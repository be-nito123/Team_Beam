import React from 'react';
import { Menu, Sun, Moon, Sparkles, Files, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Theme } from '@/hooks/useTheme';

export type ProductModule = 'ai-verification' | 'plagiarism';

interface HeaderProps {
  activeModule: ProductModule;
  onSwitchModule: (module: ProductModule) => void;
  currentTab: 'dashboard' | 'results' | 'history';
  onOpenMobileSidebar: () => void;
  isMockMode: boolean;
  onToggleMockMode?: () => void;
  activeTitle?: string;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({
  activeModule,
  onSwitchModule,
  currentTab,
  onOpenMobileSidebar,
  isMockMode,
  onToggleMockMode,
  activeTitle,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const aiTabTitles: Record<string, string> = {
    dashboard: 'VERIFICATION COCKPIT',
    results: 'EVIDENCE EXTRACTION MATRIX',
    history: 'VERIFICATION REGISTRY',
  };

  const plagTabTitles: Record<string, string> = {
    dashboard: 'SIMILARITY COCKPIT',
    results: 'ORIGINALITY AUDIT REPORT',
    history: 'PLAGIARISM REGISTRY',
  };

  const currentModuleTitle =
    activeModule === 'ai-verification'
      ? aiTabTitles[currentTab] || currentTab.toUpperCase()
      : plagTabTitles[currentTab] || currentTab.toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[var(--border-muted)] bg-[var(--header-bg)] px-4 py-2 backdrop-blur-md transition-colors duration-250 md:px-6 xl:px-8">
      
      {/* Left: Mobile Sidebar Trigger & Breadcrumbs */}
      <div className="flex min-w-0 flex-1 items-center space-x-3">
        <button
          onClick={onOpenMobileSidebar}
          className="min-h-11 min-w-11 shrink-0 rounded p-2 text-[var(--text-primary)] hover:bg-[var(--card-surface)] xl:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 flex-col">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 font-michroma text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
              VERITRACE //
            </span>
            <span title={currentModuleTitle} className="min-w-0 truncate font-michroma text-xs tracking-wider text-[var(--text-primary)]">
              {currentModuleTitle}
            </span>
          </div>
          {activeTitle && currentTab === 'results' && (
            <span title={activeTitle} className="max-w-[56vw] truncate text-[11px] text-[var(--text-secondary)] font-mono xl:max-w-[320px]">
              {activeTitle}
            </span>
          )}
        </div>
      </div>

      {/* Center: PRODUCT SWITCHER TABS */}
      <div className="hidden shrink-0 items-center rounded-lg border border-[var(--border-color)] bg-[var(--card-surface)] p-1 xl:flex">
        <button
          type="button"
          onClick={() => onSwitchModule('ai-verification')}
          className={cn(
            'flex items-center space-x-2 rounded-md px-3.5 py-1.5 font-michroma text-[11px] font-semibold uppercase tracking-wider transition-all duration-200',
            activeModule === 'ai-verification'
              ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI VERIFICATION</span>
        </button>

        <button
          type="button"
          onClick={() => onSwitchModule('plagiarism')}
          className={cn(
            'flex items-center space-x-2 rounded-md px-3.5 py-1.5 font-michroma text-[11px] font-semibold uppercase tracking-wider transition-all duration-200',
            activeModule === 'plagiarism'
              ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          )}
        >
          <Files className="h-3.5 w-3.5" />
          <span>PLAGIARISM CHECKER</span>
        </button>
      </div>

      {/* Right: Theme Toggle & Status Pills */}
      <div className="flex items-center space-x-2.5">
        {/* Mock/Live State Pill for AI verification */}
        {activeModule === 'ai-verification' && (
          <button
            onClick={onToggleMockMode}
            title="Toggle Mock / Live verification mode"
            className="hidden md:flex items-center space-x-1.5 rounded border border-[var(--border-muted)] bg-[var(--card-surface)] px-2.5 py-1 text-xs transition-all hover:border-[var(--border-hover)]"
          >
            {isMockMode ? (
              <>
                <span className="h-2 w-2 rounded-full bg-[var(--status-unsupported)] animate-ping" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--status-unsupported)]">
                  MOCK MODE
                </span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-[var(--status-supported)]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--status-supported)]">
                  API LIVE
                </span>
              </>
            )}
          </button>
        )}

        {/* Sun / Moon Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--card-surface)] text-[var(--text-primary)] transition-all hover:border-[var(--border-hover)] hover:bg-[var(--panel-bg)] active:scale-95 shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-[var(--text-primary)] transition-transform hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-[var(--text-primary)] transition-transform hover:-rotate-12" />
          )}
        </button>
      </div>
    </header>
  );
}
