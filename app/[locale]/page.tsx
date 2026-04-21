import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { CTA } from '@/components/home/CTA';
import { AdSense } from '@/components/AdSense';

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
      <ProductShowcase />
      <AdSense
        slot="home-mid"
        format="horizontal"
        className="container mx-auto my-8 px-4"
      />
      <Features />
      <CTA />
      <AdSense
        slot="home-bottom"
        format="auto"
        className="container mx-auto my-8 px-4"
      />
    </>
  );
}
