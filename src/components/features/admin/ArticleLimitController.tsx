import { Minus, Plus } from "lucide-react";

export function ArticleLimitControl({ count, onChange }: { count: number, onChange: (c: number) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Article Limit</h3>
      <p className="text-xs text-gray-500">Maximum stories rendered in this block.</p>
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl p-1 shadow-sm">
          <button 
            onClick={() => onChange(Math.max(1, count - 1))}
            className="p-2.5 text-gray-400 hover:text-[#E31E24] hover:bg-[#E31E24]/10 rounded-lg transition-all active:scale-95"
          >
            <Minus size={18} strokeWidth={3} />
          </button>
          <span className="w-14 text-center font-extrabold text-xl text-gray-900">{count}</span>
          <button 
            onClick={() => onChange(Math.min(20, count + 1))}
            className="p-2.5 text-gray-400 hover:text-[#E31E24] hover:bg-[#E31E24]/10 rounded-lg transition-all active:scale-95"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>
        <span className="text-sm font-bold text-gray-400">Cards Visible</span>
      </div>
    </div>
  );
}