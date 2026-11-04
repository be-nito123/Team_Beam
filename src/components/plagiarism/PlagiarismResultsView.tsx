import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp,
  Percent,
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Info,
  GitCommit,
} from 'lucide-react';
import {
  PlagiarismResult,
  MatchClassification,
  PlagiarismMatch,
} from '@/types/plagiarism';
import { AnimatedBackground } from '@/components/core/AnimatedBackground';
import { cn } from '@/lib/utils';

interface PlagiarismResultsViewProps {
  result: PlagiarismResult;
  onBackToDashboard: () => void;
  initialFilter?: MatchClassification | 'ALL';
}

export function PlagiarismResultsView({
  result,
  onBackToDashboard,
  initialFilter = 'ALL',
}: PlagiarismResultsViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const {
    overallSimilarity,
    matchedSources,
    wordsReviewed,
    exactMatchPercentage,
    paraphrasedPercentage,
    originalPercentage,
  } = result.summary;

  const filteredMatches = useMemo(() => {
    if (activeFilter === 'ALL' || !activeFilter) return result.matches;
    return result.matches.filter((m) => m.classification === activeFilter);
  }, [result.matches, activeFilter]);

  const toggleExpand = (id: string) => {
    setExpandedMatchId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (classification: MatchClassification) => {
    switch (classification) {
      case 'EXACT':
        return {
          label: 'EXACT FINDING',
          text: 'text-[var(--status-contradicted)]',
          border: 'border-[var(--status-contradicted)]',
          bg: 'bg-[var(--status-contradicted-bg)]',
        };
      case 'PARAPHRASED':
        return {
          label: result.isLocalCalculation ? 'NEAR LEXICAL MATCH' : 'PARAPHRASED FINDING',
          text: 'text-[var(--status-unsupported)]',
          border: 'border-[var(--status-unsupported)]',
          bg: 'bg-[var(--status-unsupported-bg)]',
        };
      case 'ORIGINAL':
      default:
        return {
          label: 'ORIGINAL PASSAGE',
          text: 'text-[var(--status-supported)]',
          border: 'border-[var(--status-supported)]',
          bg: 'bg-[var(--status-supported-bg)]',
        };
    }
  };

  return (
    <div className="mx-auto flex min-h-full min-w-0 w-full max-w-[1800px] flex-col space-y-6 p-4 text-[var(--text-primary)] md:p-6 lg:p-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-5">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 rounded border border-[var(--border-color)] bg-[var(--card-surface)] px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>BACK TO CHECKER</span>
          </button>

          <div className="h-4 w-[1px] bg-[var(--border-muted)] hidden sm:block" />

          <div>
            <h1 className="font-michroma text-base md:text-lg font-bold tracking-tight text-[var(--text-primary)] flex items-center space-x-2">
              <span>{result.documentName}</span>
              {result.isLocalCalculation && (
                <span className="rounded border border-[var(--border-muted)] bg-[var(--card-surface)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--accent)] font-normal uppercase">
                  LOCAL ALGORITHM MODE
                </span>
              )}
            </h1>
            <p className="text-[11px] font-mono text-[var(--text-secondary)]">
              REVIEW COMPLETED ON {new Date(result.createdAt).toLocaleString()} • WORDS REVIEWED:{' '}
              {wordsReviewed.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tone disclaimer pill */}
        <div className="inline-flex items-center space-x-1.5 rounded border border-[var(--border-muted)] bg-[var(--card-surface)] px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
          <Info className="h-3 w-3 text-[var(--accent)]" />
          <span>OBJECTIVE SIMILARITY FINDINGS ONLY</span>
        </div>
      </div>

      <p className="-mt-4 rounded border border-[var(--border-muted)] bg-[var(--card-surface)] px-3 py-2 text-[11px] leading-relaxed text-[var(--text-secondary)]">
        Similarity is a review signal, not a confirmed plagiarism finding. Local results compare TXT files using exact normalized sentence matching and lexical word overlap; they do not perform semantic analysis or internet-wide searches.
      </p>

      {/* Similarity Overview (Backend or Validated Calculation Only) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
        {/* Overall Similarity */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between border-[var(--border-color)] col-span-2 md:col-span-2">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="font-michroma text-[10px] uppercase tracking-widest">
              OVERALL SIMILARITY
            </span>
            <Percent className="h-4 w-4 text-[var(--text-primary)]" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={cn(
              'font-michroma text-3xl font-bold',
              overallSimilarity > 30 ? 'text-[var(--status-contradicted)]' : overallSimilarity > 10 ? 'text-[var(--status-unsupported)]' : 'text-[var(--status-supported)]'
            )}>
              {overallSimilarity.toFixed(1)}%
            </span>
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              MATCH RATIO
            </span>
          </div>
        </div>

        {/* Matched Sources */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="font-michroma text-[10px] uppercase tracking-widest">
              SOURCES
            </span>
            <BookOpen className="h-4 w-4 text-[var(--text-primary)]" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-michroma text-2xl font-bold text-[var(--text-primary)]">
              {matchedSources}
            </span>
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">MATCHED</span>
          </div>
        </div>

        {/* Exact Match % */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between border-[var(--border-muted)]">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="font-michroma text-[10px] uppercase tracking-widest">
              EXACT
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--status-contradicted)]" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-michroma text-2xl font-bold text-[var(--status-contradicted)]">
              {exactMatchPercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Paraphrased % */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between border-[var(--border-muted)]">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="font-michroma text-[10px] uppercase tracking-widest">
              {result.isLocalCalculation ? 'NEAR / LEXICAL' : 'PARAPHRASED'}
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--status-unsupported)]" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-michroma text-2xl font-bold text-[var(--status-unsupported)]">
              {paraphrasedPercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Original % */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between border-[var(--border-muted)]">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="font-michroma text-[10px] uppercase tracking-widest">
              {result.isLocalCalculation ? 'UNMATCHED' : 'ORIGINAL'}
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--status-supported)]" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-michroma text-2xl font-bold text-[var(--status-supported)]">
              {originalPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs using AnimatedBackground Component */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-muted)] pb-4 pt-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-secondary)]">
          <Layers className="h-3.5 w-3.5 text-[var(--text-primary)]" />
          <span>FILTER SIMILARITY FINDINGS:</span>
        </div>

        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-surface)] p-1">
          <AnimatedBackground
            defaultValue={activeFilter}
            value={activeFilter}
            onValueChange={(newId) => {
              if (newId) setActiveFilter(newId);
            }}
            enableHover={true}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
            className="bg-[var(--btn-primary-bg)] rounded-md shadow-sm"
          >
            {[
              { id: 'ALL', label: `ALL (${result.matches.length})` },
              { id: 'EXACT', label: `EXACT (${result.matches.filter((m) => m.classification === 'EXACT').length})` },
              { id: 'PARAPHRASED', label: `${result.isLocalCalculation ? 'NEAR / LEXICAL' : 'PARAPHRASED'} (${result.matches.filter((m) => m.classification === 'PARAPHRASED').length})` },
              { id: 'ORIGINAL', label: `${result.isLocalCalculation ? 'UNMATCHED' : 'ORIGINAL'} (${result.matches.filter((m) => m.classification === 'ORIGINAL').length})` },
            ].map((tab) => {
              const isSelected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  data-id={tab.id}
                  type="button"
                  className={cn(
                    'result-filter-tab px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider rounded-md whitespace-nowrap transition-colors duration-250 cursor-pointer',
                    isSelected
                      ? 'font-semibold text-[#080808] dark:text-[#080808]'
                      : 'font-medium text-[#171710] dark:text-[#FFFFFF] hover:text-[#82774D] dark:hover:text-[#ECE4B4]'
                  )}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </AnimatedBackground>
        </div>
      </div>

      {/* Match List */}
      {filteredMatches.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center rounded-xl p-12 text-center">
          <CheckCircle2 className="h-8 w-8 text-[var(--status-supported)] mb-3" />
          <p className="font-michroma text-sm text-[var(--text-primary)]">
            NO SIMILARITY FINDINGS UNDER "{activeFilter}"
          </p>
          <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
            No text passages in this category were detected.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match, idx) => {
            const badge = getStatusBadge(match.classification);
            const isExpanded = expandedMatchId === match.id;

            return (
              <div
                key={match.id}
                className="glass-panel rounded-xl border border-[var(--border-color)] p-5 md:p-6 transition-all hover:border-[var(--border-hover)]"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-michroma text-xs font-bold text-[var(--text-primary)]">
                      FINDING #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={cn(
                        'rounded border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider',
                        badge.border,
                        badge.bg,
                        badge.text
                      )}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono text-[var(--text-secondary)]">
                    {match.similarityScore !== undefined && (
                      <span>SCORE: {(match.similarityScore * 100).toFixed(0)}%</span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleExpand(match.id)}
                      className="flex items-center space-x-1 text-[var(--text-primary)] hover:opacity-80"
                    >
                      <span>{isExpanded ? 'COLLAPSE' : 'EXPAND'}</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Side-by-side or stacked passages */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original Passage */}
                  <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-surface)] p-3.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)] block mb-1.5">
                      ORIGINAL DOCUMENT PASSAGE
                    </span>
                    <p className="break-words text-xs md:text-sm font-sans leading-relaxed text-[var(--text-primary)] bg-[var(--highlight-bg)] p-2 rounded">
                      "{match.originalPassage}"
                    </p>
                  </div>

                  {/* Reference Passage */}
                  <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-surface)] p-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
                        MATCHED REFERENCE PASSAGE
                      </span>
                      <span title={match.referenceDocName} className="font-mono text-[10px] text-[var(--accent)] truncate max-w-[150px]">
                        {match.referenceDocName}
                      </span>
                    </div>
                    <p className="break-words text-xs md:text-sm font-sans leading-relaxed text-[var(--text-primary)] italic p-2 rounded bg-[var(--card-surface)]">
                      "{match.referencePassage}"
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 rounded border border-[var(--border-muted)] bg-[var(--card-surface)] p-3 text-xs font-mono space-y-1.5">
                    <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                      <GitCommit className="h-3.5 w-3.5 text-[var(--accent)]" />
                      <span>SOURCE CITATION:</span>
                      <span className="text-[var(--text-primary)] font-semibold">{match.referenceDocName}</span>
                      {match.pageOrSection && (
                        <span>• LOCATION: {match.pageOrSection}</span>
                      )}
                    </div>
                    {match.notes && (
                      <p className="text-[var(--text-secondary)] border-t border-[var(--border-muted)] pt-1.5">
                        ANALYSIS NOTE: {match.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
