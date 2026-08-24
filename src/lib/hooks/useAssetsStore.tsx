'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Asset, DashboardStats } from '@/lib/types';
import { createDemoAsset } from '@/lib/mock/data';

interface AssetsContextType {
  assets: Asset[];
  stats: DashboardStats;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, data: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  getAsset: (id: string) => Asset | undefined;
}

const AssetsContext = createContext<AssetsContextType | null>(null);

function computeStats(assets: Asset[]): DashboardStats {
  return {
    total: assets.length,
    drafts: assets.filter((a) => a.status === 'draft').length,
    ready: assets.filter((a) => a.status === 'ready').length,
    underReview: assets.filter((a) => a.status === 'under_review' || a.status === 'submitted').length,
    published: assets.filter((a) => a.status === 'published').length,
  };
}

export function AssetsProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);

  const stats = computeStats(assets);

  const addAsset = useCallback((asset: Asset) => {
    setAssets((prev) => [asset, ...prev]);
  }, []);

  const updateAsset = useCallback((id: string, data: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a))
    );
  }, []);

  const deleteAsset = useCallback((id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const getAsset = useCallback(
    (id: string) => assets.find((a) => a.id === id),
    [assets]
  );

  return (
    <AssetsContext.Provider value={{ assets, stats, addAsset, updateAsset, deleteAsset, getAsset }}>
      {children}
    </AssetsContext.Provider>
  );
}

export function useAssets() {
  const ctx = useContext(AssetsContext);
  if (!ctx) throw new Error('useAssets must be used within AssetsProvider');
  return ctx;
}

export { createDemoAsset };
