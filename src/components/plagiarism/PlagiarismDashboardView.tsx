import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  X,
  FileCheck,
  AlertCircle,
  ArrowRight,
  Loader2,
  ServerOff,
  Files,
  FileUp,
  FileCode,
  CheckCircle2,
} from 'lucide-react';
import { BorderTrail } from '@/components/core/BorderTrail';
import { BackendContractModal } from './BackendContractModal';
import { cn } from '@/lib/utils';

interface PlagiarismDashboardViewProps {
  onRunCheck: (originalFile: File, referenceFiles: File[]) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
  isBackendConnected: boolean;
  endpoint: string;
  onUpdateEndpoint: (url: string) => void;
}

export function PlagiarismDashboardView({
  onRunCheck,
  isLoading,
  error,
  onClearError,
  isBackendConnected,
  endpoint,
  onUpdateEndpoint,
}: PlagiarismDashboardViewProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [originalDragOver, setOriginalDragOver] = useState(false);
  const [refDragOver, setRefDragOver] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const originalInputRef = useRef<HTMLInputElement>(null);
  const refInputRef = useRef<HTMLInputElement>(null);

  const allowedExtensions = ['.pdf', '.docx', '.txt'];
  const maxFileSize = 50 * 1024 * 1024;

  const getFileValidationError = (file: File): string | null => {
    const name = file.name.toLowerCase();
    if (!allowedExtensions.some((ext) => name.endsWith(ext))) {
      return 'Unsupported file type. Use PDF, DOCX, or TXT.';
    }
    if (file.size > maxFileSize) return `${file.name} exceeds the 50 MB file limit.`;
    return null;
  };

  const validateFile = (file: File): boolean => getFileValidationError(file) === null;

  const handleOriginalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setOriginalDragOver(false);
    if (isLoading) return;
    const file = e.dataTransfer.files[0];
    if (file) {
      const fileError = getFileValidationError(file);
      if (!fileError) {
        setOriginalFile(file);
        setValidationError(null);
        onClearError?.();
      } else {
        setValidationError(fileError);
      }
    }
  };

  const handleReferenceDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setRefDragOver(false);
    if (isLoading) return;
    const droppedFiles = Array.from(e.dataTransfer.files);
    const files = droppedFiles.filter(validateFile);
    const rejectedFile = droppedFiles.find((file) => !validateFile(file));
    if (files.length > 0) {
      setReferenceFiles((prev) => {
        const existingNames = new Set(prev.map((f) => f.name));
        const newUnique = files.filter((f) => !existingNames.has(f.name));
        return [...prev, ...newUnique];
      });
      setValidationError(rejectedFile ? getFileValidationError(rejectedFile) : null);
      onClearError?.();
    } else {
      setValidationError(rejectedFile ? getFileValidationError(rejectedFile) : 'Please upload supported reference documents (.pdf, .docx, .txt).');
    }
  };

  const handleOriginalSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileError = getFileValidationError(file);
      if (!fileError) {
        setOriginalFile(file);
        setValidationError(null);
        onClearError?.();
      } else {
        setValidationError(fileError);
      }
    }
  };

  const handleReferenceSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const files = selected.filter(validateFile);
    if (files.length > 0) {
      setReferenceFiles((prev) => {
        const existingNames = new Set(prev.map((f) => f.name));
        const newUnique = files.filter((f) => !existingNames.has(f.name));
        return [...prev, ...newUnique];
      });
      const rejectedFile = selected.find((file) => !validateFile(file));
      setValidationError(rejectedFile ? getFileValidationError(rejectedFile) : null);
      onClearError?.();
    } else if (selected.length > 0) {
      setValidationError(getFileValidationError(selected[0]) || 'No supported reference files were selected.');
    }
  };

  const removeReferenceFile = (indexToRemove: number) => {
    setReferenceFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    setValidationError(null);

    if (!originalFile) {
      setValidationError('Original document is required before proceeding.');
      return;
    }
    if (referenceFiles.length === 0) {
      setValidationError('Attach at least one reference document to compare against.');
      return;
    }

    await onRunCheck(originalFile, referenceFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mx-auto flex min-h-full min-w-0 w-full max-w-[1800px] flex-col items-center justify-start space-y-6 p-4 md:p-6 lg:p-8">
      
      {/* Title & Subtitle Banner */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-muted)] pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
              VERITRACE SYSTEM //
            </span>
            <span className="font-michroma text-lg md:text-xl font-bold tracking-tight text-[var(--text-primary)]">
              PLAGIARISM CHECKER
            </span>
          </div>
          <p className="mt-1 text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)]">
            DOCUMENT SIMILARITY & ORIGINALITY REVIEW
          </p>
        </div>

        {/* Backend Connection State Indicator */}
        <div className="flex items-center space-x-3">
          {!isBackendConnected ? (
            <div className="flex items-center space-x-2 rounded border border-[var(--border-muted)] bg-[var(--card-surface)] px-3 py-1.5 text-xs font-mono">
              <ServerOff className="h-3.5 w-3.5 text-[var(--status-unsupported)]" />
              <span className="text-[var(--text-secondary)]">BACKEND:</span>
              <span className="text-[var(--status-unsupported)] font-semibold">NOT CONNECTED</span>
              <button
                type="button"
                onClick={() => setShowContractModal(true)}
                className="ml-2 text-[10px] text-[var(--text-primary)] underline hover:opacity-80 uppercase"
              >
                [VIEW SPECS]
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 rounded border border-[var(--border-muted)] bg-[var(--card-surface)] px-3 py-1.5 text-xs font-mono">
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--status-supported)]" />
              <span className="text-[var(--status-supported)] font-semibold">BACKEND CONNECTED</span>
            </div>
          )}
        </div>
      </div>

      {/* Two Numbered Panels: 01 Original Document & 02 Reference Material */}
      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
        
        {/* ================= PANEL 01: ORIGINAL DOCUMENT ================= */}
        <div className="glass-panel group relative flex flex-col rounded-xl p-5 md:p-6 transition-all duration-300 min-h-[460px] justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[var(--border-muted)] pb-4">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-michroma text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                    01/
                  </span>
                  <span className="font-michroma text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]">
                    ORIGINAL DOCUMENT
                  </span>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                  SINGLE FILE INSPECTION (PDF, DOCX, TXT)
                </p>
              </div>

              {originalFile && (
                <button
                  type="button"
                  onClick={() => setOriginalFile(null)}
                  className="flex items-center space-x-1 rounded border border-[var(--border-muted)] px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <X className="h-3 w-3" />
                  <span>REMOVE</span>
                </button>
              )}
            </div>

            {/* Dropzone & File Display */}
            <div className="mt-5">
              {!originalFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOriginalDragOver(true);
                  }}
                  onDragLeave={() => setOriginalDragOver(false)}
                  onDrop={handleOriginalDrop}
                  onClick={() => originalInputRef.current?.click()}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-all cursor-pointer min-h-[220px]',
                    originalDragOver
                      ? 'border-[var(--text-primary)] bg-[var(--card-surface)]'
                      : 'border-[var(--border-color)] bg-[var(--card-surface)] hover:border-[var(--border-hover)]'
                  )}
                >
                  <input
                    ref={originalInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleOriginalSelect}
                    className="hidden"
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)] mb-3">
                    <FileUp className="h-6 w-6" />
                  </div>
                  <p className="font-michroma text-xs font-medium text-[var(--text-primary)]">
                    DRAG & DROP ORIGINAL FILE
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)] font-mono">
                    or click to browse from device
                  </p>
                  <span className="mt-3 rounded border border-[var(--border-muted)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-secondary)]">
                    SUPPORTED: PDF, DOCX, TXT (MAX 50MB)
                  </span>
                </div>
              ) : (
                <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-surface)] p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)]">
                        <FileCheck className="h-5 w-5 text-[var(--status-supported)]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)] break-all">
                          {originalFile.name}
                        </p>
                        <div className="mt-1 flex items-center space-x-3 text-xs font-mono text-[var(--text-secondary)]">
                          <span>{formatFileSize(originalFile.size)}</span>
                          <span>•</span>
                          <span className="uppercase">
                            {originalFile.name.split('.').pop() || 'FILE'}
                          </span>
                          <span>•</span>
                          <span className="text-[var(--status-supported)]">STAGED</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[var(--border-muted)] pt-3 text-xs font-mono text-[var(--text-secondary)]">
                    PRIMARY CORPUS VALIDATED FOR SIMILARITY SCANNING
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[var(--border-muted)] pt-3 text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">
            STATUS: {originalFile ? 'ORIGINAL READY' : 'AWAITING UPLOAD'}
          </div>
        </div>

        {/* ================= PANEL 02: REFERENCE MATERIAL ================= */}
        <div className="glass-panel group relative flex flex-col rounded-xl p-5 md:p-6 transition-all duration-300 min-h-[460px] justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[var(--border-muted)] pb-4">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-michroma text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                    02/
                  </span>
                  <span className="font-michroma text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]">
                    REFERENCE MATERIAL
                  </span>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-mono">
                  MULTIPLE SOURCE DOCUMENTS (PDF, DOCX, TXT)
                </p>
              </div>

              {referenceFiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setReferenceFiles([])}
                  className="flex items-center space-x-1 rounded border border-[var(--border-muted)] px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <X className="h-3 w-3" />
                  <span>CLEAR ALL</span>
                </button>
              )}
            </div>

            {/* Dropzone & List */}
            <div className="mt-5 space-y-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setRefDragOver(true);
                }}
                onDragLeave={() => setRefDragOver(false)}
                onDrop={handleReferenceDrop}
                onClick={() => refInputRef.current?.click()}
                className={cn(
                  'flex items-center justify-between rounded-lg border-2 border-dashed px-4 py-3 transition-all cursor-pointer',
                  refDragOver
                    ? 'border-[var(--text-primary)] bg-[var(--card-surface)]'
                    : 'border-[var(--border-color)] bg-[var(--card-surface)] hover:border-[var(--border-hover)]'
                )}
              >
                <input
                  ref={refInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  onChange={handleReferenceSelect}
                  className="hidden"
                />
                <div className="flex items-center space-x-2 text-xs font-mono text-[var(--text-primary)]">
                  <Files className="h-4 w-4" />
                  <span>ADD REFERENCE DOCUMENTS (PDF, DOCX, TXT)</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  + BROWSE FILES
                </span>
              </div>

              {/* Reference Files List */}
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {referenceFiles.length === 0 ? (
                  <p className="py-8 text-center text-xs font-mono text-[var(--text-secondary)] italic">
                    No reference sources attached yet. Attach at least 1 document.
                  </p>
                ) : (
                  referenceFiles.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="flex items-center justify-between rounded border border-[var(--border-muted)] bg-[var(--card-surface)] px-3 py-2 text-xs"
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        <FileText className="h-4 w-4 shrink-0 text-[var(--text-primary)]" />
                        <span className="font-mono text-xs text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-xs">
                          {file.name}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeReferenceFile(idx)}
                        className="rounded p-1 text-[var(--text-secondary)] hover:text-[var(--status-contradicted)] transition-colors"
                        title="Remove reference file"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border-muted)] pt-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">
            <span>REFERENCES: {referenceFiles.length} ATTACHED</span>
            <span>{referenceFiles.length > 0 ? 'COMPARISON READY' : 'MINIMUM 1 REQUIRED'}</span>
          </div>
        </div>

      </div>

      {/* Validation and Error Alerts */}
      {(validationError || error) && (
        <div className="flex w-full items-start space-x-2.5 rounded-lg border border-[var(--status-contradicted)] bg-[var(--status-contradicted-bg)] p-3 text-xs text-[var(--status-contradicted)]">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{validationError || error}</p>
            {!isBackendConnected && (
              <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                You can review the required backend specifications or click{' '}
                <button
                  type="button"
                  onClick={() => setShowContractModal(true)}
                  className="underline text-[var(--text-primary)] font-bold"
                >
                  Configure Backend Endpoint
                </button>
                . Alternatively, uploading plain text (.txt) files enables client-side validated deterministic text analysis.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Submit Action: CHECK FOR PLAGIARISM → */}
      <div className="relative inline-block w-full max-w-sm pt-2">
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
          {/* BorderTrail */}
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
              <span className="font-michroma text-xs tracking-widest">
                ANALYZING SIMILARITY...
              </span>
            </>
          ) : (
            <>
              <span className="font-michroma text-xs tracking-widest">
                CHECK FOR PLAGIARISM
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>

      {/* Backend Contract Modal */}
      <BackendContractModal
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
        currentEndpoint={endpoint}
        onUpdateEndpoint={onUpdateEndpoint}
        isBackendConnected={isBackendConnected}
      />
    </div>
  );
}
