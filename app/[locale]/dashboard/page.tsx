import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, CreditCard, Download, TrendingUp } from 'lucide-react';

const stats = [
  { key: 'orders', icon: ShoppingBag, value: '3' },
  { key: 'subscriptions', icon: CreditCard, value: '1' },
  { key: 'downloads', icon: Download, value: '12' },
];

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const locale = useLocale();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('welcome')}</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`${stat.key}.title`)}
                </CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {locale === 'en' ? 'Recent Activity' : '最近活动'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {locale === 'en'
              ? 'No recent activity'
              : '暂无最近活动'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
