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
import { useHomepageSections } from '@/hooks/useHomepageSections';

export function HomepageContent() {
  useScrollReveal();
  
  // Consuming your new dynamic engine
  const { data, isLoading } = useHomepageSections();

  return (
    <div className="bg-white">
      {/* Now powered by the Engine */}
      <HeroSection 
        // articles={data?.hero ?? []} 
        // isLoading={isLoading} 
      />
      
      <FundingRoundsSection />
      
      <div className="bg-gray-50">
        <LatestNewsSection
          articles={data?.latest ?? []}
          isLoading={isLoading}
        />
      </div>
      
      <InDepthSection
        articles={data?.indepth ?? []}
        isLoading={isLoading}
      />
      
      <NewsGridSection
        articles={data?.newsgrid ?? []}
        isLoading={isLoading}
      />
      
      <BrandLabsSection />
      
      <div className="bg-gray-50">
        {/* Now powered by the Engine */}
        <MoreNewsSection
          articles={data?.morenews ?? []}
          // isLoading={isLoading}
        />
      </div>
      
      <NewsletterBanner />
      
      {/* Now powered by the Engine */}
      <MoreArticlesSection 
        articles={data?.morearticles ?? []}
        // isLoading={isLoading}
      />
    </div>
  );
}