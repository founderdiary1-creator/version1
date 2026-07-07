'use client';

import { MouseEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface SpotlightCardProps {
  href: string;
  name: string;
  description: string | null;
  icon: LucideIcon;
  isHero?: boolean; // Used to emphasize the very first block
  onClick?: () => void;
}

export function SpotlightCard({ 
  href, 
  name, 
  description, 
  icon: Icon, 
  isHero = false, 
  onClick 
}: SpotlightCardProps) {
  const divRef = useRef<HTMLAnchorElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => { setIsFocused(true); setOpacity(1); };
  const handleBlur = () => { setIsFocused(false); setOpacity(0); };
  const handleMouseEnter = () => { setOpacity(1); };
  const handleMouseLeave = () => { setOpacity(0); };

  return (
    <Link
      ref={divRef}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col h-full w-full overflow-hidden rounded-[1.5rem] bg-white border border-gray-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-900/10 hover:border-red-200"
    >
      {/* The Dynamic Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 z-0"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(227, 30, 36, 0.06), transparent 40%)`,
        }}
      />

      {/* Fluid padding based on whether it's the hero block or standard block */}
      <div className={`relative z-10 flex flex-col h-full justify-between ${isHero ? 'p-6 sm:p-8' : 'p-4 sm:p-5 md:p-6'}`}>
        
        {/* Top Section: Icon & Arrow */}
        <div className="flex items-start justify-between">
          <div className={`rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100/50 transition-all duration-500 group-hover:bg-red-50 group-hover:border-red-100 group-hover:scale-110 ${isHero ? 'w-12 h-12' : 'w-10 h-10'}`}>
            <Icon className={`${isHero ? 'w-6 h-6' : 'w-5 h-5'} text-gray-400 transition-colors duration-500 group-hover:text-[#E31E24]`} />
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-all duration-300 group-hover:bg-[#E31E24]">
            <ArrowRight className="w-4 h-4 text-gray-400 transition-colors duration-300 group-hover:text-white -rotate-45 group-hover:rotate-0" />
          </div>
        </div>

        {/* Bottom Section: Text */}
        <div className="mt-4">
          <h3 className={`font-extrabold text-gray-900 transition-colors group-hover:text-[#E31E24] leading-tight ${
            isHero ? 'text-2xl sm:text-3xl mb-2' : 'text-base sm:text-lg lg:text-xl'
          }`}>
            {name}
          </h3>
          
          {/* Hide descriptions on very small cards to keep the UI exceptionally clean */}
          <p className={`text-gray-500 font-medium leading-relaxed mt-1.5 sm:mt-2 line-clamp-2 ${
            isHero ? 'text-sm sm:text-base max-w-sm' : 'text-xs sm:text-sm hidden sm:line-clamp-2'
          }`}>
            {description || `Explore breaking news, data, and deep analysis on ${name}.`}
          </p>
        </div>
      </div>
    </Link>
  );
}