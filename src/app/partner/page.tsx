'use client';

import Image from 'next/image';
import { TrendingUp, Users, BarChart3, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const offerings = [
  { icon: TrendingUp, title: 'Sponsored Content', description: 'Native articles written by our editorial team, highlighting your brand story to our audience of startup founders, investors, and CXOs.' },
  { icon: Users, title: 'Brand Partnerships', description: 'Co-branded events, webinars, and exclusive roundtables with India\'s top startup ecosystem leaders.' },
  { icon: BarChart3, title: 'Data-Driven Reports', description: 'Custom research reports powered by Founder Diary Datalabs, establishing your brand as a thought leader.' },
  { icon: Mail, title: 'Newsletter Sponsorships', description: 'Premium placement in our daily and weekly newsletters reaching 500K+ startup ecosystem professionals.' },
];

const stats = [
  { value: '10M+', label: 'Monthly Readers' },
  { value: '500K+', label: 'Newsletter Subscribers' },
  { value: '50K+', label: 'Social Followers' },
  { value: '200+', label: 'Brand Partners' },
];

const caseStudies = [
  { image: '/images/brandlabs-smartworks.jpg', brand: 'Smartworks', title: 'How Smartworks Turned Managed Workspaces Into An Enterprise Play', result: '2.3M impressions, 45K reads' },
  { image: '/images/brandlabs-shipway.jpg', brand: 'Shipway', title: 'How Shipway Is Using AI To Drive Post-Purchase Efficiency', result: '1.8M impressions, 38K reads' },
  { image: '/images/brandlabs-oracle.jpg', brand: 'Oracle', title: 'How Startups Are Rebuilding Their Cloud Stack', result: '3.1M impressions, 52K reads' },
];

export default function PartnerPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-[#1A1A1A] py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image src="/images/logo2.png" alt="Founder Diary" width={48} height={48} className="h-12 w-12 object-contain rounded-full bg-white p-1" />
            <span className="text-white font-bold text-2xl tracking-wide">FOUNDER DIARY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Partner With <span className="text-[#E31E24]">Founder Diary</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Reach India&apos;s most influential startup ecosystem decision-makers through premium content partnerships, sponsored features, and data-driven campaigns.
          </p>
          <a
            href="mailto:partnerships@founderdiary.com"
            className="inline-flex items-center gap-2 bg-[#E31E24] text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#C41A20] transition-colors text-lg"
          >
            Get In Touch <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-[#E31E24] mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">What We Offer</h2>
          <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">Premium advertising solutions designed for the startup ecosystem</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerings.map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-[#E31E24]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-[#E31E24]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">BrandLabs Success Stories</h2>
          <p className="text-gray-500 text-center mb-12">See how leading brands have partnered with Founder Diary</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((study) => (
              <div key={study.brand} className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <div className="relative aspect-[16/10]">
                  <Image src={study.image} alt={study.brand} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="p-6">
                  <span className="text-[#E31E24] text-xs font-semibold uppercase tracking-wider">{study.brand}</span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1 mb-3">{study.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 size={16} className="text-green-500" />
                    {study.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#E31E24] py-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Reach India&apos;s Startup Ecosystem?</h2>
          <p className="text-white/80 mb-8">Contact our partnerships team to explore custom solutions for your brand.</p>
          <a
            href="mailto:partnerships@founderdiary.com"
            className="inline-flex items-center gap-2 bg-white text-[#E31E24] font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            <Mail size={20} /> partnerships@founderdiary.com
          </a>
        </div>
      </section>
    </div>
  );
}
