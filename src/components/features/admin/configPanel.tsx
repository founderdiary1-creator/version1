import { LayoutTemplate, Settings2 } from "lucide-react";
import { TagManager } from "./TagManager";
import { ArticleLimitControl } from "./ArticleLimitController";
import { ContentModeSelector } from "./ContentModelSelector";
import { SectionConfig } from "@/app/admin/settings/page";

export function ConfigPanel({ activeSectionId, config, onUpdate, onOpenModal, pageSections }: { 
  activeSectionId: string; 
  config: SectionConfig; 
  onUpdate: (u: Partial<SectionConfig>) => void;
  onOpenModal: () => void;
  pageSections: { id: string; name: string }[];
}) {
  const sectionName = pageSections.find(s => s.id === activeSectionId)?.name;

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
          <ArticleLimitControl 
            count={config.count} 
            onChange={(count) => onUpdate({ count })} 
          />

          <div className={`transition-all duration-500 ${config.mode === 'tag' ? 'opacity-100 translate-y-0' : 'opacity-30 pointer-events-none -translate-y-2'}`}>
            <TagManager tags={config.tags} onChange={(tags) => onUpdate({ tags })} />
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
                Open Story Selector ({config.selectedIds.length}/{config.count} Selected)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}