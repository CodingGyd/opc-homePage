import { setRequestLocale } from 'next-intl/server';
import DownloadPageClient from './DownloadPageClient';

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
  ];
}

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <DownloadPageClient locale={locale} id={id} />;
}
