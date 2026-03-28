'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink } from 'lucide-react';
import { sponsorInfo } from '@/lib/sponsor';

export function Supporter() {
  const t = useTranslations('home.supporter');
  const locale = useLocale();

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 md:p-10 rounded-2xl border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4">
                <Heart className="w-4 h-4" />
                {t('badge')}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('title')}</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">{t('description')}</p>
            </div>

            {/* Price */}
            <div className="text-center mb-8">
              <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">¥19.9</span>
              <span className="text-sm text-muted-foreground ml-2">{t('price_label')}</span>
            </div>

            {/* Payment QR Codes */}
            <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto mb-8">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-3 bg-white rounded-xl border shadow-sm flex items-center justify-center overflow-hidden">
                  <img
                    src={sponsorInfo.alipay.qrCode}
                    alt="Alipay"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{sponsorInfo.alipay.name}</span>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-3 bg-white rounded-xl border shadow-sm flex items-center justify-center overflow-hidden">
                  <img
                    src={sponsorInfo.wechat.qrCode}
                    alt="WeChat Pay"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{sponsorInfo.wechat.name}</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-white/60 dark:bg-white/10 border">
                {locale === 'en' ? 'Lifetime Updates' : '终身免费更新'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/60 dark:bg-white/10 border">
                {locale === 'en' ? 'Priority Support' : '优先技术支持'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/60 dark:bg-white/10 border">
                {locale === 'en' ? 'Unlock Advanced Features' : '解锁高级功能'}
              </span>
            </div>

            {/* Register Link */}
            <a
              href={sponsorInfo.registerFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button size="lg" className="w-full gap-2">
                {t('register_btn')}
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>

            <p className="text-xs text-muted-foreground text-center mt-4">
              {t('register_hint')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
