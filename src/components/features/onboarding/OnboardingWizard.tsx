'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import { FormSectionWithQuestions, FormQuestion } from '@/types/onboarding';

// Custom Inputs
import { CardRadio } from './inputs/CardRadio';
import { AutoResizeTextarea } from './inputs/AutoResizeTextarea';
import { CloudinaryDropzone } from './inputs/CloudinaryDropzone';

const ARCHETYPES = [
  { id: 'BOOTSTRAPPED', label: 'Bootstrapped', desc: 'No institutional funding yet' },
  { id: 'EARLY_VENTURE', label: 'Early Venture', desc: 'Pre-Seed or Seed stage' },
  { id: 'GROWTH_SERIES_A', label: 'Growth Stage', desc: 'Series A and beyond' }
];

export function OnboardingWizard({ sections }: { sections: FormSectionWithQuestions[] }) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Archetype Selection, 1+ = Sections
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize react-hook-form with Record<string, any> for dynamic fields
  const form = useForm<Record<string, any>>({
    defaultValues: {
      archetype: '',
      // Dynamic fields will be populated as user types
    }
  });

  // Use auto-save hook
  const { hasDraft, restoreDraft, ignoreDraft, clearDraft } = useAutoSaveForm(form, 'founderdiary_onboarding_draft', 1500);

  // Watch archetype to filter sections
  const selectedArchetype = form.watch('archetype');

  // Filter sections and questions dynamically based on selected archetype
  const activeSections = useMemo(() => {
    return sections.map(s => {
      const visibleQ = (s.questions || []).filter(q => {
        if (!q.is_active) return false;
        if (!selectedArchetype) return true; // Show all if no archetype selected yet
        return !q.target_archetypes || q.target_archetypes.length === 0 || q.target_archetypes.includes('ALL') || q.target_archetypes.includes(selectedArchetype);
      });
      return { ...s, questions: visibleQ };
    }).filter(s => s.questions.length > 0 && s.is_active);
  }, [sections, selectedArchetype]);

  const totalSteps = activeSections.length;
  const progressPercent = currentStep === 0 ? 0 : Math.round(((currentStep) / (totalSteps + 1)) * 100);

  const handleNext = async () => {
    // Validate current step before proceeding
    let isValid = true;
    
    if (currentStep === 0) {
      if (!selectedArchetype) {
        form.setError('archetype', { message: 'Please select an archetype' });
        isValid = false;
      }
    } else {
      const section = activeSections[currentStep - 1];
      const requiredFields = section.questions
        .filter(q => q.visibility_tier === 'MANDATORY')
        .map(q => q.id);
      
      const isSectionValid = await form.trigger(requiredFields);
      isValid = isSectionValid;
    }

    if (isValid) {
      setDirection(1);
      setCurrentStep(prev => Math.min(prev + 1, totalSteps + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const finalData = { ...data };
      
      // Process "Other" fields
      for (const key of Object.keys(finalData)) {
        if (key.endsWith('_other')) continue;
        const otherKey = `${key}_other`;
        if (finalData[otherKey]) {
          if (Array.isArray(finalData[key])) {
            finalData[key] = finalData[key].map((v: string) => (v === 'Other' || v === 'Others') ? finalData[otherKey] : v);
          } else if (finalData[key] === 'Other' || finalData[key] === 'Others') {
            finalData[key] = finalData[otherKey];
          }
        }
      }
      
      // Clean up the temporary _other fields
      for (const key of Object.keys(finalData)) {
        if (key.endsWith('_other')) delete finalData[key];
      }

      const { submitOnboardingPlaybook } = await import('@/app/actions/onboarding.actions');
      const result = await submitOnboardingPlaybook(finalData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      clearDraft();
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Something went wrong submitting your playbook. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent Enter key from submitting form prematurely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.metaKey) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, selectedArchetype]);

  const variants = {
    enter: (direction: number) => ({
      y: 20,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      opacity: 0,
      transition: { duration: 0.2 }
    })
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Submitted</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for sharing your playbook. Our editorial team will review your submission and reach out shortly.
          </p>
          <Link href="/" className="inline-block w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      
      {/* Draft Restore Prompt */}
      <AnimatePresence>
        {hasDraft && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 inset-x-0 z-50 bg-gray-900 text-white p-4 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-lg"
          >
            <span className="font-medium">We found a saved draft of your application.</span>
            <div className="flex gap-2">
              <button onClick={restoreDraft} className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
                Resume Draft
              </button>
              <button onClick={ignoreDraft} className="text-gray-300 px-4 py-2 text-sm font-medium hover:text-white transition-colors">
                Start Fresh
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="h-1.5 w-full bg-gray-100 absolute top-0 left-0">
          <motion.div 
            className="h-full bg-[#E31E24]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between mt-1.5">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft size={16} /> Back to Founder Diary
          </Link>
          {currentStep > 0 && currentStep <= totalSteps && (
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Step {currentStep} of {totalSteps}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 pb-40 relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          
          {/* STEP 0: The Executive Briefing & Archetype Selection */}
{currentStep === 0 && (
  <motion.div
    key="step-0"
    custom={direction}
    variants={variants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    className="space-y-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8"
  >
    {/* 1. Brand Logo Header */}
    <div className="flex justify-center mb-8">
      {/* Replace this div with your actual <img src="/logo.svg" alt="Founder Diary" /> if you have an SVG logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#E31E24] flex items-center justify-center shadow-lg shadow-red-500/20">
          <img src="/images/logo2.png" className='rounded-2xl' alt="Founder Diary" />
        </div>
        <span className="text-2xl font-black tracking-tight text-red-600">Founder Diary</span>
      </div>
    </div>

    {/* 2. The Hook & Header */}
    <div className="text-center space-y-4">
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 leading-tight">
        Build Your Founder Playbook.
      </h1>
      <p className="text-gray-500 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
        We don't do PR fluff. We are building an invite-only archive of the exact growth mechanics, unit economics, and tech stacks used by India's most efficient founders.
      </p>
    </div>

    {/* 3. The Value Prop & Instructions (Premium Grid Layout) */}
    <div className="grid grid-cols-1 gap-6 pt-6">
      
      {/* Left Column: The Rules */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-center">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
          How this works
        </h2>
        
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
              <svg className="w-5 h-5 text-[#E31E24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">Auto-Save Enabled</p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">Your progress is automatically saved to your browser. You can close this tab and resume anytime without losing data.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">100% Veto Power</p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">No surprises. You will receive a private preview link to review, edit, or approve the final draft before anything is published.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Premium Question Guide */}
      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
          Question Guide
        </h2>
        
        <div className="space-y-3">
          {/* Mandatory Card */}
          <div className="grid grid-cols-4 items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="mt-0.5 col-span-1">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-900 text-white rounded-md shadow-sm">Mandatory</span>
            </div>
            <div className="col-span-3">
              <p className="text-sm font-bold text-gray-900">Core Identity</p>
              <p className="text-xs text-gray-500 mt-0.5">Essential business details needed to build your profile.</p>
            </div>
          </div>
          
          {/* Recommended Card */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-white rounded-2xl border border-blue-100 shadow-sm transition-all hover:shadow-md">
            <div className="mt-0.5 col-span-1">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded-md">Recommended</span>
            </div>
            <div className="col-span-3">
              <p className="text-sm font-bold text-gray-900">Investor Memo</p>
              <p className="text-xs text-gray-500 mt-0.5">Crucial metrics and growth data used to construct the deep-dive.</p>
            </div>
          </div>
          
          {/* Optional Card */}
          <div className="grid grid-cols-4 gap-4 p-4  bg-white rounded-2xl border border-blue-100 shadow-sm transition-all hover:shadow-md">
            <div className="mt-0.5 col-span-1">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600 rounded-md">Optional</span>
            </div>
            <div className="col-span-3">
              <p className="text-sm font-bold text-gray-900">Editorial Artifacts</p>
              <p className="text-xs text-gray-500 mt-0.5">Extra context, screenshots, and pitch deck uploads.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>

    {/* 4. The Archetype Selection */}
    <div className="space-y-6 pt-10">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Select your current stage.</h3>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          We use this to filter out irrelevant questions. A bootstrapped founder faces totally different challenges than a Series A CEO.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Controller
          name="archetype"
          control={form.control}
          render={({ field }) => (
            <CardRadio
              options={ARCHETYPES.map(a => a.id)}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {form.formState.errors.archetype && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#E31E24] text-sm font-medium mt-3 text-center"
          >
            {form.formState.errors.archetype.message as string}
          </motion.p>
        )}
      </div>
    </div>

    {/* 5. The Action Button */}
    <div className="flex justify-center pt-8 pb-16">
      <button
        onClick={handleNext}
        className="group relative flex items-center gap-3 bg-[#E31E24] text-white font-bold text-lg px-10 py-5 rounded-2xl hover:bg-[#C41A20] transition-all shadow-[0_8px_30px_rgba(227,30,36,0.25)] hover:shadow-[0_8px_30px_rgba(227,30,36,0.4)] focus:outline-none focus:ring-4 focus:ring-red-100 transform hover:-translate-y-1"
      >
        <span>Initialize Playbook</span>
        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </motion.div>
)}

          {/* STEP 1 to N: Form Sections */}
          {currentStep > 0 && currentStep <= totalSteps && (
            <motion.div
              key={`step-${currentStep}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {(() => {
                const section = activeSections[currentStep - 1];
                return (
                  <div>
                    <div className="mb-12">
                      <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-4">{section.title}</h1>
                      {section.description && <p className="text-gray-500 text-lg leading-relaxed">{section.description}</p>}
                    </div>

                    <div className="space-y-12">
                      {section.questions.map(q => (
                        <div key={q.id}>
                          <label className="flex items-start justify-between gap-4 text-2xl font-bold tracking-tight text-gray-900 mb-2 leading-snug">
                            <div className="flex-1">
                              {q.label} {q.visibility_tier === 'MANDATORY' && <span className="text-[#E31E24]">*</span>}
                            </div>
                            <div className="mt-1.5 shrink-0">
                              {q.visibility_tier === 'MANDATORY' && (
                                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-900 text-white rounded-md shadow-sm">Mandatory</span>
                              )}
                              {q.visibility_tier === 'RECOMMENDED_MEMO' && (
                                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded-md">Recommended</span>
                              )}
                              {q.visibility_tier === 'OPTIONAL_DEEP_DIVE' && (
                                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600 rounded-md">Optional</span>
                              )}
                            </div>
                          </label>
                          {q.helper_text && <p className="text-gray-500 text-base mb-6 leading-relaxed">{q.helper_text}</p>}
                          
                          <Controller
                            name={q.id}
                            control={form.control}
                            rules={{ required: q.visibility_tier === 'MANDATORY' ? 'This field is required' : false }}
                            render={({ field, fieldState }) => (
                              <div>
                                {q.type === 'short_text' && (
                                  <input 
                                    {...field}
                                    value={field.value || ''}
                                    type="text"
                                    placeholder={q.placeholder || ''}
                                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 outline-none transition-all text-lg"
                                  />
                                )}
                                {q.type === 'long_text' && (
                                  <AutoResizeTextarea
                                    {...field}
                                    value={field.value || ''}
                                    placeholder={q.placeholder || ''}
                                  />
                                )}
                                {q.type === 'dropdown_single' && (
                                  <CardRadio
                                    options={q.options || []}
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                  />
                                )}
                                {q.type === 'dropdown_multi' && (
                                  <CardRadio
                                    options={q.options || []}
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    isMulti
                                  />
                                )}
                                {q.type === 'boolean' && (
                                  <CardRadio
                                    options={['Yes', 'No']}
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                  />
                                )}
                                {q.type === 'file_upload' && (
                                  <CloudinaryDropzone
                                    value={field.value || null}
                                    onChange={field.onChange}
                                  />
                                )}
                                {q.type === 'range_slider' && (
                                  <div className="py-4">
                                    <input 
                                      {...field}
                                      value={field.value || ''}
                                      type="range"
                                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E31E24]"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500 mt-3 font-semibold uppercase tracking-wider">
                                      <span>{q.options?.[0] || 'Min'}</span>
                                      <span>{q.options?.[1] || 'Max'}</span>
                                    </div>
                                  </div>
                                )}
                                {fieldState.error && (
                                  <p className="text-[#E31E24] text-sm font-semibold mt-3 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E31E24] inline-block" />
                                    {fieldState.error.message}
                                  </p>
                                )}

                                {/* Conditional text input for "Other" selections */}
                                {((Array.isArray(field.value) ? (field.value.includes('Other') || field.value.includes('Others')) : (field.value === 'Other' || field.value === 'Others'))) && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                                    <input
                                      {...form.register(`${q.id}_other`, { required: 'Please specify your answer' })}
                                      type="text"
                                      placeholder="Please specify..."
                                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 outline-none transition-all text-lg"
                                    />
                                    {form.formState.errors[`${q.id}_other`] && (
                                      <p className="text-[#E31E24] text-sm font-semibold mt-2 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#E31E24] inline-block" />
                                        {(form.formState.errors[`${q.id}_other`] as any).message}
                                      </p>
                                    )}
                                  </motion.div>
                                )}
                              </div>
                            )}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
                      <button
                        onClick={handlePrev}
                        className="text-gray-500 font-semibold px-6 py-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        <ArrowLeft size={20} /> Back
                      </button>
                      <button
                        onClick={handleNext}
                        className="bg-gray-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-black transition-colors flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-gray-200"
                      >
                        Continue <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* STEP N+1: Review and Submit */}
          {currentStep === totalSteps + 1 && (
            <motion.div
              key="step-review"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="space-y-10"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-4">Ready to Submit?</h1>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Take a moment to review your playbook. We save your draft automatically, so you can always come back later.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Submission Summary</h3>
                <ul className="space-y-4">
                  {activeSections.map(section => {
                    const answered = section.questions.filter(q => !!form.getValues(q.id)).length;
                    const total = section.questions.length;
                    return (
                      <li key={section.id} className="flex items-center justify-between text-base">
                        <span className="font-medium text-gray-700">{section.title}</span>
                        <span className={`font-semibold ${answered === total ? 'text-green-600' : 'text-amber-500'}`}>
                          {answered} / {total} answered
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
                <button
                  onClick={handlePrev}
                  className="w-full sm:w-auto text-gray-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Go Back to Edit
                </button>
                <button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#E31E24] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#C41A20] shadow-[0_4px_20px_rgba(227,30,36,0.2)] transition-all disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                  {isSubmitting ? 'Submitting...' : 'Submit Playbook'}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
