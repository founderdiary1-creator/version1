interface InvestorCardProps {
  name: string;
  letter: string;
  portfolioCompanies: number;
  totalInvestments: string;
}

export function InvestorCard({ name, letter, portfolioCompanies, totalInvestments }: InvestorCardProps) {
  return (
    <div className="py-3 border-b border-dashed border-gray-200 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
            {letter}
          </div>
          <span className="text-[14px] font-semibold text-gray-900">{name}</span>
        </div>
        <span className="text-[#E31E24] text-xs font-medium hover:underline cursor-pointer">
          Full Profile &rarr;
        </span>
      </div>
      <div className="flex gap-6 text-xs">
        <div>
          <span className="text-gray-400">Portfolio Companies</span>
          <p className="font-semibold text-gray-900">{portfolioCompanies}</p>
        </div>
        <div>
          <span className="text-gray-400">Total Investments</span>
          <p className="font-semibold text-gray-900">{totalInvestments}</p>
        </div>
      </div>
    </div>
  );
}
