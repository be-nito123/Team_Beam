import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { ClaimItem } from '@/types/verification';
import { cn } from '@/lib/utils';

interface ClaimCardProps {
  claim: ClaimItem;
  onOpenExplorer: (claim: ClaimItem) => void;
}

export function ClaimCard({ claim, onOpenExplorer }: ClaimCardProps) {
  const statusConfig = {
    SUPPORTED: {
      label: 'SUPPORTED',
      icon: CheckCircle2,
      border: 'border-[var(--status-supported)]',
      bg: 'bg-[var(--status-supported-bg)]',
      text: 'text-[var(--status-supported)]',
      hoverBorder: 'hover:border-[var(--status-supported)]',
    },
    CONTRADICTED: {
      label: 'CONTRADICTED',
      icon: XCircle,
      border: 'border-[var(--status-contradicted)]',
      bg: 'bg-[var(--status-contradicted-bg)]',
      text: 'text-[var(--status-contradicted)]',
      hoverBorder: 'hover:border-[var(--status-contradicted)]',
    },
    UNSUPPORTED: {
      label: 'UNSUPPORTED',
      icon: AlertCircle,
      border: 'border-[var(--status-unsupported)]',
      bg: 'bg-[var(--status-unsupported-bg)]',
      text: 'text-[var(--status-unsupported)]',
      hoverBorder: 'hover:border-[var(--status-unsupported)]',
    },
  }[claim.status];

  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={cn(
        'glass-panel relative flex flex-col justify-between rounded-xl p-5 md:p-6 transition-all duration-200 border-[var(--border-color)] hover:border-[var(--border-hover)] hover:shadow-md text-[var(--text-primary)]',
        statusConfig.hoverBorder
      )}
    >
      <div>
        {/* Header row: Claim Number & Status Badge */}
        <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-3">
          <div className="flex items-baseline space-x-2">
            <span className="font-michroma text-lg font-bold tracking-tight text-[var(--text-primary)]">
              {String(claim.claimNumber).padStart(2, '0')}/
            </span>
            <span className="font-michroma text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
              CLAIM
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            {claim.confidence !== undefined && (
              <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                {(claim.confidence * 100).toFixed(0)}% CONF
              </span>
            )}

            <div
              className={cn(
                'flex items-center space-x-1.5 rounded border px-2.5 py-0.5 text-[11px] font-mono tracking-wider font-semibold',
                statusConfig.border,
                statusConfig.bg,
                statusConfig.text
              )}
            >
              <StatusIcon className="h-3 w-3" />
              <span>{statusConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Claim Text */}
        <div className="mt-3.5">
          <p className="break-words text-sm font-medium leading-relaxed text-[var(--text-primary)]">
            {claim.originalClaim}
          </p>
        </div>

        {/* Explanation */}
        <div className="mt-3 rounded-lg border border-[var(--border-muted)] bg-[var(--card-surface)] p-3">
          <p className="break-words text-xs leading-relaxed text-[var(--text-secondary)]">
            {claim.explanation}
          </p>
        </div>

        {/* Evidence Snippet preview if available */}
        {claim.evidence ? (
          <div className="mt-3 rounded border-l-2 border-[var(--accent)] bg-[var(--card-surface)] pl-3 py-1.5 text-xs">
            <span className="font-mono text-[10px] uppercase text-[var(--text-secondary)] block mb-0.5">
              SOURCE REFERENCE:
            </span>
            <p className="break-words text-xs italic text-[var(--text-primary)] line-clamp-2">
              "{claim.evidence.exactSentence}"
            </p>
          </div>
        ) : (
          <div className="mt-3 py-1 text-[11px] font-mono text-[var(--status-unsupported)]">
            [!] ZERO CORROBORATING EVIDENCE IN REFERENCE TEXT
          </div>
        )}
      </div>

      {/* Action Footer: Evidence Explorer Button */}
      <div className="mt-5 border-t border-[var(--border-muted)] pt-3.5 flex items-center justify-between">
        <span title={claim.evidence?.source} className="min-w-0 max-w-[48%] truncate font-mono text-[10px] text-[var(--text-secondary)] uppercase">
          {claim.evidence ? claim.evidence.source : 'NO EVIDENCE MAPPED'}
        </span>

        <button
          type="button"
          onClick={() => onOpenExplorer(claim)}
          className="group inline-flex items-center space-x-1 text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] hover:opacity-80 transition-opacity"
        >
          <span>EVIDENCE EXPLORER</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
