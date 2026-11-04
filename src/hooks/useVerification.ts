import { useState, useEffect, useCallback } from 'react';
import {
  VerificationRequest,
  VerificationResult,
  HistorySession,
  VerificationStatus,
} from '@/types/verification';
import {
  runVerification,
  fetchHistory,
  fetchResultById,
  checkBackendHealth,
  getIsMockMode,
  setMockMode,
} from '@/services/api';

export function useVerification() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'results' | 'history'>('dashboard');
  const [activeResult, setActiveResult] = useState<VerificationResult | null>(null);
  const [recentSessions, setRecentSessions] = useState<HistorySession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockModeActive, setIsMockModeActive] = useState(false);
  const [activeFilter, setActiveFilter] = useState<VerificationStatus | 'ALL'>('ALL');

  // Probe backend health and load sessions on mount
  useEffect(() => {
    let mounted = true;

    async function init() {
      const isOnline = await checkBackendHealth();
      if (!mounted) return;
      setIsMockModeActive(!isOnline);

      try {
        const history = await fetchHistory();
        if (mounted) {
          setRecentSessions(history);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleMockMode = useCallback(() => {
    const nextState = !isMockModeActive;
    setMockMode(nextState);
    setIsMockModeActive(nextState);
  }, [isMockModeActive]);

  const handleRunVerification = useCallback(
    async (req: VerificationRequest) => {
      if (isLoading) return; // Prevent duplicate submissions

      setError(null);
      setIsLoading(true);

      try {
        const result = await runVerification(req);
        setActiveResult(result);
        setActiveFilter('ALL');

        // Update sessions
        const updatedSessions = await fetchHistory();
        setRecentSessions(updatedSessions);

        // Transition to results page on success
        setCurrentTab('results');
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message || 'Verification pipeline encountered an unexpected error.');
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const handleSelectSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchResultById(sessionId);
      if (res) {
        setActiveResult(res);
        setActiveFilter('ALL');
        setCurrentTab('results');
      } else {
        setError(`Analysis session ${sessionId} could not be retrieved.`);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading session.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNewAnalysis = useCallback(() => {
    setError(null);
    setCurrentTab('dashboard');
  }, []);

  const handleFilterByStatus = useCallback((status: VerificationStatus) => {
    setActiveFilter(status);
    setCurrentTab('results');
  }, []);

  return {
    currentTab,
    setCurrentTab,
    activeResult,
    recentSessions,
    isLoading,
    error,
    clearError: () => setError(null),
    isMockMode: isMockModeActive,
    toggleMockMode: handleToggleMockMode,
    runVerification: handleRunVerification,
    selectSession: handleSelectSession,
    newAnalysis: handleNewAnalysis,
    filterByStatus: handleFilterByStatus,
    activeFilter,
  };
}
