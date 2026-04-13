'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Download, ExternalLink, ChevronDown, ChevronUp,
  ChevronRight, Monitor, History,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { assetPath } from '@/lib/utils';
import { trackDownload } from '@/lib/tracker';

// --- Types ---

type Platform = 'Windows' | 'macOS' | 'Linux';
type DetectedOS = 'Windows' | 'macOS' | 'Linux' | 'Unknown';

interface DownloadItem {
  platform: Platform;
  arch: string;
  url: string;
  size: string;
  requirements?: string;
  status: 'stable' | 'beta' | 'experimental';
  format: string;
  recommended?: boolean;
}

interface VersionDownloads {
  version: string;
  releaseDate: string;
  status: 'stable' | 'beta' | 'experimental';
  isLatest: boolean;
  downloads: DownloadItem[];
  releaseNotes: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  latest_version: string;
  versions: VersionDownloads[];
}

// --- OS Detection ---

function detectOS(): DetectedOS {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown';
}

function detectArch(): 'x64' | 'x86' | 'Unknown' {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  const platform = navigator.platform || '';
  if (ua.includes('x86_64') || ua.includes('x64') || ua.includes('WOW64') || ua.includes('Win64')) return 'x64';
  if (ua.includes('x86') || ua.includes('i686') || ua.includes('i386')) return 'x86';
  if (platform.includes('Mac')) return 'x64';
  return 'Unknown';
}

function getRecommendedDownload(
  version: VersionDownloads,
  os: DetectedOS,
  arch: string,
): DownloadItem | null {
  const platformDownloads = version.downloads.filter((d) => d.platform === os);
  if (platformDownloads.length === 0) return null;

  const recommended = platformDownloads.find((d) => d.recommended);
  if (recommended) return recommended;

  if (os === 'Windows') {
    const archMatch = platformDownloads.find((d) =>
      arch === 'x64' ? d.arch.includes('64-bit') : d.arch.includes('32-bit'),
    );
    if (archMatch) return archMatch;
    return platformDownloads.find((d) => d.format === 'exe') || platformDownloads[0];
  }

  if (os === 'macOS') {
    return platformDownloads.find((d) => d.arch.includes('Universal')) || platformDownloads[0];
  }

  return platformDownloads.find((d) => d.format === 'deb')
    || platformDownloads.find((d) => d.format === 'rpm')
    || platformDownloads[0];
}

const platformIcon = (p: Platform) => (p === 'Windows' ? '🪟' : p === 'macOS' ? '🍎' : '🐧');

// --- Product Data ---

