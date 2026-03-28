'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Menu, X, Heart } from 'lucide-react';

export function Header() {
  const t = useTranslations('common.nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'zh' : 'en';
    const currentPath = pathname.replace(/^\/(en|zh)/, '') || '/';
    document.cookie = `locale=${newLocale};path=/`;
    router.push(`/${newLocale}${currentPath}`);
  };

  const navLinks = [
    { href: `/${locale}`, label: t('home'), pattern: /^\/(en|zh)$/ },
    { href: `/${locale}/products`, label: t('products'), pattern: /^\/(en|zh)\/products/ },
    { href: `/${locale}/support`, label: t('support'), pattern: /^\/(en|zh)\/support/ },
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
          <Button
            variant="ghost"
            onClick={switchLocale}
            className="px-3 font-medium"
          >
            {locale === 'en' ? '中文' : 'EN'}
          </Button>
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
            <div className="pt-4 border-t">
              <Button variant="ghost" onClick={switchLocale} className="w-full justify-start font-medium">
                {locale === 'en' ? '切换到中文' : 'Switch to English'}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
