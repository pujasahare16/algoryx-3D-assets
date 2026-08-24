'use client';

import Link from 'next/link';
import type { Asset } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatFileSize, formatRelativeDate } from '@/lib/utils';
import { MoreHorizontal, Eye, Pencil, Trash2, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AssetTableProps {
  assets: Asset[];
  onDelete?: (id: string) => void;
  onSubmit?: (id: string) => void;
}

export default function AssetTable({ assets, onDelete, onSubmit }: AssetTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" role="table">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="pb-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Asset</th>
            <th className="pb-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider hidden md:table-cell">Format</th>
            <th className="pb-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider hidden md:table-cell">Size</th>
            <th className="pb-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Updated</th>
            <th className="pb-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Status</th>
            <th className="pb-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider w-10"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/50">
          {assets.map((asset) => (
            <AssetRow key={asset.id} asset={asset} onDelete={onDelete} onSubmit={onSubmit} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AssetRow({ asset, onDelete, onSubmit }: { asset: Asset; onDelete?: (id: string) => void; onSubmit?: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <tr className="group hover:bg-neutral-900/30 transition-colors">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">{asset.fileFormat}</span>
          </div>
          <div className="min-w-0">
            <Link href={`/creator/assets/${asset.id}`} className="text-[13px] font-medium text-neutral-200 hover:text-white truncate block transition-colors">
              {asset.title || 'Untitled Asset'}
            </Link>
            <p className="text-[11px] text-neutral-600 truncate">{asset.fileName}</p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-4 hidden md:table-cell">
        <span className="text-[12px] font-mono text-neutral-400 uppercase">.{asset.fileFormat}</span>
      </td>
      <td className="py-3 pr-4 hidden md:table-cell">
        <span className="text-[12px] text-neutral-400">{formatFileSize(asset.fileSize)}</span>
      </td>
      <td className="py-3 pr-4 hidden sm:table-cell">
        <span className="text-[12px] text-neutral-500">{formatRelativeDate(asset.updatedAt)}</span>
      </td>
      <td className="py-3 pr-4">
        <StatusBadge status={asset.status} />
      </td>
      <td className="py-3">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-neutral-600 hover:text-neutral-300 transition-colors rounded"
            aria-label="Asset actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 rounded-md border border-neutral-700 bg-neutral-800 py-1 shadow-xl z-20">
              <Link
                href={`/creator/assets/${asset.id}`}
                className="flex items-center gap-2 px-3 py-1.5 text-[12px] text-neutral-300 hover:text-white hover:bg-neutral-700/50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <Eye className="h-3.5 w-3.5" /> View
              </Link>
              {(asset.status === 'draft' || asset.status === 'rejected') && (
                <button
                  onClick={() => { onSubmit?.(asset.id); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] text-neutral-300 hover:text-white hover:bg-neutral-700/50 transition-colors text-left"
                >
                  <Send className="h-3.5 w-3.5" /> Submit
                </button>
              )}
              <button
                onClick={() => { onDelete?.(asset.id); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] text-red-400 hover:text-red-300 hover:bg-neutral-700/50 transition-colors text-left"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
