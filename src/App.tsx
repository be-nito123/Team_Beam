import React, { useState, useEffect } from 'react';
import { LayoutShell } from '@/components/layout/LayoutShell';
import { ProductModule } from '@/components/layout/Header';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { ResultsView } from '@/components/results/ResultsView';
import { HistoryView } from '@/components/history/HistoryView';
import { PlagiarismDashboardView } from '@/components/plagiarism/PlagiarismDashboardView';
import { PlagiarismResultsView } from '@/components/plagiarism/PlagiarismResultsView';
import { PlagiarismHistoryView } from '@/components/plagiarism/PlagiarismHistoryView';
import { useVerification } from '@/hooks/useVerification';
import { usePlagiarism } from '@/hooks/usePlagiarism';
import { useTheme } from '@/hooks/useTheme';

const MODULE_STORAGE_KEY = 'veritrace-active-module';

export function App() {
  const { theme, toggleTheme } = useTheme();

  const [activeModule, setActiveModule] = useState<ProductModule>(() => {
    try {
      const saved = localStorage.getItem(MODULE_STORAGE_KEY);
      if (saved === 'ai-verification' || saved === 'plagiarism') return saved;
    } catch {}
    return 'ai-verification';
  });

  const handleSwitchModule = (module: ProductModule) => {
    setActiveModule(module);
    try {
      localStorage.setItem(MODULE_STORAGE_KEY, module);
    } catch {}
  };

  // AI Verification State & Handlers
  const {
    currentTab: aiTab,
    setCurrentTab: setAiTab,
    activeResult: aiActiveResult,
    recentSessions: aiRecentSessions,
    isLoading: aiLoading,
    error: aiError,
    clearError: aiClearError,
    isMockMode: aiMockMode,
    toggleMockMode: aiToggleMockMode,
    runVerification: aiRunVerification,
    selectSession: aiSelectSession,
    newAnalysis: aiNewAnalysis,
    filterByStatus: aiFilterByStatus,
    activeFilter: aiActiveFilter,
  } = useVerification();

  // Plagiarism State & Handlers
  const {
    currentTab: plagTab,
    setCurrentTab: setPlagTab,
    activeResult: plagActiveResult,
    sessions: plagSessions,
    isLoading: plagLoading,
    error: plagError,
    clearError: plagClearError,
    isBackendConnected: plagBackendConnected,
    endpoint: plagEndpoint,
    updateEndpoint: plagUpdateEndpoint,
    runPlagiarismCheck,
    selectSession: plagSelectSession,
    deleteSession: plagDeleteSession,
    newCheck: plagNewCheck,
    activeFilter: plagActiveFilter,
  } = usePlagiarism();

  const currentTab = activeModule === 'ai-verification' ? aiTab : plagTab;
  const handleNavigate = (tab: 'dashboard' | 'results' | 'history') => {
    if (activeModule === 'ai-verification') {
      setAiTab(tab);
    } else {
      setPlagTab(tab);
    }
  };

  const handleNewAction = () => {
    if (activeModule === 'ai-verification') {
      aiNewAnalysis();
    } else {
      plagNewCheck();
    }
  };

  return (
    <LayoutShell
      activeModule={activeModule}
      onSwitchModule={handleSwitchModule}
      currentTab={currentTab}
      onNavigate={handleNavigate}
      onNewAction={handleNewAction}
      theme={theme}
      onToggleTheme={toggleTheme}
      // AI Verification props
      recentAiSessions={aiRecentSessions}
      onSelectAiSession={aiSelectSession}
      selectedAiSessionId={aiActiveResult?.id}
      onFilterByStatus={aiFilterByStatus}
      isMockMode={aiMockMode}
      onToggleMockMode={aiToggleMockMode}
      activeAiTitle={aiActiveResult?.title}
      // Plagiarism props
      recentPlagiarismSessions={plagSessions}
      onSelectPlagiarismSession={plagSelectSession}
      selectedPlagiarismSessionId={plagActiveResult?.id}
      activePlagiarismTitle={plagActiveResult?.documentName}
    >
      {/* ================= AI VERIFICATION MODULE ================= */}
      {activeModule === 'ai-verification' && (
        <>
          {aiTab === 'dashboard' && (
            <DashboardView
              onRunVerification={aiRunVerification}
              isLoading={aiLoading}
              error={aiError}
              onClearError={aiClearError}
            />
          )}

          {aiTab === 'results' && aiActiveResult && (
            <ResultsView
              result={aiActiveResult}
              onBackToDashboard={() => setAiTab('dashboard')}
              initialFilter={aiActiveFilter}
            />
          )}

          {aiTab === 'results' && !aiActiveResult && (
            <DashboardView
              onRunVerification={aiRunVerification}
              isLoading={aiLoading}
              error="No active analysis selected. Enter claims below to execute verification."
              onClearError={aiClearError}
            />
          )}

          {aiTab === 'history' && (
            <HistoryView
              sessions={aiRecentSessions}
              onSelectSession={aiSelectSession}
              onNewAnalysis={aiNewAnalysis}
            />
          )}
        </>
      )}

      {/* ================= PLAGIARISM CHECKER MODULE ================= */}
      {activeModule === 'plagiarism' && (
        <>
          {plagTab === 'dashboard' && (
            <PlagiarismDashboardView
              onRunCheck={runPlagiarismCheck}
              isLoading={plagLoading}
              error={plagError}
              onClearError={plagClearError}
              isBackendConnected={plagBackendConnected}
              endpoint={plagEndpoint}
              onUpdateEndpoint={plagUpdateEndpoint}
            />
          )}

          {plagTab === 'results' && plagActiveResult && (
            <PlagiarismResultsView
              result={plagActiveResult}
              onBackToDashboard={() => setPlagTab('dashboard')}
              initialFilter={plagActiveFilter}
            />
          )}

          {plagTab === 'results' && !plagActiveResult && (
            <PlagiarismDashboardView
              onRunCheck={runPlagiarismCheck}
              isLoading={plagLoading}
              error="No active similarity report selected. Attach documents below to begin comparison."
              onClearError={plagClearError}
              isBackendConnected={plagBackendConnected}
              endpoint={plagEndpoint}
              onUpdateEndpoint={plagUpdateEndpoint}
            />
          )}

          {plagTab === 'history' && (
            <PlagiarismHistoryView
              sessions={plagSessions}
              onSelectSession={plagSelectSession}
              onDeleteSession={plagDeleteSession}
              onNewCheck={plagNewCheck}
            />
          )}
        </>
      )}
    </LayoutShell>
  );
}

export default App;
