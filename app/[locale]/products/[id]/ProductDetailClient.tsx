'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Check, ExternalLink, Play, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { assetPath } from '@/lib/utils';

interface ScreenshotConfig {
  url: string;
}

interface DownloadItem {
  platform: string;
  version: string;
  url: string;
  size: string;
  icon: string;
}

interface ProductConfig {
  id: string;
  category: string;
  video_url: string;
  demo_url: string;
  website_url: string;
  latest_version: string;
  downloads: DownloadItem[];
  screenshots: ScreenshotConfig[];
}

// Non-translatable product config (media, urls, etc.)
const productConfigs: Record<string, ProductConfig> = {
  '1': {
    id: '1',
    category: 'software',
    video_url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.0.1/promo.mp4',
    demo_url: '',
    website_url: '',
    latest_version: 'v1.0.1',
    downloads: [
      {
        platform: 'Windows (exe)',
        version: '1.0.1',
        url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.0.1/DataWhere_1.0.1_x64-setup.exe',
        size: '5.6 MB',
        icon: '🪟',
      },
      {
        platform: 'Windows (msi)',
        version: '1.0.1',
        url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.0.1/DataWhere_1.0.1_x64_zh-CN.msi',
        size: '8.1 MB',
        icon: '🪟',
      },
      {
        platform: 'macOS (dmg)',
        version: '1.0.1',
        url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.0.1/DataWhere_1.0.1_universal.dmg',
        size: '17.1 MB',
        icon: '🍎',
      },
      {
        platform: 'Linux (deb)',
        version: '1.0.1',
        url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.0.1/DataWhere_1.0.1_amd64.deb',
        size: '10.1 MB',
        icon: '🐧',
      },
      {
        platform: 'Linux (AppImage)',
        version: '1.0.1',
        url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.0.1/DataWhere_1.0.1_amd64.AppImage',
        size: '83.3 MB',
        icon: '🐧',
      },
    ],
    screenshots: [
      { url: assetPath('/images/products/dataquery/home.webp') },
      { url: assetPath('/images/products/dataquery/search.webp') },
      { url: assetPath('/images/products/dataquery/mysql.webp') },
      { url: assetPath('/images/products/dataquery/redis.webp') },
      { url: assetPath('/images/products/dataquery/kafka.webp') },
      { url: assetPath('/images/products/dataquery/datasource.webp') },
    ],
  },
  '2': {
    id: '2',
    category: 'software',
    video_url: '',
    demo_url: '',
    website_url: '',
    latest_version: 'v1.0.0',
    downloads: [
      {
        platform: 'Windows',
        version: '1.0.0',
        url: '/downloads/devtools-suite-1.0.0-windows-x64.exe',
        size: '65 MB',
        icon: '🪟',
      },
      {
        platform: 'macOS (Universal)',
        version: '1.0.0',
        url: '/downloads/devtools-suite-1.0.0-macos-universal.dmg',
        size: '70 MB',
        icon: '🍎',
      },
      {
        platform: 'Linux',
        version: '1.0.0',
        url: '/downloads/devtools-suite-1.0.0-linux-x64.AppImage',
        size: '68 MB',
        icon: '🐧',
      },
    ],
    screenshots: [
      { url: assetPath('/images/products/devtools/main.svg') },
      { url: assetPath('/images/products/devtools/json.svg') },
    ],
  },
  '3': {
    id: '3',
    category: 'saas',
    video_url: 'https://player.bilibili.com/player.html?bvid=BV1example3',
    demo_url: 'https://clouddev.opc.studio',
    website_url: 'https://clouddev.opc.studio',
    latest_version: '',
    downloads: [],
    screenshots: [
      { url: assetPath('/images/products/clouddev/ide.svg') },
      { url: assetPath('/images/products/clouddev/ai.svg') },
    ],
  },
  '4': {
    id: '4',
    category: 'game',
    video_url: '',
    demo_url: assetPath('/games/moyu-spreadsheet.html'),
    website_url: '',
    latest_version: 'v1.0.0',
    downloads: [],
    screenshots: [
      { url: assetPath('/images/products/moyu-spreadsheet/home.webp') },
    ],
  },
};

interface ProductDetailClientProps {
  locale: string;
  id: string;
}

