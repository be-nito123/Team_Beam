import {
  PlagiarismRequest,
  PlagiarismResult,
  PlagiarismSession,
  PlagiarismMatch,
} from '@/types/plagiarism';

export const DEFAULT_PLAGIARISM_ENDPOINT = '/api/plagiarism/check';
const ENDPOINT_STORAGE_KEY = 'veritrace-plagiarism-endpoint';
const SESSIONS_STORAGE_KEY = 'veritrace-plagiarism-sessions';
const RESULTS_STORAGE_KEY = 'veritrace-plagiarism-results';

export interface BackendContractSpec {
  endpoint: string;
  method: string;
  contentType: string;
  requestFields: {
    name: string;
    type: string;
    description: string;
  }[];
  expectedResponseExample: string;
}

export const PLAGIARISM_BACKEND_CONTRACT: BackendContractSpec = {
  endpoint: '/api/plagiarism/check',
  method: 'POST',
  contentType: 'multipart/form-data',
  requestFields: [
    {
      name: 'originalDocument',
      type: 'File (PDF, DOCX, TXT)',
      description: 'Single primary document to inspect for text similarity.',
    },
    {
      name: 'referenceDocuments',
      type: 'File[] (PDF, DOCX, TXT)',
      description: 'One or more reference source files to cross-check against.',
    },
  ],
  expectedResponseExample: JSON.stringify(
    {
      id: 'plag-session-8821',
      documentName: 'Research_Draft_V2.pdf',
      documentSize: 142080,
      createdAt: '2026-11-04T12:00:00.000Z',
      summary: {
        overallSimilarity: 14.8,
        matchedSources: 2,
        wordsReviewed: 2840,
        exactMatchPercentage: 5.2,
        paraphrasedPercentage: 9.6,
        originalPercentage: 85.2,
      },
      matches: [
        {
          id: 'm-1',
          classification: 'EXACT',
          originalPassage:
            'Trapped-ion systems retain internal qubit coherence within cryogenic vacuum chambers.',
          referencePassage:
            'Trapped-ion systems retain internal qubit coherence within cryogenic vacuum chambers.',
          referenceDocName: 'Cryo_Physics_2025.pdf',
          pageOrSection: 'Page 7, Section 2.1',
          similarityScore: 1.0,
          notes: 'Identical 12-word exact sequence match.',
        },
        {
          id: 'm-2',
          classification: 'PARAPHRASED',
          originalPassage:
            'The error rates observed during entangling operations decreased substantially when laser cooling was prolonged.',
          referencePassage:
            'Longer durations of sympathetic laser cooling produced marked reductions in two-qubit gate error rates.',
          referenceDocName: 'Quantum_Benchmark_Report.txt',
          pageOrSection: 'Section 4: Thermalization',
          similarityScore: 0.84,
          notes: 'High semantic alignment with reordered phrasing.',
        },
      ],
      referenceDocuments: [
        { name: 'Cryo_Physics_2025.pdf', size: 1048576, type: 'application/pdf' },
        { name: 'Quantum_Benchmark_Report.txt', size: 45020, type: 'text/plain' },
      ],
    },
    null,
    2
  ),
};

export function getPlagiarismEndpoint(): string {
  try {
    return localStorage.getItem(ENDPOINT_STORAGE_KEY) || DEFAULT_PLAGIARISM_ENDPOINT;
  } catch {
    return DEFAULT_PLAGIARISM_ENDPOINT;
  }
}

export function setPlagiarismEndpoint(url: string): void {
  try {
    localStorage.setItem(ENDPOINT_STORAGE_KEY, url);
  } catch {}
}

export async function checkPlagiarismBackendHealth(
  endpoint = getPlagiarismEndpoint()
): Promise<boolean> {
  try {
    const healthUrl = endpoint.replace(/\/check$/, '/health');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(healthUrl, { signal: controller.signal });
    clearTimeout(timeout);
    // Only healthy if 200 OK and returns json, not a 404 or vite SPA fallback
    if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function getSavedPlagiarismSessions(): PlagiarismSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function savePlagiarismSession(session: PlagiarismSession, result: PlagiarismResult): void {
  try {
    const sessions = getSavedPlagiarismSessions().filter((s) => s.id !== session.id);
    sessions.unshift(session);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));

    const resultsRaw = localStorage.getItem(RESULTS_STORAGE_KEY);
    const results: Record<string, PlagiarismResult> = resultsRaw ? JSON.parse(resultsRaw) : {};
    results[result.id] = result;
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
  } catch (err) {
    console.error('Failed to save plagiarism session:', err);
  }
}

export function deletePlagiarismSession(sessionId: string): void {
  try {
    const sessions = getSavedPlagiarismSessions().filter((s) => s.id !== sessionId);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));

    const resultsRaw = localStorage.getItem(RESULTS_STORAGE_KEY);
    if (resultsRaw) {
      const results: Record<string, PlagiarismResult> = JSON.parse(resultsRaw);
      delete results[sessionId];
      localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
    }
  } catch (err) {
    console.error('Failed to delete session:', err);
  }
}

export function getPlagiarismResultById(sessionId: string): PlagiarismResult | null {
  try {
    const resultsRaw = localStorage.getItem(RESULTS_STORAGE_KEY);
    if (resultsRaw) {
      const results: Record<string, PlagiarismResult> = JSON.parse(resultsRaw);
      return results[sessionId] || null;
    }
  } catch {}
  return null;
}

