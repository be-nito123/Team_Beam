import {
  VerificationRequest,
  VerificationResult,
  HistorySession,
  ClaimItem,
  VerificationStatus,
} from '@/types/verification';
import { INITIAL_MOCK_SESSIONS, MOCK_ANALYSIS_DATABASE } from './mockData';

const BASE_URL = '';

let isMockMode = false;
let mockSessions: HistorySession[] = [...INITIAL_MOCK_SESSIONS];
const mockDatabase: Record<string, VerificationResult> = { ...MOCK_ANALYSIS_DATABASE };

// Try checking backend health
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${BASE_URL}/api/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const contentType = res.headers.get('content-type')?.toLowerCase() || '';
    const isJsonResponse = contentType.includes('application/json') || contentType.includes('+json');
    if (res.ok && isJsonResponse) {
      isMockMode = false;
      return true;
    }
  } catch (err) {
    // Backend offline; engage mock mode
  }
  isMockMode = true;
  return false;
}

export function getIsMockMode(): boolean {
  return isMockMode;
}

export function setMockMode(enabled: boolean): void {
  isMockMode = enabled;
}

export async function fetchHistory(): Promise<HistorySession[]> {
  try {
    if (!isMockMode) {
      const res = await fetch(`${BASE_URL}/api/history`);
      if (res.ok) {
        return await res.json();
      }
    }
  } catch (err) {
    console.warn('Backend history fetch failed, using mock data:', err);
    isMockMode = true;
  }
  return mockSessions;
}

export async function fetchResultById(id: string): Promise<VerificationResult | null> {
  try {
    if (!isMockMode) {
      const res = await fetch(`${BASE_URL}/api/results/${id}`);
      if (res.ok) {
        return await res.json();
      }
    }
  } catch (err) {
    console.warn(`Backend fetchResultById(${id}) failed, checking local database:`, err);
    isMockMode = true;
  }
  return mockDatabase[id] || null;
}

export async function runVerification(
  req: VerificationRequest
): Promise<VerificationResult> {
  if (!req.aiClaim.trim()) {
    throw new Error('AI Claim input cannot be empty.');
  }
  if (!req.referenceText.trim() && !req.documentFile) {
    throw new Error('Reference Claim text or document is required.');
  }

  // Attempt real API call first
  if (!isMockMode) {
    try {
      const formData = new FormData();
      formData.append('aiClaim', req.aiClaim);
      formData.append('referenceText', req.referenceText);
      if (req.documentFile) {
        formData.append('file', req.documentFile);
      }

      const res = await fetch(`${BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const result: VerificationResult = await res.json();
        return result;
      }
    } catch (err) {
      console.warn('Real API call failed; falling back to Mock Engine:', err);
      isMockMode = true;
    }
  }

  // Fallback / Mock Engine
  // Simulate network roundtrip between 800ms to 1400ms so the BorderTrail animation runs naturally
  await new Promise((resolve) => setTimeout(resolve, 1100));

  // If user inputs text matching one of our standard presets or new text:
  const newId = `vt-${Date.now()}`;
  const aiSentences = req.aiClaim
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const referenceSentences = req.referenceText
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const claims: ClaimItem[] = aiSentences.map((sentence, idx) => {
    // Find closest match in reference text
    const lowerSentence = sentence.toLowerCase();
    const words = lowerSentence.split(/\s+/).filter((w) => w.length > 3);

    let bestMatch = '';
    let maxOverlap = 0;

    for (const ref of referenceSentences) {
      const lowerRef = ref.toLowerCase();
      let overlap = 0;
      for (const w of words) {
        if (lowerRef.includes(w)) overlap++;
      }
      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        bestMatch = ref;
      }
    }

    const overlapRatio = words.length > 0 ? maxOverlap / words.length : 0;

    // Check for numerical contradiction
    const sentenceNumbers = sentence.match(/\b\d+(\.\d+)?%?\b/g) || [];
    let hasContradictoryNumber = false;

    if (bestMatch && sentenceNumbers.length > 0) {
      const refNumbers: string[] = bestMatch.match(/\b\d+(\.\d+)?%?\b/g) || [];
      if (refNumbers.length > 0 && !sentenceNumbers.some((n: string) => refNumbers.includes(n))) {
        hasContradictoryNumber = true;
      }
    }

    let status: VerificationStatus = 'UNSUPPORTED';
    let explanation = 'No corroborating or refuting evidence was identified in the provided reference text.';
    let evidence = undefined;

    if (overlapRatio >= 0.45 && !hasContradictoryNumber) {
      status = 'SUPPORTED';
      explanation = 'Directly verified by the source documentation.';
      evidence = {
        source: req.documentFile ? req.documentFile.name : 'Reference Document',
        exactSentence: bestMatch,
        relationship: 'Direct Support',
        explanation: 'Reference text substantiates the core claims and parameters.',
      };
    } else if (hasContradictoryNumber || (overlapRatio >= 0.35 && (lowerSentence.includes('not') || lowerSentence.includes('never') || lowerSentence.includes('exclusively')))) {
      status = 'CONTRADICTED';
      explanation = 'Conflict detected between the statement and source documentation values.';
      evidence = {
        source: req.documentFile ? req.documentFile.name : 'Reference Document',
        exactSentence: bestMatch,
        relationship: 'Contradiction',
        explanation: 'Discrepancy identified in values or assertions between claim and reference.',
      };
    } else {
      // RULE: Never fabricate evidence. If no source sentence exists, show the claim as Unsupported with NO evidence object!
      status = 'UNSUPPORTED';
      explanation = 'No corresponding source sentence found in reference text. Marked Unsupported.';
      evidence = undefined;
    }

    return {
      id: `c-${idx + 1}`,
      claimNumber: idx + 1,
      originalClaim: sentence,
      status,
      confidence: Number((0.85 + Math.random() * 0.14).toFixed(2)),
      explanation,
      evidence,
    };
  });

  const total = claims.length;
  const supported = claims.filter((c) => c.status === 'SUPPORTED').length;
  const contradicted = claims.filter((c) => c.status === 'CONTRADICTED').length;
  const unsupported = claims.filter((c) => c.status === 'UNSUPPORTED').length;

  const title = req.aiClaim.slice(0, 55).replace(/[^\w\s]/g, '') + '...';

  const newResult: VerificationResult = {
    id: newId,
    title,
    createdAt: new Date().toISOString(),
    aiClaim: req.aiClaim,
    referenceClaim: req.referenceText,
    summary: {
      total,
      supported,
      contradicted,
      unsupported,
    },
    claims,
    isMock: true,
  };

  mockDatabase[newId] = newResult;

  // Add to sessions
  const newSession: HistorySession = {
    id: newId,
    title,
    createdAt: newResult.createdAt,
    summary: newResult.summary,
    aiClaimExcerpt: req.aiClaim.slice(0, 80) + '...',
    referenceExcerpt: req.referenceText.slice(0, 80) + '...',
  };
  mockSessions = [newSession, ...mockSessions];

  return newResult;
}
