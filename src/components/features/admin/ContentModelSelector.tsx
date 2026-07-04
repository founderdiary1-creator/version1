import { ContentMode } from "@/app/admin/settings/page";
import { Check, Zap } from "lucide-react";

 export function ContentModeSelector({ currentMode, onChange }: { currentMode: ContentMode, onChange: (m: ContentMode) => void }) {
  const modes: { id: ContentMode; title: string; desc: string }[] = [
    { id: 'auto', title: 'Automated', desc: 'Pulls the most recent published articles automatically.' },
    { id: 'tag', title: 'Tag Based', desc: 'Dynamically fetches stories based on specific tags.' },
    { id: 'manual', title: 'Manual Curated', desc: 'Hand-pick specific articles for this section.' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
        <Zap size={16} className="text-[#E31E24]" /> Content Engine
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => (
          <label 
            key={mode.id} 
            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
              currentMode === mode.id 
                ? 'border-[#E31E24] bg-[#E31E24]/5 -translate-y-1' 
                : 'border-gray-100 bg-white hover:border-gray-300'
            }`}
          >
            <input 
              type="radio" name="mode" value={mode.id} checked={currentMode === mode.id}
              onChange={() => onChange(mode.id)} className="sr-only"
            />
            <div className="flex items-center justify-between mb-2">
              <span className={`font-bold ${currentMode === mode.id ? 'text-[#E31E24]' : 'text-gray-900'}`}>
                {mode.title}
              </span>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                currentMode === mode.id ? 'bg-[#E31E24] text-white scale-100 shadow-sm' : 'bg-gray-100 scale-90'
              }`}>
                {currentMode === mode.id && <Check size={12} strokeWidth={3} />}
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{mode.desc}</p>
          </label>
        ))}
      </div>
    </div>
  );
}