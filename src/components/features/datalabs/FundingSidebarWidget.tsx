'use client';

import { useFundingSidebarQuery } from '@/hooks/useDataLabs';
import { ArrowRight, Building2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function FundingSidebarWidget() {
  const { data: rounds, isLoading, isError } = useFundingSidebarQuery(5);

  if (isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-6 h-6 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs text-gray-400 font-medium tracking-wide">LOADING DATALABS...</span>
      </div>
    );
  }

  if (isError || !rounds || rounds.length === 0) return null;

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden sticky top-24">
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#E31E24] animate-pulse" />
          <h3 className="text-[13px] font-bold text-gray-900 tracking-wider uppercase">
            Latest Funding Rounds
          </h3>
        </div>
        <p className="text-xs text-gray-500">Powered by DataLabs Intelligence</p>
      </div>

      <div className="divide-y divide-gray-100">
        {rounds.map((round) => (
          <div key={round.id} className="p-4 hover:bg-white transition-colors group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white border border-gray-100 rounded flex items-center justify-center shrink-0">
                {round.company?.logo_url ? (
                  <Image src={round.company.logo_url} alt={round.company.name} width={24} height={24} className="object-contain" />
                ) : (
                  <Building2 size={16} className="text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {round.company?.name || 'Unknown'}
                  </h4>
                  <span className="text-xs font-bold text-[#E31E24] shrink-0 ml-2">
                    {round.amount}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-2">
                  <span className="truncate">{round.company?.sector || 'Unknown Sector'}</span>
                  <span>•</span>
                  <span>{round.stage}</span>
                </div>
                {round.company?.slug && (
                  <Link 
                    href={`/company/${round.company.slug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 group-hover:text-[#E31E24] transition-colors"
                  >
                    Full Profile <ArrowRight size={10} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-t border-gray-100 p-3 text-center">
        <Link href="/datalabs/funding" className="text-xs font-bold text-gray-900 hover:text-[#E31E24] transition-colors uppercase tracking-wider">
          View All Rounds
        </Link>
      </div>
    </div>
  );
}
