export type VerificationStatus = 'SUPPORTED' | 'CONTRADICTED' | 'UNSUPPORTED';

export interface EvidenceReference {
  source: string;
  pageNumber?: number | string;
  exactSentence: string;
  relationship: 'Direct Support' | 'Contradiction' | 'None' | string;
  contextSnippet?: string;
  explanation: string;
}

export interface ClaimItem {
  id: string;
  claimNumber: number;
  originalClaim: string;
  status: VerificationStatus;
  confidence?: number; // 0 to 1, only if provided by backend
  explanation: string;
  evidence?: EvidenceReference;
}

export interface VerificationSummary {
  total: number;
  supported: number;
  contradicted: number;
  unsupported: number;
}

export interface VerificationResult {
  id: string;
  title: string;
  createdAt: string;
  aiClaim: string;
  referenceClaim: string;
  summary: VerificationSummary;
  claims: ClaimItem[];
  isMock?: boolean;
}

export interface VerificationRequest {
  aiClaim: string;
  referenceText: string;
  documentFile?: File | null;
}

export interface HistorySession {
  id: string;
  title: string;
  createdAt: string;
  summary: VerificationSummary;
  aiClaimExcerpt: string;
  referenceExcerpt: string;
}
