'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';

const navItems = [
  { key: 'dashboard', icon: LayoutDashboard, href: '' },
  { key: 'products', icon: Package, href: '/products' },
  { key: 'orders', icon: ShoppingCart, href: '/orders' },
  { key: 'users', icon: Users, href: '/users' },
  { key: 'analytics', icon: BarChart3, href: '/analytics' },
  { key: 'settings', icon: Settings, href: '/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('admin');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-background border-r">
          <div className="p-6">
            <Link href={`/${locale}/admin`} className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                OPC Admin
              </span>
            </Link>
          </div>
          <nav className="px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const href = `/${locale}/admin${item.href}`;
              const isActive =
                pathname === href ||
                (item.href === '' && pathname === `/${locale}/admin`);

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
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
