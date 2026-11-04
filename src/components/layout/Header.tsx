import React from 'react';
import { Menu, ShieldAlert, Cpu } from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'results' | 'history';
  onOpenMobileSidebar: () => void;
  isMockMode: boolean;
  onToggleMockMode?: () => void;
  activeTitle?: string;
}

export function Header({
  currentTab,
  onOpenMobileSidebar,
  isMockMode,
  onToggleMockMode,
  activeTitle,
}: HeaderProps) {
  const tabTitles: Record<string, string> = {
    dashboard: 'VERIFICATION COCKPIT',
    results: 'EVIDENCE EXTRACTION MATRIX',
    history: 'VERIFICATION REGISTRY',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[rgba(236,228,180,0.15)] bg-[#080808]/90 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded p-2 text-[#ECE4B4] hover:bg-[rgba(255,255,255,0.05)] md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-michroma text-[10px] uppercase tracking-widest text-[#B9B49B]">
              VERITRACE //
            </span>
            <span className="font-michroma text-xs tracking-wider text-[#ECE4B4]">
              {tabTitles[currentTab] || currentTab.toUpperCase()}
            </span>
          </div>
          {activeTitle && currentTab === 'results' && (
            <span className="max-w-[280px] md:max-w-[450px] truncate text-[11px] text-[#B9B49B]/80 font-mono">
              {activeTitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Mock / Live State Pill */}
        <button
          onClick={onToggleMockMode}
          title="Click to toggle Mock / Live mode"
          className="flex items-center space-x-1.5 rounded border border-[rgba(236,228,180,0.22)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1 text-xs transition-all hover:border-[rgba(236,228,180,0.4)]"
        >
          {isMockMode ? (
            <>
              <span className="h-2 w-2 rounded-full bg-[#FBBF24] animate-ping" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#FBBF24]">
                MOCK MODE (STANDALONE)
              </span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#4ADE80]">
                API CONNECTED
              </span>
            </>
          )}
        </button>

        <div className="hidden sm:flex items-center space-x-1 rounded border border-[rgba(236,228,180,0.1)] px-2 py-1 text-[10px] font-mono text-[#B9B49B]/70">
          <Cpu className="h-3 w-3 text-[#ECE4B4]" />
          <span>V1.0</span>
        </div>
      </div>
    </header>
  );
}
