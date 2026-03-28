import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { Supporter } from '@/components/home/Supporter';
import { Features } from '@/components/home/Features';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { CTA } from '@/components/home/CTA';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Supporter />
      <ProductShowcase />
      <Features />
      <CTA />
    </>
  );
}
