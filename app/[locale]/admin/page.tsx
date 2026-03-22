import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, CreditCard } from 'lucide-react';

const stats = [
  { key: 'total_revenue', icon: DollarSign, value: '$1,234', change: '+12%' },
  { key: 'total_orders', icon: ShoppingCart, value: '45', change: '+5%' },
  { key: 'total_users', icon: Users, value: '128', change: '+8%' },
  { key: 'active_subscriptions', icon: CreditCard, value: '23', change: '+3%' },
];

export default function AdminDashboardPage() {
  const t = useTranslations('admin.dashboard');
  const locale = useLocale();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(stat.key)}
                </CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600">{stat.change} {locale === 'en' ? 'from last month' : '较上月'}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{locale === 'en' ? 'Revenue Overview' : '收入概览'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {locale === 'en' ? 'Chart will be displayed here' : '图表将在此显示'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{locale === 'en' ? 'Recent Orders' : '最近订单'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {locale === 'en' ? 'Orders will be displayed here' : '订单将在此显示'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
