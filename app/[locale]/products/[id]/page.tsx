import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Check, ExternalLink, Download } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  category: string;
  type: string;
  subscription_enabled: boolean;
  subscription_price: number;
  subscription_interval: string;
  features: string[];
  demo_url: string;
  download_url: string;
}

// Demo products - in production, fetch from API
const demoProducts: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'DataQuery Pro',
    description: 'DataQuery Pro is a powerful cross-platform desktop application designed for developers and database administrators. It provides a unified interface for querying MySQL, Redis, and Kafka databases with advanced features like global search, metadata synchronization, and offline mode support.',
    short_description: 'Unified database query tool for MySQL, Redis, and Kafka',
    price: 49,
    category: 'software',
    type: 'download',
    subscription_enabled: true,
    subscription_price: 9.99,
    subscription_interval: 'month',
    features: [
      'MySQL database support with full query capabilities',
      'Redis key-value store integration',
      'Kafka message queue management',
      'Global search across all data sources',
      'Offline mode with cached metadata',
      'Cross-platform (Windows, macOS, Linux)',
      'Dark mode support',
      'Automatic updates',
    ],
    demo_url: 'https://demo.opc.studio/dataquery',
    download_url: 'https://downloads.opc.studio/dataquery-pro-latest',
  },
  '2': {
    id: '2',
    name: 'DevTools Suite',
    description: 'Essential developer tools for everyday productivity. Includes JSON formatter, Base64 encoder, regex tester, color picker, and more.',
    short_description: 'Essential developer tools for productivity',
    price: 29,
    category: 'software',
    type: 'download',
    subscription_enabled: false,
    subscription_price: 0,
    subscription_interval: 'month',
    features: [
      'JSON Tools',
      'Encoding Tools',
      'Regex Tester',
      'Color Picker',
      'Code Beautifier',
      'Cross-platform',
      'Offline support',
    ],
    demo_url: '',
    download_url: 'https://downloads.opc.studio/devtools-suite-latest',
  },
  '3': {
    id: '3',
    name: 'CloudDev Studio',
    description: 'CloudDev Studio is an AI-powered online development environment. Code from anywhere, collaborate in real-time, and deploy with one click. No installation required.',
    short_description: 'AI-powered online development environment',
    price: 0,
    category: 'saas',
    type: 'online',
    subscription_enabled: true,
    subscription_price: 19.99,
    subscription_interval: 'month',
    features: [
      'AI Code Completion',
      'Cloud IDE',
      'Real-time Collaboration',
      'Git Integration',
      'Live Preview',
      'Team Workspaces',
      'One-click Deploy',
      '24/7 Support',
    ],
    demo_url: 'https://clouddev.opc.studio',
    download_url: '',
  },
};

interface ProductDetailPageProps {
  params: { id: string };
}

// 为静态导出生成所有产品 ID
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const t = useTranslations('products');
  const locale = useLocale();

  const product = demoProducts[params.id] || demoProducts['1'];

  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href={`/${locale}`} className="hover:text-foreground">
          {locale === 'en' ? 'Home' : '首页'}
        </Link>
        {' / '}
        <Link href={`/${locale}/products`} className="hover:text-foreground">
          {t('title')}
        </Link>
        {' / '}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Product Images */}
        <div>
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-6xl">📦</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary"
              >
                <span className="text-2xl">📷</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div>
          <div className="mb-4">
            <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
              {t(`category.${product.category}`)}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg text-muted-foreground mb-8">{product.short_description}</p>

          {/* Pricing Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('detail.pricing')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* One-time */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold">{t('price.one_time')}</div>
                  <div className="text-3xl font-bold">${product.price}</div>
                  <div className="text-sm text-muted-foreground">
                    {locale === 'en' ? 'Lifetime access' : '终身访问'}
                  </div>
                </div>
                <Link href={`/${locale}/checkout?product=${product.id}&type=one_time`}>
                  <Button>{t('card.get_it')}</Button>
                </Link>
              </div>

              {/* Subscription */}
              {product.subscription_enabled && (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                  <div>
                    <div className="font-semibold">{t('price.subscription')}</div>
                    <div className="text-3xl font-bold">${product.subscription_price}<span className="text-lg font-normal">{t('price.per_month')}</span></div>
                    <div className="text-sm text-muted-foreground">
                      {locale === 'en' ? 'Cancel anytime' : '随时取消'}
                    </div>
                  </div>
                  <Link href={`/${locale}/checkout?product=${product.id}&type=subscription`}>
                    <Button variant="secondary">{t('price.subscribe')}</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Demo & Download Links */}
          <div className="flex gap-4">
            {product.demo_url && (
              <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  {t('detail.demo')}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">{t('detail.features')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">{t('detail.description')}</h2>
        <div className="prose prose-lg max-w-none">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
