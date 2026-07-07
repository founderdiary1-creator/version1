'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '@/hooks/useCategories';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { 
  Brain, FlaskConical, ShoppingBag, ShoppingCart, 
  GraduationCap, Building2, CreditCard, Users, 
  BookOpenText, TrendingUp, Newspaper, Rocket, Hash 
} from 'lucide-react';

interface SearchCategoryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. Precise Icon Mapping
const getIconForSlug = (slug: string) => {
  const iconMap: Record<string, any> = {
    'ai-economy': Brain,
    'brandlabs': FlaskConical,
    'consumer-services': ShoppingBag,
    'ecommerce': ShoppingCart,
    'edtech': GraduationCap,
    'enterprise-tech': Building2,
    'fintech': CreditCard,
    'founder-story': Users,
    'in-depth': BookOpenText,
    'markets': TrendingUp,
    'news': Newspaper,
    'startups': Rocket,
  };
  return iconMap[slug] || Hash;
};

// 2. The Responsive Tetris Matrix
// Default = Mobile (2 cols), sm = Tablet (3 cols), lg = Desktop (4 cols)
const getBentoConfig = (index: number): string => {
  switch(index) {
    case 0: return 'col-span-2 row-span-1 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2'; // Hero
    case 1: return 'col-span-1 row-span-1 sm:col-span-1 sm:row-span-2 lg:col-span-2 lg:row-span-1';
    case 2: return 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1 lg:col-span-1 lg:row-span-2';
    case 3: return 'col-span-2 row-span-1 sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1';
    case 4: return 'col-span-1 row-span-1 sm:col-span-3 sm:row-span-1 lg:col-span-2 lg:row-span-1';
    case 5: return 'col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1';
    case 6: return 'col-span-2 row-span-1 sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1';
    case 7: return 'col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1';
    case 8: return 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1 lg:col-span-1 lg:row-span-1';
    case 9: return 'col-span-2 row-span-1 sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1';
    case 10: return 'col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 lg:col-span-2 lg:row-span-1';
    case 11: return 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1 lg:col-span-2 lg:row-span-1';
    default: return 'col-span-1 row-span-1';
  }
};

export function SearchCategoryOverlay({ isOpen, onClose }: SearchCategoryOverlayProps) {
  const { data: categories, isLoading } = useCategories();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const overlayVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(12px)', transition: { duration: 0.4 } },
    exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.3, delay: 0.1 } }
  } as const;

  const containerVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1], staggerChildren: 0.04 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: 'easeIn' } }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  } as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 top-16 z-30 bg-black/40"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // Mobile gets scrollable max-height, desktop keeps it contained cleanly
            className="fixed top-16 left-0 right-0 z-40 bg-white/90 backdrop-blur-3xl border-b border-gray-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] origin-top overflow-y-auto max-h-[calc(100vh-64px)]"
          >
            {/* Fluid padding for different devices */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">
              
              <motion.div variants={itemVariants} className="mb-8 sm:mb-10 text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                  Explore Ecosystem
                </h2>
                <p className="text-sm sm:text-base text-gray-500 font-medium mt-1.5 sm:mt-2 max-w-lg">
                  Select a category to uncover exclusive data, breaking news, and inside founder stories.
                </p>
              </motion.div>

              {/* THE BENTO GRID: Notice grid-cols-2 for mobile, scaling up to 4 for desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 auto-rows-[120px] sm:auto-rows-[130px] lg:auto-rows-[140px] grid-flow-row-dense pb-8">
                
                {isLoading ? (
                  Array.from({ length: 12 }).map((_, index) => (
                    <motion.div 
                      key={`skeleton-${index}`} 
                      variants={itemVariants}
                      className={`rounded-[1.5rem] bg-gray-100/80 animate-pulse ${getBentoConfig(index)}`}
                    />
                  ))
                ) : (
                  categories?.map((cat, index) => (
                    <motion.div 
                      key={cat.id} 
                      variants={itemVariants} 
                      className={`w-full h-full ${getBentoConfig(index)}`}
                    >
                      <SpotlightCard
                        href={`/category/${cat.slug}`}
                        name={cat.name}
                        description={cat.description}
                        icon={getIconForSlug(cat.slug)}
                        isHero={index === 0}
                        onClick={onClose}
                      />
                    </motion.div>
                  ))
                )}
              </div>
              
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}