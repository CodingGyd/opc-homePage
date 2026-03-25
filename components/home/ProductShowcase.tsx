import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Gift, MessageSquare, Rocket, ExternalLink } from 'lucide-react';

// 飞书表单链接配置
const FEEDBACK_FORM_URL = 'https://my.feishu.cn/share/base/form/shrcnZWJTCblyIq5rjC4Ms8sqrg';

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
              {locale === 'en' ? 'Explore our most popular products' : '探索我最受欢迎的产品'}
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

        {/* Product Notice */}
        <div className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Rocket className="w-4 h-4" />
              {locale === 'en' ? 'Early Access' : '早期探索阶段'}
            </span>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {locale === 'en'
                ? 'All products are currently in the early exploration stage. We are actively iterating and improving. Thank you for your support and patience!'
                : '所有产品目前均处于早期探索阶段，我正在积极迭代优化中。感谢您的支持与包容！'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  {locale === 'en' ? 'More Coming' : '持续迭代'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en'
                    ? 'New products and features are under development. Stay tuned for updates.'
                    : '更多新产品和功能正在开发中，后续将陆续上架。'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Gift className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  {locale === 'en' ? 'Free to Use' : '免费使用'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en'
                    ? 'All products are free during the early access period. Download and try them out!'
                    : '早期阶段所有产品免费开放，欢迎下载体验！'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  {locale === 'en' ? 'Need Your Help' : '需要您的帮助'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en'
                    ? 'Your feedback is invaluable. Help us build better products together!'
                    : '您的使用反馈非常宝贵，帮助我打造更好的产品！'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {locale === 'en'
                ? 'Have suggestions or found a bug? Submit via our feedback form.'
                : '有建议或发现问题？通过反馈表单告诉我，支持上传截图。'}
            </p>
            <a href={FEEDBACK_FORM_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                {locale === 'en' ? 'Submit Feedback' : '提交反馈'}
                <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
