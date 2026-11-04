export type MatchClassification = 'EXACT' | 'PARAPHRASED' | 'ORIGINAL';

export interface PlagiarismMatch {
  id: string;
  classification: MatchClassification;
  originalPassage: string;
  referencePassage: string;
  referenceDocName: string;
  pageOrSection?: string;
  similarityScore?: number; // 0 to 1, if provided
  notes?: string;
}

export interface PlagiarismSummary {
  overallSimilarity: number; // 0 - 100 percentage
  matchedSources: number;
  wordsReviewed: number;
  exactMatchPercentage: number;
  paraphrasedPercentage: number;
  originalPercentage: number;
}

export interface ReferenceDocumentMeta {
  name: string;
  size: number;
  type: string;
  pageCount?: number;
}

export interface PlagiarismResult {
  id: string;
  documentName: string;
  documentSize: number;
  createdAt: string;
  summary: PlagiarismSummary;
  matches: PlagiarismMatch[];
  referenceDocuments: ReferenceDocumentMeta[];
  isLocalCalculation?: boolean;
}

export interface PlagiarismSession {
  id: string;
  documentName: string;
  createdAt: string;
  similarityPercentage: number;
  matchedSources: number;
  wordsReviewed: number;
  referenceCount: number;
}

export interface PlagiarismRequest {
  originalFile: File;
  referenceFiles: File[];
  endpointUrl?: string;
}
