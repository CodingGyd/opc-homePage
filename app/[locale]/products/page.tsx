import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { assetPath } from '@/lib/utils';

// Non-translatable product config
const productConfigs = [
  {
    id: '1',
    category: 'software',
    image: assetPath('/images/products/dataquery/home.webp'),
  },
  {
    id: '5',
    category: 'miniprogram',
    image: assetPath('/images/products/bdx/home.jpg'),
  },
  {
    id: '4',
    category: 'game',
    video: 'https://gydblog2.su.bcebos.com/files/moyu-games/promo.mp4',
    icon: '🐟',
  },
];

const comingSoonConfigs = [
  { icon: '☁️', nameKey: 'showcase.saas_platform', descKey: 'showcase.saas_platform_desc' },
];

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProductsList />;
}

function ProductsList() {
  const t = useTranslations('products');
  const locale = useLocale();

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Products Grid */}
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
                  <img src={config.image} alt={t(`data.${config.id}.name`)} className="w-full h-full object-cover" loading="lazy" />
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
              <Link href={`/${locale}/products/${config.id}`}>
                <Button size="sm" className="w-full">
                  {t('showcase.learn_more')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        {/* Coming Soon */}
        {comingSoonConfigs.map((config, index) => (
          <Card key={index} className="group relative overflow-hidden opacity-75 hover:opacity-100 transition-all">
            <CardHeader>
              <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">{config.icon}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                  {t('showcase.coming_soon')}
                </span>
              </div>
              <CardTitle className="text-muted-foreground">
                {t(config.nameKey)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground/70 line-clamp-2 mb-4">
                {t(config.descKey)}
              </p>
              <Button size="sm" className="w-full" disabled>
                {t('showcase.coming_soon_btn')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
