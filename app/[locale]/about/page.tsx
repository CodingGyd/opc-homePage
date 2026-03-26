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
        <h2 className="text-2xl font-bold mb-8 text-center">{t('story.title')}</h2>
        {locale === 'en' ? (
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              OPC (One Person Company) represents a new paradigm in software development. As an independent developer,
              I believe in creating products that are thoughtfully designed, well-crafted, and directly supported by
              the person who built them.
            </p>
            <p>
              Every product you see here is the result of countless hours of development, testing, and refinement.
              I take pride in every line of code and every feature I ship.
            </p>
            <p>
              When you use OPC products, you&apos;re not just getting software – you&apos;re getting a commitment to quality
              and direct access to someone who truly cares about your experience.
            </p>
          </div>
        ) : (
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-2">
              OPC 是 One Person Company 的缩写，意为"一人公司"。作为独立开发者，我热衷于打造实用的软件产品。
            </p>
            <p>
              这里的每款产品都凝聚了大量心血——从构思、开发、测试到打磨，每一个环节我都亲力亲为。我为每一个功能感到自豪。
            </p>
            <p className="text-center font-medium text-foreground pt-4 border-t">
              感谢您的关注与支持！如有任何问题或建议，欢迎随时联系我。
            </p>
          </div>
        )}
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
