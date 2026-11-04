import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { HistorySession } from '@/types/verification';
import { cn } from '@/lib/utils';

interface HistoryViewProps {
  sessions: HistorySession[];
  onSelectSession: (id: string) => void;
  onNewAnalysis: () => void;
}

export function HistoryView({
  sessions,
  onSelectSession,
  onNewAnalysis,
}: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriterion, setFilterCriterion] = useState<'ALL' | 'CONTRADICTED' | 'SUPPORTED' | 'UNSUPPORTED'>('ALL');

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.aiClaimExcerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.referenceExcerpt.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterCriterion === 'CONTRADICTED') return s.summary.contradicted > 0;
      if (filterCriterion === 'SUPPORTED') return s.summary.supported === s.summary.total;
      if (filterCriterion === 'UNSUPPORTED') return s.summary.unsupported > 0;
      return true;
    });
  }, [sessions, searchQuery, filterCriterion]);

  return (
    <div className="flex flex-col w-full min-h-full p-4 md:p-6 lg:p-8 space-y-6 max-w-[1580px] mx-auto text-[var(--text-primary)]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-5">
        <div>
          <h1 className="font-michroma text-lg md:text-xl font-bold tracking-tight text-[var(--text-primary)]">
            VERIFICATION REGISTRY
          </h1>
          <p className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-secondary)] mt-1">
            ARCHIVED SESSIONS & AUDIT TRAIL ({sessions.length} RECORDED)
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          className="rounded border border-[var(--border-color)] bg-[var(--btn-primary-bg)] px-4 py-2 font-michroma text-xs font-semibold uppercase tracking-wider text-[var(--btn-primary-text)] hover:opacity-90 transition-all"
        >
          + NEW VERIFICATION
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past analyses, claims, or citations..."
            className="input-glass w-full rounded-lg pl-9 pr-4 py-2 text-xs font-mono"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { id: 'ALL', label: 'ALL SESSIONS' },
              { id: 'CONTRADICTED', label: 'HAS CONTRADICTIONS' },
              { id: 'SUPPORTED', label: '100% SUPPORTED' },
              { id: 'UNSUPPORTED', label: 'HAS UNSUPPORTED' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterCriterion(item.id)}
              className={cn(
                'whitespace-nowrap rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
                filterCriterion === item.id
                  ? 'border-[var(--text-primary)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-bold'
                  : 'border-[var(--border-color)] bg-[var(--card-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center rounded-xl p-16 text-center">
          <Clock className="h-10 w-10 text-[var(--text-secondary)]/40 mb-3" />
          <p className="font-michroma text-sm text-[var(--text-primary)]">NO MATCHING SESSIONS</p>
          <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
            Try adjusting your query or filter parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className="glass-panel group relative flex flex-col justify-between rounded-xl p-5 md:p-6 transition-all duration-200 cursor-pointer border-[var(--border-color)] hover:border-[var(--border-hover)]"
            >
              <div>
                {/* Timestamp & ID */}
                <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-3 text-[10px] font-mono text-[var(--text-secondary)]">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-[var(--text-primary)]" />
                    <span>
                      {new Date(session.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </span>
                  <span className="rounded bg-[var(--card-surface)] px-1.5 py-0.5 border border-[var(--border-muted)]">
                    {session.id}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-3 font-michroma text-sm font-semibold leading-snug text-[var(--text-primary)] truncate">
                  {session.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-2 text-xs italic text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  "{session.aiClaimExcerpt}"
                </p>

                {/* Breakdown Badges */}
                <div className="mt-4 flex items-center space-x-2 font-mono text-[11px]">
                  <span className="flex items-center space-x-1 rounded border border-[var(--status-supported)] bg-[var(--status-supported-bg)] px-2 py-0.5 text-[var(--status-supported)]">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{session.summary.supported} Sup</span>
                  </span>

                  <span className="flex items-center space-x-1 rounded border border-[var(--status-contradicted)] bg-[var(--status-contradicted-bg)] px-2 py-0.5 text-[var(--status-contradicted)]">
                    <XCircle className="h-3 w-3" />
                    <span>{session.summary.contradicted} Con</span>
                  </span>

                  <span className="flex items-center space-x-1 rounded border border-[var(--status-unsupported)] bg-[var(--status-unsupported-bg)] px-2 py-0.5 text-[var(--status-unsupported)]">
                    <AlertCircle className="h-3 w-3" />
                    <span>{session.summary.unsupported} Uns</span>
                  </span>
                </div>
              </div>

              {/* Action footer */}
              <div className="mt-5 border-t border-[var(--border-muted)] pt-3 flex items-center justify-between text-xs font-mono text-[var(--text-primary)]">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase">
                  TOTAL CLAIMS: {session.summary.total}
                </span>

                <div className="flex items-center space-x-1 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>REOPEN AUDIT</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
