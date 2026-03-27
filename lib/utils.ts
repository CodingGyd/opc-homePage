import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateId(): string {
  return crypto.randomUUID();
}

// 获取 basePath（GitHub Pages 需要，Cloudflare 不需要）
export function getBasePath(): string {
  // 服务端：检查环境变量
  if (typeof window === 'undefined') {
    return process.env.BASE_PATH || '';
  }

  // 客户端：只有 GitHub Pages 需要 basePath
  const hostname = window.location.hostname;
  // GitHub Pages: xxx.github.io
  if (hostname.includes('github.io')) {
    return '/opc-homePage';
  }
  // Cloudflare Pages 或其他: 不需要 basePath
  return '';
}

// 获取带 basePath 的资源路径
export function assetPath(path: string): string {
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // 服务端构建时使用环境变量
  if (typeof window === 'undefined') {
    const basePath = process.env.BASE_PATH || '';
    return `${basePath}${normalizedPath}`;
  }

  // 客户端运行时动态检测
  const hostname = window.location.hostname;
  if (hostname.includes('github.io')) {
    return `/opc-homePage${normalizedPath}`;
  }
  return normalizedPath;
}
