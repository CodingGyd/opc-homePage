import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Gift, MessageSquare, Rocket, ExternalLink } from 'lucide-react';
import { assetPath } from '@/lib/utils';

const FEEDBACK_FORM_URL = 'https://my.feishu.cn/share/base/form/shrcnZWJTCblyIq5rjC4Ms8sqrg';

// Non-translatable product config (media, category, etc.)
const productConfigs = [
  {
    id: '1',
    category: 'software',
    image: assetPath('/images/products/dataquery/home.webp'),
    video: assetPath('/video/products/datawhere/promo-muted.mp4'),
  },
  {
    id: '4',
    category: 'game',
    image: assetPath('/images/products/moyu-spreadsheet/home.webp'),
    icon: '🐟',
  },
];

export function ProductShowcase() {
  const t = useTranslations('products');
  const tc = useTranslations('common');
  const locale = useLocale();

  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {t('showcase.title')}
            </h2>
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-3">
              🚀 {t('showcase.badge')} · {t('showcase.badge_desc')}
            </p>
            <p className="text-lg text-muted-foreground">
              {t('showcase.subtitle')}
            </p>
          </div>
          <Link href={`/${locale}/products`} className="mt-4 md:mt-0">
            <Button variant="outline" className="gap-2">
              {t('showcase.view_all')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productConfigs.map((config) => (
            <Card key={config.id} className="group hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {config.video ? (
                    <video
                      src={config.video}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : config.image ? (
                    <img src={config.image} alt={t(`data.${config.id}.name`)} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">{config.icon || '📦'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {t(`category.${config.category}`)}
                  </span>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {t(`data.${config.id}.name`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {t(`data.${config.id}.short_description`)}
                </p>
                <Link href={`/${locale}/products/${config.id}`} className="block">
                  <Button size="sm" className="w-full">
                    {t('showcase.learn_more')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}

          <Card className="group relative overflow-hidden opacity-60 hover:opacity-80 transition-all border-dashed">
            <CardHeader>
              <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                  {t('showcase.coming_soon')}
                </span>
              </div>
              <CardTitle className="text-muted-foreground">
                {t('showcase.miniprogram')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground/70 line-clamp-2 mb-4">
                {t('showcase.miniprogram_desc')}
              </p>
              <Button size="sm" className="w-full" disabled>
                {t('showcase.coming_soon_btn')}
              </Button>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden opacity-60 hover:opacity-80 transition-all border-dashed">
            <CardHeader>
              <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">☁️</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                  {t('showcase.coming_soon')}
                </span>
              </div>
              <CardTitle className="text-muted-foreground">
                {t('showcase.saas_platform')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground/70 line-clamp-2 mb-4">
                {t('showcase.saas_platform_desc')}
              </p>
              <Button size="sm" className="w-full" disabled>
                {t('showcase.coming_soon_btn')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Product Notice */}
        <div className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Rocket className="w-4 h-4" />
              {t('showcase.notice_badge')}
            </span>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('showcase.notice_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  {t('showcase.iterate_title')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('showcase.iterate_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Gift className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  {t('showcase.adopter_title')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('showcase.adopter_desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  {t('showcase.feedback_title')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('showcase.feedback_desc')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t('showcase.feedback_prompt')}
            </p>
            <a href={FEEDBACK_FORM_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                {t('showcase.feedback_btn')}
                <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
