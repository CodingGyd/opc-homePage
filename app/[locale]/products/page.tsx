import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  short_description: string;
  price: number;
  category: string;
  subscription_enabled: boolean;
  subscription_price: number;
}

// Demo products - in production, fetch from API
const demoProducts: Product[] = [
  {
    id: '1',
    name: 'DataQuery Pro',
    short_description: 'Unified database query tool for MySQL, Redis, and Kafka',
    price: 49,
    category: 'software',
    subscription_enabled: true,
    subscription_price: 9.99,
  },
  {
    id: '2',
    name: 'DevTools Suite',
    short_description: 'Essential developer tools for productivity',
    price: 29,
    category: 'software',
    subscription_enabled: false,
    subscription_price: 0,
  },
  {
    id: '3',
    name: 'CloudDev Studio',
    short_description: 'AI-powered online development environment',
    price: 0,
    category: 'saas',
    subscription_enabled: true,
    subscription_price: 19.99,
  },
];

const categories = [
  { key: 'all', label: { en: 'All', zh: '全部' } },
  { key: 'software', label: { en: 'Software', zh: '软件' } },
  { key: 'saas', label: { en: 'SaaS', zh: 'SaaS' } },
  { key: 'template', label: { en: 'Templates', zh: '模板' } },
  { key: 'course', label: { en: 'Courses', zh: '课程' } },
];

export default function ProductsPage() {
  const t = useTranslations('products');
  const locale = useLocale();

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Link
            key={cat.key}
            href={`?category=${cat.key}`}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-muted hover:bg-muted/80"
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
              <p className="text-muted-foreground line-clamp-2">
                {product.short_description}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div>
                {product.price > 0 ? (
                  <>
                    <span className="text-2xl font-bold">${product.price}</span>
                    {product.subscription_enabled && (
                      <span className="text-sm text-muted-foreground ml-2">
                        {locale === 'en' ? 'or' : '或'} ${product.subscription_price}/mo
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-2xl font-bold">{t('price.free')}</span>
                )}
              </div>
              <Link href={`/${locale}/products/${product.id}`}>
                <Button size="sm">{t('card.view_details')}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
