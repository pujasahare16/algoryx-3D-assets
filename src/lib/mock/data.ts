import type { Asset, Creator, DashboardStats, Submission } from '@/lib/types';

export const mockCreator: Creator = {
  id: 'creator-1',
  fullName: '',
  creatorName: '',
  email: '',
  bio: '',
  portfolioUrl: '',
  profileImageUrl: undefined,
  applicationStatus: 'not_applied',
  totalAssets: 0,
  publishedAssets: 0,
  createdAt: new Date().toISOString(),
};

export const mockAssets: Asset[] = [];

export const mockDashboardStats: DashboardStats = {
  total: 0,
  drafts: 0,
  ready: 0,
  underReview: 0,
  published: 0,
};

export const mockSubmissions: Submission[] = [];

// Helper to generate a demo asset for development only
export function createDemoAsset(overrides: Partial<Asset> = {}): Asset {
  const id = `asset-${Date.now()}`;
  return {
    id,
    title: '',
    description: '',
    category: 'other',
    tags: [],
    fileName: '',
    fileFormat: 'glb',
    fileSize: 0,
    status: 'draft',
    creatorId: 'creator-1',
    creatorName: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}
