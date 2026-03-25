import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出配置
  output: 'export',

  // GitHub Pages 基础路径（仓库名）
  basePath: '/opc-homePage',

  // 静态导出时图片优化需要禁用或使用外部 loader
  images: {
    unoptimized: true,
  },

  // 禁用实验性功能（静态导出不支持）
  experimental: undefined,
};

export default withNextIntl(nextConfig);
