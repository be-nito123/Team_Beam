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
  onlineAnalysis?: OnlinePlagiarismReport;
  documentAnalysis?: DocumentSimilarityReport;
  aiContentAnalysis?: AiContentReport;
}

export interface OnlinePlagiarismReport {
  status: 'complete' | 'partial' | 'not_configured' | 'unavailable';
  message?: string;
  overallSimilarity: number;
  matchedSources: number;
  exactMatches: number;
  nearDuplicateMatches: number;
  semanticMatches: number;
  retrievalTimestamp?: string;
  matches: Array<PlagiarismMatch & { sourceUrl: string; sourceDomain: string; sourceTitle?: string; publishedAt?: string }>;
}

export interface DocumentSimilarityReport {
  status: 'complete' | 'partial' | 'unavailable';
  message?: string;
  referenceCount: number;
  extractedCount: number;
  matches: PlagiarismMatch[];
}

export interface AiContentReport {
  assessment: 'AI-like writing patterns detected' | 'Predominantly human-like writing patterns' | 'Inconclusive — insufficient evidence';
  estimatedAiLikeness: number | null;
  confidence: 'low' | 'moderate';
  wordsAnalyzed: number;
  indicators: string[];
  limitations: string;
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
  originalFile?: File;
  originalText?: string;
  documentName?: string;
  referenceFiles: File[];
  endpointUrl?: string;
}
