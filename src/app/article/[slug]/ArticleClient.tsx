'use client';

import { useStoryQuery as useArticle } from '@/hooks/useStories';
import { CategoryTag } from '@/components/ui/CategoryTag';
import Image from 'next/image';
import { 
  Clock, User, ArrowLeft, Bookmark, 
  Share2, 
  MessageCircle, Link2, Check
} from 'lucide-react';
import { Facebook, Twitter, Linkedin } from '@/components/ui/BrandIcons';
import Link from 'next/link';
import { use, useState, useEffect } from 'react';

import { FundingSidebarWidget } from '@/components/features/datalabs/FundingSidebarWidget';
import { CompanyDataCard } from '@/components/features/datalabs/CompanyDataCard';
import type { ContentBlock } from '@/types/article';

export default function ArticleClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: article, isLoading, isError } = useArticle(slug);

  // States for micro-interactions
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // --- Handlers for Social & Actions ---
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.summary,
          url: currentUrl,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    }
  };

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article?.title || '')}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(article?.title || '')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(article?.title + ' ' + currentUrl)}`
  };

  // --- Loading & Error States ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase animate-pulse">Loading Briefing</span>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Intelligence Not Found</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">The briefing you are looking for has been archived or removed from our active database.</p>
          <Link href="/news" className="inline-block bg-gray-900 text-white font-medium px-6 py-3 rounded-lg hover:bg-[#E31E24] transition-colors">
            Return to Frontpage
          </Link>
        </div>
      </div>
    );
  }

  // --- The Action Bar Component ---
  const ActionBar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex ${mobile ? 'flex-row items-center gap-4' : 'flex-col gap-5 sticky top-24'}`}>
      <button 
        onClick={() => setIsSaved(!isSaved)}
        className={`group flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 ${isSaved ? 'bg-black border-black text-white' : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'}`}
        title="Save for later"
      >
        <Bookmark size={18} className={isSaved ? 'fill-current' : ''} />
      </button>

      <div className={`${mobile ? 'w-px h-6' : 'h-px w-6 mx-auto'} bg-gray-200`} />

      <a href={shareLinks.x} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors" title="Share on X">
        <Twitter size={20} />
      </a>
      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0A66C2] transition-colors" title="Share on LinkedIn">
        <Linkedin size={20} />
      </a>
      <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#25D366] transition-colors" title="Share on WhatsApp">
        <MessageCircle size={20} />
      </a>
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors hidden sm:block" title="Share on Facebook">
        <Facebook size={20} />
      </a>

      <div className={`${mobile ? 'w-px h-6' : 'h-px w-6 mx-auto'} bg-gray-200`} />

      <button onClick={handleCopyLink} className="text-gray-400 hover:text-black transition-colors relative" title="Copy Link">
        {copied ? <Check size={20} className="text-green-500" /> : <Link2 size={20} />}
      </button>
      
      {/* Native share for mobile devices */}
      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
        <button onClick={handleNativeShare} className="lg:hidden text-gray-400 hover:text-black transition-colors" title="Share">
          <Share2 size={20} />
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen border-t border-gray-100 selection:bg-[#E31E24]/20 selection:text-gray-900">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-[#E31E24] transition-colors mb-8 md:mb-12">
          <ArrowLeft size={16} /> Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* LEFT: Desktop Action Bar (Hidden on Mobile) */}
          <aside className="hidden lg:block lg:col-span-1 border-r border-gray-100 pr-4">
            <ActionBar />
          </aside>

          {/* CENTER: Main Article Content */}
          <article className="lg:col-span-7 max-w-[720px] mx-auto w-full">
            
            {/* Metadata Header */}
            {article.category && (
              <div className="mb-6">
                <CategoryTag category={article.category.name} />
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6">
              {article.title}
            </h1>

            {article.summary && (
              <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-8 font-light">
                {article.summary}
              </p>
            )}

            {/* Meta & Mobile Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2 text-gray-900">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#E31E24]">
                    <User size={14} />
                  </div>
                  <span>{article.author_name || 'Founder Diary Intelligence'}</span>
                </div>
                <span className="text-gray-300 hidden sm:inline">|</span>
                {article.published_at && (
                  <span>{new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                )}
                {article.read_time && (
                  <>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{article.read_time}</span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Render action bar horizontally on mobile */}
              <div className="lg:hidden">
                <ActionBar mobile={true} />
              </div>
            </div>

            {/* Featured Image */}
            {article.featured_image && (
              <figure className="mb-12 group">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    priority
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                </div>
              </figure>
            )}

            {/* Executive Summary Box */}
            {article.summary_points && article.summary_points.length > 0 && (
              <div className="bg-[#F8F9FA] border border-gray-100 p-6 md:p-8 mb-12 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#E31E24]" />
                <h3 className="text-xs font-black text-gray-900 tracking-widest uppercase mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E31E24] animate-pulse" />
                  Executive Summary
                </h3>
                <ul className="space-y-4">
                  {article.summary_points.map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700 leading-relaxed">
                      <Check size={18} className="text-gray-400 shrink-0 mt-1" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* NEW: Block-Based Content Engine */}
            <div className="article-body-content">
              {article.content_blocks && article.content_blocks.length > 0 ? (
                // 1. Render blocks if the new API structure exists
                <div className="space-y-10">
                  {article.content_blocks.map((block: ContentBlock) => (
                    <section key={block.id} className="scroll-reveal">
                      {block.subheading && (
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
                          {block.subheading}
                        </h2>
                      )}
                      
                      {block.content && (
                        <div 
  className="
    text-gray-700 leading-relaxed text-lg 
    [&>p]:mb-6 [&>p:last-of-type]:mb-0 
    [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-gray-900
    [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-8 [&>h2]:text-gray-900
    [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:mt-6 [&>h3]:text-gray-900
    [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2
    [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-2
    [&>blockquote]:border-l-4 [&>blockquote]:border-[#E31E24] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:mb-6 [&>blockquote]:bg-gray-50 [&>blockquote]:py-2 [&>blockquote]:pr-4
    [&>a]:text-[#E31E24] [&>a]:font-medium hover:[&>a]:underline
  "
  dangerouslySetInnerHTML={{ __html: block.content }}
/>
                      )}

                      {block.image_url && (
                        <figure className="mt-8 mb-4">
                          <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                            <Image src={block.image_url} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt={block.image_caption || block.subheading || 'Article figure'} fill className="object-cover" />
                          </div>
                          {block.image_caption && (
                            <figcaption className="mt-3 text-sm text-center text-gray-500 font-medium">
                              {block.image_caption}
                            </figcaption>
                          )}
                        </figure>
                      )}
                    </section>
                  ))}
                </div>
              ) : (
                // 2. Fallback to old HTML string if blocks aren't available yet
                article.content && (
                  <div 
            className="
    text-gray-700 leading-relaxed text-lg 
    [&>p]:mb-6 [&>p:last-of-type]:mb-0 
    [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-gray-900
    [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-8 [&>h2]:text-gray-900
    [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:mt-6 [&>h3]:text-gray-900
    [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2
    [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-2
    [&>blockquote]:border-l-4 [&>blockquote]:border-[#E31E24] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:mb-6 [&>blockquote]:bg-gray-50 [&>blockquote]:py-2 [&>blockquote]:pr-4
    [&>a]:text-[#E31E24] [&>a]:font-medium hover:[&>a]:underline
  "
  dangerouslySetInnerHTML={{ __html: article.content }}
/>
                )
              )}
            </div>

            {/* Post-Article Divider */}
            <div className="my-12 flex items-center justify-center gap-2 text-gray-300">
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
            </div>

            {/* DATALABS COMPANY CARD (Inline at the bottom for flow) */}
            {article.company_id && (
              <div className="mb-12">
                <CompanyDataCard companyId={article.company_id} />
              </div>
            )}
          </article>

          {/* RIGHT: DataLabs Sidebar */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24">
              <FundingSidebarWidget />
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}