// Client-side validated text similarity algorithm for TXT files (Zero Hallucination / Deterministic Jaccard & n-gram)
export async function runLocalValidatedAnalysis(
  originalFile: File,
  referenceFiles: File[]
): Promise<PlagiarismResult> {
  const readText = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  };

  const originalText = await readText(originalFile);
  const refTexts = await Promise.all(
    referenceFiles.map(async (file) => ({
      name: file.name,
      size: file.size,
      text: await readText(file),
    }))
  );

  const cleanSentences = (text: string) =>
    text
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

  const origSentences = cleanSentences(originalText);
  const wordsReviewed = originalText.trim().split(/\s+/).filter(Boolean).length;

  const matches: PlagiarismMatch[] = [];
  let exactCount = 0;
  let paraphrasedCount = 0;
  const matchedSourcesSet = new Set<string>();

  for (let i = 0; i < origSentences.length; i++) {
    const orig = origSentences[i];
    const origWords = new Set(orig.toLowerCase().split(/\s+/).filter((w) => w.length > 2));
    if (origWords.size === 0) continue;

    let bestScore = 0;
    let bestRefDoc = '';
    let bestRefSentence = '';
    let bestRefSentenceIndex = 0;
    let isExact = false;

    for (const ref of refTexts) {
      const refSentences = cleanSentences(ref.text);
      for (let refSentenceIndex = 0; refSentenceIndex < refSentences.length; refSentenceIndex++) {
        const refSent = refSentences[refSentenceIndex];
        const normalizedOriginal = orig.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
        const normalizedReference = refSent.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
        if (normalizedReference === normalizedOriginal) {
          bestScore = 1.0;
          bestRefDoc = ref.name;
          bestRefSentence = refSent;
          bestRefSentenceIndex = refSentenceIndex + 1;
          isExact = true;
          break;
        }

        const refWords = new Set(refSent.toLowerCase().split(/\s+/).filter((w) => w.length > 2));
        let intersection = 0;
        origWords.forEach((w) => {
          if (refWords.has(w)) intersection++;
        });

        const union = new Set([...origWords, ...refWords]).size;
        const jaccard = union > 0 ? intersection / union : 0;

        if (jaccard > bestScore && jaccard >= 0.35) {
          bestScore = jaccard;
          bestRefDoc = ref.name;
          bestRefSentence = refSent;
          bestRefSentenceIndex = refSentenceIndex + 1;
        }
      }
      if (isExact) break;
    }

    if (bestScore >= 0.35) {
      matchedSourcesSet.add(bestRefDoc);
      const classification = isExact ? 'EXACT' : 'PARAPHRASED';
      if (classification === 'EXACT') exactCount++;
      else paraphrasedCount++;

      matches.push({
        id: `match-${i + 1}`,
        classification,
        originalPassage: orig,
        referencePassage: bestRefSentence,
        referenceDocName: bestRefDoc,
        pageOrSection: `Sentence ${bestRefSentenceIndex}`,
        similarityScore: Number(bestScore.toFixed(2)),
        notes: isExact
          ? 'Exact identical text match confirmed.'
          : `High lexical overlap (${(bestScore * 100).toFixed(0)}% Jaccard similarity index).`,
      });
    }
  }

  const totalEvaluated = origSentences.length || 1;
  const exactMatchPercentage = Number(((exactCount / totalEvaluated) * 100).toFixed(1));
  const paraphrasedPercentage = Number(((paraphrasedCount / totalEvaluated) * 100).toFixed(1));
  const overallSimilarity = Number(Math.min(100, exactMatchPercentage + paraphrasedPercentage).toFixed(1));
  const originalPercentage = Number(Math.max(0, 100 - overallSimilarity).toFixed(1));

  const result: PlagiarismResult = {
    id: `plag-${Date.now()}`,
    documentName: originalFile.name,
    documentSize: originalFile.size,
    createdAt: new Date().toISOString(),
    summary: {
      overallSimilarity,
      matchedSources: matchedSourcesSet.size,
      wordsReviewed,
      exactMatchPercentage,
      paraphrasedPercentage,
      originalPercentage,
    },
    matches,
    referenceDocuments: referenceFiles.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type || 'text/plain',
    })),
    isLocalCalculation: true,
  };

  return result;
}

export async function submitPlagiarismCheck(
  req: PlagiarismRequest
): Promise<{ result: PlagiarismResult | null; backendError: string | null; isBackendAvailable: boolean }> {
  const endpoint = req.endpointUrl || getPlagiarismEndpoint();

  // Try real API call first
  try {
    const formData = new FormData();
    if (req.originalFile) formData.append('originalDocument', req.originalFile); else if (req.originalText) formData.append('originalText', req.originalText);
    req.referenceFiles.forEach((file) => {
      formData.append('referenceDocuments', file);
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    // If real backend responds with valid JSON
    if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
      const data: PlagiarismResult = await res.json();
      return { result: data, backendError: null, isBackendAvailable: true };
    }
  } catch {
    // Backend offline / not reachable
  }

  // If no backend responded or responded with 404/HTML:
  // Check if text files are provided so we can run deterministic validated local calculation:
  const canRunLocal = !!req.originalFile && /\.txt$/i.test(req.originalFile.name) &&
    req.referenceFiles.every((file) => /\.txt$/i.test(file.name));

  if (canRunLocal && req.originalFile) {
    const localResult = await runLocalValidatedAnalysis(req.originalFile, req.referenceFiles);
    return {
      result: localResult,
      backendError: null,
      isBackendAvailable: false,
    };
  }

  // If non-text files (PDF/DOCX) and no backend is connected:
  return {
    result: null,
    backendError: `Backend service is offline at ${endpoint}. Connect a compatible similarity server or configure a custom endpoint.`,
    isBackendAvailable: false,
  };
}
