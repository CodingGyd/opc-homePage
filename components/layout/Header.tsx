'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Menu, X, Globe, User, LogOut, LayoutDashboard } from 'lucide-react';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function Header() {
  const t = useTranslations('common.nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      console.log('fetchUser response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('fetchUser data:', data);
        setUser(data.user);
      } else {
        const data = await res.json();
        console.log('fetchUser error:', data);
      }
    } catch (err) {
      console.log('fetchUser catch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push(`/${locale}`);
    } catch {
      // Handle error
    }
  };

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'zh' : 'en';
    // 使用正则移除所有语言前缀，防止重复
    const currentPath = pathname.replace(/^\/(en|zh)/, '') || '/';
    document.cookie = `locale=${newLocale};path=/`;
    window.location.href = `/${newLocale}${currentPath}`;
  };

  const navLinks = [
    { href: `/${locale}`, label: t('home'), pattern: /^\/(en|zh)$/ },
    { href: `/${locale}/products`, label: t('products'), pattern: /^\/(en|zh)\/products/ },
    { href: `/${locale}/about`, label: t('about'), pattern: /^\/(en|zh)\/about/ },
  ];

  const isActiveLink = (pattern: RegExp) => pattern.test(pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            OPC
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActiveLink(link.pattern)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Language Switch */}
          <Button
            variant="ghost"
            onClick={switchLocale}
            className="px-3 font-medium"
          >
            {locale === 'en' ? '中文' : 'EN'}
          </Button>

          {/* User Area */}
          {loading ? null : user ? (
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/dashboard`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  {user.name || user.email.split('@')[0]}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/auth/login`}>
                <Button variant="ghost" size="sm">
                  {locale === 'en' ? 'Sign In' : '登录'}
                </Button>
              </Link>
              <Link href={`/${locale}/auth/register`}>
                <Button size="sm">
                  {locale === 'en' ? 'Sign Up' : '注册'}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActiveLink(link.pattern)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t space-y-2">
              <Button variant="ghost" onClick={switchLocale} className="w-full justify-start font-medium">
                {locale === 'en' ? '切换到中文' : 'Switch to English'}
              </Button>

              {user ? (
                <>
                  <Link href={`/${locale}/dashboard`} className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      {locale === 'en' ? 'Dashboard' : '控制台'}
                    </Button>
                  </Link>
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {locale === 'en' ? 'Sign Out' : '退出'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link href={`/${locale}/auth/login`} className="block">
                    <Button variant="outline" className="w-full">
                      {locale === 'en' ? 'Sign In' : '登录'}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/auth/register`} className="block">
                    <Button className="w-full">
                      {locale === 'en' ? 'Sign Up' : '注册'}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
