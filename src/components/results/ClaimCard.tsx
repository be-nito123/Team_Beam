import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileSearch,
  ArrowUpRight,
  Shield,
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
      border: 'border-[rgba(74,222,128,0.25)]',
      bg: 'bg-[rgba(74,222,128,0.06)]',
      text: 'text-[#4ADE80]',
      hoverBorder: 'hover:border-[rgba(74,222,128,0.45)]',
    },
    CONTRADICTED: {
      label: 'CONTRADICTED',
      icon: XCircle,
      border: 'border-[rgba(248,113,113,0.25)]',
      bg: 'bg-[rgba(248,113,113,0.06)]',
      text: 'text-[#F87171]',
      hoverBorder: 'hover:border-[rgba(248,113,113,0.45)]',
    },
    UNSUPPORTED: {
      label: 'UNSUPPORTED',
      icon: AlertCircle,
      border: 'border-[rgba(251,191,36,0.25)]',
      bg: 'bg-[rgba(251,191,36,0.06)]',
      text: 'text-[#FBBF24]',
      hoverBorder: 'hover:border-[rgba(251,191,36,0.45)]',
    },
  }[claim.status];

  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={cn(
        'glass-panel relative flex flex-col justify-between rounded-xl p-5 md:p-6 transition-all duration-200 border-[rgba(236,228,180,0.18)] hover:border-[rgba(236,228,180,0.38)] hover:shadow-[0_0_20px_rgba(236,228,180,0.03)]',
        statusConfig.hoverBorder
      )}
    >
      <div>
        {/* Header row: Claim Number & Status Badge */}
        <div className="flex items-center justify-between border-b border-[rgba(236,228,180,0.1)] pb-3">
          <div className="flex items-baseline space-x-2">
            <span className="font-michroma text-lg font-bold tracking-tight text-[#ECE4B4]">
              {String(claim.claimNumber).padStart(2, '0')}/
            </span>
            <span className="font-michroma text-[10px] uppercase tracking-widest text-[#B9B49B]">
              CLAIM
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            {claim.confidence !== undefined && (
              <span className="font-mono text-[11px] text-[#B9B49B]/80">
                {(claim.confidence * 100).toFixed(0)}% CONF
              </span>
            )}

            <div
              className={cn(
                'flex items-center space-x-1.5 rounded border px-2.5 py-0.5 text-[11px] font-mono tracking-wider',
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
          <p className="text-sm font-medium leading-relaxed text-[#ECE4B4]">
            {claim.originalClaim}
          </p>
        </div>

        {/* Explanation */}
        <div className="mt-3 rounded-lg border border-[rgba(236,228,180,0.08)] bg-[rgba(255,255,255,0.015)] p-3">
          <p className="text-xs leading-relaxed text-[#B9B49B]">
            {claim.explanation}
          </p>
        </div>

        {/* Evidence Snippet preview if available */}
        {claim.evidence ? (
          <div className="mt-3 rounded border-l-2 border-[#ECE4B4]/40 bg-[rgba(255,255,255,0.01)] pl-3 py-1 text-xs">
            <span className="font-mono text-[10px] uppercase text-[#B9B49B]/60 block mb-0.5">
              SOURCE REFERENCE:
            </span>
            <p className="text-xs italic text-[#ECE4B4]/90 line-clamp-2">
              "{claim.evidence.exactSentence}"
            </p>
          </div>
        ) : (
          <div className="mt-3 py-1 text-[11px] font-mono text-[#FBBF24]/80">
            [!] ZERO CORROBORATING EVIDENCE IN REFERENCE TEXT
          </div>
        )}
      </div>

      {/* Action Footer: Evidence Explorer Button */}
      <div className="mt-5 border-t border-[rgba(236,228,180,0.1)] pt-3.5 flex items-center justify-between">
        <span className="font-mono text-[10px] text-[#B9B49B]/60 uppercase">
          {claim.evidence ? claim.evidence.source : 'NO EVIDENCE MAPPED'}
        </span>

        <button
          type="button"
          onClick={() => onOpenExplorer(claim)}
          className="group inline-flex items-center space-x-1 text-xs font-mono uppercase tracking-wider text-[#ECE4B4] hover:text-[#FFF8D6] transition-colors"
        >
          <span>EVIDENCE EXPLORER</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
