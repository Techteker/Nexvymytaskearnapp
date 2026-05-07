import React from 'react';
import { Navigation } from './Navigation';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen mesh-gradient relative">
      <div className="absolute inset-0 mesh-overlay pointer-events-none opacity-20" />
      <main className="max-w-md mx-auto pb-32 pt-6 px-4 relative min-h-screen">
        {children}
      </main>
      <Navigation />
    </div>
  );
};
