import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出配置
  output: 'export',

  // 动态 basePath：GitHub Pages 需要，Cloudflare Pages 不需要
  // 设置环境变量 BASE_PATH=/opc-homePage 启用
  basePath: process.env.BASE_PATH || '',

  // 确保目录结构正确（/zh/ 而不是 /zh.html）
  trailingSlash: true,

  // 静态导出时图片优化需要禁用或使用外部 loader
  images: {
    unoptimized: true,
  },

  // 禁用实验性功能（静态导出不支持）
  experimental: undefined,
};

export default withNextIntl(nextConfig);
