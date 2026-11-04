import React from 'react';
import { LayoutShell } from '@/components/layout/LayoutShell';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { ResultsView } from '@/components/results/ResultsView';
import { HistoryView } from '@/components/history/HistoryView';
import { useVerification } from '@/hooks/useVerification';

export function App() {
  const {
    currentTab,
    setCurrentTab,
    activeResult,
    recentSessions,
    isLoading,
    error,
    clearError,
    isMockMode,
    toggleMockMode,
    runVerification,
    selectSession,
    newAnalysis,
    filterByStatus,
    activeFilter,
  } = useVerification();

  return (
    <LayoutShell
      currentTab={currentTab}
      onNavigate={setCurrentTab}
      onNewAnalysis={newAnalysis}
      recentSessions={recentSessions}
      onSelectSession={selectSession}
      selectedSessionId={activeResult?.id}
      onFilterByStatus={filterByStatus}
      isMockMode={isMockMode}
      onToggleMockMode={toggleMockMode}
      activeTitle={activeResult?.title}
    >
      {currentTab === 'dashboard' && (
        <DashboardView
          onRunVerification={runVerification}
          isLoading={isLoading}
          error={error}
          onClearError={clearError}
        />
      )}

      {currentTab === 'results' && activeResult && (
        <ResultsView
          result={activeResult}
          onBackToDashboard={() => setCurrentTab('dashboard')}
          initialFilter={activeFilter}
        />
      )}

      {currentTab === 'results' && !activeResult && (
        <DashboardView
          onRunVerification={runVerification}
          isLoading={isLoading}
          error="No active analysis selected. Enter claims below to execute verification."
          onClearError={clearError}
        />
      )}

      {currentTab === 'history' && (
        <HistoryView
          sessions={recentSessions}
          onSelectSession={selectSession}
          onNewAnalysis={newAnalysis}
        />
      )}
    </LayoutShell>
  );
}

export default App;
