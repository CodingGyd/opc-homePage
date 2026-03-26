'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Check, ExternalLink, Play, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Screenshot {
  url: string;
  title: string;
  description: string;
}

interface DownloadItem {
  platform: string;
  version: string;
  url: string;
  size: string;
  icon: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  category: string;
  features: string[];
  demo_url: string;
  website_url: string;
  video_url: string;
  screenshots: Screenshot[];
  downloads: DownloadItem[];
  latest_version: string;
}

// 产品数据
const demoProducts: Record<string, Product> = {
  '1': {
    id: '1',
    name: '数据统一查询工具',
    description: '数据统一查询工具是一款通用的数据源接入平台，致力于打造成统一的数据查询入口。通过插件化的数据源适配器，支持接入各类数据库、缓存、消息队列等数据源。目前已实现 MySQL、Redis、Kafka 的接入，后续将持续扩展更多数据源类型。核心理念：统一（一个入口，接入任意数据源）、简单（像搜索引擎一样易用）、安全（只读模式，数据不出本地）。',
    short_description: '通用数据源接入工具，一个入口统一管理多种数据源（目前已支持 MySQL、Redis、Kafka）',
    category: 'software',
    features: [
      '通用数据源接入：插件化架构，持续扩展更多数据源类型',
      '已支持 MySQL 5.6.x ~ 8.4.x：数据库浏览、只读 SQL 查询',
      '已支持 Redis 5.x ~ 7.x：Key 浏览和值查看',
      '已支持 Kafka 2.8.x ~ 3.6.x：Topic 浏览和消息查看',
      '全局搜索：一个搜索框，跨数据源类型、跨连接实例统一检索',
      '数据源管理：统一管理所有数据源连接',
      '元数据同步：自动同步数据源元数据到本地索引',
      '跨平台支持：Windows、macOS、Linux',
      '本地优先：所有数据留在本地，无需联网',
      '安全可靠：Ed25519 数字签名验证，严格只读模式',
    ],
    demo_url: '',
    website_url: '',
    video_url: '',
    latest_version: 'v0.1.0',
    downloads: [
      {
        platform: 'Windows (exe)',
        version: '0.1.0',
        url: '/opc-homePage/downloads/dataquery-tool-0.1.0-windows-x64.exe',
        size: '5.5 MB',
        icon: '🪟',
      },
      {
        platform: 'Windows (msi)',
        version: '0.1.0',
        url: '/opc-homePage/downloads/dataquery-tool-0.1.0-windows-x64.msi',
        size: '8 MB',
        icon: '🪟',
      },
    ],
    screenshots: [
      {
        url: '/opc-homePage/images/products/dataquery/home.png',
        title: '首页',
        description: '简洁直观的首页设计',
      },
      {
        url: '/opc-homePage/images/products/dataquery/search.png',
        title: '聚合搜索',
        description: '一个搜索框，跨数据源检索',
      },
      {
        url: '/opc-homePage/images/products/dataquery/mysql.png',
        title: 'MySQL 工作台',
        description: 'MySQL 数据库查询与管理',
      },
      {
        url: '/opc-homePage/images/products/dataquery/redis.png',
        title: 'Redis 工作台',
        description: 'Redis 键值浏览与管理',
      },
      {
        url: '/opc-homePage/images/products/dataquery/kafka.png',
        title: 'Kafka 工作台',
        description: 'Kafka 消息浏览与查看',
      },
      {
        url: '/opc-homePage/images/products/dataquery/datasource.png',
        title: '数据源管理',
        description: '统一管理所有数据源连接',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'DevTools Suite',
    description: '开发者日常必备工具集，包含 JSON 格式化、Base64 编码、正则测试、颜色选择器等实用工具。',
    short_description: '开发者日常效率工具集',
    category: 'software',
    features: [
      'JSON 工具',
      '编码工具',
      '正则测试器',
      '颜色选择器',
      '代码美化',
      '跨平台支持',
      '离线使用',
    ],
    demo_url: '',
    website_url: '',
    video_url: '',
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
      {
        url: '/opc-homePage/images/products/devtools/main.svg',
        title: '工具集主界面',
        description: '所有工具一目了然',
      },
      {
        url: '/opc-homePage/images/products/devtools/json.svg',
        title: 'JSON 工具',
        description: 'JSON 格式化与验证',
      },
    ],
  },
  '3': {
    id: '3',
    name: 'CloudDev Studio',
    description: 'AI 驱动的在线开发环境。随时随地编码，实时协作，一键部署。无需安装。',
    short_description: 'AI 驱动的在线开发环境',
    category: 'saas',
    features: [
      'AI 代码补全',
      '云端 IDE',
      '实时协作',
      'Git 集成',
      '实时预览',
      '团队工作空间',
      '一键部署',
      '24/7 支持',
    ],
    demo_url: 'https://clouddev.opc.studio',
    website_url: 'https://clouddev.opc.studio',
    video_url: 'https://player.bilibili.com/player.html?bvid=BV1example3',
    latest_version: '',
    downloads: [],
    screenshots: [
      {
        url: '/opc-homePage/images/products/clouddev/ide.svg',
        title: '在线 IDE',
        description: '功能完整的在线代码编辑器',
      },
      {
        url: '/opc-homePage/images/products/clouddev/ai.svg',
        title: 'AI 助手',
        description: '智能代码补全与建议',
      },
    ],
  },
};

interface ProductDetailClientProps {
  locale: string;
  id: string;
}

export default function ProductDetailClient({ locale, id }: ProductDetailClientProps) {
  const t = useTranslations('products');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const product = demoProducts[id] || demoProducts['1'];
  const isSoftware = product.category === 'software';

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + product.screenshots.length) % product.screenshots.length);
    }
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % product.screenshots.length);
    }
  };

  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href={`/${locale}`} className="hover:text-foreground">
          {locale === 'en' ? 'Home' : '首页'}
        </Link>
        {' / '}
        <Link href={`/${locale}/products`} className="hover:text-foreground">
          {t('title')}
        </Link>
        {' / '}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Product Screenshots */}
        <div>
          {/* Main Screenshot */}
          <div
            className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mb-4 cursor-pointer hover:ring-2 hover:ring-primary transition-all overflow-hidden relative"
            onClick={() => openLightbox(0)}
          >
            <img
              src={product.screenshots[0]?.url}
              alt={product.screenshots[0]?.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-6xl">📦</span>
          </div>

          {/* Screenshot Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {product.screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary overflow-hidden relative"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={screenshot.url}
                  alt={screenshot.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="text-2xl">📷</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
              {t(`category.${product.category}`)}
            </span>
            {product.latest_version && (
              <span className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground">
                {product.latest_version}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg text-muted-foreground mb-8">{product.short_description}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {product.video_url && (
              <Button className="gap-2" onClick={() => setShowVideo(true)}>
                <Play className="w-4 h-4" />
                {locale === 'en' ? 'Watch Demo' : '观看演示'}
              </Button>
            )}

            {/* Software: Download button */}
            {isSoftware && product.downloads.length > 0 && (
              <Link href={`/${locale}/products/${product.id}/download`}>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  {locale === 'en' ? 'Download' : '下载体验'}
                </Button>
              </Link>
            )}

            {/* SaaS: Online experience button */}
            {!isSoftware && product.demo_url && (
              <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  {locale === 'en' ? 'Try Online' : '在线体验'}
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
          {product.features.map((feature, index) => (
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
        {product.id === '1' ? (
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-lg leading-relaxed">
              告别数据查询的繁琐！
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-semibold">
                数据统一查询工具
              </span>
              为产品、运营、开发、运维等每一位团队成员打造专属的数据检索入口。
            </p>
            <p className="text-lg leading-relaxed">
              一个搜索框，秒级定位任意数据源中的数据资产。目前已支持
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
              ，更多数据源持续扩展中——无需切换工具，无需记忆复杂命令，让数据查询像搜索引擎一样简单。
            </p>
            <p className="text-lg leading-relaxed">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 font-semibold">
                只读查询
              </span>
              天然杜绝误操作风险。与传统数据库工具不同，我们从根本上限制写入权限——让您放心把工具交给任何需要查询数据的同事，再也不用担心数据被意外篡改或删除。
            </p>
            <div className="mt-10 pt-8 border-t">
              <h3 className="text-xl font-bold mb-6 text-center">核心理念</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group p-5 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all text-center">
                  <span className="text-4xl block mb-3">🎯</span>
                  <h4 className="font-bold text-lg text-violet-700 dark:text-violet-400 mb-2">统一</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">一个入口，接入任意数据源</p>
                </div>
                <div className="group p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-center">
                  <span className="text-4xl block mb-3">⚡</span>
                  <h4 className="font-bold text-lg text-emerald-700 dark:text-emerald-400 mb-2">简单</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">像搜索引擎一样易用</p>
                </div>
                <div className="group p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-700 transition-all text-center">
                  <span className="text-4xl block mb-3">🔒</span>
                  <h4 className="font-bold text-lg text-amber-700 dark:text-amber-400 mb-2">安全</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">只读模式，数据不出本地</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <p>{product.description}</p>
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

          <div className="max-w-5xl max-h-[80vh] px-12" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg aspect-video flex items-center justify-center">
              <img
                src={product.screenshots[selectedImage]?.url}
                alt={product.screenshots[selectedImage]?.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-6xl">📷</span>
            </div>
            <div className="text-center mt-4 text-white">
              <h3 className="text-lg font-semibold">{product.screenshots[selectedImage]?.title}</h3>
              <p className="text-sm text-white/70">{product.screenshots[selectedImage]?.description}</p>
              <p className="text-xs text-white/50 mt-2">
                {selectedImage + 1} / {product.screenshots.length}
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
      {showVideo && product.video_url && (
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
              src={product.video_url}
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
