import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Mail } from 'lucide-react';

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrivacyContent />;
}

function PrivacyContent() {
  const t = useTranslations('privacy');
  const locale = useLocale();

  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        {t('title')}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">{t('last_updated')}</p>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <p>{t('intro')}</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('collect_title')}</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-foreground">{t('collect_1_title')}</h3>
              <p>{t('collect_1_desc')}</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground">{t('collect_2_title')}</h3>
              <p>{t('collect_2_desc')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('cookies_title')}</h2>
          <p className="mb-3">{t('cookies_desc')}</p>
          <p className="font-medium text-foreground">{t('cookies_types_title')}</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>{t('cookies_1')}</li>
            <li>{t('cookies_2')}</li>
            <li>{t('cookies_3')}</li>
          </ul>
          <p className="mt-3">{t('cookies_control')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('adsense_title')}</h2>
          <p className="mb-3">{t('adsense_desc')}</p>
          <p className="mb-3">{t('adsense_detail')}</p>
          <p>{t('adsense_note')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('protect_title')}</h2>
          <p>{t('protect_desc')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('rights_title')}</h2>
          <p className="mb-3">{t('rights_desc')}</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>{t('right_1')}</li>
            <li>{t('right_2')}</li>
            <li>{t('right_3')}</li>
            <li>{t('right_4')}</li>
          </ul>
          <p className="mt-3">{t('rights_contact')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('changes_title')}</h2>
          <p>{t('changes_desc')}</p>
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
