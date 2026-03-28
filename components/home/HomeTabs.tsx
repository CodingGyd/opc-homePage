'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Hero } from '@/components/home/Hero';
import { Supporter } from '@/components/home/Supporter';
import { Features } from '@/components/home/Features';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { CTA } from '@/components/home/CTA';
import { Heart } from 'lucide-react';

export function HomeTabs() {
  const t = useTranslations('home');
  const [activeTab, setActiveTab] = useState<'home' | 'support'>('home');

  return (
    <>
      {/* Tab Bar */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b">
        <div className="container">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'home'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('tab_home')}
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors inline-flex items-center gap-1.5 ${
                activeTab === 'support'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              {t('tab_support')}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'home' ? (
        <>
          <Hero />
          <ProductShowcase />
          <Features />
          <CTA />
        </>
      ) : (
        <Supporter />
      )}
    </>
  );
}
