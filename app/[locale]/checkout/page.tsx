'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, XCircle, AlertCircle } from 'lucide-react';

// Demo product for testing without database
const demoProducts: Record<string, any> = {
  '1': {
    id: '1',
    name: 'DataQuery Pro',
    description: 'Unified database query tool for MySQL, Redis, and Kafka',
    price: 49,
    type: 'download',
    subscription_enabled: true,
    subscription_price: 9.99,
  },
  '2': {
    id: '2',
    name: 'DevTools Suite',
    description: 'Essential developer tools for productivity',
    price: 29,
    type: 'download',
    subscription_enabled: false,
    subscription_price: 0,
  },
  '3': {
    id: '3',
    name: 'CloudDev Studio',
    description: 'AI-powered online development environment',
    price: 0,
    type: 'online',
    access_url: 'https://clouddev.opc.studio',
    subscription_enabled: true,
    subscription_price: 19.99,
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const router = useRouter();

  const productId = searchParams.get('product');
  const type = searchParams.get('type') || 'one_time';

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
    loadProduct();
  }, [productId]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      setIsLoggedIn(res.ok);
    } catch {
      setIsLoggedIn(false);
    }
  };

  const loadProduct = async () => {
    // First try demo products
    if (demoProducts[productId || '']) {
      setProduct(demoProducts[productId || '']);
      setLoading(false);
      return;
    }

    // Then try API
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
      }
    } catch (err) {
      // Product not found
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      router.push(`/${locale}/auth/login?redirect=/${locale}/checkout?product=${productId}&type=${type}`);
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, type, locale }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.needLogin) {
        router.push(`/${locale}/auth/login?redirect=/${locale}/checkout?product=${productId}&type=${type}`);
      } else {
        setError(data.error || 'Checkout failed');
        setProcessing(false);
      }
    } catch (err) {
      setError('Checkout failed. Please try again.');
      setProcessing(false);
    }
  };

  // Test mode: simulate successful payment
  const handleTestCheckout = async () => {
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Redirect to success page with product info
    router.push(`/${locale}/checkout/success?product=${productId}&test=1`);
  };

  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!productId || !product) {
    return (
      <div className="container py-16 text-center">
        <XCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">
          {locale === 'en' ? 'Product Not Found' : '产品未找到'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {locale === 'en' ? 'The product you are looking for does not exist.' : '您要购买的产品不存在。'}
        </p>
        <Button onClick={() => router.push(`/${locale}/products`)}>
          {locale === 'en' ? 'Back to Products' : '返回产品列表'}
        </Button>
      </div>
    );
  }

  const price = type === 'subscription'
    ? product.subscription_price
    : product.price;

  const priceLabel = type === 'subscription'
    ? (locale === 'en' ? '/month' : '/月')
    : (locale === 'en' ? 'One-time' : '一次性');

  const isTestMode = !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">
        {locale === 'en' ? 'Checkout' : '结账'}
      </h1>

      {/* Test Mode Notice */}
      {isTestMode && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-800 dark:text-amber-200">
              {locale === 'en' ? 'Test Mode' : '测试模式'}
            </p>
            <p className="text-amber-700 dark:text-amber-300 mt-1">
              {locale === 'en'
                ? 'Stripe is not configured. You can test the checkout flow using the test button below.'
                : 'Stripe 未配置。您可以使用下面的测试按钮测试结账流程。'}
            </p>
          </div>
        </div>
      )}

      {/* Login Notice */}
      {!isLoggedIn && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-700 dark:text-blue-300">
              {locale === 'en'
                ? 'Please sign in to complete your purchase.'
                : '请登录以完成购买。'}
            </p>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {locale === 'en' ? 'Order Summary' : '订单摘要'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">
                {type === 'subscription'
                  ? (locale === 'en' ? 'Monthly Subscription' : '月度订阅')
                  : (locale === 'en' ? 'One-time Purchase' : '一次性购买')}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>{locale === 'en' ? 'Total' : '总计'}</span>
              <span>${price} {priceLabel}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Checkout Buttons */}
      <div className="space-y-3">
        {isTestMode ? (
          <Button
            size="lg"
            className="w-full"
            onClick={handleTestCheckout}
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {locale === 'en' ? 'Processing...' : '处理中...'}
              </>
            ) : (
              locale === 'en' ? 'Test Checkout (Free)' : '测试结账（免费）'
            )}
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full"
            onClick={handleCheckout}
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {locale === 'en' ? 'Processing...' : '处理中...'}
              </>
            ) : (
              locale === 'en' ? 'Proceed to Payment' : '前往支付'
            )}
          </Button>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        {locale === 'en'
          ? 'Secure payment powered by Stripe'
          : '由 Stripe 提供安全支付'}
      </p>

      {/* Back Link */}
      <div className="text-center mt-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/${locale}/products/${productId}`)}
        >
          {locale === 'en' ? 'Back to Product' : '返回产品'}
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