const products: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'DataWhere',
    description: '一个搜索框，搜遍你所有的数据',
    latest_version: 'v1.1.6',
    versions: [
      {
        version: '1.1.6',
        releaseDate: '2026-04-13',
        status: 'stable',
        isLatest: true,
        downloads: [
          {
            platform: 'Windows',
            arch: 'exe (64-bit)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.6/DataWhere_1.1.6_x64-setup.exe',
            size: '5.8 MB',
            requirements: 'Windows 10+ (64-bit)',
            status: 'stable',
            format: 'exe',
            recommended: true,
          },
          {
            platform: 'Windows',
            arch: 'msi (64-bit)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.6/DataWhere_1.1.6_x64_zh-CN.msi',
            size: '8.4 MB',
            requirements: 'Windows 10+ (64-bit)',
            status: 'stable',
            format: 'msi',
          },
          {
            platform: 'Windows',
            arch: 'exe (32-bit)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.6/DataWhere_1.1.6_x86-setup.exe',
            size: '5.2 MB',
            requirements: 'Windows 10+ (32-bit)',
            status: 'stable',
            format: 'exe',
          },
          {
            platform: 'Windows',
            arch: 'msi (32-bit)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.6/DataWhere_1.1.6_x86_zh-CN.msi',
            size: '7.4 MB',
            requirements: 'Windows 10+ (32-bit)',
            status: 'stable',
            format: 'msi',
          },
          {
            platform: 'macOS',
            arch: 'Universal',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.6/DataWhere_1.1.6_universal.dmg',
            size: '18 MB',
            requirements: 'macOS 10.15+',
            status: 'stable',
            format: 'dmg',
            recommended: true,
          },
          {
            platform: 'Linux',
            arch: 'deb (amd64)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.6/DataWhere_1.1.6_amd64.deb',
            size: '11 MB',
            requirements: 'Debian/Ubuntu',
            status: 'stable',
            format: 'deb',
            recommended: true,
          },
          {
            platform: 'Linux',
            arch: 'rpm (x86_64)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.6/DataWhere-1.1.6-1.x86_64.rpm',
            size: '11 MB',
            requirements: 'RHEL/CentOS/Fedora',
            status: 'stable',
            format: 'rpm',
          },
          {
            platform: 'Linux',
            arch: 'AppImage (amd64)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.6/DataWhere_1.1.6_amd64.AppImage',
            size: '86 MB',
            requirements: '通用 Linux 发行版',
            status: 'stable',
            format: 'AppImage',
          },
        ],
        releaseNotes: [
          'SOCKS5 代理支持：新增全局 SOCKS5 代理配置，解决 VPN 环境下无法连接远程数据源的问题',
          '连接自动回退：网络环境变化时自动切换直连/代理方式，无需手动干预',
          'OceanBase 数据源：新增 OceanBase 数据源支持（MySQL 兼容模式）',
          '首页统计卡片展示优化',
        ],
      },
      {
        version: '1.1.4',
        releaseDate: '2026-04-09',
        status: 'stable',
        isLatest: false,
        downloads: [
          {
            platform: 'Windows',
            arch: 'exe (64-bit)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.4/DataWhere_1.1.4_x64-setup.exe',
            size: '5.8 MB',
            requirements: 'Windows 10+ (64-bit)',
            status: 'stable',
            format: 'exe',
            recommended: true,
          },
          {
            platform: 'Windows',
            arch: 'msi (64-bit)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.4/DataWhere_1.1.4_x64_zh-CN.msi',
            size: '8.4 MB',
            requirements: 'Windows 10+ (64-bit)',
            status: 'stable',
            format: 'msi',
          },
          {
            platform: 'Windows',
            arch: 'exe (32-bit)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.4/DataWhere_1.1.4_x86-setup.exe',
            size: '5.2 MB',
            requirements: 'Windows 10+ (32-bit)',
            status: 'stable',
            format: 'exe',
          },
          {
            platform: 'Windows',
            arch: 'msi (32-bit)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.4/DataWhere_1.1.4_x86_zh-CN.msi',
            size: '7.4 MB',
            requirements: 'Windows 10+ (32-bit)',
            status: 'stable',
            format: 'msi',
          },
          {
            platform: 'macOS',
            arch: 'Universal',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.4/DataWhere_1.1.4_universal.dmg',
            size: '18 MB',
            requirements: 'macOS 10.15+',
            status: 'stable',
            format: 'dmg',
            recommended: true,
          },
          {
            platform: 'Linux',
            arch: 'deb (amd64)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.4/DataWhere_1.1.4_amd64.deb',
            size: '11 MB',
            requirements: 'Debian/Ubuntu',
            status: 'stable',
            format: 'deb',
            recommended: true,
          },
          {
            platform: 'Linux',
            arch: 'rpm (x86_64)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.4/DataWhere-1.1.4-1.x86_64.rpm',
            size: '11 MB',
            requirements: 'RHEL/CentOS/Fedora',
            status: 'stable',
            format: 'rpm',
          },
          {
            platform: 'Linux',
            arch: 'AppImage (amd64)',
            url: 'https://gydblog2.su.bcebos.com/files/datawhere/v1.1.4/DataWhere_1.1.4_amd64.AppImage',
            size: '86 MB',
            requirements: '通用 Linux 发行版',
            status: 'stable',
            format: 'AppImage',
          },
        ],
        releaseNotes: [
          '修复首页统计卡片不显示 Kafka 主题数量',
          '修复 Kafka 工作台拉取消息返回空（日志保留清理旧消息后 offset 越界）',
          '修复搜索结果缺少视图和物化视图的筛选项',
          '搜索页类型筛选改为下拉选择器',
          '首页统计新增 PostgreSQL 视图和物化视图展示',
        ],
      },
    ],
  },
  '2': {
    id: '2',
    name: 'DevTools Suite',
    description: '开发者日常效率工具集',
    latest_version: 'v1.0.0',
    versions: [
      {
        version: '1.0.0',
        releaseDate: '2026-03-15',
        status: 'stable',
        isLatest: true,
        downloads: [
          {
            platform: 'Windows',
            arch: '64-bit',
            url: '/downloads/devtools-suite-1.0.0-windows-x64.exe',
            size: '65 MB',
            requirements: 'Windows 10/11 (64-bit)',
            status: 'stable',
            format: 'exe',
            recommended: true,
          },
          {
            platform: 'Windows',
            arch: '32-bit',
            url: '/downloads/devtools-suite-1.0.0-windows-ia32.exe',
            size: '58 MB',
            requirements: 'Windows 10/11 (32-bit)',
            status: 'stable',
            format: 'exe',
          },
          {
            platform: 'macOS',
            arch: 'Universal',
            url: '/downloads/devtools-suite-1.0.0-macos-universal.dmg',
            size: '70 MB',
            requirements: 'macOS 11.0+',
            status: 'experimental',
            format: 'dmg',
            recommended: true,
          },
          {
            platform: 'Linux',
            arch: 'x64',
            url: '/downloads/devtools-suite-1.0.0-linux-x64.AppImage',
            size: '68 MB',
            requirements: 'Ubuntu 20.04+',
            status: 'experimental',
            format: 'AppImage',
            recommended: true,
          },
        ],
        releaseNotes: [
          '首次发布',
          '包含 JSON 工具、编码工具、正则测试器等',
          '支持 Windows、macOS、Linux',
        ],
      },
    ],
  },
};

