import { setRequestLocale } from 'next-intl/server';
import { Supporter } from '@/components/home/Supporter';

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Supporter />;
}
