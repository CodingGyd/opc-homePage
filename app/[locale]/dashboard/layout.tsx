'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { LayoutDashboard, ShoppingBag, CreditCard, Settings } from 'lucide-react';

const navItems = [
  { key: 'overview', icon: LayoutDashboard, href: '' },
  { key: 'orders', icon: ShoppingBag, href: '/orders' },
  { key: 'subscriptions', icon: CreditCard, href: '/subscriptions' },
  { key: 'settings', icon: Settings, href: '/settings' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-background rounded-xl border p-4 sticky top-20">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const href = `/${locale}/dashboard${item.href}`;
                  const isActive = pathname === href || (item.href === '' && pathname === `/${locale}/dashboard`);

                  return (
                    <Link
                      key={item.key}
                      href={href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{t(`${item.key}.title`)}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
