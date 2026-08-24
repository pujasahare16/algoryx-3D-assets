'use client';

import { useState, useCallback, useRef, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
}

export default function TagInput({ tags, onChange, maxTags = 10, placeholder = 'Add a tag...' }: TagInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = useCallback(
    (value: string) => {
      const trimmed = value.trim().toLowerCase();
      if (!trimmed) return;
      if (tags.includes(trimmed)) return;
      if (tags.length >= maxTags) return;
      onChange([...tags, trimmed]);
      setInput('');
    },
    [tags, onChange, maxTags]
  );

  const removeTag = useCallback(
    (tag: string) => {
      onChange(tags.filter((t) => t !== tag));
    },
    [tags, onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag(input);
      } else if (e.key === 'Backspace' && !input && tags.length > 0) {
        removeTag(tags[tags.length - 1]);
      }
    },
    [input, addTag, removeTag, tags]
  );

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-900/50 px-2.5 py-2 min-h-[40px] focus-within:border-neutral-600 transition-colors cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[12px] text-neutral-300"
          >
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="text-neutral-500 hover:text-neutral-200 transition-colors ml-0.5"
              aria-label={`Remove tag: ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : tags.length >= maxTags ? 'Max tags reached' : ''}
          disabled={tags.length >= maxTags}
          className="flex-1 min-w-[80px] bg-transparent text-[13px] text-neutral-200 placeholder-neutral-600 outline-none disabled:cursor-not-allowed"
          aria-label="Tag input"
        />
      </div>
      <p className="mt-1.5 text-[11px] text-neutral-600">Press Enter to add. {tags.length}/{maxTags} tags.</p>
    </div>
  );
}
