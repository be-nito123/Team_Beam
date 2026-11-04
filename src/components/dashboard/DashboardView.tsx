import React, { useState } from 'react';
import {
  Upload,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Loader2,
  FileText,
  AlertTriangle,
  Target,
} from 'lucide-react';
import { BorderTrail } from '@/components/core/BorderTrail';
import { cn } from '@/lib/utils';
import { VerificationRequest } from '@/types/verification';

interface DashboardViewProps {
  onRunVerification: (request: VerificationRequest) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
}

export function DashboardView({
  onRunVerification,
  isLoading,
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

  const handleLoadSample = (sampleType: 'quantum' | 'medical') => {
    if (sampleType === 'quantum') {
      setAiClaim(
        `Trapped-ion quantum processors achieve single-qubit gate fidelities exceeding 99.98% at 4 Kelvin operation. Two-qubit entangling gates operate with a duration of 14 microseconds under laser Raman transitions. The coherence time T2 is preserved up to 12 minutes without dynamical decoupling pulses. The system architecture uses barium-137 isotopes exclusively.`
      );
      setReferenceClaim(
        `Experimental verification of 171Yb+ and 137Ba+ ion traps within closed-cycle 4K cryostats demonstrates single-qubit randomized benchmarking fidelity of 99.982(4)% at 4.2 Kelvin. Two-qubit Mølmer-Sørensen gates achieved an average duration of 28.5 microseconds. Coherence time T2 without dynamical decoupling pulses was measured at 1.84 seconds; pulsed CPMG dynamical decoupling extends T2 to 8.2 minutes. The test bench utilizes ytterbium-171 as the primary computational qubit with sympathetic cooling via barium-137 ions.`
      );
    } else {
      setAiClaim(
        `Empagliflozin reduced all-cause cardiovascular mortality by 38% in chronic kidney disease cohorts. Hospitalization for heart failure was lowered by 35%. Severe hypoglycemic events increased four-fold.`
      );
      setReferenceClaim(
        `Results from the multi-center trial confirmed that empagliflozin conferred a 38% relative risk reduction in cardiovascular death. Heart failure hospitalization was reduced by 35% compared to placebo. Incidences of severe hypoglycemia remained equivalent across treatment and control arms.`
      );
    }
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
    <div className="flex h-full w-full items-center justify-center p-4 md:p-6 lg:p-8">
      {/* Exactly three equal-height panels, horizontal, centered */}
      <div className="grid w-full max-w-[1580px] grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3 lg:gap-6 items-stretch">
        
        {/* ================= PANEL 01: AI CLAIM ================= */}
        <div className="glass-panel group relative flex flex-col rounded-xl p-5 md:p-6 transition-all duration-300 hover:border-[rgba(236,228,180,0.35)] min-h-[520px] lg:h-[calc(100vh-140px)] max-h-[720px]">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[rgba(236,228,180,0.12)] pb-4">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-michroma text-2xl md:text-3xl font-bold tracking-tight text-[#ECE4B4]">
                  01/
                </span>
                <span className="font-michroma text-xs font-semibold uppercase tracking-[0.2em] text-[#ECE4B4]">
                  AI CLAIM
                </span>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-[#B9B49B]/70 font-mono">
                GENERATED HYPOTHESIS OR LLM RESPONSE
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleLoadSample('quantum')}
                className="hidden xl:inline-flex items-center space-x-1 rounded border border-[rgba(236,228,180,0.15)] bg-[rgba(255,255,255,0.02)] px-2 py-1 text-[10px] uppercase font-mono text-[#ECE4B4]/80 hover:bg-[rgba(236,228,180,0.08)] hover:text-[#ECE4B4]"
                title="Populate test sample"
              >
                <Sparkles className="h-3 w-3" />
                <span>Sample</span>
              </button>

              {aiClaim && (
                <button
                  type="button"
                  onClick={handleClearAiClaim}
                  className="flex items-center space-x-1 rounded border border-[rgba(236,228,180,0.15)] px-2 py-1 text-[10px] uppercase tracking-wider text-[#B9B49B] hover:text-[#ECE4B4] hover:bg-[rgba(255,255,255,0.03)]"
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
              className="input-glass h-full w-full resize-none rounded-lg p-4 font-sans text-sm leading-relaxed placeholder-[#B9B49B]/40 transition-all duration-200 focus:ring-1 focus:ring-[#ECE4B4]/40"
            />
          </div>

          {/* Footer: Character Counter */}
          <div className="mt-3 flex items-center justify-between border-t border-[rgba(236,228,180,0.1)] pt-3 text-[11px] font-mono text-[#B9B49B]/80">
            <span>INPUT BUFFER</span>
            <span>{aiClaim.length} / 10000 CHARACTERS</span>
          </div>
        </div>

        {/* ================= PANEL 02: YOUR CLAIM / GROUND TRUTH ================= */}
        <div className="glass-panel group relative flex flex-col rounded-xl p-5 md:p-6 transition-all duration-300 hover:border-[rgba(236,228,180,0.35)] min-h-[520px] lg:h-[calc(100vh-140px)] max-h-[720px]">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[rgba(236,228,180,0.12)] pb-4">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-michroma text-2xl md:text-3xl font-bold tracking-tight text-[#ECE4B4]">
                  02/
                </span>
                <span className="font-michroma text-xs font-semibold uppercase tracking-[0.2em] text-[#ECE4B4]">
                  YOUR CLAIM
                </span>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-[#B9B49B]/70 font-mono">
                GROUND TRUTH EVIDENCE & REFERENCE TEXT
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {(referenceClaim || selectedFile) && (
                <button
                  type="button"
                  onClick={handleClearReferenceClaim}
                  className="flex items-center space-x-1 rounded border border-[rgba(236,228,180,0.15)] px-2 py-1 text-[10px] uppercase tracking-wider text-[#B9B49B] hover:text-[#ECE4B4] hover:bg-[rgba(255,255,255,0.03)]"
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
              className="input-glass h-full w-full resize-none rounded-lg p-4 font-sans text-sm leading-relaxed placeholder-[#B9B49B]/40 transition-all duration-200 focus:ring-1 focus:ring-[#ECE4B4]/40"
            />
          </div>

          {/* Upload Slot: PDF / TXT / DOCX */}
          <div className="mt-3">
            <label
              htmlFor="reference-doc-upload"
              className={cn(
                'flex cursor-pointer items-center justify-between rounded border border-dashed border-[rgba(236,228,180,0.2)] bg-[rgba(255,255,255,0.015)] px-3 py-2 text-xs transition-colors hover:border-[rgba(236,228,180,0.45)] hover:bg-[rgba(255,255,255,0.03)]',
                isLoading && 'pointer-events-none opacity-50'
              )}
            >
              <div className="flex items-center space-x-2 text-[#ECE4B4]">
                <Upload className="h-3.5 w-3.5 text-[#ECE4B4]" />
                <span className="font-mono text-[11px] uppercase tracking-wider">
                  {selectedFile ? selectedFile.name : 'ATTACH DOCUMENT (PDF, TXT, DOCX)'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#B9B49B]/70">
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
          <div className="mt-3 flex items-center justify-between border-t border-[rgba(236,228,180,0.1)] pt-3 text-[11px] font-mono text-[#B9B49B]/80">
            <span>REFERENCE BUFFER</span>
            <span>{referenceClaim.length} / 20000 CHARACTERS</span>
          </div>
        </div>

        {/* ================= PANEL 03: VERIFY ================= */}
        <div className="glass-panel group relative flex flex-col justify-between rounded-xl p-5 md:p-6 transition-all duration-300 hover:border-[rgba(236,228,180,0.35)] min-h-[520px] lg:h-[calc(100vh-140px)] max-h-[720px]">
          {/* Header */}
          <div className="border-b border-[rgba(236,228,180,0.12)] pb-4">
            <div className="flex items-baseline space-x-2">
              <span className="font-michroma text-2xl md:text-3xl font-bold tracking-tight text-[#ECE4B4]">
                03/
              </span>
              <span className="font-michroma text-xs font-semibold uppercase tracking-[0.2em] text-[#ECE4B4]">
                VERIFY
              </span>
            </div>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-[#B9B49B]/70 font-mono">
              EVALUATION PIPELINE & AUDIT
            </p>
          </div>

          {/* Center Symbol & Action */}
          <div className="my-auto flex flex-col items-center justify-center py-8">
            {/* Minimal Symbol */}
            <div className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-full border border-[rgba(236,228,180,0.22)] bg-[rgba(255,255,255,0.015)] shadow-[0_0_40px_rgba(236,228,180,0.03)]">
              {/* Outer decorative ring */}
              <div className="absolute inset-1.5 rounded-full border border-dashed border-[rgba(236,228,180,0.15)] animate-[spin_60s_linear_infinite]" />
              
              {/* Reticle / target center icon */}
              <Target className={cn(
                'h-10 w-10 text-[#ECE4B4] transition-all duration-500',
                isLoading && 'scale-110 text-[#FFF8D6] animate-pulse'
              )} />
            </div>

            {/* Error Message display if any */}
            {error && (
              <div className="mb-6 flex w-full max-w-sm items-start space-x-2.5 rounded border border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.08)] p-3 text-left">
                <AlertTriangle className="h-4 w-4 shrink-0 text-[#F87171] mt-0.5" />
                <p className="text-xs text-[#F87171] leading-relaxed">{error}</p>
              </div>
            )}

            {/* Single Centered RUN VERIFICATION Button with BorderTrail */}
            <div className="relative inline-block w-full max-w-[280px]">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={cn(
                  'relative flex h-14 w-full items-center justify-center space-x-3 rounded-lg border border-[rgba(236,228,180,0.3)] bg-[#ECE4B4] px-6 text-sm font-semibold uppercase tracking-wider text-[#080808] transition-all duration-200 overflow-hidden shadow-[0_0_20px_rgba(236,228,180,0.12)]',
                  isLoading
                    ? 'cursor-wait opacity-90'
                    : 'hover:bg-[#FFF8D6] hover:shadow-[0_0_30px_rgba(236,228,180,0.3)] active:scale-[0.98]'
                )}
              >
                {/* BorderTrail integrated dynamically */}
                <BorderTrail
                  size={120}
                  className="bg-gradient-to-r from-transparent via-[#ECE4B4] to-[#4F4D3C]"
                  transition={{
                    repeat: isLoading ? Infinity : 0,
                    duration: 2.2,
                    ease: 'linear',
                  }}
                />

                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#080808]" />
                    <span className="font-michroma text-xs tracking-widest text-[#080808]">
                      AUDITING CLAIMS...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-michroma text-xs tracking-widest text-[#080808]">
                      RUN VERIFICATION
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#080808] transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer state indicator */}
          <div className="border-t border-[rgba(236,228,180,0.1)] pt-3 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B9B49B]/60">
              {isLoading ? 'PIPELINE ACTIVE • COMMITTING REQUEST' : 'AWAITING DISPATCH • ZERO FABRICATION POLICY'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
