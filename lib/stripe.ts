import Stripe from 'stripe';
import { query, queryOne, update } from './db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function getOrCreateCustomer(userId: string, email: string): Promise<string> {
  const user = await queryOne<{ stripe_customer_id: string | null }>(
    'SELECT stripe_customer_id FROM users WHERE id = ?',
    [userId]
  );

  if (user?.stripe_customer_id) {
    return user.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  await update('UPDATE users SET stripe_customer_id = ? WHERE id = ?', [
    customer.id,
    userId,
  ]);

  return customer.id;
}

export async function createOneTimeCheckout(params: {
  productId: string;
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const product = await queryOne<{
    id: string;
    name: string;
    price: number;
    stripe_price_id: string | null;
  }>(
    'SELECT id, name, price, stripe_price_id FROM products WHERE id = ? AND status = ?',
    [params.productId, 'active']
  );

  if (!product) throw new Error('Product not found');

  const customerId = await getOrCreateCustomer(params.userId, params.email);

  let priceId = product.stripe_price_id;

  if (!priceId) {
    const stripeProduct = await stripe.products.create({
      name: product.name,
      metadata: {
        productId: product.id,
      },
    });

    const price = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(product.price * 100),
      currency: 'usd',
    });

    priceId = price.id;

    await update('UPDATE products SET stripe_price_id = ? WHERE id = ?', [
      priceId,
      product.id,
    ]);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      productId: product.id,
      userId: params.userId,
    },
  });

  // Create pending order
  await query(
    `INSERT INTO orders (id, order_number, user_id, product_id, type, status, amount, currency, stripe_checkout_session_id)
     VALUES (UUID(), CONCAT('OPC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0')), ?, ?, 'one_time', 'pending', ?, 'USD', ?)`,
    [params.userId, product.id, product.price, session.id]
  );

  return session.url!;
}

export async function createSubscriptionCheckout(params: {
  productId: string;
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const product = await queryOne<{
    id: string;
    name: string;
    subscription_price: number;
    subscription_interval: string;
    stripe_subscription_id: string | null;
  }>(
    'SELECT id, name, subscription_price, subscription_interval, stripe_subscription_id FROM products WHERE id = ? AND status = ? AND subscription_enabled = ?',
    [params.productId, 'active', true]
  );

  if (!product) throw new Error('Product not found or subscription not available');

  const customerId = await getOrCreateCustomer(params.userId, params.email);

  let priceId = product.stripe_subscription_id;

  if (!priceId) {
    const stripeProduct = await stripe.products.create({
      name: `${product.name} (Subscription)`,
      metadata: {
        productId: product.id,
      },
    });

    const price = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(product.subscription_price * 100),
      currency: 'usd',
      recurring: {
        interval: product.subscription_interval as 'month' | 'year',
      },
    });

    priceId = price.id;

    await update('UPDATE products SET stripe_subscription_id = ? WHERE id = ?', [
      priceId,
      product.id,
    ]);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      productId: product.id,
      userId: params.userId,
    },
  });

  // Create pending order
  await query(
    `INSERT INTO orders (id, order_number, user_id, product_id, type, status, amount, currency, stripe_checkout_session_id)
     VALUES (UUID(), CONCAT('OPC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 10000), 4, '0')), ?, ?, 'subscription', 'pending', ?, 'USD', ?)`,
    [params.userId, product.id, product.subscription_price, session.id]
  );

  return session.url!;
}

export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { productId, userId } = session.metadata || {};

      if (!productId || !userId) return;

      // Update order status
      await update(
        `UPDATE orders SET status = 'paid', stripe_payment_intent_id = ?, paid_at = NOW() WHERE stripe_checkout_session_id = ?`,
        [session.payment_intent as string, session.id]
      );

      // If subscription, create subscription record
      if (session.mode === 'subscription' && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        await query(
          `INSERT INTO subscriptions (id, user_id, product_id, order_id, stripe_subscription_id, status, current_period_start, current_period_end)
           SELECT UUID(), ?, ?, id, ?, 'active', FROM_UNIXTIME(?), FROM_UNIXTIME(?)
           FROM orders WHERE stripe_checkout_session_id = ?`,
          [
            userId,
            productId,
            subscription.id,
            subscription.current_period_start,
            subscription.current_period_end,
            session.id,
          ]
        );
      }
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

        await update(
          `UPDATE subscriptions SET current_period_start = FROM_UNIXTIME(?), current_period_end = FROM_UNIXTIME(?) WHERE stripe_subscription_id = ?`,
          [
            subscription.current_period_start,
            subscription.current_period_end,
            subscription.id,
          ]
        );
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      await update(
        `UPDATE subscriptions SET status = 'cancelled' WHERE stripe_subscription_id = ?`,
        [subscription.id]
      );
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      await update(
        `UPDATE orders SET status = 'failed' WHERE stripe_payment_intent_id = ?`,
        [paymentIntent.id]
      );
      break;
    }
  }
}

export default stripe;
