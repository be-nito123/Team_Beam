import React, { useState } from 'react';
import {
  Upload,
  RotateCcw,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Target,
} from 'lucide-react';
import { BorderTrail } from '@/components/core/BorderTrail';
import { HowItWorksExample } from './HowItWorksExample';
import { TextShimmer } from '@/components/core/text-shimmer';
import { cn } from '@/lib/utils';
import { VerificationRequest } from '@/types/verification';

interface DashboardViewProps {
  onRunVerification: (request: VerificationRequest) => Promise<void>;
  isLoading: boolean;
  stage?: string | null;
  error?: string | null;
  onClearError?: () => void;
}

export function DashboardView({
  onRunVerification,
  isLoading,
  stage,
  error,
  onClearError,
}: DashboardViewProps) {
  const [aiClaim, setAiClaim] = useState('');
  const [referenceClaim, setReferenceClaim] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleClearAiClaim = () => {
    setAiClaim('');
    onClearError?.();
  };

  const handleClearReferenceClaim = () => {
    setReferenceClaim('');
    setSelectedFile(null);
    setFileInputKey(Date.now());
    onClearError?.();
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    await onRunVerification({
      aiClaim,
      referenceText: referenceClaim,
      documentFile: selectedFile,
    });
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-start p-4 md:p-6 lg:p-8 space-y-8">
      {/* Exactly three equal-height panels, horizontal, centered */}
      <div className="grid w-full max-w-[1800px] grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-5 min-[1360px]:grid-cols-3 min-[1360px]:gap-6">
        
        {/* ================= PANEL 01: AI CLAIM ================= */}
        <div className="glass-panel group relative flex min-w-0 flex-col rounded-xl p-5 transition-all duration-300 md:p-6 md:min-h-[420px] min-[1360px]:h-[calc(100vh-280px)] min-[1360px]:min-h-[540px] min-[1360px]:max-h-[680px]">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[var(--border-muted)] pb-4">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-michroma text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  01/
                </span>
                <span className="font-michroma text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]">
                  AI CLAIM
                </span>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                GENERATED HYPOTHESIS OR LLM RESPONSE
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {aiClaim && (
                <button
                  type="button"
                  onClick={handleClearAiClaim}
                  className="flex items-center space-x-1 rounded border border-[var(--border-muted)] px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--card-surface)]"
                  title="Clear text"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                  <span>CLEAR</span>
                </button>
              )}
            </div>
          </div>

          {/* Textarea with focus animation */}
          <div className="relative mt-4 flex-1">
            <textarea
              value={aiClaim}
              onChange={(e) => {
                setAiClaim(e.target.value);
                if (error) onClearError?.();
              }}
              placeholder="Enter the AI-generated answer..."
              disabled={isLoading}
              maxLength={10000}
              aria-label="AI-generated answer"
              aria-required="true"
              wrap="soft"
              className="input-glass h-full min-h-[240px] min-w-0 w-full max-w-full resize-none overflow-x-hidden rounded-lg p-4 font-sans text-sm leading-relaxed placeholder:opacity-50 transition-all duration-200 md:min-h-0"
            />
          </div>

          {/* Footer: Character Counter */}
          <div className="mt-3 flex min-w-0 items-center justify-between gap-2 border-t border-[var(--border-muted)] pt-3 text-[11px] font-mono text-[var(--text-secondary)]">
            <span>INPUT BUFFER</span>
            <span>{aiClaim.length} / 10000 CHARACTERS</span>
          </div>
        </div>

        {/* ================= PANEL 02: YOUR CLAIM / GROUND TRUTH ================= */}
        <div className="glass-panel group relative flex min-w-0 flex-col rounded-xl p-5 transition-all duration-300 md:p-6 md:min-h-[420px] min-[1360px]:h-[calc(100vh-280px)] min-[1360px]:min-h-[540px] min-[1360px]:max-h-[680px]">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[var(--border-muted)] pb-4">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-michroma text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  02/
                </span>
                <span className="font-michroma text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]">
                  YOUR CLAIM
                </span>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                GROUND TRUTH EVIDENCE & REFERENCE TEXT
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {(referenceClaim || selectedFile) && (
                <button
                  type="button"
                  onClick={handleClearReferenceClaim}
                  className="flex items-center space-x-1 rounded border border-[var(--border-muted)] px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--card-surface)]"
                  title="Clear text"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                  <span>CLEAR</span>
                </button>
              )}
            </div>
          </div>

          {/* Textarea with focus animation */}
          <div className="relative mt-4 flex-1">
            <textarea
              value={referenceClaim}
              onChange={(e) => {
                setReferenceClaim(e.target.value);
                if (error) onClearError?.();
              }}
              placeholder="Enter your claim or reference text..."
              disabled={isLoading}
              maxLength={20000}
              aria-label="Reference evidence text"
              wrap="soft"
              className="input-glass h-full min-h-[200px] min-w-0 w-full max-w-full resize-none overflow-x-hidden rounded-lg p-4 font-sans text-sm leading-relaxed placeholder:opacity-50 transition-all duration-200 md:min-h-0"
            />
          </div>

          {/* Upload Slot: PDF / TXT / DOCX */}
          <div className="mt-3">
            <label
              htmlFor="reference-doc-upload"
              className={cn(
                'flex cursor-pointer items-center justify-between rounded border border-dashed border-[var(--border-color)] bg-[var(--card-surface)] px-3 py-2 text-xs transition-colors hover:border-[var(--border-hover)]',
                isLoading && 'pointer-events-none opacity-50'
              )}
            >
              <div className="flex items-center space-x-2 text-[var(--text-primary)]">
                <Upload className="h-3.5 w-3.5" />
                <span className="font-mono text-[11px] uppercase tracking-wider">
                  {selectedFile ? selectedFile.name : 'ATTACH DOCUMENT (PDF, TXT, DOCX)'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'OPTIONAL'}
              </span>
            </label>
            <input
              id="reference-doc-upload"
              key={fileInputKey}
              type="file"
              accept=".pdf,.txt,.docx"
              disabled={isLoading}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setSelectedFile(file);
              }}
              className="hidden"
            />
          </div>

          {/* Footer: Character Counter */}
          <div className="mt-3 flex min-w-0 items-center justify-between gap-2 border-t border-[var(--border-muted)] pt-3 text-[11px] font-mono text-[var(--text-secondary)]">
            <span>REFERENCE BUFFER</span>
            <span>{referenceClaim.length} / 20000 CHARACTERS</span>
          </div>
        </div>

        {/* ================= PANEL 03: VERIFY ================= */}
        <div className="glass-panel group relative flex min-w-0 flex-col justify-between rounded-xl p-5 transition-all duration-300 md:col-span-2 md:min-h-[300px] md:p-6 min-[1360px]:col-span-1 min-[1360px]:h-[calc(100vh-280px)] min-[1360px]:min-h-[540px] min-[1360px]:max-h-[680px]">
          {/* Header */}
          <div className="border-b border-[var(--border-muted)] pb-4">
            <div className="flex items-baseline space-x-2">
              <span className="font-michroma text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                03/
              </span>
              <span className="font-michroma text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]">
                VERIFY
              </span>
            </div>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-mono">
              EVALUATION PIPELINE & AUDIT
            </p>
          </div>

          {/* Center Symbol & Action */}
          <div className="my-auto flex flex-col items-center justify-center py-8">
            {/* Minimal Symbol */}
            <div className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--card-surface)] shadow-sm">
              <div className="absolute inset-1.5 rounded-full border border-dashed border-[var(--border-muted)] animate-[spin_60s_linear_infinite]" />
              
              <Target className={cn(
                'h-10 w-10 text-[var(--text-primary)] transition-all duration-500',
                isLoading && 'scale-110 animate-pulse'
              )} />
            </div>

            {/* Error Message display if any */}
            {error ? (
              <div role="alert" className="mb-6 flex w-full max-w-sm items-start gap-2.5 rounded border border-[var(--status-contradicted)] bg-[var(--status-contradicted-bg)] p-3 text-left">
                <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--status-contradicted)] mt-0.5" />
                <p className="text-xs text-[var(--status-contradicted)] leading-relaxed">{error}</p>
              </div>
            ) : (
              <p role="status" aria-live="polite" className="mb-6 max-w-sm text-center text-xs leading-relaxed text-[var(--text-secondary)]">
                {isLoading ? 'Verification is in progress. Keep this page open while the evidence is checked.' : 'Enter an AI answer and provide reference text or a source document to begin verification.'}
              </p>
            )}

            {/* Single Centered RUN VERIFICATION Button with BorderTrail */}
            <div className="relative inline-block w-full max-w-[280px]">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={cn(
                  'relative flex h-14 w-full items-center justify-center space-x-3 rounded-lg border border-[var(--border-color)] bg-[var(--btn-primary-bg)] px-6 text-sm font-semibold uppercase tracking-wider text-[var(--btn-primary-text)] transition-all duration-200 overflow-hidden shadow-lg',
                  isLoading
                    ? 'cursor-wait opacity-90'
                    : 'hover:opacity-95 hover:shadow-[0_0_30px_rgba(236,228,180,0.2)] active:scale-[0.98]'
                )}
              >
                {/* BorderTrail integrated dynamically */}
                <BorderTrail
                  size={120}
                  className="bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
                  transition={{
                    repeat: isLoading ? Infinity : 0,
                    duration: 2.2,
                    ease: 'linear',
                  }}
                />

                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[var(--btn-primary-text)]" />
                    <span className="font-michroma text-xs tracking-widest text-[var(--btn-primary-text)]">
                      AUDITING CLAIMS...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-michroma text-xs tracking-widest text-[var(--btn-primary-text)]">
                      RUN VERIFICATION
                    </span>
                    <ArrowRight className="h-4 w-4 text-[var(--btn-primary-text)] transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

            {/* Active Loading Shimmer State */}
            {isLoading && (
              <div className="mt-4 flex items-center justify-center space-x-2.5 py-1.5 px-4 rounded-full border border-[var(--border-muted)] bg-[var(--card-surface)] shadow-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-ping" />
                <TextShimmer className="font-mono text-sm" duration={1}>
                  {stage || 'Analyzing claims...'}
                </TextShimmer>
              </div>
            )}
          </div>

          {/* Footer state indicator */}
          <div className="border-t border-[var(--border-muted)] pt-3 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">
              {isLoading ? 'PIPELINE ACTIVE • COMMITTING REQUEST' : 'AWAITING DISPATCH • ZERO FABRICATION POLICY'}
            </span>
          </div>
        </div>

      </div>

      {/* ================= HOW VERITRACE WORKS EXAMPLE SECTION ================= */}
      <HowItWorksExample />
    </div>
  );
}
