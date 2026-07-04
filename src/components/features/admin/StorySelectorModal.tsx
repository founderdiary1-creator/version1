'use client';

import { Check, Lock, Search, X } from "lucide-react";
import { useState } from "react";

export function StorySelectorModal({ isOpen, onClose, limit, initialSelected, onSelectSave, articlesPool }: any) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>(initialSelected);

  if (!isOpen) return null;

  // 1. Defensively ensure we always have an array
  const safePool = Array.isArray(articlesPool) ? articlesPool : [];
  console.log("safe pool", safePool)

  // 2. Filter safely
  const filteredPool = safePool.filter((art: any) => 
    art?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i: string) => i !== id));
    } else {
      if (selected.length >= limit) return;
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">Curate Section</h3>
            <p className="text-sm font-medium text-gray-500 mt-1">Select <span className="text-[#E31E24]">{selected.length}</span> out of {limit} slotted spaces.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition-all">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 relative">
          <Search size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" placeholder="Search publication archive..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 pl-12 pr-4 py-3 rounded-xl border-transparent focus:border-[#E31E24] focus:bg-white focus:ring-2 focus:ring-[#E31E24]/10 transition-all outline-none text-sm font-medium"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50/30">
          {filteredPool.map((article: any) => {
            const isPicked = selected.includes(article.id);
            const isMaxedOut = !isPicked && selected.length >= limit;
            return (
              <div 
                key={article.id} onClick={() => toggleSelect(article.id)}
                className={`group flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 ${
                  isPicked 
                    ? 'border-2 border-[#E31E24] bg-white shadow-sm' 
                    : `border-2 border-transparent bg-white hover:border-gray-200 ${isMaxedOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}`
                }`}
              >
                <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={article.featured_image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold line-clamp-1 transition-colors ${isPicked ? 'text-[#E31E24]' : 'text-gray-900 group-hover:text-[#E31E24]'}`}>
                    {article.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-semibold text-gray-400">{new Date(article.published_at).toLocaleDateString()}</span>
                    {article.is_premium && <span className="flex items-center gap-0.5 bg-[#E31E24]/10 text-[#E31E24] font-bold text-[9px] px-1.5 py-0.5 rounded-sm"><Lock size={8} /> PLUS</span>}
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isPicked ? 'bg-[#E31E24] border-[#E31E24] text-white scale-110' : 'border-gray-200 bg-white'
                }`}>
                  {isPicked && <Check size={12} strokeWidth={4} />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-gray-100 bg-white flex items-center justify-between">
          <span className="text-sm font-bold text-gray-500">
            <span className="text-gray-900">{selected.length}</span> / {limit} Selected
          </span>
          <button 
            onClick={() => { onSelectSave(selected); onClose(); }}
            className="bg-[#E31E24] text-white text-sm font-bold px-8 py-3 rounded-xl hover:bg-[#C41A20] hover:shadow-[0_4px_15px_rgba(227,30,36,0.2)] active:scale-95 transition-all"
          >
            Apply Selection
          </button>
        </div>
      </div>
    </div>
  );
}