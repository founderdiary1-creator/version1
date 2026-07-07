'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchSearchResults, fetchTrendingData } from '@/app/actions/search.actions';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, SearchX } from 'lucide-react';
import SearchResultCard from './SearchResultCard';
import SearchEmptyState from './SearchEmptyState';

export default function SearchClientView({ initialQuery }: { initialQuery: string }) {
  const searchParams = useSearchParams();
  // Get real-time query from URL, fallback to initial server query
  const query = searchParams.get('q') || initialQuery;

  // 1. Fetch Trending Data (Only runs if query is empty)
  const { data: trendingData, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trending-search-data'],
    queryFn: fetchTrendingData,
    enabled: !query, 
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  // 2. Fetch Search Results (Only runs if query exists)
  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetchSearchResults(query),
    enabled: !!query,
    staleTime: 1000 * 60, // Cache searches for 1 min for instant back-navigation
  });

  return (
    <div className="w-full relative">
      {/* Header section that reacts to state */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight transition-all">
          {query ? (
            <>
              Search results for <span className="text-[#E31E24]">"{query}"</span>
            </>
          ) : (
            'Explore Founder Diary'
          )}
        </h1>
        {isSearching && query && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-[#E31E24]" />
            Searching database...
          </div>
        )}
        {!isSearching && query && searchResults && (
          <p className="text-sm text-gray-500 mt-4 font-medium">
            Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
          </p>
        )}
      </div>

      {/* Smoothly transition between Empty State and Results */}
      <AnimatePresence mode="wait">
        {!query ? (
          // EMPTY STATE (Trending)
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <SearchEmptyState data={trendingData} isLoading={isTrendingLoading} />
          </motion.div>
        ) : searchResults?.length === 0 && !isSearching ? (
          // NO RESULTS STATE
          <motion.div
            key="no-results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No matching stories found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find anything matching "{query}". Try checking your spelling or searching for a broader term.
            </p>
          </motion.div>
        ) : (
          // RESULTS GRID
          <motion.div
            key="results-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {searchResults?.map((article, index) => (
              <SearchResultCard key={article.slug} article={article} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}