'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Package } from 'lucide-react';
import CreatorHeader from '@/components/creator/CreatorHeader';
import AssetTable from '@/components/creator/AssetTable';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useAssets } from '@/lib/hooks/useAssetsStore';
import { useToast } from '@/lib/hooks/useToast';
import { cn } from '@/lib/utils';
import type { AssetStatus } from '@/lib/types';

const filters: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'ready', label: 'Ready' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
];

export default function MyAssetsPage() {
  const { assets, deleteAsset, updateAsset } = useAssets();
  const { addToast } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredAssets = activeFilter === 'all'
    ? assets
    : assets.filter((a) => a.status === activeFilter);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteAsset(deleteId);
      addToast({ type: 'success', title: 'Asset deleted' });
      setDeleteId(null);
    }
  };

  const handleSubmit = (id: string) => {
    updateAsset(id, { status: 'submitted', submittedAt: new Date().toISOString() });
    addToast({ type: 'success', title: 'Asset submitted for review' });
  };

  return (
    <div>
      <CreatorHeader
        title="My Assets"
        description="Manage and track all your 3D assets."
        action={
          <Link
            href="/creator/assets/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-teal-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Asset
          </Link>
        }
      />

      {/* Filters */}
      <div className="mt-6 flex items-center gap-1 border-b border-neutral-800 overflow-x-auto pb-px">
        {filters.map((filter) => {
          const count = filter.value === 'all'
            ? assets.length
            : assets.filter((a) => a.status === filter.value).length;
          return (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-[13px] border-b-2 -mb-px transition-colors',
                activeFilter === filter.value
                  ? 'border-teal-500 text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              )}
            >
              {filter.label}
              {count > 0 && (
                <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-400 font-mono">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Assets */}
      <div className="mt-6">
        {filteredAssets.length > 0 ? (
          <AssetTable assets={filteredAssets} onDelete={handleDelete} onSubmit={handleSubmit} />
        ) : (
          <EmptyState
            icon={<Package className="h-10 w-10" />}
            title={activeFilter === 'all' ? 'No assets yet' : `No ${activeFilter.replace('_', ' ')} assets`}
            description={
              activeFilter === 'all'
                ? 'Create your first 3D asset to start building your Algoryx portfolio.'
                : `You don't have any assets with this status.`
            }
            action={
              activeFilter === 'all' ? (
                <Link
                  href="/creator/assets/new"
                  className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-teal-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Asset
                </Link>
              ) : undefined
            }
          />
        )}
      </div>

      <ConfirmationModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Asset"
        description="This action cannot be undone. The asset and its associated files will be permanently removed."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
