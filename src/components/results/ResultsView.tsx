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
    <div className="flex flex-col w-full min-h-full p-4 md:p-6 lg:p-8 space-y-6 max-w-[1580px] mx-auto text-[var(--text-primary)]">
      
      {/* Top Bar: Back Action & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-5">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 rounded border border-[var(--border-color)] bg-[var(--card-surface)] px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>BACK TO COCKPIT</span>
          </button>

          <div className="h-4 w-[1px] bg-[var(--border-muted)] hidden sm:block" />

          <div>
            <h1 className="font-michroma text-base md:text-lg font-bold tracking-tight text-[var(--text-primary)]">
              {result.title}
            </h1>
            <p className="text-[11px] font-mono text-[var(--text-secondary)]">
              AUDITED ON {new Date(result.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Real Backend Values Indicator */}
        <div className="flex items-center space-x-2 font-mono text-[11px] text-[var(--text-secondary)]">
          <span>VERITRACE AUDIT ID:</span>
          <span className="rounded bg-[var(--card-surface)] border border-[var(--border-muted)] px-2 py-0.5 text-[var(--text-primary)]">
            {result.id}
          </span>
        </div>
      </div>

      {/* Overview Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Total Claims */}
        <div className="glass-panel rounded-xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="font-michroma text-[10px] uppercase tracking-widest">
              TOTAL CLAIMS
            </span>
            <Layers className="h-4 w-4 text-[var(--text-primary)]" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-michroma text-3xl font-bold text-[var(--text-primary)]">
              {total}
            </span>
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">EXTRACTED</span>
          </div>
        </div>

        {/* Supported */}
        <div className="glass-panel rounded-xl p-4 md:p-5 flex flex-col justify-between border-[var(--status-supported)] bg-[var(--status-supported-bg)]">
          <div className="flex items-center justify-between text-[var(--status-supported)]">
            <span className="font-michroma text-[10px] uppercase tracking-widest font-semibold">
              SUPPORTED
            </span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-michroma text-3xl font-bold text-[var(--status-supported)]">
              {supported}
            </span>
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              {total > 0 ? `${((supported / total) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Contradicted */}
        <div className="glass-panel rounded-xl p-4 md:p-5 flex flex-col justify-between border-[var(--status-contradicted)] bg-[var(--status-contradicted-bg)]">
          <div className="flex items-center justify-between text-[var(--status-contradicted)]">
            <span className="font-michroma text-[10px] uppercase tracking-widest font-semibold">
              CONTRADICTED
            </span>
            <XCircle className="h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-michroma text-3xl font-bold text-[var(--status-contradicted)]">
              {contradicted}
            </span>
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              {total > 0 ? `${((contradicted / total) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Unsupported */}
        <div className="glass-panel rounded-xl p-4 md:p-5 flex flex-col justify-between border-[var(--status-unsupported)] bg-[var(--status-unsupported-bg)]">
          <div className="flex items-center justify-between text-[var(--status-unsupported)]">
            <span className="font-michroma text-[10px] uppercase tracking-widest font-semibold">
              UNSUPPORTED
            </span>
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-michroma text-3xl font-bold text-[var(--status-unsupported)]">
              {unsupported}
            </span>
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              {total > 0 ? `${((unsupported / total) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs using AnimatedBackground Component */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-muted)] pb-4 pt-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-secondary)]">
          <Filter className="h-3.5 w-3.5 text-[var(--text-primary)]" />
          <span>FILTER CLAIMS:</span>
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
              { id: 'ALL', label: `ALL (${total})` },
              { id: 'SUPPORTED', label: `SUPPORTED (${supported})` },
              { id: 'CONTRADICTED', label: `CONTRADICTED (${contradicted})` },
              { id: 'UNSUPPORTED', label: `UNSUPPORTED (${unsupported})` },
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

      {/* Claim Cards Grid */}
      {filteredClaims.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center rounded-xl p-12 text-center">
          <FileCheck2 className="h-8 w-8 text-[var(--text-secondary)]/40 mb-3" />
          <p className="font-michroma text-sm text-[var(--text-primary)]">NO CLAIMS FOUND</p>
          <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
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
