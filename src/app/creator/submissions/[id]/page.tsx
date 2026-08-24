'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, Pencil, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import SubmissionTimeline from '@/components/creator/SubmissionTimeline';
import { useAssets } from '@/lib/hooks/useAssetsStore';
import type { SubmissionTimelineEntry } from '@/lib/types';

function buildTimeline(asset: { status: string; createdAt: string; submittedAt?: string; reviewedAt?: string }): SubmissionTimelineEntry[] {
  const steps: SubmissionTimelineEntry[] = [
    {
      step: 'created',
      label: 'Asset Created',
      completedAt: asset.createdAt,
      active: false,
    },
    {
      step: 'validated',
      label: 'Asset Validated',
      completedAt: asset.createdAt,
      active: false,
    },
    {
      step: 'submitted',
      label: 'Submitted',
      completedAt: asset.submittedAt,
      active: asset.status === 'submitted',
    },
    {
      step: 'under_review',
      label: 'Under Review',
      completedAt: asset.status === 'under_review' || asset.status === 'approved' || asset.status === 'rejected' || asset.status === 'published' ? asset.reviewedAt || undefined : undefined,
      active: asset.status === 'under_review',
    },
    {
      step: 'decision',
      label: asset.status === 'rejected' ? 'Rejected' : 'Approved',
      completedAt: asset.status === 'approved' || asset.status === 'rejected' || asset.status === 'published' ? asset.reviewedAt || undefined : undefined,
      active: false,
    },
    {
      step: 'published',
      label: 'Published',
      completedAt: asset.status === 'published' ? asset.reviewedAt || undefined : undefined,
      active: false,
    },
  ];

  return steps;
}

export default function SubmissionStatusPage() {
  const params = useParams();
  const { getAsset } = useAssets();

  const id = params.id as string;
  const asset = getAsset(id);

  if (!asset) {
    return (
      <EmptyState
        icon={<FileText className="h-10 w-10" />}
        title="Submission not found"
        description="The submission you're looking for doesn't exist."
        action={
          <Link href="/creator/assets" className="rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-[13px] text-neutral-300 hover:text-white transition-colors">
            Back to Assets
          </Link>
        }
      />
    );
  }

  const timeline = buildTimeline(asset);

  return (
    <div>
      <Link href="/creator/assets" className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-300 transition-colors mb-4">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Assets
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">Submission Status</h1>
          <p className="mt-1 text-[13px] text-neutral-400">{asset.title || 'Untitled Asset'}</p>
        </div>
        <StatusBadge status={asset.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-neutral-800 p-6">
            <h2 className="text-[14px] font-medium text-white mb-6">Review Timeline</h2>
            <SubmissionTimeline entries={timeline} />
          </div>

          {/* Rejection Details — only shown when backend provides them */}
          {asset.status === 'rejected' && (
            <div className="mt-6 rounded-lg border border-red-900/30 bg-red-950/10 p-6">
              <h3 className="text-[14px] font-medium text-red-300 mb-3">Review Feedback</h3>
              {asset.rejectionReason ? (
                <>
                  <div className="mb-3">
                    <p className="text-[12px] text-neutral-500 mb-1">Reason</p>
                    <p className="text-[13px] text-neutral-300 leading-relaxed">{asset.rejectionReason}</p>
                  </div>
                  {asset.rejectionChanges && (
                    <div className="mb-4">
                      <p className="text-[12px] text-neutral-500 mb-1">Required Changes</p>
                      <p className="text-[13px] text-neutral-300 leading-relaxed">{asset.rejectionChanges}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[13px] text-neutral-500">
                  Detailed feedback will be available once the reviewer provides it.
                </p>
              )}
              <div className="flex items-center gap-2 mt-4">
                <Link
                  href={`/creator/assets/${asset.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-800/50 px-3.5 py-1.5 text-[13px] text-neutral-300 hover:text-white transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Asset
                </Link>
                <button className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-3.5 py-1.5 text-[13px] font-medium text-white hover:bg-teal-500 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Resubmit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Asset Summary */}
        <div>
          <div className="rounded-lg border border-neutral-800 p-5 space-y-3">
            <h3 className="text-[13px] font-medium text-white mb-3">Asset Summary</h3>
            <SummaryItem label="Title" value={asset.title || 'Untitled'} />
            <SummaryItem label="Format" value={`.${asset.fileFormat}`} />
            <SummaryItem label="File" value={asset.fileName} />
            {asset.submittedAt && <SummaryItem label="Submitted" value={new Date(asset.submittedAt).toLocaleDateString()} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-neutral-500">{label}</span>
      <span className="text-[12px] text-neutral-300 truncate max-w-[60%] text-right">{value}</span>
    </div>
  );
}
