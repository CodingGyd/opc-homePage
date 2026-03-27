import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { assetPath } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  short_description: string;
  category: string;
  comingSoon?: boolean;
  icon?: string;
  image?: string;
}

// 产品数据
const products: Product[] = [
  {
    id: '1',
    name: 'DataWhere',
    short_description: '一个搜索框，搜遍你所有的数据',
    category: 'software',
    image: assetPath('/images/products/dataquery/home.webp'),
  },
];

// 即将推出的产品
const comingSoonProducts: Product[] = [
  {
    id: '',
    name: '小程序',
    short_description: '微信小程序开发',
    category: 'miniprogram',
    comingSoon: true,
    icon: '📱',
  },
  {
    id: '',
    name: 'SaaS 平台',
    short_description: '云端服务，随时随地访问',
    category: 'saas',
    comingSoon: true,
    icon: '☁️',
  },
];

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProductsList locale={locale} />;
}

function ProductsList({ locale }: { locale: string }) {
  const t = useTranslations('products');

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 真实产品 */}
        {products.map((product) => (
          <Card key={product.id} className="group hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{product.icon || '📦'}</span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  {t(`category.${product.category}`)}
                </span>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">
                {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-2 mb-4">
                {product.short_description}
              </p>
              <Link href={`/${locale}/products/${product.id}`}>
                <Button size="sm" className="w-full">
                  {locale === 'en' ? 'Learn More' : '了解更多'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        {/* 即将推出 */}
        {comingSoonProducts.map((product, index) => (
          <Card key={index} className="group relative overflow-hidden opacity-75 hover:opacity-100 transition-all">
            <CardHeader>
              <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">{product.icon}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                  {locale === 'en' ? 'Coming Soon' : '即将推出'}
                </span>
              </div>
              <CardTitle className="text-muted-foreground">
                {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground/70 line-clamp-2 mb-4">
                {product.short_description}
              </p>
              <Button size="sm" className="w-full" disabled>
                {locale === 'en' ? 'Coming Soon' : '敬请期待'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
