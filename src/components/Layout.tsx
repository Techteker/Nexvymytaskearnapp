import React from 'react';
import { Navigation } from './Navigation';
import { TopBar } from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
  wide?: boolean;
}

export const Layout = ({ children, wide = false }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#061340] via-[#091b5c] to-[#040d2d] text-slate-100 relative selection:bg-amber-500/30">
      {/* Abstract Background Ambient Light Spotlights */}
      <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[30%] rounded-full bg-[#1239B3] opacity-20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#1e1b4b] opacity-35 blur-[150px] pointer-events-none" />
      
      <main className={`${wide ? 'max-w-3xl md:max-w-4xl' : 'max-w-md'} mx-auto pb-32 pt-6 px-4 relative min-h-screen transition-all duration-300`}>
        <TopBar />
        {children}
      </main>
      <Navigation />
    </div>
  );
};
