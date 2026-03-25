import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
}

// 产品展示数据
const demoProducts: Product[] = [
  {
    id: '1',
    name: 'DataQuery Pro',
    description: '跨平台数据库查询工具，支持 MySQL、Redis 和 Kafka',
    category: 'software',
  },
  {
    id: '2',
    name: 'DevTools Suite',
    description: '开发者日常效率工具集',
    category: 'software',
  },
  {
    id: '3',
    name: 'CloudDev Studio',
    description: 'AI 驱动的在线开发环境',
    category: 'saas',
  },
];

export function ProductShowcase() {
  const t = useTranslations('products');
  const locale = useLocale();

  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {locale === 'en' ? 'Featured Products' : '精选产品'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {locale === 'en' ? 'Explore our most popular products' : '探索我们最受欢迎的产品'}
            </p>
          </div>
          <Link href={`/${locale}/products`} className="mt-4 md:mt-0">
            <Button variant="outline" className="gap-2">
              {locale === 'en' ? 'View All' : '查看全部'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

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
                  {product.description}
                </p>
                <Link href={`/${locale}/products/${product.id}`} className="block">
                  <Button size="sm" className="w-full">
                    {locale === 'en' ? 'Learn More' : '了解更多'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
