import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { DevelopersSection } from '@/components/home/DevelopersSection';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { MarketReportSection } from '@/components/home/MarketReportSection';
import { CommunitiesSection } from '@/components/home/CommunitiesSection';
import { QuizSection } from '@/components/home/QuizSection';
import { MortgageCalculator } from '@/components/home/MortgageCalculator';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { BlogsSection } from '@/components/home/BlogsSection';
import { SustainabilitySection } from '@/components/home/SustainabilitySection';
import { FAQSection } from '@/components/home/FAQSection';
import { ContactCTA } from '@/components/home/ContactCTA';

export const metadata: Metadata = {
  title: 'Wolves International — Luxury Dubai Real Estate',
  description: "A private Dubai real estate consultancy. Curated villas, penthouses and off-plan investments across Palm Jumeirah, Downtown, Emirates Hills and beyond.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — full bleed dark */}
      <HeroSection />

      {/* 2. Featured Properties — white */}
      <FeaturedProperties />

      {/* 3. Developer marquee — white with border */}
      <DevelopersSection />

      {/* 4. Off-plan Projects — cream */}
      <FeaturedProjects />

      {/* 5. Market Report — white */}
      <MarketReportSection />

      {/* 6. Communities — cream */}
      <CommunitiesSection />

      {/* 7. Quiz CTA — white */}
      <QuizSection />

      {/* 8. Mortgage Calculator — cream */}
      <MortgageCalculator />

      {/* 9. Testimonials — ink (dark) */}
      <TestimonialsSection />

      {/* 10. Blog — cream */}
      <BlogsSection />

      {/* 11. Sustainability — white */}
      <SustainabilitySection />

      {/* 12. FAQ — white */}
      <FAQSection />

      {/* 13. Contact CTA — ink (dark) */}
      <ContactCTA />
    </>
  );
}
