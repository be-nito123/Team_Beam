import React, { useState } from 'react';
import {
  X,
  ServerOff,
  Code2,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
} from 'lucide-react';
import {
  PLAGIARISM_BACKEND_CONTRACT,
  checkPlagiarismBackendHealth,
} from '@/services/plagiarismApi';
import { cn } from '@/lib/utils';

interface BackendContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEndpoint: string;
  onUpdateEndpoint: (url: string) => void;
  isBackendConnected: boolean;
}

export function BackendContractModal({
  isOpen,
  onClose,
  currentEndpoint,
  onUpdateEndpoint,
  isBackendConnected,
}: BackendContractModalProps) {
  const [endpointInput, setEndpointInput] = useState(currentEndpoint);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    onUpdateEndpoint(endpointInput);
    const ok = await checkPlagiarismBackendHealth(endpointInput);
    setTestResult(ok);
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="glass-panel relative flex w-full max-w-2xl flex-col rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] p-6 shadow-2xl text-[var(--text-primary)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-[var(--border-color)] bg-[var(--card-surface)] text-[var(--text-primary)]">
              <ServerOff className="h-4 w-4 text-[var(--status-contradicted)]" />
            </div>
            <div>
              <h2 className="font-michroma text-sm font-bold tracking-wider">
                PLAGIARISM BACKEND CONTRACT
              </h2>
              <p className="text-[11px] font-mono text-[var(--text-secondary)]">
                REQUIRED API SPECIFICATIONS & ENDPOINT CONFIGURATION
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status & Endpoint Config */}
        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-surface)] p-4">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
              TARGET ENDPOINT URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={endpointInput}
                onChange={(e) => setEndpointInput(e.target.value)}
                placeholder="/api/plagiarism/check"
                className="input-glass flex-1 rounded px-3 py-1.5 text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="flex items-center space-x-1.5 rounded border border-[var(--border-color)] bg-[var(--btn-primary-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--btn-primary-text)] hover:opacity-90 transition-opacity"
              >
                <RefreshCw className={cn('h-3.5 w-3.5', testing && 'animate-spin')} />
                <span>{testing ? 'PROBING...' : 'TEST'}</span>
              </button>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--text-secondary)]">CURRENT STATUS:</span>
              {testResult === true || (testResult === null && isBackendConnected) ? (
                <span className="flex items-center space-x-1 text-[var(--status-supported)]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>ONLINE & HEALTHY</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-[var(--status-contradicted)]">
                  <ServerOff className="h-3.5 w-3.5" />
                  <span>OFFLINE / NOT CONNECTED</span>
                </span>
              )}
            </div>
          </div>

          {/* Detailed Contract Specifications */}
          <div className="space-y-3">
            <h3 className="font-michroma text-xs font-semibold tracking-wider text-[var(--text-primary)] flex items-center space-x-1.5">
              <Code2 className="h-3.5 w-3.5 text-[var(--text-primary)]" />
              <span>WHAT THE BACKEND MUST PROVIDE</span>
            </h3>

            {/* Request Specification */}
            <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-surface)] p-3 text-xs">
              <span className="font-mono text-[10px] text-[var(--text-secondary)] block uppercase mb-1">
                HTTP REQUEST CONTRACT
              </span>
              <div className="font-mono text-[11px] text-[var(--text-primary)] space-y-1">
                <div>
                  <span className="text-[var(--accent)] font-bold">METHOD:</span>{' '}
                  {PLAGIARISM_BACKEND_CONTRACT.method}
                </div>
                <div>
                  <span className="text-[var(--accent)] font-bold">ENDPOINT:</span>{' '}
                  {PLAGIARISM_BACKEND_CONTRACT.endpoint}
                </div>
                <div>
                  <span className="text-[var(--accent)] font-bold">CONTENT-TYPE:</span>{' '}
                  {PLAGIARISM_BACKEND_CONTRACT.contentType}
                </div>
              </div>

              <div className="mt-2.5 border-t border-[var(--border-muted)] pt-2 space-y-1">
                <span className="font-mono text-[10px] text-[var(--text-secondary)] block uppercase">
                  REQUIRED MULTIPART FIELDS:
                </span>
                {PLAGIARISM_BACKEND_CONTRACT.requestFields.map((f) => (
                  <div key={f.name} className="flex flex-col sm:flex-row sm:items-baseline gap-1 text-[11px]">
                    <span className="font-mono font-semibold text-[var(--text-primary)]">
                      `{f.name}`:
                    </span>
                    <span className="font-mono text-[var(--accent)]">({f.type})</span>
                    <span className="text-[var(--text-secondary)] text-[10px] sm:ml-1">
                      — {f.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Specification */}
            <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-surface)] p-3 text-xs">
              <span className="font-mono text-[10px] text-[var(--text-secondary)] block uppercase mb-1">
                EXPECTED JSON RESPONSE SCHEMA
              </span>
              <pre className="max-h-52 overflow-y-auto rounded bg-black/40 p-2.5 font-mono text-[10px] leading-relaxed text-[var(--text-primary)]">
                {PLAGIARISM_BACKEND_CONTRACT.expectedResponseExample}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end border-t border-[var(--border-muted)] pt-4">
          <button
            onClick={onClose}
            className="rounded border border-[var(--border-color)] bg-[var(--btn-primary-bg)] px-4 py-2 font-michroma text-[11px] uppercase tracking-wider text-[var(--btn-primary-text)] hover:opacity-90"
          >
            DISMISS SPECIFICATION
          </button>
        </div>
      </div>
    </div>
  );
}
