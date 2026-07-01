'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, X } from 'lucide-react';
import { useStickyNav } from '@/hooks/useStickyNav';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export function MainNav() {
  const isScrolled = useStickyNav(100);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const mainLinks = [
    { label: 'NEWS', href: '/news' },
    { label: 'IN-DEPTH', href: '/features' },
    { label: 'STARTUPS', href: '/news?category=startups' },
    { label: "INDIA'S AI ECONOMY", href: '/news?category=ai-economy' },
    { label: 'MARKETS', href: '/news?category=markets' },
    { label: 'DATALABS', href: '/datalabs' },
  ];

  return (
    <>
      <nav
        className={`bg-[#E31E24] h-14 flex items-center sticky top-0 z-40 transition-shadow duration-200 ${
          isScrolled ? 'shadow-[0_2px_8px_rgba(0,0,0,0.15)]' : ''
        }`}
      >
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center whitespace-nowrap shrink-0">
            <Image
              src="/images/logo2.png"
              alt="Founder Diary"
              width={40}
              height={40}
              className="h-10 w-10 object-contain rounded-full bg-white p-0.5"
            />
            <span className="ml-2 text-white font-bold text-sm hidden sm:inline tracking-wide">
              FOUNDER DIARY
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-4 flex-1 ml-8">
            {mainLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white text-xs font-medium tracking-[0.02em] hover:text-white/80 transition-colors flex items-center gap-0.5 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button className="text-white hover:text-white/80 transition-colors p-1">
              <Search size={18} />
            </button>
            {user ? (
              <button
                onClick={signOut}
                className="bg-white text-[#E31E24] text-xs font-semibold px-3 py-1.5 rounded hover:scale-[1.02] transition-transform hidden sm:block"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="bg-white text-[#E31E24] text-xs font-semibold px-3 py-1.5 rounded hover:scale-[1.02] transition-transform hidden sm:block"
              >
                LOGIN
              </Link>
            )}
            <Link
              href="/plus"
              className="bg-[#1A1A1A] text-white text-xs font-semibold px-3 py-1.5 rounded hover:scale-[1.02] transition-transform whitespace-nowrap hidden md:block"
            >
              JOIN PLUS
            </Link>
            <button
              className="lg:hidden text-white p-1 ml-1"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-[#1A1A1A] z-50 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="bg-[#E31E24] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo2.png"
              alt="Founder Diary"
              width={36}
              height={36}
              className="h-9 w-9 object-contain rounded-full bg-white p-0.5"
            />
            <span className="text-white font-bold text-sm tracking-wide">FOUNDER DIARY</span>
          </div>
          <button
            className="text-white p-1"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="py-4 overflow-y-auto">
          {mainLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-6 py-3.5 text-white/90 text-sm font-medium tracking-wide hover:bg-white/10 transition-colors border-b border-white/5"
            >
              {link.label}
            </Link>
          ))}

          <div className="px-6 pt-6 space-y-3">
            {user ? (
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="w-full bg-white text-[#E31E24] text-sm font-bold py-2.5 rounded hover:bg-gray-100 transition-colors"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-white text-[#E31E24] text-sm font-bold py-2.5 rounded hover:bg-gray-100 transition-colors"
              >
                LOGIN
              </Link>
            )}
            <Link
              href="/plus"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-[#E31E24] text-white text-sm font-bold py-2.5 rounded hover:bg-[#C41A20] transition-colors"
            >
              JOIN FOUNDER DIARY PLUS
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
