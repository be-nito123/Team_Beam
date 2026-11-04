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
} from 'lucide-react';
import { HistorySession, VerificationStatus } from '@/types/verification';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentTab: 'dashboard' | 'results' | 'history';
  onNavigate: (tab: 'dashboard' | 'results' | 'history') => void;
  onNewAnalysis: () => void;
  recentSessions: HistorySession[];
  onSelectSession: (id: string) => void;
  selectedSessionId?: string;
  onFilterByStatus?: (status: VerificationStatus) => void;
  isMockMode: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  currentTab,
  onNavigate,
  onNewAnalysis,
  recentSessions,
  onSelectSession,
  selectedSessionId,
  onFilterByStatus,
  isMockMode,
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
          'fixed inset-y-0 left-0 z-50 flex w-[265px] flex-col bg-[#0A0A0A] border-r border-[rgba(236,228,180,0.22)] transition-transform duration-300 ease-in-out md:translate-x-0',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-[rgba(236,228,180,0.12)] px-5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded border border-[rgba(236,228,180,0.4)] bg-[rgba(255,255,255,0.03)] text-[#ECE4B4]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-michroma text-sm tracking-[0.2em] text-[#ECE4B4] font-bold">
              VERITRACE
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {isMockMode && (
              <span className="flex items-center space-x-1 rounded border border-[rgba(251,191,36,0.4)] bg-[rgba(251,191,36,0.1)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#FBBF24]">
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                <span>MOCK</span>
              </span>
            )}
            <button
              onClick={onCloseMobile}
              className="p-1 text-[#B9B49B] hover:text-[#ECE4B4] md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Action Button: + NEW ANALYSIS */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewAnalysis();
              onCloseMobile();
            }}
            className="group flex w-full items-center justify-center space-x-2 rounded border border-[rgba(236,228,180,0.3)] bg-[#ECE4B4] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#080808] transition-all hover:bg-[#FFF8D6] hover:shadow-[0_0_15px_rgba(236,228,180,0.25)] active:scale-[0.99]"
          >
            <PlusCircle className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
            <span className="font-michroma text-[11px] tracking-wider">+ NEW ANALYSIS</span>
          </button>
        </div>

        {/* Navigation links */}
        <div className="px-3 py-1 space-y-1">
          <button
            onClick={() => {
              onNavigate('dashboard');
              onCloseMobile();
            }}
            className={cn(
              'flex w-full items-center space-x-3 rounded px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors',
              currentTab === 'dashboard'
                ? 'bg-[rgba(255,255,255,0.06)] text-[#ECE4B4] border-l-2 border-[#ECE4B4]'
                : 'text-[#B9B49B] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#ECE4B4]'
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
                ? 'bg-[rgba(255,255,255,0.06)] text-[#ECE4B4] border-l-2 border-[#ECE4B4]'
                : 'text-[#B9B49B] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#ECE4B4]'
            )}
          >
            <History className="h-4 w-4" />
            <span>HISTORY</span>
          </button>
        </div>

        <div className="mx-4 my-2 border-t border-[rgba(236,228,180,0.1)]" />

        {/* ANALYSIS DETAILS (Expandable) */}
        <div className="px-3">
          <button
            onClick={() => setAnalysisDetailsOpen(!analysisDetailsOpen)}
            className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] uppercase tracking-wider text-[#B9B49B] hover:text-[#ECE4B4]"
          >
            <span className="font-michroma text-[10px] tracking-widest text-[#B9B49B]/90">
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
                className="flex w-full items-center space-x-2.5 rounded px-2.5 py-1.5 text-[#B9B49B] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#4ADE80] transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-[#4ADE80]" />
                <span className="text-[11px] tracking-wide">Supported Claims</span>
              </button>

              <button
                onClick={() => {
                  onFilterByStatus?.('CONTRADICTED');
                  onNavigate('results');
                  onCloseMobile();
                }}
                className="flex w-full items-center space-x-2.5 rounded px-2.5 py-1.5 text-[#B9B49B] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#F87171] transition-colors"
              >
                <XCircle className="h-3.5 w-3.5 text-[#F87171]" />
                <span className="text-[11px] tracking-wide">Contradicted Claims</span>
              </button>

              <button
                onClick={() => {
                  onFilterByStatus?.('UNSUPPORTED');
                  onNavigate('results');
                  onCloseMobile();
                }}
                className="flex w-full items-center space-x-2.5 rounded px-2.5 py-1.5 text-[#B9B49B] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#FBBF24] transition-colors"
              >
                <AlertCircle className="h-3.5 w-3.5 text-[#FBBF24]" />
                <span className="text-[11px] tracking-wide">Unsupported Claims</span>
              </button>
            </div>
          )}
        </div>

        <div className="mx-4 my-2 border-t border-[rgba(236,228,180,0.1)]" />

        {/* RECENT ANALYSES */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="px-3 py-1.5">
            <span className="font-michroma text-[10px] uppercase tracking-widest text-[#B9B49B]/90">
              RECENT ANALYSES
            </span>
          </div>

          <div className="mt-1 space-y-1">
            {recentSessions.length === 0 ? (
              <p className="px-3 py-2 text-[11px] text-[#B9B49B]/60 italic">
                No past analyses recorded.
              </p>
            ) : (
              recentSessions.map((session) => {
                const isSelected = selectedSessionId === session.id;
                return (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      onCloseMobile();
                    }}
                    className={cn(
                      'group flex w-full flex-col items-start rounded px-3 py-2 text-left transition-colors',
                      isSelected
                        ? 'bg-[rgba(255,255,255,0.06)] text-[#ECE4B4] border border-[rgba(236,228,180,0.22)]'
                        : 'text-[#B9B49B] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#ECE4B4]'
                    )}
                  >
                    <span className="line-clamp-1 text-xs font-medium text-[#ECE4B4]">
                      {session.title}
                    </span>
                    <div className="mt-1 flex w-full items-center justify-between text-[10px] text-[#B9B49B]/70">
                      <span>{new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      <div className="flex items-center space-x-1.5 font-mono">
                        <span className="text-[#4ADE80]">{session.summary.supported}S</span>
                        <span className="text-[#F87171]">{session.summary.contradicted}C</span>
                        <span className="text-[#FBBF24]">{session.summary.unsupported}U</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[rgba(236,228,180,0.12)] p-3 space-y-0.5">
          <button
            onClick={() => alert('Settings modal: Model parameters, endpoint URL, and confidence threshold configurations.')}
            className="flex w-full items-center space-x-3 rounded px-3 py-2 text-xs uppercase tracking-wider text-[#B9B49B] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#ECE4B4] transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>SETTINGS</span>
          </button>

          <button
            onClick={() => alert('Help & Support: VeriTrace extracts factual statements from AI text and contrasts against provided ground truth documents without hallucinations.')}
            className="flex w-full items-center space-x-3 rounded px-3 py-2 text-xs uppercase tracking-wider text-[#B9B49B] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#ECE4B4] transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            <span>HELP & SUPPORT</span>
          </button>

          <div className="pt-1">
            <div className="flex items-center space-x-3 rounded border border-[rgba(236,228,180,0.1)] bg-[rgba(255,255,255,0.02)] px-3 py-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(236,228,180,0.1)] text-[#ECE4B4]">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-medium text-[#ECE4B4]">Analyst Node #01</span>
                <span className="text-[10px] text-[#B9B49B]/70 font-mono">READY • STANDBY</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
