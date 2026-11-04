import React from 'react';
import {
  CheckCircle2,
  XCircle,
  FileText,
  Bot,
  ArrowDown,
  Info,
  GitCommit,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function HowItWorksExample() {
  return (
    <section
      aria-label="How VeriTrace Works Example"
      className="glass-panel relative w-full max-w-[1580px] rounded-xl border border-[var(--border-color)] bg-[var(--card-surface)] p-5 md:p-7 backdrop-blur-md transition-all duration-300 text-[var(--text-primary)]"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-muted)] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
              METHODOLOGY GUIDE //
            </span>
            <span className="font-michroma text-xs font-bold tracking-widest text-[var(--text-primary)]">
              HOW VERITRACE WORKS
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
            VeriTrace decomposes AI-generated output into atomic factual propositions and rigorously cross-references each claim against ground truth citations.
          </p>
        </div>

        {/* Example Notice Pill */}
        <div className="inline-flex items-center space-x-1.5 self-start sm:self-center rounded border border-[var(--border-color)] bg-[var(--panel-bg)] px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)]">
          <Info className="h-3 w-3 text-[var(--accent)]" />
          <span>ILLUSTRATIVE EXAMPLE • NON-EXECUTABLE</span>
        </div>
      </div>

      {/* Step 1: Input Comparison Box (AI Answer vs Reference Document) */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Answer Box */}
        <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--panel-bg)] p-4">
          <div className="flex items-center justify-between text-[var(--text-secondary)] pb-2 border-b border-[var(--border-muted)]">
            <span className="font-michroma text-[10px] uppercase tracking-widest flex items-center space-x-1.5 text-[var(--text-primary)]">
              <Bot className="h-3.5 w-3.5" />
              <span>AI-GENERATED ANSWER</span>
            </span>
            <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase">SOURCE UNVERIFIED</span>
          </div>
          <p className="mt-2.5 text-xs md:text-sm font-sans leading-relaxed text-[var(--text-primary)]">
            "The Eiffel Tower is located in Berlin, Germany. It was completed in 1889."
          </p>
        </div>

        {/* Reference Document Box */}
        <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--panel-bg)] p-4">
          <div className="flex items-center justify-between text-[var(--text-secondary)] pb-2 border-b border-[var(--border-muted)]">
            <span className="font-michroma text-[10px] uppercase tracking-widest flex items-center space-x-1.5 text-[var(--text-primary)]">
              <FileText className="h-3.5 w-3.5" />
              <span>REFERENCE DOCUMENT</span>
            </span>
            <span className="font-mono text-[10px] text-[var(--status-supported)] uppercase">GROUND TRUTH</span>
          </div>
          <p className="mt-2.5 text-xs md:text-sm font-sans leading-relaxed text-[var(--text-primary)]">
            "The Eiffel Tower is a landmark located in Paris, France. It was completed in 1889."
          </p>
        </div>
      </div>

      {/* Visual Connector / Pipeline Transition */}
      <div className="my-4 flex items-center justify-center">
        <div className="flex items-center space-x-2 rounded-full border border-[var(--border-muted)] bg-[var(--panel-bg)] px-3 py-1 font-mono text-[10px] tracking-widest text-[var(--text-secondary)] uppercase shadow-sm">
          <ArrowDown className="h-3 w-3 text-[var(--text-primary)]" />
          <span>ATOMIC EXTRACTION & VERIFICATION BREAKDOWN</span>
        </div>
      </div>

      {/* Step 2: Verification Breakdown (Two Factual Claims) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CLAIM 1: CONTRADICTED */}
        <div className="relative flex flex-col justify-between rounded-lg border border-[var(--status-contradicted)] bg-[var(--status-contradicted-bg)] p-4 md:p-5 transition-all">
          <div>
            {/* Header: Claim Number & Verdict Badge */}
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-2.5">
              <span className="font-michroma text-xs font-bold tracking-wider text-[var(--text-primary)]">
                CLAIM 01
              </span>
              <span className="flex items-center space-x-1 rounded border border-[var(--status-contradicted)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--status-contradicted)] font-semibold">
                <XCircle className="h-3 w-3" />
                <span>CONTRADICTED</span>
              </span>
            </div>

            {/* Extracted Claim Statement */}
            <div className="mt-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
                EXTRACTED ATOMIC PROPOSITION:
              </span>
              <p className="text-xs md:text-sm font-medium text-[var(--text-primary)]">
                The Eiffel Tower is located in Berlin, Germany.
              </p>
            </div>

            {/* Evidence Link */}
            <div className="mt-3.5 rounded border-l-2 border-[var(--status-contradicted)] bg-[var(--panel-bg)] pl-3 py-2 text-xs">
              <div className="flex items-center space-x-1 font-mono text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mb-0.5">
                <GitCommit className="h-2.5 w-2.5 text-[var(--status-contradicted)]" />
                <span>CORRESPONDING EVIDENCE FROM REFERENCE:</span>
              </div>
              <blockquote className="font-sans italic text-[var(--text-primary)] text-xs">
                "The Eiffel Tower is a landmark located in Paris, France."
              </blockquote>
            </div>

            {/* Explanation */}
            <div className="mt-3 rounded border border-[var(--border-muted)] bg-[var(--panel-bg)] p-2.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-secondary)] block mb-0.5">
                VERDICT EXPLANATION:
              </span>
              <p className="text-xs text-[var(--text-secondary)]">
                The reference document identifies Paris, not Berlin.
              </p>
            </div>
          </div>
        </div>

        {/* CLAIM 2: SUPPORTED */}
        <div className="relative flex flex-col justify-between rounded-lg border border-[var(--status-supported)] bg-[var(--status-supported-bg)] p-4 md:p-5 transition-all">
          <div>
            {/* Header: Claim Number & Verdict Badge */}
            <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-2.5">
              <span className="font-michroma text-xs font-bold tracking-wider text-[var(--text-primary)]">
                CLAIM 02
              </span>
              <span className="flex items-center space-x-1 rounded border border-[var(--status-supported)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--status-supported)] font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                <span>SUPPORTED</span>
              </span>
            </div>

            {/* Extracted Claim Statement */}
            <div className="mt-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
                EXTRACTED ATOMIC PROPOSITION:
              </span>
              <p className="text-xs md:text-sm font-medium text-[var(--text-primary)]">
                The Eiffel Tower was completed in 1889.
              </p>
            </div>

            {/* Evidence Link */}
            <div className="mt-3.5 rounded border-l-2 border-[var(--status-supported)] bg-[var(--panel-bg)] pl-3 py-2 text-xs">
              <div className="flex items-center space-x-1 font-mono text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mb-0.5">
                <GitCommit className="h-2.5 w-2.5 text-[var(--status-supported)]" />
                <span>CORRESPONDING EVIDENCE FROM REFERENCE:</span>
              </div>
              <blockquote className="font-sans italic text-[var(--text-primary)] text-xs">
                "It was completed in 1889."
              </blockquote>
            </div>

            {/* Explanation */}
            <div className="mt-3 rounded border border-[var(--border-muted)] bg-[var(--panel-bg)] p-2.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-secondary)] block mb-0.5">
                VERDICT EXPLANATION:
              </span>
              <p className="text-xs text-[var(--text-secondary)]">
                The reference document confirms the completion year.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
