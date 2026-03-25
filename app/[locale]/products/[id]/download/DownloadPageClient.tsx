'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface DownloadItem {
  platform: string;
  arch?: string;
  version: string;
  url: string;
  size: string;
  icon: string;
  requirements?: string;
  releaseDate?: string;
  status: 'stable' | 'beta' | 'experimental';
}

interface Product {
  id: string;
  name: string;
  description: string;
  latest_version: string;
  releaseDate: string;
  downloads: DownloadItem[];
  releaseNotes: string[];
}

// 产品数据
const products: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'DataQuery Pro',
    description: '跨平台数据库查询工具，支持 MySQL、Redis 和 Kafka',
    latest_version: 'v1.2.0',
    releaseDate: '2026-03-20',
    releaseNotes: [
      '新增 Kafka 消息队列管理功能',
      '优化 MySQL 查询性能，提升 50%',
      '修复 Redis 连接池泄漏问题',
      '新增深色模式支持',
      '改进全局搜索算法',
    ],
    downloads: [
      {
        platform: 'Windows',
        arch: '64-bit',
        version: '1.2.0',
        url: '/downloads/dataquery-pro-1.2.0-windows-x64.exe',
        size: '85 MB',
        icon: '🪟',
        requirements: 'Windows 10/11 (64-bit)',
        releaseDate: '2026-03-20',
        status: 'stable',
      },
      {
        platform: 'Windows',
        arch: '32-bit',
        version: '1.2.0',
        url: '/downloads/dataquery-pro-1.2.0-windows-ia32.exe',
        size: '78 MB',
        icon: '🪟',
        requirements: 'Windows 10/11 (32-bit)',
        releaseDate: '2026-03-20',
        status: 'stable',
      },
      {
        platform: 'macOS',
        arch: 'Intel',
        version: '1.2.0',
        url: '/downloads/dataquery-pro-1.2.0-macos-x64.dmg',
        size: '92 MB',
        icon: '🍎',
        requirements: 'macOS 11.0+ (Intel)',
        releaseDate: '2026-03-20',
        status: 'experimental',
      },
      {
        platform: 'macOS',
        arch: 'Apple Silicon',
        version: '1.2.0',
        url: '/downloads/dataquery-pro-1.2.0-macos-arm64.dmg',
        size: '88 MB',
        icon: '🍎',
        requirements: 'macOS 11.0+ (M1/M2/M3)',
        releaseDate: '2026-03-20',
        status: 'experimental',
      },
      {
        platform: 'Linux',
        arch: 'x64',
        version: '1.2.0',
        url: '/downloads/dataquery-pro-1.2.0-linux-x64.AppImage',
        size: '95 MB',
        icon: '🐧',
        requirements: 'Ubuntu 20.04+ / Debian 11+',
        releaseDate: '2026-03-20',
        status: 'experimental',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'DevTools Suite',
    description: '开发者日常效率工具集',
    latest_version: 'v1.0.0',
    releaseDate: '2026-03-15',
    releaseNotes: [
      '首次发布',
      '包含 JSON 工具、编码工具、正则测试器等',
      '支持 Windows、macOS、Linux',
    ],
    downloads: [
      {
        platform: 'Windows',
        arch: '64-bit',
        version: '1.0.0',
        url: '/downloads/devtools-suite-1.0.0-windows-x64.exe',
        size: '65 MB',
        icon: '🪟',
        requirements: 'Windows 10/11 (64-bit)',
        releaseDate: '2026-03-15',
        status: 'stable',
      },
      {
        platform: 'Windows',
        arch: '32-bit',
        version: '1.0.0',
        url: '/downloads/devtools-suite-1.0.0-windows-ia32.exe',
        size: '58 MB',
        icon: '🪟',
        requirements: 'Windows 10/11 (32-bit)',
        releaseDate: '2026-03-15',
        status: 'stable',
      },
      {
        platform: 'macOS',
        arch: 'Universal',
        version: '1.0.0',
        url: '/downloads/devtools-suite-1.0.0-macos-universal.dmg',
        size: '70 MB',
        icon: '🍎',
        requirements: 'macOS 11.0+',
        releaseDate: '2026-03-15',
        status: 'experimental',
      },
      {
        platform: 'Linux',
        arch: 'x64',
        version: '1.0.0',
        url: '/downloads/devtools-suite-1.0.0-linux-x64.AppImage',
        size: '68 MB',
        icon: '🐧',
        requirements: 'Ubuntu 20.04+',
        releaseDate: '2026-03-15',
        status: 'experimental',
      },
    ],
  },
};

// 赞助配置
const sponsorInfo = {
  alipay: {
    name: '支付宝',
    qrCode: '/opc-homePage/images/sponsor/alipay.png',
  },
  wechat: {
    name: '微信支付',
    qrCode: '/opc-homePage/images/sponsor/wechat-pay.png',
  },
  registerFormUrl: 'https://my.feishu.cn/share/base/form/shrcnj9KL4CDSbHZIEXKr4WR08e',
};

