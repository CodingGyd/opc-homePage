import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { locales } from '@/i18n/config';
import { assetPath } from '@/lib/utils';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

// 网站元数据
export const metadata = {
  title: 'OPC - 一人公司',
  description: '用热情和专注打造优质软件产品',
  icons: {
    icon: assetPath('/icon.svg'),
    apple: assetPath('/icon.svg'),
  },
};

// 强制静态生成
export const dynamic = 'force-static';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  // 启用静态渲染
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <script dangerouslySetInnerHTML={{ __html: '(function(){var s=new MutationObserver(function(m){m.forEach(function(r){r.addedNodes.forEach(function(n){if(n.tagName==="SCRIPT"&&n.src&&n.src.includes("cloudflareinsights")){n.remove()}if(n.tagName==="LINK"&&n.href&&n.href.includes("cloudflareinsights")){n.remove()}})})});s.observe(document.documentElement,{childList:true,subtree:true})})()' }} />
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
