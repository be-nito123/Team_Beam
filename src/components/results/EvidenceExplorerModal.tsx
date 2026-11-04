import React from 'react';
import { X, CheckCircle2, XCircle, AlertCircle, FileText, Compass, ExternalLink } from 'lucide-react';
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
      border: 'border-[rgba(74,222,128,0.3)]',
      bg: 'bg-[rgba(74,222,128,0.08)]',
      text: 'text-[#4ADE80]',
      badgeBorder: 'border-[#4ADE80]/40',
    },
    CONTRADICTED: {
      label: 'CONTRADICTED',
      icon: XCircle,
      border: 'border-[rgba(248,113,113,0.3)]',
      bg: 'bg-[rgba(248,113,113,0.08)]',
      text: 'text-[#F87171]',
      badgeBorder: 'border-[#F87171]/40',
    },
    UNSUPPORTED: {
      label: 'UNSUPPORTED',
      icon: AlertCircle,
      border: 'border-[rgba(251,191,36,0.3)]',
      bg: 'bg-[rgba(251,191,36,0.08)]',
      text: 'text-[#FBBF24]',
      badgeBorder: 'border-[#FBBF24]/40',
    },
  }[claim.status];

  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className="glass-panel relative flex w-full max-w-2xl flex-col rounded-xl border border-[rgba(236,228,180,0.3)] bg-[#0A0A0A] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(236,228,180,0.15)] pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-7 w-7 items-center justify-center rounded border border-[rgba(236,228,180,0.2)] bg-[rgba(255,255,255,0.03)] text-[#ECE4B4]">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span className="font-michroma text-xs tracking-widest text-[#ECE4B4]">
                EVIDENCE EXPLORER
              </span>
              <span className="ml-2 font-mono text-xs text-[#B9B49B]">
                // CLAIM {String(claim.claimNumber).padStart(2, '0')}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1 text-[#B9B49B] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#ECE4B4]"
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
                'inline-flex items-center space-x-1.5 rounded border px-2.5 py-1 text-xs font-mono tracking-wider',
                statusConfig.badgeBorder,
                statusConfig.bg,
                statusConfig.text
              )}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              <span>{statusConfig.label}</span>
            </div>

            {claim.confidence !== undefined && (
              <div className="text-xs font-mono text-[#B9B49B]">
                CONFIDENCE RATIO: <span className="text-[#ECE4B4] font-bold">{(claim.confidence * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>

          {/* Original Claim */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#B9B49B]/70">
              ORIGINAL EXTRACTED CLAIM
            </label>
            <div className="mt-1.5 rounded-lg border border-[rgba(236,228,180,0.15)] bg-[rgba(255,255,255,0.02)] p-3 text-sm leading-relaxed text-[#ECE4B4]">
              {claim.originalClaim}
            </div>
          </div>

          {/* Reference Sentence / Evidence Section */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#B9B49B]/70">
                EXACT GROUND TRUTH REFERENCE SENTENCE
              </label>
              {claim.evidence && (
                <span className="text-[10px] font-mono text-[#B9B49B]">
                  RELATIONSHIP: <span className="text-[#ECE4B4] uppercase">{claim.evidence.relationship}</span>
                </span>
              )}
            </div>

            {claim.evidence ? (
              <div className="mt-1.5 rounded-lg border border-[#ECE4B4]/30 bg-[rgba(236,228,180,0.04)] p-4">
                <blockquote className="border-l-2 border-[#ECE4B4] pl-3 text-sm italic leading-relaxed text-[#ECE4B4]">
                  "{claim.evidence.exactSentence}"
                </blockquote>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(236,228,180,0.1)] pt-2 text-[11px] font-mono text-[#B9B49B]">
                  <span className="flex items-center space-x-1">
                    <FileText className="h-3 w-3 text-[#ECE4B4]" />
                    <span>SOURCE: {claim.evidence.source}</span>
                  </span>
                  {claim.evidence.pageNumber && (
                    <span>PAGE {claim.evidence.pageNumber}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-1.5 rounded-lg border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.04)] p-4 text-xs leading-relaxed text-[#FBBF24]">
                <div className="font-semibold uppercase tracking-wider">No Source Evidence Identified</div>
                <p className="mt-1 text-[#B9B49B]">
                  In accordance with the VeriTrace zero-fabrication protocol, no matching or conflicting sentence was found in the provided ground truth text. This claim is strictly categorized as Unsupported.
                </p>
              </div>
            )}
          </div>

          {/* Explanation */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#B9B49B]/70">
              VERIFICATION RATIONALE & ANALYSIS
            </label>
            <div className="mt-1.5 rounded-lg border border-[rgba(236,228,180,0.1)] bg-[rgba(255,255,255,0.015)] p-3 text-xs leading-relaxed text-[#B9B49B]">
              {claim.explanation}
              {claim.evidence?.explanation && (
                <p className="mt-2 text-[#ECE4B4]/90 border-t border-[rgba(236,228,180,0.1)] pt-2">
                  {claim.evidence.explanation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-[rgba(236,228,180,0.15)] pt-4">
          <button
            onClick={onClose}
            className="rounded border border-[rgba(236,228,180,0.3)] bg-[#ECE4B4] px-4 py-2 font-michroma text-[11px] uppercase tracking-wider text-[#080808] hover:bg-[#FFF8D6]"
          >
            CLOSE EXPLORER
          </button>
        </div>
      </div>
    </div>
  );
}
