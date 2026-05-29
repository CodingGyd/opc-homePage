import { setRequestLocale } from 'next-intl/server';
import ProductDetailClient from './ProductDetailClient';

// 为静态导出生成所有产品 ID
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <ProductDetailClient locale={locale} id={id} />;
}