// --- Sponsor Config ---
import { sponsorInfo } from '@/lib/sponsor';

// --- Component ---

export default function DownloadPageClient({
  locale,
  id,
}: {
  locale: string;
  id: string;
}) {
  const product = products[id] || products['1'];
  const latestVersion = product.versions.find((v) => v.isLatest)!;
  const historicalVersions = product.versions.filter((v) => !v.isLatest);

  const [detectedOS, setDetectedOS] = useState<DetectedOS>('Unknown');
  const [detectedArch, setDetectedArch] = useState<string>('Unknown');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [showHistoricalVersions, setShowHistoricalVersions] = useState(false);
  const [expandedHistoricalNotes, setExpandedHistoricalNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    setDetectedOS(detectOS());
    setDetectedArch(detectArch());
  }, []);

  const recommendedDownload =
    detectedOS !== 'Unknown' ? getRecommendedDownload(latestVersion, detectedOS, detectedArch) : null;

  // Platform filter for latest version
  const allPlatforms = ['Windows', 'macOS', 'Linux'] as Platform[];
  const latestPlatforms = ['all', ...Array.from(new Set(latestVersion.downloads.map((d) => d.platform)))] as string[];

  const filteredLatestDownloads =
    selectedPlatform === 'all'
      ? latestVersion.downloads
      : latestVersion.downloads.filter((d) => d.platform === selectedPlatform);

  const toggleHistoricalNotes = (version: string) => {
    setExpandedHistoricalNotes((prev) => {
      const s = new Set(prev);
      if (s.has(version)) s.delete(version);
      else s.add(version);
      return s;
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
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* OS Detection Banner */}
          <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Monitor className="w-6 h-6 text-primary shrink-0" />
                <div className="min-w-0">
                  {recommendedDownload ? (
                    <>
                      <p className="font-medium text-sm">
                        {locale === 'en'
                          ? `Detected your OS: ${detectedOS}${detectedArch !== 'Unknown' ? ` ${detectedArch}` : ''}`
                          : `检测到您的系统：${detectedOS}${detectedArch !== 'Unknown' ? ` ${detectedArch}` : ''}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {product.name} v{latestVersion.version} · {recommendedDownload.arch} · {recommendedDownload.size}
                      </p>
                    </>
                  ) : (
                    <p className="font-medium text-sm">
                      {locale === 'en' ? 'Choose your platform' : '请选择您的平台'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {recommendedDownload ? (
                  <a href={recommendedDownload.url} download onClick={() => trackDownload({ productId: product.id, productName: product.name, version: latestVersion.version, platform: recommendedDownload.platform, format: recommendedDownload.format })}>
                    <Button size="lg" className="gap-2 px-8 h-12 text-base">
                      <Download className="w-5 h-5" />
                      {locale === 'en' ? 'Download Now' : '立即下载'}
                    </Button>
                  </a>
                ) : (
                  allPlatforms
                    .filter((p) => latestVersion.downloads.some((d) => d.platform === p))
                    .map((p) => (
                      <a
                        key={p}
                        href={latestVersion.downloads.find((d) => d.platform === p && d.recommended)?.url
                          || latestVersion.downloads.find((d) => d.platform === p)?.url
                          || '#'}
                        download
                      >
                        <Button variant="outline" size="default" className="gap-1.5">
                          {platformIcon(p)} {p}
                        </Button>
                      </a>
                    ))
                )}
              </div>
            </div>
            {/* Other platform quick links */}
            {recommendedDownload && (
              <div className="mt-3 pt-3 border-t border-primary/10 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{locale === 'en' ? 'Other platforms:' : '其他平台：'}</span>
                {allPlatforms
                  .filter((p) => p !== detectedOS && latestVersion.downloads.some((d) => d.platform === p))
                  .map((p) => {
                    const dl = latestVersion.downloads.find((d) => d.platform === p && d.recommended)
                      || latestVersion.downloads.find((d) => d.platform === p);
                    return (
                      <a key={p} href={dl?.url} download className="inline-flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => dl && trackDownload({ productId: product.id, productName: product.name, version: latestVersion.version, platform: dl.platform, format: dl.format })}>
                        {platformIcon(p)} {p}
                        <ChevronRight className="w-3 h-3" />
                      </a>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Latest Version Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold">v{latestVersion.version}</h2>
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {locale === 'en' ? 'Latest' : '最新'}
              </span>
              <span className="text-sm text-muted-foreground">{latestVersion.releaseDate}</span>
            </div>

            {/* Platform Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {latestPlatforms.map((platform) => (
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
                    ? locale === 'en' ? 'All Platforms' : '全部平台'
                    : platform}
                </button>
              ))}
            </div>

            {/* Platform Download Cards */}
            <div className="space-y-4">
              {(() => {
                const platformOrder: Platform[] = ['Windows', 'macOS', 'Linux'];
                const groups = (selectedPlatform === 'all' ? platformOrder : [selectedPlatform as Platform])
                  .map((p) => ({
                    platform: p,
                    icon: platformIcon(p),
                    items: filteredLatestDownloads.filter((d) => d.platform === p),
                  }))
                  .filter((g) => g.items.length > 0);

                return groups.map((group) => (
                  <div
                    key={group.platform}
                    className={`rounded-xl border bg-card overflow-hidden transition-all ${
                      detectedOS === group.platform ? 'ring-2 ring-primary/20 border-primary/30' : ''
                    }`}
                  >
                    <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
                      <span className="text-xl">{group.icon}</span>
                      <h3 className="font-semibold">{group.platform}</h3>
                      <span className="text-xs text-muted-foreground">
                        {group.items.length} {locale === 'en' ? 'files' : '个安装包'}
                      </span>
                      {detectedOS === group.platform && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-primary/10 text-primary">
                          {locale === 'en' ? 'Recommended' : '推荐'}
                        </span>
                      )}
                    </div>
                    <div className="p-3 space-y-2">
                      {group.items.map((dl, index) => (
                        <a
                          key={index}
                          href={dl.url}
                          download
                          onClick={() => trackDownload({ productId: product.id, productName: product.name, version: latestVersion.version, platform: dl.platform, format: dl.format })}
                          className={`flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50 group ${
                            dl.recommended ? 'bg-primary/5 border border-primary/10' : ''
                          } ${dl.status === 'experimental' ? 'border border-orange-200 bg-orange-50/30' : ''}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{dl.arch}</span>
                              {dl.recommended && (
                                <span className="px-1.5 py-0.5 text-[10px] rounded bg-primary/10 text-primary">
                                  {locale === 'en' ? 'Recommended' : '推荐'}
                                </span>
                              )}
                              {dl.status === 'stable' ? (
                                <span className="px-1.5 py-0.5 text-[10px] rounded bg-green-100 text-green-700">
                                  {locale === 'en' ? 'Stable' : '稳定版'}
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 text-[10px] rounded bg-orange-100 text-orange-700">
                                  {locale === 'en' ? 'Experimental' : '实验版'}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {dl.size}
                              {dl.requirements && <span> · {dl.requirements}</span>}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className={`gap-1.5 ${dl.status === 'experimental' ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            {locale === 'en' ? 'Download' : '下载'}
                          </Button>
                        </a>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Latest Release Notes */}
            {latestVersion.releaseNotes.length > 0 && (
              <div className="rounded-xl border bg-muted/30 overflow-hidden mt-6">
                <div className="p-5 border-b">
                  <h3 className="font-semibold">
                    {locale === 'en' ? 'Release Notes' : '更新日志'} · v{latestVersion.version}
                  </h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-2 ml-1">
                    {latestVersion.releaseNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span className="text-muted-foreground">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Historical Versions */}
          {historicalVersions.length > 0 && (
            <div className="border-t pt-8">
              <button
                onClick={() => setShowHistoricalVersions((prev) => !prev)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <History className="w-4 h-4" />
                {locale === 'en'
                  ? `Previous Versions (${historicalVersions.length})`
                  : `历史版本 (${historicalVersions.length})`}
                {showHistoricalVersions ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showHistoricalVersions && (
                <div className="mt-6 space-y-4">
                  {historicalVersions.map((version) => (
                    <div key={version.version} className="rounded-lg border bg-muted/20 overflow-hidden">
                      {/* Version Header */}
                      <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-muted text-muted-foreground">
                          v{version.version}
                        </span>
                        <span className="text-xs text-muted-foreground">{version.releaseDate}</span>
                        {version.status === 'stable' && (
                          <span className="px-1.5 py-0.5 text-[10px] rounded bg-green-100 text-green-700">
                            {locale === 'en' ? 'Stable' : '稳定版'}
                          </span>
                        )}
                      </div>

                      {/* Compact Downloads */}
                      <div className="p-3 space-y-1">
                        {version.downloads.map((dl, i) => (
                          <a
                            key={i}
                            href={dl.url}
                            download
                            onClick={() => trackDownload({ productId: product.id, productName: product.name, version: version.version, platform: dl.platform, format: dl.format })}
                            className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-xs">
                              <span>{platformIcon(dl.platform)}</span>
                              <span className="font-medium">{dl.arch}</span>
                              <span className="text-muted-foreground">{dl.size}</span>
                              {dl.requirements && (
                                <span className="text-muted-foreground hidden sm:inline">· {dl.requirements}</span>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 px-2">
                              <Download className="w-3 h-3" />
                            </Button>
                          </a>
                        ))}
                      </div>

                      {/* Collapsible Release Notes */}
                      {version.releaseNotes.length > 0 && (
                        <div className="border-t">
                          <button
                            onClick={() => toggleHistoricalNotes(version.version)}
                            className="w-full p-3 text-xs text-muted-foreground hover:text-foreground flex items-center justify-between transition-colors"
                          >
                            {locale === 'en' ? 'Release Notes' : '更新日志'}
                            {expandedHistoricalNotes.has(version.version) ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                          {expandedHistoricalNotes.has(version.version) && (
                            <div className="px-3 pb-3">
                              <ul className="space-y-1 text-xs text-muted-foreground">
                                {version.releaseNotes.map((note, i) => (
                                  <li key={i} className="flex gap-1.5">
                                    <span>•</span>
                                    <span>{note}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border">
            <h3 className="font-semibold mb-3">
              {locale === 'en' ? 'Download Tips' : '下载提示'}
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {locale === 'en' ? 'Windows: EXE is recommended for better install experience' : 'Windows：推荐下载 EXE 版本，安装体验更好'}</li>
              <li>• {locale === 'en' ? 'Windows: MSI is suitable for enterprise deployment' : 'Windows：MSI 版本适合企业批量部署'}</li>
              <li>• {locale === 'en' ? 'macOS: Download DMG and drag to Applications' : 'macOS：下载 DMG 后拖入应用程序文件夹即可'}</li>
              <li>• {locale === 'en' ? 'Linux: deb/rpm for package managers, AppImage for portable use' : 'Linux：deb/rpm 适用于包管理器，AppImage 可直接运行'}</li>
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

          {/* macOS Gatekeeper Warning */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <span className="text-xl">🍎</span>
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                  {locale === 'en' ? 'macOS Installation Guide' : 'macOS 安装说明'}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {locale === 'en'
                    ? 'If you see "cannot be opened because the developer cannot be verified" when launching the app, follow these steps:'
                    : '如果在安装软件成功后，打开应用时，提示："无法打开 XXX"，因为无法验证开发者。解决方法如下：'}
                </p>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium">
                    {locale === 'en' ? 'Method 1:' : '方法一：'}
                  </p>
                  <p className="pl-3">
                    {locale === 'en'
                      ? 'Find the app in Finder, right-click (or Control-click) and select "Open". A prompt will appear with an "Open" button — click it.'
                      : '找到应用，右键打开，还会有提示，但是会多一个"打开"的按钮，点击打开即可。'}
                  </p>
                  <p className="font-medium mt-2">
                    {locale === 'en' ? 'Method 2:' : '方法二：'}
                  </p>
                  <p className="pl-3">
                    {locale === 'en'
                      ? 'Click the Apple icon  → System Settings → Privacy & Security. At the bottom, find "was blocked from use because it is from an unidentified developer" and click "Open Anyway" → confirm with "Open".'
                      : '点击屏幕左上角的苹果图标，选择菜单：系统偏好设置 → 安全性与隐私 → 通用，在窗口底部会看到"已阻止使用 XXX，因为来自身份不明的开发者"，点击后面的"仍要打开"按钮 → 在弹出的确认弹窗中，点击"打开"按钮即可。'}
                  </p>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  {locale === 'en'
                    ? 'This is a completely offline, safe software. The above steps are only needed once.'
                    : '本软件承诺为正规完全离线软件，按此操作即可正常安装。'}
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
              <span className="text-2xl font-bold text-amber-600">¥29.9</span>
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
