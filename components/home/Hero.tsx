import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  const t = useTranslations('home.hero');
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container py-24 md:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{t('badge')}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>

          {/* Early Access Notice */}
          <div className="inline-flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              🚀 {locale === 'en' ? 'Early Exploration Stage' : '早期探索阶段'}
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-300 text-center max-w-md">
              {locale === 'en'
                ? 'All products are currently in early exploration stage. We are actively iterating and improving. Thank you for your support!'
                : '所有产品目前均处于早期探索阶段，我们正在积极迭代优化中。感谢您的支持与包容！'}
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            {t('subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}/products`}>
              <Button size="lg" className="gap-2">
                {t('cta')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href={`/${locale}/about`}>
              <Button size="lg" variant="outline">
                {t('cta_secondary')}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 md:gap-16 pt-8 mt-8 border-t">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground mt-1">
                {locale === 'en' ? 'Products' : '款产品'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground mt-1">
                {locale === 'en' ? 'Users' : '用户'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground mt-1">
                {locale === 'en' ? 'Support' : '支持'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
