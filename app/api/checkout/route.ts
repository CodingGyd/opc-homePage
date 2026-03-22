import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createOneTimeCheckout, createSubscriptionCheckout } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', needLogin: true },
        { status: 401 }
      );
    }

    const { productId, type, locale: requestLocale } = await req.json();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const locale = requestLocale || 'en';

    const successUrl = `${appUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/${locale}/checkout?product=${productId}&type=${type}`;

    let checkoutUrl: string;

    if (type === 'subscription') {
      checkoutUrl = await createSubscriptionCheckout({
        productId,
        userId: user.id,
        email: user.email,
        successUrl,
        cancelUrl,
      });
    } else {
      checkoutUrl = await createOneTimeCheckout({
        productId,
        userId: user.id,
        email: user.email,
        successUrl,
        cancelUrl,
      });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
