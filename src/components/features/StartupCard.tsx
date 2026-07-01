interface StartupCardProps {
  name: string;
  letter: string;
  sector: string;
  totalFunding: string;
  stage: string;
}

export function StartupCard({ name, letter, sector, totalFunding, stage }: StartupCardProps) {
  return (
    <div className="py-3 border-b border-dashed border-gray-200 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#E31E24] flex items-center justify-center text-sm font-semibold text-white">
            {letter}
          </div>
          <span className="text-[14px] font-semibold text-gray-900">{name}</span>
        </div>
        <span className="text-[#E31E24] text-xs font-medium hover:underline cursor-pointer">
          Full Profile &rarr;
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-gray-400">Sector</span>
          <p className="font-medium text-gray-900">{sector}</p>
        </div>
        <div>
          <span className="text-gray-400">Total Funding</span>
          <p className="font-medium text-gray-900">{totalFunding}</p>
        </div>
        <div>
          <span className="text-gray-400">Stage</span>
          <p className="font-medium text-gray-900">{stage}</p>
        </div>
      </div>
    </div>
  );
}
