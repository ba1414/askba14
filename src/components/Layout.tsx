import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[var(--color-bg-page)] text-[var(--color-text-primary)] transition-colors duration-300">
      
      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen pt-32 pb-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