export default function DownloadPageClient({
  locale,
  id,
}: {
  locale: string;
  id: string;
}) {
  const product = products[id] || products['1'];
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  // 按平台分组下载项
  const platforms = ['all', ...Array.from(new Set(product.downloads.map((d) => d.platform)))];
  const filteredDownloads =
    selectedPlatform === 'all'
      ? product.downloads
      : product.downloads.filter((d) => d.platform === selectedPlatform);

  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href={`/${locale}`} className="hover:text-foreground">
          {locale === 'en' ? 'Home' : '首页'}
        </Link>
        {' / '}
        <Link href={`/${locale}/products`} className="hover:text-foreground">
          {locale === 'en' ? 'Products' : '产品'}
        </Link>
        {' / '}
        <Link href={`/${locale}/products/${id}`} className="hover:text-foreground">
          {product.name}
        </Link>
        {' / '}
        <span className="text-foreground">{locale === 'en' ? 'Download' : '下载'}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <Link
          href={`/${locale}/products/${id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {locale === 'en' ? 'Back to product' : '返回产品详情'}
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          <span className="px-3 py-1 text-sm rounded-full bg-primary text-primary-foreground">
            {product.latest_version}
          </span>
        </div>
        <p className="text-lg text-muted-foreground">{product.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Download Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Platform Filter */}
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedPlatform === platform
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {platform === 'all'
                  ? locale === 'en'
                    ? 'All Platforms'
                    : '全部平台'
                  : platform}
              </button>
            ))}
          </div>

          {/* Download Cards */}
          <div className="space-y-4">
            {filteredDownloads.map((download, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border bg-card hover:border-primary/50 transition-all group ${
                  download.status === 'experimental' ? 'border-orange-200 bg-orange-50/30' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{download.icon}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{download.platform}</h3>
                      {download.arch && (
                        <span className="px-2 py-0.5 text-xs rounded bg-muted">{download.arch}</span>
                      )}
                      {download.status === 'stable' ? (
                        <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                          {locale === 'en' ? 'Stable' : '稳定版'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-700">
                          {locale === 'en' ? 'Experimental' : '实验版'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-x-3">
                      <span>v{download.version}</span>
                      <span>·</span>
                      <span>{download.size}</span>
                      {download.requirements && (
                        <>
                          <span>·</span>
                          <span>{download.requirements}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <a href={download.url} download>
                    <Button
                      className={`gap-2 group-hover:shadow-lg transition-shadow ${
                        download.status === 'experimental' ? 'bg-orange-600 hover:bg-orange-700' : ''
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      {locale === 'en' ? 'Download' : '下载'}
                    </Button>
                  </a>
                </div>

                {/* Experimental warning */}
                {download.status === 'experimental' && (
                  <div className="mt-4 p-3 rounded-lg bg-orange-100/50 border border-orange-200">
                    <p className="text-sm text-orange-800">
                      ⚠️ {locale === 'en'
                        ? 'This version has not been fully tested. Stability is not guaranteed. If you encounter issues, please contact support.'
                        : '此版本未经过完整测试，不保证稳定使用。如遇问题请联系客服反馈。'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Release Notes */}
          <div className="p-6 rounded-xl border bg-muted/30">
            <h2 className="text-xl font-bold mb-4">
              {locale === 'en' ? 'Release Notes' : '更新日志'}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {product.latest_version} · {product.releaseDate}
            </p>
            <ul className="space-y-2">
              {product.releaseNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Requirements */}
          <div className="p-6 rounded-xl border bg-card">
            <h2 className="text-lg font-bold mb-4">
              {locale === 'en' ? 'System Requirements' : '系统要求'}
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium">Windows</div>
                <div className="text-muted-foreground">Windows 10/11 (64-bit)</div>
              </div>
              <div>
                <div className="font-medium">macOS</div>
                <div className="text-muted-foreground">macOS 11.0 (Big Sur) or later</div>
              </div>
              <div>
                <div className="font-medium">Linux</div>
                <div className="text-muted-foreground">Ubuntu 20.04+, Debian 11+</div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border">
            <h3 className="font-semibold mb-3">
              {locale === 'en' ? 'Download Tips' : '下载提示'}
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {locale === 'en' ? 'Choose the right version for your system' : '选择适合您系统的版本'}</li>
              <li>• {locale === 'en' ? 'Contact support if download fails' : '如果下载失败请联系客服'}</li>
              <li>• {locale === 'en' ? 'Free updates within major version' : '大版本内免费更新'}</li>
            </ul>
          </div>

          {/* Supporter */}
          <div className="p-6 rounded-xl border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <h2 className="text-lg font-bold">
                  {locale === 'en' ? 'Become a Supporter' : '成为支持者'}
                </h2>
              </div>
              <span className="text-2xl font-bold text-amber-600">¥19.9</span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {locale === 'en'
                ? 'Support our development to unlock more features and get priority updates. Your support keeps the project alive!'
                : '支持开发者，解锁软件更多高级功能，享受后续持续更新。您的支持是我们不断进步的动力！'}
            </p>

            {/* Payment QR Codes */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="w-28 h-28 mx-auto mb-2 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                  <img
                    src={sponsorInfo.alipay.qrCode}
                    alt="Alipay"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{sponsorInfo.alipay.name}</span>
              </div>
              <div className="text-center">
                <div className="w-28 h-28 mx-auto mb-2 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                  <img
                    src={sponsorInfo.wechat.qrCode}
                    alt="WeChat Pay"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{sponsorInfo.wechat.name}</span>
              </div>
            </div>

            {/* Register Link */}
            <a
              href={sponsorInfo.registerFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" className="w-full gap-2 text-sm">
                {locale === 'en' ? 'Register as Supporter' : '登记支持者信息'}
                <ExternalLink className="w-3 h-3" />
              </Button>
            </a>

            <p className="text-xs text-muted-foreground text-center mt-3">
              {locale === 'en'
                ? 'After payment, fill in the form and support will unlock features for you'
                : '支付后请填写登记表，客服马上为您解锁高级功能'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
