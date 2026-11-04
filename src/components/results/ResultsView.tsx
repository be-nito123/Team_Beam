import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCheck2,
  Layers,
  Filter,
} from 'lucide-react';
import {
  VerificationResult,
  VerificationStatus,
  ClaimItem,
} from '@/types/verification';
import { AnimatedBackground } from '@/components/core/AnimatedBackground';
import { ClaimCard } from './ClaimCard';
import { EvidenceExplorerModal } from './EvidenceExplorerModal';
import { cn } from '@/lib/utils';

interface ResultsViewProps {
  result: VerificationResult;
  onBackToDashboard: () => void;
  initialFilter?: VerificationStatus | 'ALL';
}

export function ResultsView({
  result,
  onBackToDashboard,
  initialFilter = 'ALL',
}: ResultsViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem | null>(null);

  const filteredClaims = useMemo(() => {
    if (activeFilter === 'ALL' || !activeFilter) return result.claims;
    return result.claims.filter((c) => c.status === activeFilter);
  }, [result.claims, activeFilter]);

  const { total, supported, contradicted, unsupported } = result.summary;

  return (
    <div className="flex flex-col w-full min-h-full p-4 md:p-6 lg:p-8 space-y-6 max-w-[1580px] mx-auto">
      
      {/* Top Bar: Back Action & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(236,228,180,0.15)] pb-5">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 rounded border border-[rgba(236,228,180,0.22)] bg-[rgba(255,255,255,0.02)] px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[#ECE4B4] hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(236,228,180,0.4)] transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>BACK TO COCKPIT</span>
          </button>

          <div className="h-4 w-[1px] bg-[rgba(236,228,180,0.2)] hidden sm:block" />

          <div>
            <h1 className="font-michroma text-base md:text-lg font-bold tracking-tight text-[#ECE4B4]">
              {result.title}
            </h1>
            <p className="text-[11px] font-mono text-[#B9B49B]/70">
              AUDITED ON {new Date(result.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Real Backend Values Indicator */}
        <div className="flex items-center space-x-2 font-mono text-[11px] text-[#B9B49B]">
          <span>VERITRACE AUDIT ID:</span>
          <span className="rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(236,228,180,0.15)] px-2 py-0.5 text-[#ECE4B4]">
            {result.id}
          </span>
        </div>
      </div>

      {/* Overview Matrix (Real backend values only, no emojis, no generic analytics cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Total Claims */}
        <div className="glass-panel rounded-xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#B9B49B]">
            <span className="font-michroma text-[10px] uppercase tracking-widest">
              TOTAL CLAIMS
            </span>
            <Layers className="h-4 w-4 text-[#ECE4B4]" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-michroma text-3xl font-bold text-[#ECE4B4]">
              {total}
            </span>
            <span className="text-[11px] font-mono text-[#B9B49B]/70">EXTRACTED</span>
          </div>
        </div>

        {/* Supported */}
        <div className="glass-panel rounded-xl p-4 md:p-5 flex flex-col justify-between border-[rgba(74,222,128,0.25)] bg-[rgba(74,222,128,0.02)]">
          <div className="flex items-center justify-between text-[#4ADE80]">
            <span className="font-michroma text-[10px] uppercase tracking-widest">
              SUPPORTED
            </span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-michroma text-3xl font-bold text-[#4ADE80]">
              {supported}
            </span>
            <span className="text-[11px] font-mono text-[#B9B49B]/70">
              {total > 0 ? `${((supported / total) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Contradicted */}
        <div className="glass-panel rounded-xl p-4 md:p-5 flex flex-col justify-between border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.02)]">
          <div className="flex items-center justify-between text-[#F87171]">
            <span className="font-michroma text-[10px] uppercase tracking-widest">
              CONTRADICTED
            </span>
            <XCircle className="h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-michroma text-3xl font-bold text-[#F87171]">
              {contradicted}
            </span>
            <span className="text-[11px] font-mono text-[#B9B49B]/70">
              {total > 0 ? `${((contradicted / total) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Unsupported */}
        <div className="glass-panel rounded-xl p-4 md:p-5 flex flex-col justify-between border-[rgba(251,191,36,0.25)] bg-[rgba(251,191,36,0.02)]">
          <div className="flex items-center justify-between text-[#FBBF24]">
            <span className="font-michroma text-[10px] uppercase tracking-widest">
              UNSUPPORTED
            </span>
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-michroma text-3xl font-bold text-[#FBBF24]">
              {unsupported}
            </span>
            <span className="text-[11px] font-mono text-[#B9B49B]/70">
              {total > 0 ? `${((unsupported / total) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs using AnimatedBackground Component */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(236,228,180,0.12)] pb-4 pt-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#B9B49B]">
          <Filter className="h-3.5 w-3.5 text-[#ECE4B4]" />
          <span>FILTER CLAIMS:</span>
        </div>

        <div className="rounded-lg border border-[rgba(236,228,180,0.22)] bg-[rgba(255,255,255,0.02)] p-1">
          <AnimatedBackground
            defaultValue={activeFilter}
            value={activeFilter}
            onValueChange={(newId) => {
              if (newId) setActiveFilter(newId);
            }}
            enableHover={true}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
            className="bg-[#ECE4B4] rounded-md shadow-sm"
          >
            <button
              data-id="ALL"
              className={cn(
                'px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors',
                activeFilter === 'ALL'
                  ? 'text-[#080808]'
                  : 'text-[#B9B49B] hover:text-[#ECE4B4]'
              )}
            >
              ALL ({total})
            </button>

            <button
              data-id="SUPPORTED"
              className={cn(
                'px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors',
                activeFilter === 'SUPPORTED'
                  ? 'text-[#080808]'
                  : 'text-[#B9B49B] hover:text-[#4ADE80]'
              )}
            >
              SUPPORTED ({supported})
            </button>

            <button
              data-id="CONTRADICTED"
              className={cn(
                'px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors',
                activeFilter === 'CONTRADICTED'
                  ? 'text-[#080808]'
                  : 'text-[#B9B49B] hover:text-[#F87171]'
              )}
            >
              CONTRADICTED ({contradicted})
            </button>

            <button
              data-id="UNSUPPORTED"
              className={cn(
                'px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors',
                activeFilter === 'UNSUPPORTED'
                  ? 'text-[#080808]'
                  : 'text-[#B9B49B] hover:text-[#FBBF24]'
              )}
            >
              UNSUPPORTED ({unsupported})
            </button>
          </AnimatedBackground>
        </div>
      </div>

      {/* Claim Cards Grid */}
      {filteredClaims.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center rounded-xl p-12 text-center">
          <FileCheck2 className="h-8 w-8 text-[#B9B49B]/40 mb-3" />
          <p className="font-michroma text-sm text-[#ECE4B4]">NO CLAIMS FOUND</p>
          <p className="text-xs font-mono text-[#B9B49B]/70 mt-1">
            No claims match filter status "{activeFilter}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredClaims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onOpenExplorer={setSelectedClaim}
            />
          ))}
        </div>
      )}

      {/* Evidence Explorer Modal */}
      <EvidenceExplorerModal
        claim={selectedClaim}
        onClose={() => setSelectedClaim(null)}
      />
    </div>
  );
}
