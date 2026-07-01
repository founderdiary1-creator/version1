'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/lib/supabase/storage';
import { useCategoriesQuery, useIndustriesQuery } from '@/hooks/useTaxonomy';
import { useCreateStoryMutation } from '@/hooks/useStories';
import { useAllCompaniesQuery } from '@/hooks/useDataLabs';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Upload, Image as ImageIcon, Save, Send, 
  Plus, X, GripVertical, Trash2, ArrowUp, ArrowDown, LayoutTemplate
} from 'lucide-react';
import Link from 'next/link';

// Types
interface ContentBlockState {
  id: string;
  subheading: string;
  content: string;
  imageFile: File | null;
  imagePreview: string;
  image_caption: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const { data: categories = [] } = useCategoriesQuery();
  const { data: industries = [] } = useIndustriesQuery();
  const { data: companies = [] } = useAllCompaniesQuery();
  const createMutation = useCreateStoryMutation();
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [summaryPoints, setSummaryPoints] = useState<string[]>(['']);

  // Meta State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    category_id: '',
    industry_id: '',
    is_premium: false,
    is_featured: false,
    is_editors_pick: false,
    read_time: '',
    company_id: '',
  });

  // The New Block Engine State
  const [blocks, setBlocks] = useState<ContentBlockState[]>([
    { id: 'initial-block', subheading: '', content: '', imageFile: null, imagePreview: '', image_caption: '' }
  ]);

  // --- Handlers: Meta ---
  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({ ...prev, title, slug: generateSlug(title) }));
  }

  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  // --- Handlers: Blocks ---
  function addBlock() {
    setBlocks(prev => [
      ...prev, 
      { id: Date.now().toString(), subheading: '', content: '', imageFile: null, imagePreview: '', image_caption: '' }
    ]);
  }

  function removeBlock(id: string) {
    if (blocks.length === 1) return toast.error('An article must have at least one content block.');
    setBlocks(prev => prev.filter(b => b.id !== id));
  }

  function moveBlock(index: number, direction: 'up' | 'down') {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  }

  function updateBlock(id: string, field: keyof ContentBlockState, value: any) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  }

  function handleBlockImage(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      updateBlock(id, 'imageFile', file);
      updateBlock(id, 'imagePreview', URL.createObjectURL(file));
    }
  }

  // --- Submission ---
  async function uploadImageToServer(file: File, fileSlug: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', fileSlug);

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }
    const data = await response.json();
    return data.url;
  }

  async function handleSubmit(status: 'draft' | 'published') {
    if (!form.title.trim()) return toast.error('Please enter a story title');
    if (!form.category_id) return toast.error('Please select a category');
    
    // Ensure at least one block has content
    if (!blocks.some(b => b.content.trim() || b.imageFile)) {
      return toast.error('Please add some content to the article');
    }

    setLoading(true);
    const loadingToast = toast.loading(status === 'published' ? 'Publishing intelligence...' : 'Saving draft...');

    try {
      // 1. Upload Main Featured Image
      let featured_image = '';
      if (imageFile) {
        toast.loading('Uploading featured image...', { id: loadingToast });
        featured_image = await uploadImageToServer(imageFile, form.slug);
      }

      // 2. Upload Block Images & Format Blocks
      toast.loading('Processing content blocks...', { id: loadingToast });
      const processedBlocks = await Promise.all(blocks.map(async (block, index) => {
        let block_image_url = '';
        if (block.imageFile) {
          block_image_url = await uploadImageToServer(block.imageFile, `${form.slug}-block-${index}`);
        }
        return {
          id: block.id,
          subheading: block.subheading,
          content: block.content,
          image_url: block_image_url,
          image_caption: block.image_caption
        };
      }));

      // 3. Save to Database
      toast.loading('Saving to database...', { id: loadingToast });
      await createMutation.mutateAsync({
        ...form,
        summary_points: summaryPoints.filter(p => p.trim() !== ''),
        company_id: form.company_id || undefined,
        featured_image: featured_image || undefined,
        content_blocks: processedBlocks, // NEW: Sending blocks array instead of raw HTML string
        status,
        published_at: status === 'published' ? new Date().toISOString() : undefined,
      });

      toast.success(status === 'published' ? 'Article published successfully!' : 'Draft saved!', { id: loadingToast });
      router.push('/admin');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to save article', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20">
      
      {/* Sticky Premium Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50">
              <ArrowLeft size={20} />
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Intelligence Composer</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              className="flex items-center gap-2 bg-white text-gray-700 font-semibold px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <Save size={16} /> Save Draft
            </button>
            <button
              onClick={() => handleSubmit('published')}
              disabled={loading}
              className="flex items-center gap-2 bg-[#E31E24] text-white font-semibold px-5 py-2 rounded-lg hover:bg-[#C41A20] shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              <Send size={16} /> Publish Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Main Editor Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Slug Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-4xl font-black text-gray-900 placeholder:text-gray-300 border-none focus:outline-none focus:ring-0 p-0 mb-4 tracking-tight"
                placeholder="Enter compelling headline..."
              />
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="font-medium shrink-0">URL Slug:</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-transparent border-none focus:outline-none text-gray-700"
                  placeholder="manual-override-slug"
                />
                <button onClick={() => setForm(prev => ({...prev, slug: generateSlug(form.title)}))} className="text-xs font-bold text-[#E31E24] hover:underline shrink-0">
                  Regenerate
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Hero Media</h2>
              {imagePreview ? (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => { setImageFile(null); setImagePreview(''); }}
                    className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                  >
                    Remove Media
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl py-16 cursor-pointer hover:border-[#E31E24] hover:bg-[#E31E24]/5 transition-all group">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <ImageIcon size={28} className="text-gray-400 group-hover:text-[#E31E24]" />
                  </div>
                  <span className="text-base text-gray-700 font-semibold mb-1">Drop featured image here</span>
                  <span className="text-sm text-gray-400">16:9 aspect ratio recommended</span>
                  <input type="file" accept="image/jpeg, image/png" onChange={handleMainImageChange} className="hidden" />
                </label>
              )}
            </div>

            {/* BLOCK ENGINE */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <LayoutTemplate size={20} className="text-gray-400" />
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Content Blocks</h2>
                </div>
              </div>

              {blocks.map((block, index) => (
                <div key={block.id} className="bg-white rounded-xl border border-gray-100 shadow-sm relative group transition-all hover:border-gray-300">
                  
                  {/* Block Controls */}
                  <div className="absolute -left-12 top-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-black disabled:opacity-30 bg-white border border-gray-200 rounded-md shadow-sm">
                      <ArrowUp size={16} />
                    </button>
                    <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1.5 text-gray-400 hover:text-black disabled:opacity-30 bg-white border border-gray-200 rounded-md shadow-sm">
                      <ArrowDown size={16} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <input
                        type="text"
                        value={block.subheading}
                        onChange={(e) => updateBlock(block.id, 'subheading', e.target.value)}
                        className="w-full text-2xl font-bold text-gray-900 placeholder:text-gray-300 border-none focus:outline-none p-0 bg-transparent"
                        placeholder={`Section ${index + 1} Subheading (Optional)`}
                      />
                      <button onClick={() => removeBlock(block.id)} className="text-gray-300 hover:text-red-500 transition-colors ml-4 shrink-0">
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="mb-6">
                      <RichTextEditor 
                        content={block.content}
                        onChange={(html) => updateBlock(block.id, 'content', html)}
                      />
                    </div>

                    {/* Block Image Section */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {block.imagePreview ? (
                        <div className="bg-gray-50 p-4 rounded-lg flex gap-4 items-start border border-gray-200">
                          <img src={block.imagePreview} alt="Block media" className="w-48 h-32 object-cover rounded-md shadow-sm" />
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              value={block.image_caption}
                              onChange={(e) => updateBlock(block.id, 'image_caption', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:border-[#E31E24] focus:outline-none"
                              placeholder="Image Caption / Source"
                            />
                            <button onClick={() => { updateBlock(block.id, 'imageFile', null); updateBlock(block.id, 'imagePreview', ''); }} className="text-xs font-bold text-red-500 hover:underline">
                              Remove Image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                          <ImageIcon size={16} /> Add Section Media
                          <input type="file" accept="image/jpeg, image/png" onChange={(e) => handleBlockImage(block.id, e)} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={addBlock}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold hover:border-[#E31E24] hover:text-[#E31E24] hover:bg-[#E31E24]/5 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Add New Content Block
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Settings Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Meta & Taxonomy */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Classification</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Industry Tag</label>
                  <select
                    value={form.industry_id}
                    onChange={(e) => setForm((prev) => ({ ...prev, industry_id: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
                  >
                    <option value="">Select industry...</option>
                    {industries.map((ind) => (
                      <option key={ind.id} value={ind.id}>{ind.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Visibility Toggles */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Display Settings</h3>
              {[
                { key: 'is_premium', label: 'Premium Exclusivity', desc: 'Restricts access to paid members' },
                { key: 'is_featured', label: 'Featured Placement', desc: 'Pins to top of frontpage' },
                { key: 'is_editors_pick', label: "Editor's Pick", desc: 'Adds to curated sidebar list' },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={form[key as keyof typeof form] as boolean}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-9 h-5 rounded-full transition-colors ${form[key as keyof typeof form] ? 'bg-[#E31E24]' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
                      <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform mt-[3px] ${form[key as keyof typeof form] ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-900">{label}</span>
                    <span className="block text-xs text-gray-500">{desc}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Summary Highlights */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Executive Summary</h3>
              
              <div className="mb-5">
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-900">Card Description</label>
                  <span className={`text-xs font-bold ${form.summary.length > 150 ? 'text-red-500' : 'text-gray-400'}`}>
                    {form.summary.length}/150
                  </span>
                </div>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-black resize-none"
                  placeholder="Appears on frontpage cards..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Key Takeaways (Top Box)</label>
                <div className="space-y-2 mb-3">
                  {summaryPoints.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const newPoints = [...summaryPoints];
                          newPoints[index] = e.target.value;
                          setSummaryPoints(newPoints);
                        }}
                        className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:bg-white focus:border-black focus:outline-none"
                        placeholder="Key point..."
                      />
                      <button onClick={() => setSummaryPoints(summaryPoints.filter((_, i) => i !== index))} className="text-gray-400 hover:text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setSummaryPoints([...summaryPoints, ''])} className="text-xs font-bold text-[#E31E24] hover:underline flex items-center gap-1">
                  <Plus size={14} /> Add Bullet Point
                </button>
              </div>
            </div>

            {/* DataLabs Context */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm border-t-4 border-t-black">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                DataLabs Link
              </h3>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Attach Company Profile</label>
              <select
                value={form.company_id}
                onChange={(e) => setForm((prev) => ({ ...prev, company_id: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white"
              >
                <option value="">No company linked</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}