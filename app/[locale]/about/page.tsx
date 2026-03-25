import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations('about');
  const locale = useLocale();

  const values = [
    { key: 'quality', icon: '✨' },
    { key: 'transparency', icon: '🔍' },
    { key: 'support', icon: '💬' },
    { key: 'innovation', icon: '🚀' },
  ];

  return (
    <div className="container py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Story Section */}
      <section className="max-w-3xl mx-auto mb-16">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">{t('story.title')}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {locale === 'en' ? (
              <>
                OPC (One Person Company) represents a new paradigm in software development. As an independent developer,
                I believe in creating products that are thoughtfully designed, well-crafted, and directly supported by
                the person who built them.
                <br /><br />
                Every product you see here is the result of countless hours of development, testing, and refinement.
                I take pride in every line of code and every feature I ship.
                <br /><br />
                When you buy from OPC, you&apos;re not just getting software – you&apos;re getting a commitment to quality
                and direct access to someone who truly cares about your experience.
              </>
            ) : (
              <>
                OPC（一人公司）代表了一种全新的软件开发模式。作为独立开发者，我相信打造经过深思熟虑、精心设计、
                并由创作者直接支持的产品。
                <br /><br />
                您在这里看到的每款产品都是无数小时开发、测试和优化的结果。我为每一行代码、每一个功能感到自豪。
                <br /><br />
                当您从 OPC 购买产品时，您不仅仅是在购买软件 —— 您获得的是对品质的承诺，以及直接联系真正关心
                您体验的开发者的渠道。
              </>
            )}
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">{t('values.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.key}
              className="p-6 rounded-2xl bg-gradient-to-br from-background to-muted/30 border hover:border-primary/50 transition-all"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="font-semibold mb-2">
                {t(`values.${value.key}`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {locale === 'en'
                  ? `We believe in ${value.key.toLowerCase()} as a core principle.`
                  : `我坚信${value.key === 'quality' ? '质量优先' : value.key === 'transparency' ? '透明诚信' : value.key === 'support' ? '用心支持' : '持续创新'}。`}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">{t('contact.title')}</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:2307990428@qq.com"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span>2307990428@qq.com</span>
          </a>
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <MessageCircle className="w-5 h-5" />
            <span>{locale === 'en' ? 'QQ Support' : 'QQ客服'}: 2307990428</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border">
          <p className="text-lg mb-4">
            {locale === 'en'
              ? 'Ready to explore our products?'
              : '准备好探索我的产品了吗？'}
          </p>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {locale === 'en' ? 'View Products' : '查看产品'}
          </Link>
        </div>
      </section>
    </div>
  );
}
