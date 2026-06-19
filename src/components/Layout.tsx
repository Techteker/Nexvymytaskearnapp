import React from 'react';
import { Navigation } from './Navigation';
import { TopBar } from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
  wide?: boolean;
}

export const Layout = ({ children, wide = false }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] text-slate-900 relative">
      <main className={`${wide ? 'max-w-3xl md:max-w-4xl' : 'max-w-md'} mx-auto pb-32 pt-6 px-4 relative min-h-screen transition-all duration-300`}>
        <TopBar />
        {children}
      </main>
      <Navigation />
    </div>
  );
};