export default function ProductDetailClient({ locale, id }: ProductDetailClientProps) {
  const t = useTranslations('products');
  const tc = useTranslations('common');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  const config = productConfigs[id] || productConfigs['1'];
  const isSoftware = config.category === 'software';
  const isGame = config.category === 'game';

  // Translatable data from i18n
  const name = t(`data.${id}.name`);
  const shortDescription = t(`data.${id}.short_description`);
  const description = t(`data.${id}.description`);
  const features: string[] = t.raw(`data.${id}.features`) || [];
  const screenshots_i18n: { title: string; description: string }[] = t.raw(`data.${id}.screenshots`) || [];

  // Merge i18n titles with config URLs
  const screenshots = config.screenshots.map((s, i) => ({
    ...s,
    title: screenshots_i18n[i]?.title || '',
    description: screenshots_i18n[i]?.description || '',
  }));

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + screenshots.length) % screenshots.length);
    }
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % screenshots.length);
    }
  };

  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href={`/${locale}`} className="hover:text-foreground">
          {tc('nav.home')}
        </Link>
        {' / '}
        <Link href={`/${locale}/products`} className="hover:text-foreground">
          {t('title')}
        </Link>
        {' / '}
        <span className="text-foreground">{name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Product Screenshots */}
        <div>
          {/* Main Screenshot / Video */}
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
            {config.video_url ? (
              <video
                ref={mainVideoRef}
                src={config.video_url}
                controls
                preload="metadata"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => openLightbox(0)}
              >
                <img
                  src={screenshots[0]?.url}
                  alt={screenshots[0]?.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Screenshot Thumbnails */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary overflow-hidden"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={screenshot.url}
                  alt={screenshot.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
              {t(`category.${config.category}`)}
            </span>
            {config.latest_version && (
              <span className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground">
                {config.latest_version}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{name}</h1>
          <p className="text-lg text-muted-foreground mb-8">{shortDescription}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {config.video_url && (
              <Button className="gap-2" onClick={() => { mainVideoRef.current?.pause(); setShowVideo(true); }}>
                <Play className="w-4 h-4" />
                {t('detail.watch_demo')}
              </Button>
            )}

            {isSoftware && config.downloads.length > 0 && (
              <Link href={`/${locale}/products/${config.id}/download`}>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  {t('detail.download')}
                </Button>
              </Link>
            )}

            {!isSoftware && config.demo_url && (
              <a href={config.demo_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  {isGame ? t('detail.play_now') : t('detail.try_online')}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">{t('detail.features')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">{t('detail.description')}</h2>
        {config.id === '1' ? (
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-lg leading-relaxed">
              {t('data.1.rich.intro')}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-semibold">
                {t('data.1.rich.intro_highlight')}
              </span>
              {t('data.1.rich.intro_desc')}
            </p>
            <p className="text-lg leading-relaxed">
              {t('data.1.rich.search_desc')}
              <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 font-medium">
                MySQL
              </span>
              、
              <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-medium">
                Redis
              </span>
              、
              <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium">
                Kafka
              </span>
              {t('data.1.rich.search_more')}
            </p>
            <p className="text-lg leading-relaxed">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 font-semibold">
                {t('data.1.rich.safety_badge')}
              </span>
              {t('data.1.rich.safety_desc')}
            </p>
            <div className="mt-10 pt-8 border-t">
              <h3 className="text-xl font-bold mb-6 text-center">{t('data.1.rich.core_title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group p-5 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all text-center">
                  <span className="text-4xl block mb-3">🎯</span>
                  <h4 className="font-bold text-lg text-violet-700 dark:text-violet-400 mb-2">{t('data.1.rich.core_1_title')}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('data.1.rich.core_1_desc')}</p>
                </div>
                <div className="group p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-center">
                  <span className="text-4xl block mb-3">⚡</span>
                  <h4 className="font-bold text-lg text-emerald-700 dark:text-emerald-400 mb-2">{t('data.1.rich.core_2_title')}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('data.1.rich.core_2_desc')}</p>
                </div>
                <div className="group p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-700 transition-all text-center">
                  <span className="text-4xl block mb-3">🔒</span>
                  <h4 className="font-bold text-lg text-amber-700 dark:text-amber-400 mb-2">{t('data.1.rich.core_3_title')}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('data.1.rich.core_3_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <p>{description}</p>
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-white/80 z-10"
            onClick={closeLightbox}
          >
            <X className="w-8 h-8" />
          </button>

          <button
            className="absolute left-4 text-white hover:text-white/80 z-10"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div className="max-w-[90vw] max-h-[90vh] overflow-auto px-4 py-4" onClick={(e) => e.stopPropagation()}>
            <div className="rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={screenshots[selectedImage]?.url}
                alt={screenshots[selectedImage]?.title}
                className="rounded-lg"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
            <div className="text-center mt-4 text-white">
              <h3 className="text-lg font-semibold">{screenshots[selectedImage]?.title}</h3>
              <p className="text-sm text-white/70">{screenshots[selectedImage]?.description}</p>
              <p className="text-xs text-white/50 mt-2">
                {selectedImage + 1} / {screenshots.length}
              </p>
            </div>
          </div>

          <button
            className="absolute right-4 text-white hover:text-white/80 z-10"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}

      {/* Video Modal */}
      {showVideo && config.video_url && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setShowVideo(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-white/80 z-10"
            onClick={() => setShowVideo(false)}
          >
            <X className="w-8 h-8" />
          </button>

          <div className="w-full max-w-5xl aspect-video px-4" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={config.video_url}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
