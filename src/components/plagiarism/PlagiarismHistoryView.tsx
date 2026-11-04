import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  Layers,
  ArrowRight,
  Percent,
  Trash2,
  Clock,
  BookOpen,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { PlagiarismSession } from '@/types/plagiarism';
import { cn } from '@/lib/utils';

interface PlagiarismHistoryViewProps {
  sessions: PlagiarismSession[];
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onNewCheck: () => void;
}

export function PlagiarismHistoryView({
  sessions,
  onSelectSession,
  onDeleteSession,
  onNewCheck,
}: PlagiarismHistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      return (
        s.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [sessions, searchQuery]);

  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPendingDeleteId(id);
  };

  const handleExecuteDelete = () => {
    if (pendingDeleteId) {
      onDeleteSession(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-full p-4 md:p-6 lg:p-8 space-y-6 max-w-[1580px] mx-auto text-[var(--text-primary)]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-muted)] pb-5">
        <div>
          <h1 className="font-michroma text-lg md:text-xl font-bold tracking-tight text-[var(--text-primary)]">
            PLAGIARISM REVIEW REGISTRY
          </h1>
          <p className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-secondary)] mt-1">
            ARCHIVED SIMILARITY AUDITS ({sessions.length} SESSIONS RECORDED)
          </p>
        </div>

        <button
          onClick={onNewCheck}
          className="rounded border border-[var(--border-color)] bg-[var(--btn-primary-bg)] px-4 py-2 font-michroma text-xs font-semibold uppercase tracking-wider text-[var(--btn-primary-text)] hover:opacity-90 transition-all"
        >
          + NEW PLAGIARISM CHECK
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by document name or session ID..."
          className="input-glass w-full rounded-lg pl-9 pr-4 py-2 text-xs font-mono"
        />
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center rounded-xl p-16 text-center">
          <Clock className="h-10 w-10 text-[var(--text-secondary)]/40 mb-3" />
          <p className="font-michroma text-sm text-[var(--text-primary)]">
            NO RECORDED PLAGIARISM CHECKS
          </p>
          <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
            Completed similarity reviews will appear here in the registry.
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
                  {session.documentName}
                </h3>

                {/* Metadata */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded border border-[var(--border-muted)] bg-[var(--card-surface)] p-2">
                    <span className="text-[10px] text-[var(--text-secondary)] block">
                      OVERALL SIMILARITY
                    </span>
                    <span className={cn(
                      'text-base font-bold',
                      session.similarityPercentage > 30
                        ? 'text-[var(--status-contradicted)]'
                        : session.similarityPercentage > 10
                        ? 'text-[var(--status-unsupported)]'
                        : 'text-[var(--status-supported)]'
                    )}>
                      {session.similarityPercentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="rounded border border-[var(--border-muted)] bg-[var(--card-surface)] p-2">
                    <span className="text-[10px] text-[var(--text-secondary)] block">
                      SOURCES MATCHED
                    </span>
                    <span className="text-base font-bold text-[var(--text-primary)]">
                      {session.matchedSources} of {session.referenceCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action footer */}
              <div className="mt-5 border-t border-[var(--border-muted)] pt-3 flex items-center justify-between text-xs font-mono">
                <button
                  type="button"
                  onClick={(e) => confirmDelete(e, session.id)}
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--status-contradicted)] transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="flex items-center space-x-1 font-semibold text-[var(--text-primary)] group-hover:translate-x-1 transition-transform">
                  <span>REOPEN RESULTS</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] p-5 text-center">
            <AlertTriangle className="h-8 w-8 text-[var(--status-contradicted)] mx-auto mb-2" />
            <h3 className="font-michroma text-sm font-bold text-[var(--text-primary)]">
              CONFIRM DELETION
            </h3>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">
              Are you sure you want to remove this similarity report? This action cannot be undone.
            </p>
            <div className="mt-5 flex space-x-3 justify-center">
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="rounded border border-[var(--border-color)] px-4 py-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="rounded border border-[var(--status-contradicted)] bg-[var(--status-contradicted-bg)] px-4 py-1.5 text-xs font-mono font-bold text-[var(--status-contradicted)] hover:opacity-90"
              >
                DELETE REPORT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
