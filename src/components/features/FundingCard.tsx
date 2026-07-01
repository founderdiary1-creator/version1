interface FundingCardProps {
  name: string;
  letter: string;
  founded: string;
  stage: string;
  totalFunding: string;
}

export function FundingCard({ name, letter, founded, stage, totalFunding }: FundingCardProps) {
  return (
    <div className="bg-white rounded-lg p-5 min-w-[260px] w-[260px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
            {letter}
          </div>
          <span className="text-[15px] font-semibold text-gray-900">{name}</span>
        </div>
        <span className="text-[#E31E24] text-xs font-medium hover:underline cursor-pointer">
          Full Profile &rarr;
        </span>
      </div>
      <div className="border-t border-dashed border-gray-200 pt-3">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-[11px] text-gray-400">Founded</p>
            <p className="text-sm font-semibold text-gray-900">{founded}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Stage</p>
            <p className="text-sm font-semibold text-gray-900">{stage}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Total Funding</p>
            <p className="text-sm font-semibold text-gray-900">{totalFunding}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
