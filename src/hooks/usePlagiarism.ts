import { useState, useEffect, useCallback } from 'react';
import {
  PlagiarismResult,
  PlagiarismSession,
  MatchClassification,
} from '@/types/plagiarism';
import {
  getPlagiarismEndpoint,
  setPlagiarismEndpoint as saveEndpoint,
  checkPlagiarismBackendHealth,
  submitPlagiarismCheck,
  getSavedPlagiarismSessions,
  savePlagiarismSession,
  deletePlagiarismSession as removeSession,
  getPlagiarismResultById,
} from '@/services/plagiarismApi';

export function usePlagiarism() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'results' | 'history'>('dashboard');
  const [activeResult, setActiveResult] = useState<PlagiarismResult | null>(null);
  const [sessions, setSessions] = useState<PlagiarismSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [endpoint, setEndpointState] = useState<string>(getPlagiarismEndpoint());
  const [activeFilter, setActiveFilter] = useState<MatchClassification | 'ALL'>('ALL');
  const [showBackendContract, setShowBackendContract] = useState(false);

  // Probe backend on mount and load sessions
  useEffect(() => {
    let mounted = true;

    async function init() {
      const isOnline = await checkPlagiarismBackendHealth(endpoint);
      if (!mounted) return;
      setIsBackendConnected(isOnline);
      const savedSessions = getSavedPlagiarismSessions();
      setSessions(savedSessions);
    }

    init();
    return () => {
      mounted = false;
    };
  }, [endpoint]);

  const updateEndpoint = useCallback((newUrl: string) => {
    saveEndpoint(newUrl);
    setEndpointState(newUrl);
    checkPlagiarismBackendHealth(newUrl).then(setIsBackendConnected);
  }, []);

  const runPlagiarismCheck = useCallback(
    async (originalFile: File, referenceFiles: File[]): Promise<boolean> => {
      if (isLoading) return false;
      if (!originalFile) {
        setError('Please select an original document to inspect.');
        return false;
      }
      if (!referenceFiles || referenceFiles.length === 0) {
        setError('Please attach at least one reference document to compare against.');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { result, backendError, isBackendAvailable } = await submitPlagiarismCheck({
          originalFile,
          referenceFiles,
          endpointUrl: endpoint,
        });

        setIsBackendConnected(isBackendAvailable);

        if (result) {
          setActiveResult(result);
          setActiveFilter('ALL');

          const session: PlagiarismSession = {
            id: result.id,
            documentName: result.documentName,
            createdAt: result.createdAt,
            similarityPercentage: result.summary.overallSimilarity,
            matchedSources: result.summary.matchedSources,
            wordsReviewed: result.summary.wordsReviewed,
            referenceCount: result.referenceDocuments.length,
          };

          savePlagiarismSession(session, result);
          setSessions(getSavedPlagiarismSessions());
          setCurrentTab('results');
          return true;
        } else {
          setError(
            backendError ||
              'Backend not reachable. Connect an originality scoring server or provide .txt documents for deterministic local text evaluation.'
          );
          return false;
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred during similarity analysis.');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, isLoading]
  );

  const selectSession = useCallback((sessionId: string) => {
    const res = getPlagiarismResultById(sessionId);
    if (res) {
      setActiveResult(res);
      setActiveFilter('ALL');
      setCurrentTab('results');
      setError(null);
    } else {
      setError(`Plagiarism session ${sessionId} could not be retrieved from local storage.`);
    }
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    removeSession(sessionId);
    setSessions(getSavedPlagiarismSessions());
    if (activeResult?.id === sessionId) {
      setActiveResult(null);
      setCurrentTab('history');
    }
  }, [activeResult]);

  const newCheck = useCallback(() => {
    setError(null);
    setCurrentTab('dashboard');
  }, []);

  return {
    currentTab,
    setCurrentTab,
    activeResult,
    sessions,
    isLoading,
    error,
    clearError: () => setError(null),
    isBackendConnected,
    endpoint,
    updateEndpoint,
    runPlagiarismCheck,
    selectSession,
    deleteSession,
    newCheck,
    activeFilter,
    setActiveFilter,
    showBackendContract,
    setShowBackendContract,
  };
}
