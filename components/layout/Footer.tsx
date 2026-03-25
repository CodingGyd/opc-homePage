import Link from 'next/link';
import { useLocale } from 'next-intl';

export function Footer() {
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                OPC
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {locale === 'en' ? 'One Person Company - Building quality software' : '一人公司 - 打造优质软件'}
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-3">
              {locale === 'en' ? 'Products' : '产品'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}/products`} className="hover:text-foreground transition-colors">
                  {locale === 'en' ? 'All Products' : '所有产品'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=software`} className="hover:text-foreground transition-colors">
                  {locale === 'en' ? 'Software' : '软件'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=saas`} className="hover:text-foreground transition-colors">
                  SaaS
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3">
              {locale === 'en' ? 'Company' : '公司'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}/about`} className="hover:text-foreground transition-colors">
                  {locale === 'en' ? 'About' : '关于'}
                </Link>
              </li>
              <li>
                <a href="mailto:contact@opc.studio" className="hover:text-foreground transition-colors">
                  {locale === 'en' ? 'Contact' : '联系我们'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">
              {locale === 'en' ? 'Contact' : '联系方式'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:contact@opc.studio" className="hover:text-foreground transition-colors">
                  contact@opc.studio
                </a>
              </li>
              <li>
                <a href="https://github.com/opcstudio" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {year} OPC Studio. {locale === 'en' ? 'All rights reserved.' : '保留所有权利。'}</p>
        </div>
      </div>
    </footer>
  );
}
