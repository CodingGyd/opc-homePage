import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  short_description: string;
  category: string;
}

// 产品数据
const demoProducts: Product[] = [
  {
    id: '1',
    name: 'DataQuery Pro',
    short_description: '跨平台数据库查询工具，支持 MySQL、Redis 和 Kafka',
    category: 'software',
  },
  {
    id: '2',
    name: 'DevTools Suite',
    short_description: '开发者日常效率工具集',
    category: 'software',
  },
  {
    id: '3',
    name: 'CloudDev Studio',
    short_description: 'AI 驱动的在线开发环境',
    category: 'saas',
  },
];

const categories = [
  { key: 'all', label: { en: 'All', zh: '全部' } },
  { key: 'software', label: { en: 'Software', zh: '软件' } },
  { key: 'saas', label: { en: 'SaaS', zh: 'SaaS' } },
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

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <Link
            key={cat.key}
            href={`/${locale}/products${cat.key === 'all' ? '' : `?category=${cat.key}`}`}
            className="px-4 py-2 rounded-full text-sm font-medium bg-muted hover:bg-muted/80 transition-colors"
          >
            {cat.label[locale as 'en' | 'zh']}
          </Link>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoProducts.map((product) => (
          <Card key={product.id} className="group hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📦</span>
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
      </div>
    </div>
  );
}
