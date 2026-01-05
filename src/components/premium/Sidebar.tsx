import React from 'react';
import { Plus, LogOut } from 'lucide-react';
import { AppleEmoji } from '../AppleEmoji';

type ViewId = string;

interface NavItem {
  id: ViewId;
  emoji: string;
  label: string;
  group?: 'tools' | 'guides';
}

interface SidebarProps {
  navItems: NavItem[];
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  lang: string;
  isGuest?: boolean;
  onLogout?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  navItems,
  activeView,
  onNavigate,
  lang,
  isGuest = false,
  onLogout,
  collapsed = false,
}: SidebarProps) {
  // Separate items into groups
  const toolItems = navItems.filter(item => item.group === 'tools');
  const guideItems = navItems.filter(item => item.group === 'guides');
  const otherItems = navItems.filter(item => !item.group);

  const renderNavItem = (item: NavItem) => {
    const isActive = activeView === item.id;
    
    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={`
          group relative w-full flex items-center gap-3.5 px-3.5 py-3 rounded-[var(--radius-lg)]
          text-[15px] font-medium
          transition-all duration-[var(--duration-fast)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30
          ${isActive 
            ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' 
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)]'
          }
        `}
      >
        {/* Active Indicator Bar - Removed for cleaner look */}
        
        <div className={`
          flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)]
          transition-colors duration-[var(--duration-fast)]
          ${isActive 
            ? 'bg-white/20 dark:bg-black/10' 
            : 'bg-[var(--color-surface-secondary)] group-hover:bg-[var(--color-surface-tertiary)]'
          }
        `}>
          <AppleEmoji emoji={item.emoji} className="w-[18px] h-[18px]" />
        </div>
        
        {!collapsed && (
          <span className="truncate flex-1 text-left">{item.label}</span>
        )}
      </button>
    );
  };

  const renderGroup = (title: string, items: NavItem[]) => {
    if (items.length === 0) return null;
    
    return (
      <div className="space-y-1">
        {!collapsed && (
          <div className="px-3 py-2 text-[var(--text-micro)] font-semibold text-[var(--color-text-quaternary)] uppercase tracking-[var(--tracking-widest)]">
            {title}
          </div>
        )}
        {items.map(renderNavItem)}
      </div>
    );
  };

  return (
    <aside className={`
      flex flex-col h-full bg-[var(--color-bg-elevated)] border-r border-[var(--color-border-primary)]
      transition-[width] duration-[var(--duration-normal)] ease-[var(--ease-default)]
      ${collapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width)]'}
    `}>
      {/* Header / Brand */}
      <div className="p-4 border-b border-[var(--color-border-primary)]">
        <a 
          href="https://www.instagram.com/baaa.14_"
          target="_blank"
          rel="noopener noreferrer"
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]
            text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)]
            transition-colors duration-[var(--duration-fast)]
          `}
        >
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-primary-subtle)] flex items-center justify-center">
            <AppleEmoji emoji="💬" className="w-4 h-4" />
          </div>
          {!collapsed && (
            <span className="text-[var(--text-body)] font-bold tracking-tight">@baaa.14_</span>
          )}
        </a>
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-2">
        <button className={`
          w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)]
          bg-[var(--color-primary)] text-white
          text-[var(--text-body-sm)] font-semibold
          hover:bg-[var(--color-primary-hover)]
          active:scale-[0.98]
          transition-all duration-[var(--duration-fast)]
          ${collapsed ? 'justify-center' : ''}
        `}>
          <Plus size={16} strokeWidth={2.5} />
          {!collapsed && <span>{lang === 'EN' ? 'New Course' : '+新增課程'}</span>}
        </button>
        
        <button className={`
          w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)]
          bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]
          text-[var(--text-body-sm)] font-medium
          hover:bg-[var(--color-surface-tertiary)] hover:text-[var(--color-text-primary)]
          active:scale-[0.98]
          transition-all duration-[var(--duration-fast)]
          ${collapsed ? 'justify-center' : ''}
        `}>
          <Plus size={16} />
          {!collapsed && <span>{lang === 'EN' ? 'New Deck' : '+新增卡組'}</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin">
        {renderGroup(lang === 'EN' ? 'Tools' : '工具', toolItems)}
        {renderGroup(lang === 'EN' ? 'Guides' : '指南', guideItems)}
        {otherItems.length > 0 && (
          <div className="space-y-1">
            {otherItems.map(renderNavItem)}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--color-border-primary)]">
        {!isGuest && onLogout && (
          <button
            onClick={onLogout}
            className={`
              w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)]
              text-[var(--text-body-sm)] text-[var(--color-text-tertiary)]
              hover:text-[var(--color-error)] hover:bg-[var(--color-error-subtle)]
              transition-colors duration-[var(--duration-fast)]
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut size={16} />
            {!collapsed && <span>{lang === 'EN' ? 'Log out' : '登出'}</span>}
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
