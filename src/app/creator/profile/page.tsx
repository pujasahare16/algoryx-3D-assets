'use client';

import { useState } from 'react';
import { User, Link as LinkIcon, Package, Eye, Calendar } from 'lucide-react';
import CreatorHeader from '@/components/creator/CreatorHeader';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAssets } from '@/lib/hooks/useAssetsStore';
import { useToast } from '@/lib/hooks/useToast';
import { formatDate } from '@/lib/utils';

export default function CreatorProfilePage() {
  const { isAuthenticated, creator, updateProfile } = useAuth();
  const { assets } = useAssets();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    creatorName: creator?.creatorName || '',
    bio: creator?.bio || '',
    portfolioUrl: creator?.portfolioUrl || '',
  });

  const publishedCount = assets.filter((a) => a.status === 'published').length;

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    addToast({ type: 'success', title: 'Profile updated' });
  };

  return (
    <div>
      <CreatorHeader
        title="Creator Profile"
        description="Your public creator profile on Algoryx."
        action={
          !editing ? (
            <button
              onClick={() => setEditing(true)}
              className="rounded-md border border-neutral-700 bg-neutral-800/50 px-4 py-2 text-[13px] font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                className="rounded-md border border-neutral-700 bg-neutral-800/50 px-3.5 py-1.5 text-[13px] text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-md bg-teal-600 px-3.5 py-1.5 text-[13px] font-medium text-white hover:bg-teal-500 transition-colors"
              >
                Save
              </button>
            </div>
          )
        }
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-neutral-800 p-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                <User className="h-7 w-7 text-neutral-500" />
              </div>
              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] text-neutral-500 mb-1">Creator Name</label>
                      <input
                        type="text"
                        value={form.creatorName}
                        onChange={(e) => setForm({ ...form, creatorName: e.target.value })}
                        className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 focus:border-neutral-600 focus:outline-none"
                        placeholder="Your display name"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] text-neutral-500 mb-1">Bio</label>
                      <textarea
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        rows={3}
                        className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 focus:border-neutral-600 focus:outline-none resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] text-neutral-500 mb-1">Portfolio URL</label>
                      <input
                        type="url"
                        value={form.portfolioUrl}
                        onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                        className="w-full rounded-md border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-[13px] text-neutral-200 focus:border-neutral-600 focus:outline-none"
                        placeholder="https://your-portfolio.com"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-[16px] font-semibold text-white">
                      {creator?.creatorName || 'No name set'}
                    </h2>
                    {creator?.fullName && (
                      <p className="text-[13px] text-neutral-500 mt-0.5">{creator.fullName}</p>
                    )}
                    {creator?.bio ? (
                      <p className="mt-3 text-[13px] text-neutral-400 leading-relaxed">{creator.bio}</p>
                    ) : (
                      <p className="mt-3 text-[13px] text-neutral-600 italic">No bio yet. Edit your profile to add one.</p>
                    )}
                    {creator?.portfolioUrl && (
                      <a
                        href={creator.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-[13px] text-teal-400 hover:text-teal-300 transition-colors"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        Portfolio
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-800 p-5">
            <h3 className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-3">Stats</h3>
            <div className="space-y-3">
              <StatRow icon={<Package className="h-3.5 w-3.5" />} label="Created Assets" value={assets.length} />
              <StatRow icon={<Eye className="h-3.5 w-3.5" />} label="Published Assets" value={publishedCount} />
              {creator?.createdAt && (
                <StatRow icon={<Calendar className="h-3.5 w-3.5" />} label="Joined" value={formatDate(creator.createdAt)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-neutral-600">{icon}</span>
        <span className="text-[12px] text-neutral-500">{label}</span>
      </div>
      <span className="text-[13px] font-medium text-neutral-300">{value}</span>
    </div>
  );
}
