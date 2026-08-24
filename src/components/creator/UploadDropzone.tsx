'use client';

import { useCallback, useState, useRef, type DragEvent } from 'react';
import { Upload, File as FileIcon, X, AlertCircle } from 'lucide-react';
import { isValidAssetFile, formatFileSize, cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  onRemove: () => void;
  uploadProgress?: number;
  error?: string | null;
}

export default function UploadDropzone({ onFileSelect, file, onRemove, uploadProgress, error }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      setValidationError(null);
      const validation = isValidAssetFile(f);
      if (!validation.valid) {
        setValidationError(validation.error || 'Invalid file');
        return;
      }
      onFileSelect(f);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFile(selected);
      if (inputRef.current) inputRef.current.value = '';
    },
    [handleFile]
  );

  const displayError = error || validationError;

  if (file) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-950/30 border border-teal-800/30 shrink-0">
            <FileIcon className="h-5 w-5 text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-white truncate">{file.name}</p>
            <p className="text-[12px] text-neutral-400 mt-0.5">
              {formatFileSize(file.size)} · {file.name.split('.').pop()?.toUpperCase()}
            </p>
            {uploadProgress !== undefined && uploadProgress < 100 && (
              <div className="mt-3">
                <div className="h-1 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">{uploadProgress}% uploaded</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => inputRef.current?.click()}
              className="rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-[12px] text-neutral-300 hover:text-white transition-colors"
            >
              Replace
            </button>
            <button
              onClick={onRemove}
              className="rounded-md p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleInputChange}
          className="hidden"
          aria-label="Replace 3D asset file"
        />
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors cursor-pointer',
          isDragging
            ? 'border-teal-500/50 bg-teal-950/10'
            : 'border-neutral-700 bg-neutral-900/30 hover:border-neutral-600 hover:bg-neutral-900/50'
        )}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        aria-label="Upload 3D asset file. Drag and drop or click to browse."
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800 border border-neutral-700 mb-4">
          <Upload className="h-5 w-5 text-neutral-400" />
        </div>
        <p className="text-[14px] font-medium text-neutral-200">
          {isDragging ? 'Drop your file here' : 'Drag & drop your 3D asset'}
        </p>
        <p className="text-[12px] text-neutral-500 mt-1">or click to browse files</p>
        <div className="flex items-center gap-3 mt-4">
          <span className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] font-mono text-neutral-400">.GLB</span>
          <span className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] font-mono text-neutral-400">.GLTF</span>
          <span className="text-[11px] text-neutral-600">·</span>
          <span className="text-[11px] text-neutral-500">Max 50 MB</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleInputChange}
          className="hidden"
          aria-label="Select 3D asset file"
        />
      </div>
      {displayError && (
        <div className="flex items-center gap-2 mt-3 px-1">
          <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
          <p className="text-[12px] text-red-400">{displayError}</p>
        </div>
      )}
    </div>
  );
}
