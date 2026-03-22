import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { CTA } from '@/components/home/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductShowcase />
      <Features />
      <CTA />
    </>
  );
}
