'use client';

import { useCompanyQuery } from '@/hooks/useDataLabs';
import { Building2, MapPin, Users, DollarSign, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface CompanyDataCardProps {
  companyId: string;
}

export function CompanyDataCard({ companyId }: CompanyDataCardProps) {
  const { data: company, isLoading, isError } = useCompanyQuery(companyId);

  if (isLoading) {
    return (
      <div className="border border-gray-100 rounded-xl p-6 bg-white flex items-center justify-center min-h-[200px]">
        <div className="w-6 h-6 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !company) return null;

  return (
    <div className="border border-gray-100 rounded-xl bg-white overflow-hidden my-12 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="bg-[#1A1A1A] p-5 flex items-center justify-between">
        <div>
          <span className="text-[#E31E24] text-[10px] font-bold tracking-wider uppercase mb-1 block">
            DataLabs Intelligence
          </span>
          <h3 className="text-white text-lg font-semibold flex items-center gap-2">
            Go Deeper On {company.name}
          </h3>
        </div>
        <div className="w-12 h-12 bg-white rounded-lg p-2 flex items-center justify-center shrink-0">
          {company.logo_url ? (
            <Image src={company.logo_url} alt={company.name} width={32} height={32} className="object-contain" />
          ) : (
            <Building2 size={24} className="text-gray-300" />
          )}
        </div>
      </div>

      {/* Primary Details Grid */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-gray-50">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <Building2 size={14} /> Sector
          </p>
          <p className="text-sm font-semibold text-gray-900">{company.sector || '—'}</p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <MapPin size={14} /> HQ
          </p>
          <p className="text-sm font-semibold text-gray-900">{company.hq_city || '—'}</p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <Users size={14} /> Founded
          </p>
          <p className="text-sm font-semibold text-gray-900">{company.founding_year || '—'}</p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <DollarSign size={14} /> Total Funding
          </p>
          <p className="text-sm font-bold text-[#E31E24]">{company.total_funding_amount || '—'}</p>
        </div>
      </div>

      {/* Founders List */}
      {company.founders && company.founders.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-50">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">Founding Team</p>
          <div className="flex flex-wrap gap-2">
            {company.founders.map((founder, i) => (
              <span key={i} className="inline-flex items-center px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium border border-gray-100 rounded-full">
                {founder}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Horizontal Interactive Metrics Carousel */}
      <div className="p-6 bg-gray-50/50">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Key Growth Metrics</p>
          <a href="#" className="text-[#E31E24] text-xs font-semibold flex items-center gap-1 hover:underline">
            Full Profile <ExternalLink size={12} />
          </a>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide">
          {/* Mock Metrics for the Carousel as per requirements */}
          {[
            { label: 'Latest Valuation', value: company.total_funding_amount ? 'Undisclosed' : '—', trend: '+15% YoY' },
            { label: 'Team Size', value: '150-250', trend: 'Growing' },
            { label: 'Market Share', value: '~12%', trend: '+2% MoM' },
            { label: 'Active Markets', value: '3 Countries', trend: 'Expanding' },
          ].map((metric, i) => (
            <div key={i} className="min-w-[160px] snap-start bg-white border border-gray-100 rounded-lg p-4 shrink-0 flex flex-col justify-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">{metric.label}</span>
              <span className="text-lg font-bold text-gray-900 mb-1 block">{metric.value}</span>
              <span className="text-xs text-green-600 font-medium">{metric.trend}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
