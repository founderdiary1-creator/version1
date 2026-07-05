'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Layout, Clock, BookOpen, Grid, 
  MoreHorizontal, Save, LayoutTemplate, SlidersHorizontal 
} from 'lucide-react';
import { SidebarNavigation } from '@/components/features/admin/sidebarNavigation';
import { StorySelectorModal } from '@/components/features/admin/StorySelectorModal';
import { ConfigPanel } from '@/components/features/admin/configPanel';

// --- TYPES ---
export type ContentMode = 'auto' | 'tag' | 'manual';

export interface SectionConfig {
  mode?: ContentMode; // <-- Made optional so it can be truly empty
  count: number;
  tags: string[];
  selectedIds: string[];
}

const PAGE_SECTIONS = [
  { id: 'hero', name: 'Hero Section', icon: Layout, desc: 'The top highlighted articles.' },
  { id: 'latest', name: 'Latest News', icon: Clock, desc: 'Chronological feed of updates.' },
  { id: 'indepth', name: 'In-Depth Stories', icon: BookOpen, desc: 'Long-form and premium content.' },
  { id: 'newsgrid', name: 'News Grid', icon: Grid, desc: '4x grid of categorized news.' },
  { id: 'morenews', name: 'More News', icon: MoreHorizontal, desc: 'Secondary news feed.' },
  { id: 'morearticles', name: 'More Articles', icon: LayoutTemplate, desc: 'Infinite scroll footer feed.' },
];

// --- API FETCHERS ---
const fetchSettings = async () => {
  const res = await fetch('/api/admin/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
};

const saveSettings = async (newConfig: Record<string, SectionConfig>) => {
  const res = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ homepage_config: newConfig }),
  });
  if (!res.ok) throw new Error('Failed to save settings');
  return res.json();
};

const fetchPublishedArticles = async () => {
  const res = await fetch('/api/admin/stories?status=published');
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
};

const fetchCategories = async () => {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

// --- MAIN PAGE COMPONENT ---
export default function LandingPageSettings() {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState('hero');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local Draft State
  const [configs, setConfigs] = useState<Record<string, SectionConfig>>({});

  // 1. Fetch live config from Database
  const { data: serverConfigs, isLoading: isLoadingConfigs } = useQuery({
    queryKey: ['homepageSettings'],
    queryFn: fetchSettings,
  });

  // 2. Fetch real articles for the Manual Curation Modal
  const { data: articlesPool = [] } = useQuery({
    queryKey: ['publishedArticlesForModal'],
    queryFn: fetchPublishedArticles,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categoriesList'],
    queryFn: fetchCategories,
  });

  // 3. Sync Server State to Local Draft State on load
  useEffect(() => {
    // We load exactly what is in the DB. Nothing hardcoded.
    if (serverConfigs?.homepage_config) {
      setConfigs(serverConfigs.homepage_config);
    }
  }, [serverConfigs]);

  // 4. Setup the Mutation to save changes
  const { mutate: handleSave, isPending: isSaving } = useMutation({
    mutationFn: () => saveSettings(configs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepageSettings'] });
    },
    onError: (error) => {
      console.error('Save failed:', error);
    }
  });

  // 🛑 The Magic Fix: We remove the 'auto' fallback. 
  // If the section isn't configured, mode is undefined, meaning no UI buttons highlight.
  const currentConfig = configs[activeSection] || { count: 4, tags: [], selectedIds: [] };

  // Update local draft state immediately
  const updateConfig = (updates: Partial<SectionConfig>) => {
    setConfigs((prev) => ({
      ...prev,
      [activeSection]: { ...currentConfig, ...updates },
    }));
  };

  if (isLoadingConfigs) {
    return (
      <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#E31E24] rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-12 selection:bg-[#E31E24] selection:text-white">
      {/* Premium Top Navigation */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90 transition-all">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 -ml-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2 text-gray-900">
              <SlidersHorizontal size={18} className="text-[#E31E24]" />
              <span className="font-bold text-lg tracking-tight">Landing Page Engine</span>
            </div>
          </div>
          <button 
            onClick={() => handleSave()}
            disabled={isSaving}
            className="group flex items-center gap-2 bg-[#E31E24] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#C41A20] hover:shadow-[0_4px_20px_rgba(227,30,36,0.3)] transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={18} className="group-hover:scale-110 transition-transform" />
            )}
            {isSaving ? 'Publishing...' : 'Publish Layout'}
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          
          {/* Left Column: Visual Builder Timeline */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Page Architecture</h2>
              <p className="text-sm text-gray-500 mt-1">Select a section to configure its data source.</p>
            </div>
            <SidebarNavigation 
              activeSection={activeSection} 
              onSelect={setActiveSection} 
              pageSections={PAGE_SECTIONS}
            />
          </div>

          {/* Right Column: Settings Panel */}
          <div className="lg:col-span-8">
            <ConfigPanel 
              activeSectionId={activeSection}
              config={currentConfig}
              onUpdate={updateConfig}
              onOpenModal={() => setIsModalOpen(true)}
              pageSections={PAGE_SECTIONS}
              categories={categories}
            />
          </div>
        </div>
      </div>

      {/* Manual Selection Modal */}
      <StorySelectorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        limit={currentConfig.count || 4}
        initialSelected={currentConfig.selectedIds || []}
        onSelectSave={(ids: string[]) => updateConfig({ selectedIds: ids })}
        articlesPool={articlesPool}
      />
    </div>
  );
}