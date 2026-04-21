import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TermsContent />;
}

function TermsContent() {
  const t = useTranslations('terms');

  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        {t('title')}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">{t('last_updated')}</p>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <p>{t('intro')}</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('service_title')}</h2>
          <p>{t('service_desc')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('usage_title')}</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>{t('usage_1')}</li>
            <li>{t('usage_2')}</li>
            <li>{t('usage_3')}</li>
            <li>{t('usage_4')}</li>
            <li>{t('usage_5')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('ip_title')}</h2>
          <p>{t('ip_desc')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('disclaimer_title')}</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>{t('disclaimer_1')}</li>
            <li>{t('disclaimer_2')}</li>
            <li>{t('disclaimer_3')}</li>
            <li>{t('disclaimer_4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('changes_title')}</h2>
          <p>{t('changes_desc')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('governing_title')}</h2>
          <p>{t('governing_desc')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('contact_title')}</h2>
          <p className="mb-3">{t('contact_desc')}</p>
          <a
            href="mailto:2307990428@qq.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span>2307990428@qq.com</span>
          </a>
        </section>
      </div>
    </div>
  );
}
