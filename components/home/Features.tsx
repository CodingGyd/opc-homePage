import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle2, HeadphonesIcon, RefreshCw, Shield } from 'lucide-react';

const icons = {
  quality: CheckCircle2,
  support: HeadphonesIcon,
  updates: RefreshCw,
  transparent: Shield,
};

export function Features() {
  const t = useTranslations('home.features');
  const locale = useLocale();

  const features = [
    { key: 'quality', icon: icons.quality },
    { key: 'support', icon: icons.support },
    { key: 'updates', icon: icons.updates },
    { key: 'transparent', icon: icons.transparent },
  ];

  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="relative group p-6 rounded-2xl bg-background border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {t(`${feature.key}.title`)}
                </h3>
                <p className="text-muted-foreground">
                  {t(`${feature.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
