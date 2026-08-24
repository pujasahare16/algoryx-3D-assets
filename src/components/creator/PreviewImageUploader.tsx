'use client';

import { useRef, useCallback, useState } from 'react';
import { ImagePlus, X, AlertCircle } from 'lucide-react';
import { isValidPreviewImage, cn } from '@/lib/utils';

interface PreviewImageUploaderProps {
  imageUrl: string | null;
  onImageSelect: (file: File) => void;
  onRemove: () => void;
}

export default function PreviewImageUploader({ imageUrl, onImageSelect, onRemove }: PreviewImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validation = isValidPreviewImage(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid image');
        return;
      }
      onImageSelect(file);
    },
    [onImageSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      if (inputRef.current) inputRef.current.value = '';
    },
    [handleFile]
  );

  if (imageUrl) {
    return (
      <div className="relative rounded-lg border border-neutral-800 overflow-hidden group">
        <img
          src={imageUrl}
          alt="Asset preview"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="rounded-md bg-neutral-800/90 border border-neutral-600 px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-neutral-700"
          >
            Replace
          </button>
          <button
            onClick={onRemove}
            className="rounded-md bg-red-900/80 border border-red-700/50 p-1.5 text-white transition-colors hover:bg-red-800"
            aria-label="Remove preview image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleChange} className="hidden" />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-900/30 hover:border-neutral-600 hover:bg-neutral-900/50 transition-colors"
      >
        <ImagePlus className="h-6 w-6 text-neutral-500 mb-2" />
        <span className="text-[13px] text-neutral-400">Upload Preview Image</span>
        <span className="text-[11px] text-neutral-600 mt-1">PNG, JPG, or WebP</span>
      </button>
      {error && (
        <div className="flex items-center gap-2 mt-2">
          <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
          <p className="text-[12px] text-red-400">{error}</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleChange} className="hidden" />
    </div>
  );
}
