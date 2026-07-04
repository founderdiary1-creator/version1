'use client';

import { TagIcon, X } from "lucide-react";
import { useState } from "react";

export function TagManager({ tags, onChange }: { tags: string[], onChange: (t: string[]) => void }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
        <TagIcon size={16} /> Targeted Tags
      </h3>
      <p className="text-xs text-gray-500">Press enter to add. Articles matching these will be pulled.</p>
      
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-wrap gap-2 focus-within:border-[#E31E24] focus-within:ring-2 focus-within:ring-[#E31E24]/10 transition-all">
        {tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm animate-in zoom-in duration-200">
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-[#E31E24] transition-colors bg-white/20 rounded-full p-0.5">
              <X size={12} strokeWidth={3} />
            </button>
          </span>
        ))}
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "e.g. startup, funding..." : "Add tag..."}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 py-1"
        />
      </div>
    </div>
  );
}