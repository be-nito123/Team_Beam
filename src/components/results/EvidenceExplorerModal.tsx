import React from 'react';
import { X, CheckCircle2, XCircle, AlertCircle, FileText, Compass } from 'lucide-react';
import { ClaimItem } from '@/types/verification';
import { cn } from '@/lib/utils';

interface EvidenceExplorerModalProps {
  claim: ClaimItem | null;
  onClose: () => void;
}

export function EvidenceExplorerModal({ claim, onClose }: EvidenceExplorerModalProps) {
  if (!claim) return null;

  const statusConfig = {
    SUPPORTED: {
      label: 'SUPPORTED',
      icon: CheckCircle2,
      border: 'border-[var(--status-supported)]',
      bg: 'bg-[var(--status-supported-bg)]',
      text: 'text-[var(--status-supported)]',
    },
    CONTRADICTED: {
      label: 'CONTRADICTED',
      icon: XCircle,
      border: 'border-[var(--status-contradicted)]',
      bg: 'bg-[var(--status-contradicted-bg)]',
      text: 'text-[var(--status-contradicted)]',
    },
    UNSUPPORTED: {
      label: 'UNSUPPORTED',
      icon: AlertCircle,
      border: 'border-[var(--status-unsupported)]',
      bg: 'bg-[var(--status-unsupported-bg)]',
      text: 'text-[var(--status-unsupported)]',
    },
  }[claim.status];

  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className="glass-panel relative flex w-full max-w-2xl flex-col rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] p-6 shadow-2xl text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-7 w-7 items-center justify-center rounded border border-[var(--border-color)] bg-[var(--card-surface)] text-[var(--text-primary)]">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span className="font-michroma text-xs tracking-widest text-[var(--text-primary)] font-semibold">
                EVIDENCE EXPLORER
              </span>
              <span className="ml-2 font-mono text-xs text-[var(--text-secondary)]">
                // CLAIM {String(claim.claimNumber).padStart(2, '0')}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="mt-5 space-y-5 max-h-[75vh] overflow-y-auto pr-1">
          {/* Status & Confidence row */}
          <div className="flex items-center justify-between">
            <div
              className={cn(
                'inline-flex items-center space-x-1.5 rounded border px-2.5 py-1 text-xs font-mono tracking-wider font-semibold',
                statusConfig.border,
                statusConfig.bg,
                statusConfig.text
              )}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              <span>{statusConfig.label}</span>
            </div>

            {claim.confidence !== undefined && (
              <div className="text-xs font-mono text-[var(--text-secondary)]">
                CONFIDENCE RATIO: <span className="text-[var(--text-primary)] font-bold">{(claim.confidence * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>

          {/* Original Claim */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">
              ORIGINAL EXTRACTED CLAIM
            </label>
            <div className="mt-1.5 rounded-lg border border-[var(--border-muted)] bg-[var(--card-surface)] p-3 text-sm leading-relaxed text-[var(--text-primary)]">
              {claim.originalClaim}
            </div>
          </div>

          {/* Reference Sentence / Evidence Section */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">
                EXACT GROUND TRUTH REFERENCE SENTENCE
              </label>
              {claim.evidence && (
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  RELATIONSHIP: <span className="text-[var(--text-primary)] uppercase">{claim.evidence.relationship}</span>
                </span>
              )}
            </div>

            {claim.evidence ? (
              <div className="mt-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--highlight-bg)] p-4">
                <blockquote className="border-l-2 border-[var(--text-primary)] pl-3 text-sm italic leading-relaxed text-[var(--text-primary)]">
                  "{claim.evidence.exactSentence}"
                </blockquote>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-muted)] pt-2 text-[11px] font-mono text-[var(--text-secondary)]">
                  <span className="flex items-center space-x-1">
                    <FileText className="h-3 w-3 text-[var(--text-primary)]" />
                    <span>SOURCE: {claim.evidence.source}</span>
                  </span>
                  {claim.evidence.pageNumber && (
                    <span>PAGE {claim.evidence.pageNumber}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-1.5 rounded-lg border border-[var(--status-unsupported)] bg-[var(--status-unsupported-bg)] p-4 text-xs leading-relaxed text-[var(--status-unsupported)]">
                <div className="font-semibold uppercase tracking-wider">No Source Evidence Identified</div>
                <p className="mt-1 text-[var(--text-secondary)]">
                  In accordance with the VeriTrace zero-fabrication protocol, no matching or conflicting sentence was found in the provided ground truth text. This claim is strictly categorized as Unsupported.
                </p>
              </div>
            )}
          </div>

          {/* Explanation */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">
              VERIFICATION RATIONALE & ANALYSIS
            </label>
            <div className="mt-1.5 rounded-lg border border-[var(--border-muted)] bg-[var(--card-surface)] p-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              {claim.explanation}
              {claim.evidence?.explanation && (
                <p className="mt-2 text-[var(--text-primary)] border-t border-[var(--border-muted)] pt-2">
                  {claim.evidence.explanation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-[var(--border-muted)] pt-4">
          <button
            onClick={onClose}
            className="rounded border border-[var(--border-color)] bg-[var(--btn-primary-bg)] px-4 py-2 font-michroma text-[11px] uppercase tracking-wider text-[var(--btn-primary-text)] hover:opacity-90"
          >
            CLOSE EXPLORER
          </button>
        </div>
      </div>
    </div>
  );
}
