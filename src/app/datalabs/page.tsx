import Link from 'next/link';
import { Database, Lock, TrendingUp, Zap, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DataLabs by Founder Diary - Coming Soon',
  description: 'The ultimate intelligence platform for India’s tech ecosystem. Coming soon.',
};

export default function DataLabsComingSoonPage() {
  return (
    <div className="bg-white min-h-[calc(100vh-140px)] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Subtle Grid & Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Main Content */}
      <div className="max-w-[800px] mx-auto px-6 py-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E31E24]/20 bg-red-50 text-[#E31E24] text-xs font-bold tracking-wider uppercase mb-8">
          <Database size={14} /> Intelligence Platform
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-none mb-6">
          <span className="text-[#E31E24]">Data</span>Labs
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 font-medium mb-12 max-w-[600px] mx-auto leading-relaxed">
          The most comprehensive data intelligence platform for India's startup ecosystem is launching soon.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 text-left max-w-[700px] mx-auto">
          {[
            { icon: TrendingUp, title: 'Funding Intelligence', desc: 'Real-time tracking of capital flows and valuations.' },
            { icon: Zap, title: 'Sector Analysis', desc: 'Deep dives into emerging tech verticals.' },
            { icon: Lock, title: 'Premium Insights', desc: 'Exclusive access to proprietary dataset models.' },
          ].map((feature, i) => (
            <div key={i} className="p-6 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className="text-[#E31E24] mb-4" size={24} />
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 md:p-12 max-w-[600px] mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Early Access</h2>
          <p className="text-gray-500 mb-6">Join the waitlist to secure priority access and an exclusive launch rate.</p>
          
          <form className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your work email" 
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E31E24] text-gray-900"
              required
            />
            <button 
              type="button" 
              className="bg-[#E31E24] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#C41A20] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Join Waitlist <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
