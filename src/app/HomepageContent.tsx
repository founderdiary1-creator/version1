'use client';

import { HeroSection } from '@/components/features/HeroSection';
import { FundingRoundsSection } from '@/components/features/FundingRoundsSection';
import { LatestNewsSection } from '@/components/features/LatestNewsSection';
import { InDepthSection } from '@/components/features/InDepthSection';
import { NewsGridSection } from '@/components/features/NewsGridSection';
import { BrandLabsSection } from '@/components/features/BrandLabsSection';
import { MoreNewsSection } from '@/components/features/MoreNewsSection';
import { NewsletterBanner } from '@/components/features/NewsletterBanner';
import { MoreArticlesSection } from '@/components/features/MoreArticlesSection';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function HomepageContent() {
  useScrollReveal();

  return (
    <div className="bg-white">
      <HeroSection />
      <FundingRoundsSection />
      <div className="bg-gray-50">
        <LatestNewsSection />
      </div>
      <InDepthSection />
      <NewsGridSection />
      <BrandLabsSection />
      <div className="bg-gray-50">
        <MoreNewsSection />
      </div>
      <NewsletterBanner />
      <MoreArticlesSection />
    </div>
  );
}
