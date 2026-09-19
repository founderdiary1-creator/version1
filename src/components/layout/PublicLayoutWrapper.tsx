'use client';

import { usePathname } from 'next/navigation';
import { MainNav } from './MainNav';
import { Footer } from './Footer';

export function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDistractionFree = pathname?.startsWith('/admin') || pathname?.startsWith('/onboarding');

  return (
    <>
      {!isDistractionFree && <MainNav />}
      <main className="flex-1">{children}</main>
      {!isDistractionFree && <Footer />}
    </>
  );
}
