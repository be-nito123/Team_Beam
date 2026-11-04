import React, { useState } from 'react';
import {
  PlusCircle,
  LayoutDashboard,
  History,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Settings,
  HelpCircle,
  User,
  ShieldCheck,
  X,
  Radio,
  Sparkles,
  Files,
  Percent,
} from 'lucide-react';
import { HistorySession, VerificationStatus } from '@/types/verification';
import { PlagiarismSession } from '@/types/plagiarism';
import { ProductModule } from './Header';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeModule: ProductModule;
  onSwitchModule: (module: ProductModule) => void;
  currentTab: 'dashboard' | 'results' | 'history';
  onNavigate: (tab: 'dashboard' | 'results' | 'history') => void;
  onNewAction: () => void;
  recentAiSessions: HistorySession[];
  onSelectAiSession: (id: string) => void;
  selectedAiSessionId?: string;
  onFilterByStatus?: (status: VerificationStatus) => void;
  isMockMode: boolean;
  recentPlagiarismSessions: PlagiarismSession[];
  onSelectPlagiarismSession: (id: string) => void;
  selectedPlagiarismSessionId?: string;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeModule,
  onSwitchModule,
  currentTab,
  onNavigate,
  onNewAction,
  recentAiSessions,
  onSelectAiSession,
  selectedAiSessionId,
  onFilterByStatus,
  isMockMode,
  recentPlagiarismSessions,
  onSelectPlagiarismSession,
  selectedPlagiarismSessionId,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  const [analysisDetailsOpen, setAnalysisDetailsOpen] = useState(true);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[265px] flex-col bg-[var(--sidebar-color)] border-r border-[var(--border-color)] transition-transform duration-300 ease-in-out md:translate-x-0 text-[var(--text-primary)]',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--border-muted)] px-5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded border border-[var(--border-color)] bg-[var(--card-surface)] text-[var(--text-primary)]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-michroma text-sm tracking-[0.2em] text-[var(--text-primary)] font-bold">
              VERITRACE
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {isMockMode && activeModule === 'ai-verification' && (
              <span className="flex items-center space-x-1 rounded border border-[var(--status-unsupported)] bg-[var(--status-unsupported-bg)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--status-unsupported)]">
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                <span>MOCK</span>
              </span>
            )}
            <button
              onClick={onCloseMobile}
              className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewAction();
              onCloseMobile();
            }}
            className="group flex w-full items-center justify-center space-x-2 rounded border border-[var(--border-color)] bg-[var(--btn-primary-bg)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--btn-primary-text)] transition-all hover:opacity-90 active:scale-[0.99] shadow-sm"
          >
            <PlusCircle className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
            <span className="font-michroma text-[11px] tracking-wider">
              {activeModule === 'ai-verification' ? '+ NEW ANALYSIS' : '+ NEW PLAGIARISM CHECK'}
            </span>
          </button>
        </div>

        {/* WORKSPACES SECTION (Highlight the active workspace) */}
        <div className="px-3 pb-2">
          <div className="px-3 py-1">
            <span className="font-michroma text-[9px] uppercase tracking-widest text-[var(--text-secondary)]">
              WORKSPACES
            </span>
          </div>
          <div className="space-y-1 mt-1">
            <button
              onClick={() => {
                onSwitchModule('ai-verification');
                onCloseMobile();
              }}
              className={cn(
                'flex w-full items-center space-x-2.5 rounded px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors',
                activeModule === 'ai-verification'
                  ? 'bg-[var(--card-surface)] text-[var(--text-primary)] border-l-2 border-[var(--accent)] font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--card-surface)] hover:text-[var(--text-primary)]'
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Verification</span>
            </button>

            <button
              onClick={() => {
                onSwitchModule('plagiarism');
                onCloseMobile();
              }}
              className={cn(
                'flex w-full items-center space-x-2.5 rounded px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors',
                activeModule === 'plagiarism'
                  ? 'bg-[var(--card-surface)] text-[var(--text-primary)] border-l-2 border-[var(--accent)] font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--card-surface)] hover:text-[var(--text-primary)]'
              )}
            >
              <Files className="h-3.5 w-3.5" />
              <span>Plagiarism Checker</span>
            </button>
          </div>
        </div>

        <div className="mx-4 my-1 border-t border-[var(--border-muted)]" />

        {/* Navigation links (Dashboard, History) */}
        <div className="px-3 py-1 space-y-1">
          <button
            onClick={() => {
              onNavigate('dashboard');
              onCloseMobile();
            }}
            className={cn(
              'flex w-full items-center space-x-3 rounded px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors',
              currentTab === 'dashboard'
                ? 'bg-[var(--card-surface)] text-[var(--text-primary)] border-l-2 border-[var(--text-primary)] font-semibold'
                : 'text-[var(--text-secondary)] hover:bg-[var(--card-surface)] hover:text-[var(--text-primary)]'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>DASHBOARD</span>
          </button>

          <button
            onClick={() => {
              onNavigate('history');
              onCloseMobile();
            }}
            className={cn(
              'flex w-full items-center space-x-3 rounded px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors',
              currentTab === 'history'
                ? 'bg-[var(--card-surface)] text-[var(--text-primary)] border-l-2 border-[var(--text-primary)] font-semibold'
                : 'text-[var(--text-secondary)] hover:bg-[var(--card-surface)] hover:text-[var(--text-primary)]'
            )}
          >
            <History className="h-4 w-4" />
            <span>HISTORY</span>
          </button>
        </div>

        <div className="mx-4 my-1 border-t border-[var(--border-muted)]" />

        {/* AI VERIFICATION EXTRAS: ANALYSIS DETAILS */}
        {activeModule === 'ai-verification' && (
          <div className="px-3">
            <button
              onClick={() => setAnalysisDetailsOpen(!analysisDetailsOpen)}
              className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <span className="font-michroma text-[9px] tracking-widest text-[var(--text-secondary)]">
                ANALYSIS DETAILS
              </span>
              {analysisDetailsOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>

            {analysisDetailsOpen && (
              <div className="mt-1 space-y-0.5 pl-2 text-xs">
                <button
                  onClick={() => {
                    onFilterByStatus?.('SUPPORTED');
                    onNavigate('results');
                    onCloseMobile();
                  }}
                  className="flex w-full items-center space-x-2.5 rounded px-2.5 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--card-surface)] hover:text-[var(--status-supported)] transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--status-supported)]" />
                  <span className="text-[11px] tracking-wide">Supported Claims</span>
                </button>

                <button
                  onClick={() => {
                    onFilterByStatus?.('CONTRADICTED');
                    onNavigate('results');
                    onCloseMobile();
                  }}
                  className="flex w-full items-center space-x-2.5 rounded px-2.5 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--card-surface)] hover:text-[var(--status-contradicted)] transition-colors"
                >
                  <XCircle className="h-3.5 w-3.5 text-[var(--status-contradicted)]" />
                  <span className="text-[11px] tracking-wide">Contradicted Claims</span>
                </button>

                <button
                  onClick={() => {
                    onFilterByStatus?.('UNSUPPORTED');
                    onNavigate('results');
                    onCloseMobile();
                  }}
                  className="flex w-full items-center space-x-2.5 rounded px-2.5 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--card-surface)] hover:text-[var(--status-unsupported)] transition-colors"
                >
                  <AlertCircle className="h-3.5 w-3.5 text-[var(--status-unsupported)]" />
                  <span className="text-[11px] tracking-wide">Unsupported Claims</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* RECENT ANALYSES / RECENT PLAGIARISM CHECKS */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="px-3 py-1">
            <span className="font-michroma text-[9px] uppercase tracking-widest text-[var(--text-secondary)]">
              {activeModule === 'ai-verification' ? 'RECENT ANALYSES' : 'RECENT PLAGIARISM CHECKS'}
            </span>
          </div>

          <div className="mt-1 space-y-1">
            {activeModule === 'ai-verification' ? (
              recentAiSessions.length === 0 ? (
                <p className="px-3 py-2 text-[11px] text-[var(--text-secondary)]/70 italic">
                  No past analyses recorded.
                </p>
              ) : (
                recentAiSessions.map((session) => {
                  const isSelected = selectedAiSessionId === session.id;
                  return (
                    <button
                      key={session.id}
                      onClick={() => {
                        onSelectAiSession(session.id);
                        onCloseMobile();
                      }}
                      className={cn(
                        'group flex w-full flex-col items-start rounded px-3 py-2 text-left transition-colors',
                        isSelected
                          ? 'bg-[var(--card-surface)] text-[var(--text-primary)] border border-[var(--border-color)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--card-surface)] hover:text-[var(--text-primary)]'
                      )}
                    >
                      <span className="line-clamp-1 text-xs font-medium text-[var(--text-primary)]">
                        {session.title}
                      </span>
                      <div className="mt-1 flex w-full items-center justify-between text-[10px] text-[var(--text-secondary)]">
                        <span>
                          {new Date(session.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <div className="flex items-center space-x-1.5 font-mono">
                          <span className="text-[var(--status-supported)]">{session.summary.supported}S</span>
                          <span className="text-[var(--status-contradicted)]">{session.summary.contradicted}C</span>
                          <span className="text-[var(--status-unsupported)]">{session.summary.unsupported}U</span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )
            ) : recentPlagiarismSessions.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-[var(--text-secondary)]/70 italic">
                No similarity audits yet.
              </p>
            ) : (
              recentPlagiarismSessions.map((session) => {
                const isSelected = selectedPlagiarismSessionId === session.id;
                return (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelectPlagiarismSession(session.id);
                      onCloseMobile();
                    }}
                    className={cn(
                      'group flex w-full flex-col items-start rounded px-3 py-2 text-left transition-colors',
                      isSelected
                        ? 'bg-[var(--card-surface)] text-[var(--text-primary)] border border-[var(--border-color)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--card-surface)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    <span className="line-clamp-1 text-xs font-medium text-[var(--text-primary)]">
                      {session.documentName}
                    </span>
                    <div className="mt-1 flex w-full items-center justify-between text-[10px] text-[var(--text-secondary)] font-mono">
                      <span>
                        {new Date(session.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className={cn(
                        'font-bold',
                        session.similarityPercentage > 30
                          ? 'text-[var(--status-contradicted)]'
                          : session.similarityPercentage > 10
                          ? 'text-[var(--status-unsupported)]'
                          : 'text-[var(--status-supported)]'
                      )}>
                        {session.similarityPercentage.toFixed(0)}% Match
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[var(--border-muted)] p-3 space-y-0.5">
          <button
            onClick={() =>
              alert(
                'Settings: Configure verification thresholds, similarity matching sensitivity, and backend endpoints.'
              )
            }
            className="flex w-full items-center space-x-3 rounded px-3 py-2 text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:bg-[var(--card-surface)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>SETTINGS</span>
          </button>

          <button
            onClick={() =>
              alert(
                'Help & Support: VeriTrace dual-engine provides factual hallucination verification against ground truth text, and document similarity/originality comparison.'
              )
            }
            className="flex w-full items-center space-x-3 rounded px-3 py-2 text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:bg-[var(--card-surface)] hover:text-[var(--text-primary)] transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            <span>HELP & SUPPORT</span>
          </button>

          <div className="pt-1">
            <div className="flex items-center space-x-3 rounded border border-[var(--border-muted)] bg-[var(--card-surface)] px-3 py-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--border-muted)] text-[var(--text-primary)]">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-medium text-[var(--text-primary)]">Analyst Node #01</span>
                <span className="text-[10px] text-[var(--text-secondary)] font-mono">READY • STANDBY</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
