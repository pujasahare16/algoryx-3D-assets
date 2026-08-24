'use client';

import Link from 'next/link';
import { Plus, Package, FileEdit, Clock, Eye, CheckCircle2 } from 'lucide-react';
import CreatorHeader from '@/components/creator/CreatorHeader';
import AssetTable from '@/components/creator/AssetTable';
import EmptyState from '@/components/ui/EmptyState';
import { useAssets } from '@/lib/hooks/useAssetsStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/utils';

const statConfig = [
  { key: 'total', label: 'Total Assets', icon: Package, color: 'text-neutral-300' },
  { key: 'drafts', label: 'Drafts', icon: FileEdit, color: 'text-neutral-400' },
  { key: 'ready', label: 'Ready to Submit', icon: CheckCircle2, color: 'text-teal-400' },
  { key: 'underReview', label: 'Under Review', icon: Clock, color: 'text-amber-400' },
  { key: 'published', label: 'Published', icon: Eye, color: 'text-emerald-400' },
] as const;

export default function CreatorDashboard() {
  const { assets, stats, deleteAsset } = useAssets();
  const { isAuthenticated } = useAuth();

  const recentAssets = assets.slice(0, 5);

  return (
    <div>
      <CreatorHeader
        title="Creator Studio"
        description="Manage your 3D assets and prepare submissions for the Algoryx Community."
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

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-neutral-800 rounded-lg border border-neutral-800 overflow-hidden">
        {statConfig.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="bg-neutral-950 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={cn('h-3.5 w-3.5', color)} />
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-xl font-semibold text-white">{stats[key]}</p>
          </div>
        ))}
      </div>

      {/* Recent Assets */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-medium text-white">Recent Assets</h2>
          {assets.length > 0 && (
            <Link href="/creator/assets" className="text-[12px] text-neutral-500 hover:text-neutral-300 transition-colors">
              View All →
            </Link>
          )}
        </div>

        {recentAssets.length > 0 ? (
          <AssetTable assets={recentAssets} onDelete={deleteAsset} />
        ) : (
          <EmptyState
            icon={<Package className="h-10 w-10" />}
            title="No assets yet"
            description="Create your first 3D asset to start building your Algoryx portfolio."
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
        )}
      </div>
    </div>
  );
}
