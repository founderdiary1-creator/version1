'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, ArrowRight } from 'lucide-react';
import { useStickyNav } from '@/hooks/useStickyNav';
import { useAuth } from '@/hooks/useAuth';
import { useState, useRef, useEffect } from 'react';

export function MainNav() {
  const isScrolled = useStickyNav(100);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Search State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus the search input automatically when the search bar opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Updated to point to the new dynamic category architecture
  const mainLinks = [
    { label: 'News', href: '/category/news' },
    { label: 'In-Depth', href: '/category/in-depth' },
    { label: 'Startups', href: '/category/startups' },
    { label: "India's AI Economy", href: '/category/ai-economy' },
    { label: 'Markets', href: '/category/markets' },
    { label: 'Founder Story', href: '/category/founder-story' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav
        className={`bg-[#E31E24] h-16 flex items-center sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between relative">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center whitespace-nowrap shrink-0 relative z-10">
            <div className="relative h-10 w-10 bg-white rounded-full p-0.5 shadow-sm overflow-hidden flex items-center justify-center">
              <Image
                src="/images/logo2.png"
                alt="Founder Diary Logo"
                fill
                sizes="40px"
                className="object-contain p-1"
              />
            </div>
            <span className="ml-2.5 text-white font-black text-[15px] hidden sm:inline tracking-widest">
              FOUNDER DIARY
            </span>
          </Link>

          {/* Desktop Nav Links & Search Takeover (Absolute overlay for smooth transitions) */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8 relative h-full">
            
            {/* Standard Links */}
            <div className={`flex items-center gap-6 transition-all duration-300 absolute ${searchOpen ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 translate-y-0'}`}>
              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="relative py-2 group"
                  >
                    <span className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                      {link.label}
                    </span>
                    {/* Premium Active Indicator */}
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full opacity-50'}`} />
                  </Link>
                );
              })}
            </div>

            {/* Search Input Takeover */}
            <form 
              onSubmit={handleSearchSubmit}
              className={`w-full max-w-2xl flex items-center transition-all duration-300 absolute ${searchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-2'}`}
            >
              <div className="relative w-full flex items-center">
                <Search size={18} className="absolute left-4 text-white/50" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, startups, or founders..."
                  className="w-full bg-black/20 text-white placeholder:text-white/50 border border-white/20 rounded-full py-2.5 pl-11 pr-12 focus:outline-none focus:bg-black/30 focus:border-white/40 transition-all backdrop-blur-sm text-sm font-medium"
                />
                {searchQuery && (
                  <button type="submit" className="absolute right-2 p-1.5 bg-white text-[#E31E24] rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowRight size={14} strokeWidth={3} />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 relative z-10">
            {/* Search Toggle Button */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full transition-colors hidden lg:flex items-center justify-center ${searchOpen ? 'bg-black/20 text-white' : 'text-white hover:bg-white/10'}`}
              aria-label="Toggle search"
            >
              {searchOpen ? <X size={18} strokeWidth={2.5} /> : <Search size={18} strokeWidth={2.5} />}
            </button>

            {/* Auth Actions */}
            {user ? (
              <button
                onClick={signOut}
                className="bg-white/10 text-white border border-white/20 text-xs font-bold px-4 py-2 rounded-full hover:bg-white hover:text-[#E31E24] transition-all hidden sm:block tracking-wide"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="bg-white text-[#E31E24] text-xs font-bold px-5 py-2 rounded-full hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 transition-all hidden sm:block tracking-wide"
              >
                LOGIN
              </Link>
            )}

            <Link
              href="/plus"
              className="bg-[#1A1A1A] text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-black hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap hidden md:flex items-center gap-1.5 tracking-wide border border-black/50"
            >
              JOIN PLUS
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-1 lg:hidden">
              <button 
                onClick={() => { setSearchOpen(true); setMobileOpen(true); }}
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Search size={20} />
              </button>
              <button
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Premium Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] bg-[#1A1A1A] z-[101] transform transition-transform duration-300 ease-out lg:hidden flex flex-col shadow-2xl ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="bg-[#E31E24] px-5 py-4 flex items-center justify-between">
          <span className="text-white font-black text-sm tracking-widest">MENU</span>
          <button
            className="text-white p-1 hover:bg-black/20 rounded-full transition-colors"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="p-5 border-b border-white/10">
          <form onSubmit={(e) => { handleSearchSubmit(e); setMobileOpen(false); }} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-lg py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-[#E31E24] transition-colors"
            />
          </form>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 overflow-y-auto py-2">
          {mainLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-6 py-4 text-sm font-bold tracking-widest uppercase transition-colors border-b border-white/5 ${
                  isActive ? 'text-[#E31E24] bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#E31E24]" />}
              </Link>
            );
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 space-y-3 bg-black/20 border-t border-white/5">
          {user ? (
            <button
              onClick={() => { signOut(); setMobileOpen(false); }}
              className="w-full bg-white/10 text-white text-xs font-bold tracking-widest py-3.5 rounded-xl hover:bg-white/20 transition-colors"
            >
              LOGOUT
            </button>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-white text-[#E31E24] text-xs font-bold tracking-widest py-3.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              LOGIN TO ACCOUNT
            </Link>
          )}
          <Link
            href="/plus"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center bg-[#E31E24] text-white text-xs font-bold tracking-widest py-3.5 rounded-xl hover:bg-[#C41A20] transition-colors"
          >
            JOIN FD PLUS
          </Link>
        </div>
      </div>
    </>
  );
}