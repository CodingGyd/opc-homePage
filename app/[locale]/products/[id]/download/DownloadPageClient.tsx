'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { assetPath } from '@/lib/utils';

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

interface ReleaseNote {
  version: string;
  date: string;
  notes: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  latest_version: string;
  releaseDate: string;
  downloads: DownloadItem[];
  releaseNotes: ReleaseNote[];
}

// 产品数据
const products: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'DataWhere',
    description: '通用数据源接入工具，一个入口统一管理多种数据源（目前已支持 MySQL、Redis、Kafka）',
    latest_version: 'v0.1.0',
    releaseDate: '2026-03-24',
    releaseNotes: [
      {
        version: 'v0.1.0',
        date: '2026-03-24',
        notes: [
          '首个版本发布',
          '通用数据源接入架构：插件化设计，可持续扩展新数据源',
          '已支持 MySQL 5.6.x, 5.7.x, 8.0.x, 8.4.x',
          '已支持 Redis 5.x, 6.x, 7.x',
          '已支持 Kafka 2.8.x, 3.3.x, 3.6.x',
          '全局搜索：跨数据源类型、跨连接实例统一检索',
          '数据源管理：添加/编辑/删除/测试连接',
          '元数据自动同步：定时增量同步与全量同步',
          '跨平台支持：Windows 10/11',
          '配置分享：支持复制分享数据源信息，新人入职即用',
          '安全可靠：Ed25519 数字签名验证，严格只读模式',
        ],
      },
    ],
    downloads: [
      {
        platform: 'Windows',
        arch: 'exe',
        version: '0.1.0',
        url: assetPath('/downloads/dataquery-tool-0.1.0-windows-x64.exe'),
        size: '5.5 MB',
        icon: '🪟',
        requirements: 'Windows 10/11 (64-bit)',
        releaseDate: '2026-03-26',
        status: 'stable',
      },
      {
        platform: 'Windows',
        arch: 'msi',
        version: '0.1.0',
        url: assetPath('/downloads/dataquery-tool-0.1.0-windows-x64.msi'),
        size: '8 MB',
        icon: '🪟',
        requirements: 'Windows 10/11 (64-bit)',
        releaseDate: '2026-03-26',
        status: 'stable',
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
      {
        version: 'v1.0.0',
        date: '2026-03-15',
        notes: [
          '首次发布',
          '包含 JSON 工具、编码工具、正则测试器等',
          '支持 Windows、macOS、Linux',
        ],
      },
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
    qrCode: assetPath('/images/sponsor/alipay.png'),
  },
  wechat: {
    name: '微信支付',
    qrCode: assetPath('/images/sponsor/wechat-pay.png'),
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
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set([product.releaseNotes[0]?.version]));

  // 按平台分组下载项
  const platforms = ['all', ...Array.from(new Set(product.downloads.map((d) => d.platform)))];
  const filteredDownloads =
    selectedPlatform === 'all'
      ? product.downloads
      : product.downloads.filter((d) => d.platform === selectedPlatform);

  // 切换版本展开/折叠
  const toggleVersion = (version: string) => {
    setExpandedVersions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(version)) {
        newSet.delete(version);
      } else {
        newSet.add(version);
      }
      return newSet;
    });
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
          <div className="rounded-xl border bg-muted/30 overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">
                {locale === 'en' ? 'Release Notes' : '更新日志'}
              </h2>
            </div>
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {product.releaseNotes.map((release, index) => (
                <div key={release.version} className="bg-card">
                  <button
                    onClick={() => toggleVersion(release.version)}
                    className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-primary/10 text-primary">
                        {release.version}
                      </span>
                      <span className="text-sm text-muted-foreground">{release.date}</span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                          {locale === 'en' ? 'Latest' : '最新'}
                        </span>
                      )}
                    </div>
                    {expandedVersions.has(release.version) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedVersions.has(release.version) && (
                    <div className="px-4 pb-4 pt-1">
                      <ul className="space-y-2 ml-2">
                        {release.notes.map((note, noteIndex) => (
                          <li key={noteIndex} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-muted-foreground">{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {product.releaseNotes.length > 3 && (
              <div className="p-4 border-t bg-muted/30 text-center">
                <button
                  onClick={() => {
                    const allVersions = new Set(product.releaseNotes.map((r) => r.version));
                    setExpandedVersions(allVersions);
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  {locale === 'en' ? 'View All Versions' : '查看所有版本'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border">
            <h3 className="font-semibold mb-3">
              {locale === 'en' ? 'Download Tips' : '下载提示'}
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {locale === 'en' ? 'EXE version is recommended for better install experience' : '推荐下载 EXE 版本，安装体验更好'}</li>
              <li>• {locale === 'en' ? 'MSI version is suitable for enterprise deployment' : 'MSI 版本适合企业批量部署'}</li>
              <li>• {locale === 'en' ? 'Download failed? Contact QQ: 2307990428' : '下载失败请联系客服 QQ: 2307990428'}</li>
              <li>• {locale === 'en' ? 'Supporters get free lifetime updates' : '成为支持者，享受后续免费更新'}</li>
            </ul>
          </div>

          {/* SmartScreen Warning */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  {locale === 'en' ? 'Windows SmartScreen Warning' : 'Windows 安全警告说明'}
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {locale === 'en'
                    ? 'The app is not code-signed, so Windows may show a SmartScreen warning. Click "More info" → "Run anyway" to proceed. The app is completely safe.'
                    : '由于应用未经商业代码签名，Windows 可能会弹出 SmartScreen 警告。请点击"更多信息"→"仍要运行"即可正常安装。软件绝对安全，请放心使用。'}
                </p>
              </div>
            </div>
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
                : '支持开发者，解锁软件更多高级功能，享受后续持续更新。您的支持是我不断进步的动力！'}
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
