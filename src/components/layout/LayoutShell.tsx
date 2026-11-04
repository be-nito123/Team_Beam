import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { HistorySession, VerificationStatus } from '@/types/verification';

interface LayoutShellProps {
  currentTab: 'dashboard' | 'results' | 'history';
  onNavigate: (tab: 'dashboard' | 'results' | 'history') => void;
  onNewAnalysis: () => void;
  recentSessions: HistorySession[];
  onSelectSession: (id: string) => void;
  selectedSessionId?: string;
  onFilterByStatus?: (status: VerificationStatus) => void;
  isMockMode: boolean;
  onToggleMockMode?: () => void;
  activeTitle?: string;
  children: React.ReactNode;
}

export function LayoutShell({
  currentTab,
  onNavigate,
  onNewAnalysis,
  recentSessions,
  onSelectSession,
  selectedSessionId,
  onFilterByStatus,
  isMockMode,
  onToggleMockMode,
  activeTitle,
  children,
}: LayoutShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#080808] text-[#ECE4B4]">
      {/* Sidebar - fixed on desktop, drawer on mobile */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={onNavigate}
        onNewAnalysis={onNewAnalysis}
        recentSessions={recentSessions}
        onSelectSession={onSelectSession}
        selectedSessionId={selectedSessionId}
        onFilterByStatus={onFilterByStatus}
        isMockMode={isMockMode}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (offset by 265px on md+ screens) */}
      <div className="flex flex-1 flex-col md:pl-[265px] min-h-screen w-full overflow-x-hidden">
        <Header
          currentTab={currentTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isMockMode={isMockMode}
          onToggleMockMode={onToggleMockMode}
          activeTitle={activeTitle}
        />

        <main className="flex-1 flex flex-col w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
}
