'use client';

import { useState } from 'react';
import { X, CheckCircle2, FileUp, Mic, ArrowRight, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import { FormSectionWithQuestions, FormQuestion } from '@/types/onboarding';
import { motion, AnimatePresence } from 'framer-motion';

interface LivePreviewProps {
  sections: FormSectionWithQuestions[];
  onClose: () => void;
}

const ARCHETYPES = [
  { id: 'BOOTSTRAPPED', label: 'Bootstrapped', desc: 'No institutional funding yet' },
  { id: 'EARLY_VENTURE', label: 'Early Venture', desc: 'Pre-Seed or Seed stage' },
  { id: 'GROWTH_SERIES_A', label: 'Growth Stage', desc: 'Series A and beyond' },
  { id: 'ALL', label: 'All (Testing)', desc: 'Show all questions' }
];

export default function LivePreview({ sections, onClose }: LivePreviewProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0); // 0 = archetype selection, 1+ = sections
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter sections and questions by archetype
  const previewSections = sections.map(s => {
    const visibleQ = (s.questions || []).filter(q => 
      !selectedArchetype || selectedArchetype === 'ALL' || (q.target_archetypes && (q.target_archetypes.includes('ALL') || q.target_archetypes.includes(selectedArchetype)))
    );
    return { ...s, questions: visibleQ };
  }).filter(s => s.questions.length > 0 || selectedArchetype === 'ALL');

  const totalSteps = previewSections.length;
  const progressPercent = currentStep === 0 ? 0 : Math.round((currentStep / totalSteps) * 100);

  const handleNext = () => {
    if (currentStep === 0 && !selectedArchetype) return;
    setDirection(1);
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? 'bg-white' : 'bg-black/60 p-4 sm:p-8 backdrop-blur-sm'}`}>
      <div className={`bg-white flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-full max-h-[90vh] rounded-2xl'}`}>
        
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between shrink-0 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={20} className="text-[#E31E24]" /> Live Form Preview
            </h2>
            <p className="text-gray-400 text-sm mt-1">See exactly what the founder sees.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors">
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {currentStep > 0 && (
          <div className="h-1.5 w-full bg-gray-100 shrink-0">
            <motion.div 
              className="h-full bg-[#E31E24]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative bg-white">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            
            {/* STEP 0: Archetype Selection */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 overflow-y-auto p-8 flex flex-col items-center justify-center"
              >
                <div className="max-w-2xl w-full">
                  <div className="text-center mb-10">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-3">Welcome, Founder.</h1>
                    <p className="text-gray-500 text-lg">To tailor your experience, please tell us about your current stage.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {ARCHETYPES.map(arch => (
                      <button
                        key={arch.id}
                        onClick={() => setSelectedArchetype(arch.id)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all ${
                          selectedArchetype === arch.id 
                            ? 'border-[#E31E24] bg-red-50 shadow-md scale-[1.02]' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <h3 className={`font-bold text-lg mb-1 ${selectedArchetype === arch.id ? 'text-[#E31E24]' : 'text-gray-900'}`}>
                          {arch.label}
                        </h3>
                        <p className="text-sm text-gray-500">{arch.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleNext}
                      disabled={!selectedArchetype}
                      className="flex items-center gap-2 bg-[#E31E24] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#C41A20] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(227,30,36,0.2)]"
                    >
                      Start Application <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 1+: Form Sections */}
            {currentStep > 0 && currentStep <= totalSteps && (
              <motion.div
                key={`step-${currentStep}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 overflow-y-auto p-8"
              >
                <div className="max-w-2xl mx-auto pb-24">
                  {/* Current Section Content */}
                  {(() => {
                    const section = previewSections[currentStep - 1];
                    return (
                      <div>
                        <div className="mb-8 border-b border-gray-100 pb-6">
                          <span className="text-[#E31E24] font-bold text-sm tracking-wider uppercase mb-2 block">
                            Step {currentStep} of {totalSteps}
                          </span>
                          <h1 className="text-3xl font-black text-gray-900">{section.title}</h1>
                          {section.description && <p className="text-gray-500 mt-2 text-lg">{section.description}</p>}
                        </div>
                        
                        <div className="space-y-8">
                          {section.questions.map(q => (
                            <PreviewQuestion key={q.id} question={q} />
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {currentStep > 0 && (
          <div className="bg-white border-t border-gray-100 p-6 shrink-0 relative z-10">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 text-gray-600 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} /> Previous
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors"
                >
                  Next Step <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  onClick={() => alert('Profile Submitted!')}
                  className="flex items-center gap-2 bg-[#E31E24] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#C41A20] shadow-[0_4px_20px_rgba(227,30,36,0.2)] transition-all"
                >
                  Submit Profile <CheckCircle2 size={20} />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function PreviewQuestion({ question: q }: { question: FormQuestion }) {
  const isRequired = q.visibility_tier === 'MANDATORY';
  
  return (
    <div className="bg-white">
      <label className="block text-base font-bold text-gray-900 mb-1">
        {q.label} {isRequired && <span className="text-[#E31E24]">*</span>}
      </label>
      {q.helper_text && <p className="text-sm text-gray-500 mb-3">{q.helper_text}</p>}
      
      {q.type === 'short_text' && (
        <input 
          type="text" 
          placeholder={q.placeholder || ''} 
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24] outline-none transition-all"
        />
      )}

      {q.type === 'long_text' && (
        <textarea 
          placeholder={q.placeholder || ''} 
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24] outline-none transition-all"
        />
      )}

      {q.type === 'dropdown_single' && (
        <select 
          defaultValue=""
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24] outline-none transition-all appearance-none"
        >
          <option value="" disabled>{q.placeholder || 'Select an option'}</option>
          {(q.options || []).map((opt: string, i: number) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {q.type === 'dropdown_multi' && (
        <div className="space-y-2">
          {(q.options || []).map((opt: string, i: number) => (
            <label key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input type="checkbox" className="w-5 h-5 text-[#E31E24] border-gray-300 rounded focus:ring-[#E31E24]" />
              <span className="text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {q.type === 'range_slider' && (
        <div className="px-2">
          <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E31E24]" />
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
            <span>{q.options?.[0] || 'Min'}</span>
            <span>{q.options?.[1] || 'Max'}</span>
          </div>
        </div>
      )}

      {q.type === 'boolean' && (
        <div className="flex gap-4">
          <label className="flex-1 flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-[#E31E24] hover:bg-red-50 cursor-pointer transition-all">
            <input type="radio" name={`radio-${q.id}`} className="w-4 h-4 text-[#E31E24] focus:ring-[#E31E24]" />
            <span className="font-semibold text-gray-700">Yes</span>
          </label>
          <label className="flex-1 flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all">
            <input type="radio" name={`radio-${q.id}`} className="w-4 h-4 text-gray-600 focus:ring-gray-500" />
            <span className="font-semibold text-gray-700">No</span>
          </label>
        </div>
      )}

      {q.type === 'file_upload' && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-[#E31E24]/50 transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-red-50 text-[#E31E24] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <FileUp size={24} />
          </div>
          <p className="font-semibold text-gray-900">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG, or PDF (max. 10MB)</p>
          {q.is_verification_artifact && (
            <p className="text-xs font-bold text-blue-600 mt-3 bg-blue-50 px-2 py-1 rounded">Required for Verification Badge</p>
          )}
        </div>
      )}

      {q.type === 'audio_note' && (
        <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50">
          <button className="w-16 h-16 bg-white shadow-md text-[#E31E24] rounded-full flex items-center justify-center mb-4 hover:scale-105 hover:shadow-lg transition-all">
            <Mic size={28} />
          </button>
          <p className="font-semibold text-gray-900">Record Audio Note</p>
          <p className="text-xs text-gray-500 mt-1">Up to 3 minutes</p>
        </div>
      )}

    </div>
  );
}
