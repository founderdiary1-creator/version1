'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shield, LayoutDashboard, Settings, FileText, ClipboardList, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      // Access denied handled below
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-md p-8 text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-[#E31E24]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {!user ? 'Authentication Required' : 'Access Denied'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {!user 
              ? 'You need to be logged in as an admin to access this page.' 
              : "You don't have admin privileges. Contact an administrator to get access."}
          </p>
          <Link 
            href={!user ? "/auth/login" : "/"} 
            className="inline-block bg-[#E31E24] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#C41A20] transition-colors"
          >
            {!user ? 'Go to Login' : 'Back to Home'}
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Articles', href: '/admin/editor', icon: FileText },
    { name: 'Onboarding Builder', href: '/admin/onboarding-builder', icon: ClipboardList },
    { name: 'Layout Editor', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] lg:shadow-none`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 shrink-0">
          <Link href="/admin" className={`flex items-center gap-2 font-bold text-xl text-gray-900 ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <span className="text-[#E31E24] bg-red-50 p-1.5 rounded-lg">FD</span>
            {!isCollapsed && <span>Admin</span>}
          </Link>
          <button 
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-red-50 text-[#E31E24] font-semibold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`}
                title={isCollapsed ? item.name : undefined}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon size={20} className={`shrink-0 ${isActive ? 'text-[#E31E24]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
          
          <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-2">
            <Link 
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all font-medium"
              title={isCollapsed ? "Back to Public Site" : undefined}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-400 group-hover:text-gray-600"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              {!isCollapsed && <span>Back to Site</span>}
            </Link>
          </div>
        </div>

        {/* Collapse toggle (Desktop only) */}
        <div className="hidden lg:flex p-4 border-t border-gray-100 shrink-0">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-full ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Menu size={20} className="shrink-0" />
            {!isCollapsed && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center px-4 shrink-0 shadow-sm z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 -ml-2"
          >
            <Menu size={24} />
          </button>
          <span className="ml-2 font-bold text-gray-900">Admin Dashboard</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
