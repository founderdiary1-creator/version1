import { ContentMode } from '@/app/admin/settings/page';
import { Zap, Settings2, Plus, Minus, Tag as TagIcon, LayoutTemplate, Check, X } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';

export function ConfigPanel({ activeSectionId, config, onUpdate, onOpenModal, pageSections, categories }: any) {
  const sectionName = pageSections.find((s: any) => s.id === activeSectionId)?.name;

  return (
    <div key={activeSectionId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-gray-100 bg-gray-50/80 p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-[#E31E24]">
            <Settings2 size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">{sectionName} Settings</h2>
        </div>
        <p className="text-gray-500 pl-14 text-sm">Define how content is pulled into this section of the landing page.</p>
      </div>

      <div className="p-8 space-y-10">
        <ContentModeSelector currentMode={config.mode} onChange={(mode) => onUpdate({ mode })} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
          <ArticleLimitControl count={config.count} onChange={(count) => onUpdate({ count })} />

          <div className={`transition-all duration-500 ${config.mode === 'tag' ? 'opacity-100 translate-y-0' : 'opacity-30 pointer-events-none -translate-y-2'}`}>
            <TagManager tags={config.tags || []} onChange={(tags) => onUpdate({ tags })} categories={categories} />
          </div>
        </div>

        {config.mode === 'manual' && (
          <div className="pt-6 border-t border-gray-100 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-[#E31E24]/5 border border-[#E31E24]/20 rounded-xl p-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E31E24]/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#E31E24] mx-auto mb-4 shadow-sm border border-[#E31E24]/10">
                <LayoutTemplate size={24} />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Curate Stories</h4>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto mb-6">
                Manually hand-pick the exact {config.count} stories you want featured in this block.
              </p>
              <button 
                onClick={onOpenModal}
                className="relative z-10 bg-white border-2 border-gray-200 text-gray-900 font-bold px-6 py-2.5 rounded-xl hover:border-[#E31E24] hover:text-[#E31E24] hover:shadow-[0_4px_15px_rgba(227,30,36,0.1)] transition-all duration-300 active:scale-95"
              >
                Open Story Selector ({config.selectedIds?.length || 0}/{config.count} Selected)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ContentModeSelector({ currentMode, onChange }: { currentMode?: ContentMode, onChange: (m: ContentMode) => void }) {
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

function ArticleLimitControl({ count, onChange }: { count: number, onChange: (c: number) => void }) {
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

function TagManager({ tags, onChange, categories }: { tags: string[], onChange: (t: string[]) => void, categories: any[] }) {

  const safeCategories = Array.isArray(categories) ? categories : (categories?.data  || []);
  
  // 2. Filter safely
  const availableCategories = safeCategories.filter((c: any) => !tags.includes(c.name));

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    if (selectedName && !tags.includes(selectedName)) {
      onChange([...tags, selectedName]);
    }
    // Reset dropdown back to default placeholder
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
        <TagIcon size={16} /> Targeted Categories
      </h3>
      <p className="text-xs text-gray-500">Select categories. Articles matching these will be dynamically pulled.</p>
      
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col gap-3 focus-within:border-[#E31E24] focus-within:ring-2 focus-within:ring-[#E31E24]/10 transition-all">
        
        {/* Selected Pills */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                {tag}
                <button onClick={() => onChange(tags.filter(t => t !== tag))} className="hover:text-[#E31E24] transition-colors bg-white/20 rounded-full p-0.5">
                  <X size={12} strokeWidth={3} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Custom Category Dropdown */}
        <div className="relative">
          <select
            onChange={handleSelect}
            defaultValue=""
            className="w-full appearance-none bg-white border border-gray-200 text-sm text-gray-900 font-medium py-2.5 pl-3 pr-10 rounded-lg outline-none hover:border-gray-300 transition-colors cursor-pointer"
          >
            <option value="" disabled>Select a category to add...</option>
            {availableCategories.map((cat : any) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
            {availableCategories.length === 0 && (
              <option value="" disabled>All categories selected</option>
            )}
          </select>
          {/* Custom Chevron for the Select */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}