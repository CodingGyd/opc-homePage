import { setRequestLocale } from 'next-intl/server';
import { HomeTabs } from '@/components/home/HomeTabs';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeTabs />;
}
