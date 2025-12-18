import React, { useState } from 'react';
import { Search, Globe, Sun, Moon, User, ChevronDown, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface AppBarProps {
  title: string;
  breadcrumb?: string;
  lang: string;
  onToggleLang: () => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function AppBar({ 
  title, 
  breadcrumb, 
  lang, 
  onToggleLang,
  onMenuClick,
  showMenuButton = false
}: AppBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] h-[var(--appbar-height)] md:h-[var(--appbar-height)] bg-[var(--color-bg-elevated)]/80 backdrop-blur-xl border-b border-[var(--color-border-primary)]">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Menu + Breadcrumb + Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 -ml-2 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          )}
          
          <div className="min-w-0">
            {breadcrumb && (
              <div className="text-[var(--text-caption)] text-[var(--color-text-quaternary)] truncate">
                {breadcrumb}
              </div>
            )}
            <h1 className="text-[var(--text-h4)] font-semibold text-[var(--color-text-primary)] truncate tracking-tight">
              {title}
            </h1>
          </div>
        </div>
        
        {/* Center: Global Search */}
        <div className="hidden md:flex flex-1 max-w-md justify-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-[var(--color-text-quaternary)]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'EN' ? 'Search...' : '搜尋...'}
              className="w-full h-9 pl-9 pr-4 rounded-[var(--radius-full)] bg-[var(--color-surface-secondary)] border-none text-[var(--text-body-sm)] text-[var(--color-text-primary)] placeholder-[var(--color-text-quaternary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-shadow"
            />
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          
          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-full)] text-[var(--text-caption)] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors"
          >
            <Globe size={14} />
            <span>{lang === 'EN' ? '中文' : 'EN'}</span>
          </button>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 p-4 bg-[var(--color-bg-elevated)] border-b border-[var(--color-border-primary)] animate-fade-in-down">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-[var(--color-text-quaternary)]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'EN' ? 'Search...' : '搜尋...'}
              autoFocus
              className="w-full h-10 pl-9 pr-10 rounded-[var(--radius-md)] bg-[var(--color-surface-secondary)] border-none text-[var(--text-body)] text-[var(--color-text-primary)] placeholder-[var(--color-text-quaternary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-quaternary)]"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default AppBar;
