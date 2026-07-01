'use client';

import Link from 'next/link';

export function TopNav() {
  const links = [
    { label: 'MEDIA', href: '/news' },
    { label: 'REPORTS', href: '/features' },
    { label: 'EVENTS', href: '#' },
    { label: 'COURSES', href: '#', hasDropdown: true },
    { label: 'BRANDLABS', href: '#' },
    { label: 'ABOUT', href: '#' },
    { label: 'D2C RETAIL & SUMMIT 2026', href: '#', isNew: true },
    { label: 'DATALABS', href: '/datalabs', isNew: true },
  ];

  return (
    <nav className="bg-[#1A1A1A] h-10 flex items-center sticky top-0 z-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-4 min-w-max">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white text-[10px] sm:text-xs font-medium tracking-[0.03em] hover:text-white/80 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              {link.label}
              {link.hasDropdown && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
              {link.isNew && (
                <span className="bg-[#E31E24] text-white text-[9px] font-bold px-1 py-0.5 rounded ml-0.5">NEW</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
