'use client';

import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Pencil, Send, Trash2, FileText, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import EmptyState from '@/components/ui/EmptyState';
import { useAssets } from '@/lib/hooks/useAssetsStore';
import { useToast } from '@/lib/hooks/useToast';
import { formatFileSize, formatDate, getFileExtension } from '@/lib/utils';
import { ASSET_CATEGORIES } from '@/lib/types';

const ModelViewer = dynamic(() => import('@/components/three/ModelViewer'), { ssr: false });

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getAsset, deleteAsset, updateAsset } = useAssets();
  const { addToast } = useToast();
  const [showDelete, setShowDelete] = useState(false);

  const id = params.id as string;
  const asset = getAsset(id);

  if (!asset) {
    return (
      <EmptyState
        icon={<FileText className="h-10 w-10" />}
        title="Asset not found"
        description="The asset you're looking for doesn't exist or has been removed."
        action={
          <Link href="/creator/assets" className="rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-[13px] text-neutral-300 hover:text-white transition-colors">
            Back to Assets
          </Link>
        }
      />
    );
  }

  const handleDelete = () => {
    deleteAsset(asset.id);
    addToast({ type: 'success', title: 'Asset deleted' });
    router.push('/creator/assets');
  };

  const handleSubmit = () => {
    updateAsset(asset.id, { status: 'submitted', submittedAt: new Date().toISOString() });
    addToast({ type: 'success', title: 'Asset submitted for review' });
  };

  return (
    <div>
      {/* Back */}
      <Link href="/creator/assets" className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-300 transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Assets
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white tracking-tight">{asset.title || 'Untitled Asset'}</h1>
            <StatusBadge status={asset.status} />
          </div>
          <p className="mt-1 text-[13px] text-neutral-500">{asset.fileName}</p>
        </div>
        <div className="flex items-center gap-2">
          {(asset.status === 'draft' || asset.status === 'rejected') && (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-3.5 py-1.5 text-[13px] font-medium text-white hover:bg-teal-500 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              Submit
            </button>
          )}
          <button
            onClick={() => setShowDelete(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-800/50 px-3.5 py-1.5 text-[13px] text-neutral-300 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Viewer */}
        <div className="lg:col-span-2">
          <ModelViewer modelUrl={null} showControls minHeight="500px" />
          <p className="mt-2 text-[11px] text-neutral-600 text-center">
            3D preview requires the original file. Upload again to preview.
          </p>
        </div>

        {/* Info Panel */}
        <div className="space-y-5">
          {asset.description && (
            <div>
              <h3 className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5">Description</h3>
              <p className="text-[13px] text-neutral-300 leading-relaxed">{asset.description}</p>
            </div>
          )}

          <div className="border-t border-neutral-800 pt-4 space-y-3">
            <DetailRow label="File Format" value={`.${asset.fileFormat}`} />
            <DetailRow label="File Size" value={formatFileSize(asset.fileSize)} />
            <DetailRow label="Category" value={ASSET_CATEGORIES.find((c) => c.value === asset.category)?.label || asset.category} />
            <DetailRow label="Created" value={formatDate(asset.createdAt)} />
            <DetailRow label="Updated" value={formatDate(asset.updatedAt)} />
            <DetailRow label="Status" value="">
              <StatusBadge status={asset.status} />
            </DetailRow>
          </div>

          {asset.tags.length > 0 && (
            <div className="border-t border-neutral-800 pt-4">
              <h3 className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {asset.tags.map((tag) => (
                  <span key={tag} className="rounded bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-400">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {asset.status === 'submitted' && asset.submittedAt && (
            <div className="border-t border-neutral-800 pt-4">
              <Link
                href={`/creator/submissions/${asset.id}`}
                className="text-[13px] text-teal-400 hover:text-teal-300 transition-colors"
              >
                View Submission Status →
              </Link>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Asset"
        description="This action cannot be undone. The asset and its associated files will be permanently removed."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}

function DetailRow({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-neutral-500">{label}</span>
      {children || <span className="text-[13px] text-neutral-300">{value}</span>}
    </div>
  );
}
