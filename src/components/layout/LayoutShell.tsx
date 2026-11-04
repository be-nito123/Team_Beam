import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header, ProductModule } from './Header';
import { HistorySession, VerificationStatus } from '@/types/verification';
import { PlagiarismSession } from '@/types/plagiarism';
import { Theme } from '@/hooks/useTheme';

interface LayoutShellProps {
  activeModule: ProductModule;
  onSwitchModule: (module: ProductModule) => void;
  currentTab: 'dashboard' | 'results' | 'history';
  onNavigate: (tab: 'dashboard' | 'results' | 'history') => void;
  onNewAction: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  
  // AI Verification state
  recentAiSessions: HistorySession[];
  onSelectAiSession: (id: string) => void;
  selectedAiSessionId?: string;
  onFilterByStatus?: (status: VerificationStatus) => void;
  isMockMode: boolean;
  onToggleMockMode?: () => void;
  activeAiTitle?: string;

  // Plagiarism state
  recentPlagiarismSessions: PlagiarismSession[];
  onSelectPlagiarismSession: (id: string) => void;
  selectedPlagiarismSessionId?: string;
  activePlagiarismTitle?: string;

  children: React.ReactNode;
}

export function LayoutShell({
  activeModule,
  onSwitchModule,
  currentTab,
  onNavigate,
  onNewAction,
  theme,
  onToggleTheme,
  recentAiSessions,
  onSelectAiSession,
  selectedAiSessionId,
  onFilterByStatus,
  isMockMode,
  onToggleMockMode,
  activeAiTitle,
  recentPlagiarismSessions,
  onSelectPlagiarismSession,
  selectedPlagiarismSessionId,
  activePlagiarismTitle,
  children,
}: LayoutShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const activeTitle =
    activeModule === 'ai-verification' ? activeAiTitle : activePlagiarismTitle;

  return (
    <div className="flex min-h-screen w-full bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-250">
      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onSwitchModule={onSwitchModule}
        currentTab={currentTab}
        onNavigate={onNavigate}
        onNewAction={onNewAction}
        recentAiSessions={recentAiSessions}
        onSelectAiSession={onSelectAiSession}
        selectedAiSessionId={selectedAiSessionId}
        onFilterByStatus={onFilterByStatus}
        isMockMode={isMockMode}
        recentPlagiarismSessions={recentPlagiarismSessions}
        onSelectPlagiarismSession={onSelectPlagiarismSession}
        selectedPlagiarismSessionId={selectedPlagiarismSessionId}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-[265px] min-h-screen w-full overflow-x-hidden">
        <Header
          activeModule={activeModule}
          onSwitchModule={onSwitchModule}
          currentTab={currentTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isMockMode={isMockMode}
          onToggleMockMode={onToggleMockMode}
          activeTitle={activeTitle}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />

        <main className="flex-1 flex flex-col w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
}
