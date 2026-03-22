'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Loader2, ArrowRight, ExternalLink, Key, Copy, Monitor, Clock } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  type: 'download' | 'online' | 'hybrid';
  download_url?: string;
  access_url?: string;
  version?: string;
}

// Demo products
const demoProducts: Record<string, Product> = {
  '1': { id: '1', name: 'DataQuery Pro', type: 'download', version: '1.0.0' },
  '2': { id: '2', name: 'DevTools Suite', type: 'download', version: '1.2.0' },
  '3': { id: '3', name: 'CloudDev Studio', type: 'online', access_url: 'https://clouddev.opc.studio' },
};

function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [];
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  return segments.join('-');
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const router = useRouter();

  const productId = searchParams.get('product') || '1';
  const isTest = searchParams.get('test') === '1';

  const [loading, setLoading] = useState(true);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const product = demoProducts[productId] || demoProducts['1'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Generate license for download products
      if (product.type === 'download') {
        setLicenseKey(generateLicenseKey());
      }
    }, isTest ? 500 : 1500);

    return () => clearTimeout(timer);
  }, [productId, product.type, isTest]);

  const handleCopy = () => {
    if (licenseKey) {
      navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    alert(locale === 'en' ? 'Download started!' : '下载已开始！');
  };

  if (loading) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          {locale === 'en' ? 'Processing your order...' : '处理您的订单中...'}
        </p>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-3xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {locale === 'en' ? 'Payment Successful!' : '支付成功！'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'en'
            ? `Thank you for purchasing ${product.name}!`
            : `感谢购买 ${product.name}！`}
        </p>
      </div>

      {/* Download Product - Show License */}
      {product.type === 'download' && licenseKey && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              {locale === 'en' ? 'Your License Key' : '您的许可证密钥'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between gap-4">
                <code className="text-lg font-mono tracking-wider">{licenseKey}</code>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Monitor className="w-4 h-4" />
                <span>
                  {locale === 'en' ? '1 Device' : '1 台设备'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  {locale === 'en' ? 'Lifetime' : '永久有效'}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
              <p className="text-blue-700 dark:text-blue-300">
                {locale === 'en'
                  ? 'Please save your license key. You will need it to activate the software.'
                  : '请保存您的许可证密钥。 您需要使用它来激活软件。'}
              </p>
            </div>

            <Button size="lg" className="w-full gap-2" onClick={handleDownload}>
              <Download className="w-4 h-4" />
              {locale === 'en' ? 'Download Software' : '下载软件'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Online Product - Show Access URL */}
      {product.type === 'online' && product.access_url && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-primary" />
              {locale === 'en' ? 'Access Your Product' : '访问您的产品'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                {locale === 'en' ? 'Product URL:' : '产品地址：'}
              </p>
              <a
                href={product.access_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {product.access_url}
              </a>
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={() => window.open(product.access_url, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              {locale === 'en' ? 'Open Product' : '打开产品'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Test Mode Notice */}
      {isTest && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {locale === 'en'
              ? 'This is a test purchase. In production, your license would be stored permanently.'
              : '这是一次测试购买。在生产环境中，您的许可证将被永久保存。'}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => router.push(`/${locale}/dashboard/orders`)}
        >
          {locale === 'en' ? 'View Orders' : '查看订单'}
        </Button>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => router.push(`/${locale}/products`)}
        >
          {locale === 'en' ? 'Continue Shopping' : '继续浏览'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
