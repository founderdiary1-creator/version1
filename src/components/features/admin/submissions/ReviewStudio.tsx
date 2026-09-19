'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FormSubmission, FormSectionWithQuestions, SubmissionStatus } from '@/types/onboarding';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft, Save, Loader2, Copy, Check, Play, Pause } from 'lucide-react';
import Link from 'next/link';
import { updateSubmissionStatus, updateSubmissionNotes, toggleVerificationBadge } from '@/app/actions/onboarding.actions';
import { AdaptiveImageModal } from './AdaptiveImageModal';
import { PdfViewerModal } from './PdfViewerModal';
import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks/useDebounce';

interface ReviewStudioProps {
  submission: FormSubmission;
  sections: FormSectionWithQuestions[];
}

export function ReviewStudio({ submission, sections }: ReviewStudioProps) {
  const [status, setStatus] = useState<SubmissionStatus>(submission.status);
  const [notes, setNotes] = useState(submission.editorial_notes || '');
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'ASSETS' | 'SCRATCHPAD'>('SCRATCHPAD');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const debouncedNotes = useDebounce(notes, 1000);

  // Auto-save editorial notes
  useEffect(() => {
    if (debouncedNotes !== submission.editorial_notes && debouncedNotes !== undefined) {
      setIsSavingNotes(true);
      updateSubmissionNotes(submission.id, debouncedNotes)
        .then(() => setIsSavingNotes(false))
        .catch(() => toast.error('Failed to save notes'));
    }
  }, [debouncedNotes, submission.id, submission.editorial_notes]);

  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    setStatus(newStatus);
    setIsSavingStatus(true);
    const res = await updateSubmissionStatus(submission.id, newStatus);
    setIsSavingStatus(false);
    if (res.success) {
      toast.success('Status updated');
    } else {
      toast.error('Failed to update status');
      setStatus(submission.status); // revert
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  // Extract all assets (URLs) from the payload
  const allAssets = Object.entries(submission.payload).filter(([key, val]) => {
    if (typeof val === 'string' && (val.includes('cloudinary.com') || val.startsWith('http'))) {
      const q = sections.flatMap(s => s.questions).find(q => q.id === key);
      return q?.type === 'file_upload';
    }
    return false;
  }).map(([key, url]) => {
    const q = sections.flatMap(s => s.questions).find(q => q.id === key);
    return { url: url as string, label: q?.label || 'Unknown Asset', isPdf: url.toString().toLowerCase().endsWith('.pdf') };
  });

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex flex-col font-sans bg-gray-50">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/submissions" className="p-2 -ml-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="w-px h-6 bg-gray-200" />
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">
              {submission.company_name || 'Unknown Company'} <span className="text-gray-400 font-normal ml-2">by {submission.founder_name || 'Unknown Founder'}</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Submitted {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as SubmissionStatus)}
            disabled={isSavingStatus}
            className={`px-4 py-2 rounded-lg font-bold text-sm border-2 outline-none transition-all ${
              status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-200' :
              status === 'DRAFTING' ? 'bg-purple-50 text-purple-700 border-purple-200' :
              status === 'UNDER_REVIEW' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            <option value="NEW">New / Unreviewed</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="DRAFTING">Drafting Article</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </header>

      {/* 60/40 Split Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Structured Playbook (60%) */}
        <div className="w-3/5 overflow-y-auto p-8 bg-gray-50 border-r border-gray-200">
          <div className="max-w-3xl mx-auto space-y-12 pb-24">
            {sections.map(section => {
              // Check if any questions in this section have answers in the payload
              const answeredQuestions = section.questions.filter(q => submission.payload[q.id]);
              if (answeredQuestions.length === 0) return null;

              return (
                <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-900 px-6 py-4">
                    <h2 className="text-lg font-bold text-white">{section.title}</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {answeredQuestions.map(q => {
                      const answer = submission.payload[q.id];
                      const isArray = Array.isArray(answer);
                      const isUrl = typeof answer === 'string' && (answer.startsWith('http') || answer.includes('cloudinary'));

                      return (
                        <div key={q.id} className="p-6 group hover:bg-gray-50/50 transition-colors relative">
                          {/* Copy Button */}
                          <button 
                            onClick={() => handleCopy(isArray ? answer.join(', ') : String(answer))}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            title="Copy Answer"
                          >
                            <Copy size={16} />
                          </button>

                          <div className="pr-12">
                            <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                              {q.label}
                              {q.visibility_tier === 'MANDATORY' && <span className="w-1.5 h-1.5 rounded-full bg-[#E31E24]" title="Mandatory" />}
                            </h3>
                            
                            {/* Answer Formatting */}
                            {isArray ? (
                              <div className="flex flex-wrap gap-2">
                                {answer.map((item: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-900">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            ) : q.type === 'file_upload' && isUrl ? (
                              <div className="mt-2">
                                <button 
                                  onClick={() => answer.toLowerCase().endsWith('.pdf') ? setSelectedPdf(answer) : setSelectedImage(answer)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors shadow-sm"
                                >
                                  Open Attached File
                                </button>
                              </div>
                            ) : q.type === 'long_text' ? (
                              <p className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap">{answer}</p>
                            ) : (
                              <p className="text-gray-900 text-lg font-medium">{String(answer)}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Editorial & Assets (40%) */}
        <div className="w-2/5 flex flex-col bg-white">
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button 
              onClick={() => setActiveTab('SCRATCHPAD')}
              className={`flex-1 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'SCRATCHPAD' ? 'border-[#E31E24] text-[#E31E24] bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}
            >
              <div className="flex items-center justify-center gap-2">
                Editorial Scratchpad
                {isSavingNotes && <Loader2 size={14} className="animate-spin text-gray-400" />}
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('ASSETS')}
              className={`flex-1 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ASSETS' ? 'border-[#E31E24] text-[#E31E24] bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}
            >
              Asset Vault ({allAssets.length})
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'SCRATCHPAD' && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Draft article points, copy/paste quotes, or outline your LinkedIn carousel here. (Auto-saves automatically)"
                className="w-full h-full p-6 resize-none outline-none text-gray-800 leading-relaxed font-mono text-sm bg-[#fafafa]"
              />
            )}
            {activeTab === 'ASSETS' && (
              <div className="p-6 h-full overflow-y-auto">
                {allAssets.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <p>No files uploaded</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {allAssets.map((asset, i) => (
                      <div key={i} className="group relative rounded-xl border border-gray-200 bg-gray-50 overflow-hidden aspect-[4/3] flex items-center justify-center cursor-pointer" onClick={() => asset.isPdf ? setSelectedPdf(asset.url) : setSelectedImage(asset.url)}>
                        {asset.isPdf ? (
                          <div className="text-gray-400 font-bold text-lg flex flex-col items-center">
                            PDF
                            <span className="text-xs font-normal mt-2 text-center px-2 line-clamp-2">{asset.label}</span>
                          </div>
                        ) : (
                          <img src={asset.url} alt="Asset" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                          <p className="text-white text-xs font-bold truncate">{asset.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedImage && <AdaptiveImageModal url={selectedImage} onClose={() => setSelectedImage(null)} />}
        {selectedPdf && <PdfViewerModal url={selectedPdf} onClose={() => setSelectedPdf(null)} />}
      </AnimatePresence>

    </div>
  );
}
