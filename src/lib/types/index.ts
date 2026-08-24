// Algoryx — Core Type Definitions

export type AssetStatus =
  | 'draft'
  | 'ready'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'published'
  | 'rejected';

export type ApplicationStatus =
  | 'not_applied'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected';

export type AssetCategory =
  | 'architecture'
  | 'environment'
  | 'furniture'
  | 'product'
  | 'vehicle'
  | 'character'
  | 'props'
  | 'other';

export const ASSET_CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: 'architecture', label: 'Architecture' },
  { value: 'environment', label: 'Environment' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'product', label: 'Product' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'character', label: 'Character' },
  { value: 'props', label: 'Props' },
  { value: 'other', label: 'Other' },
];

export interface Asset {
  id: string;
  title: string;
  description: string;
  category: AssetCategory;
  tags: string[];
  fileName: string;
  fileFormat: 'glb' | 'gltf';
  fileSize: number; // bytes
  fileUrl?: string;
  previewImageUrl?: string;
  status: AssetStatus;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  rejectionChanges?: string;
}

export interface Creator {
  id: string;
  fullName: string;
  creatorName: string;
  email: string;
  bio: string;
  portfolioUrl: string;
  profileImageUrl?: string;
  applicationStatus: ApplicationStatus;
  totalAssets: number;
  publishedAssets: number;
  createdAt: string;
}

export interface CreatorApplication {
  fullName: string;
  creatorName: string;
  email: string;
  portfolioUrl: string;
  bio: string;
  motivation: string;
  experience: string;
}

export interface Submission {
  id: string;
  assetId: string;
  assetTitle: string;
  status: AssetStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  rejectionChanges?: string;
  timeline: SubmissionTimelineEntry[];
}

export interface SubmissionTimelineEntry {
  step: string;
  label: string;
  completedAt?: string;
  active: boolean;
}

export interface DashboardStats {
  total: number;
  drafts: number;
  ready: number;
  underReview: number;
  published: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface ValidationResult {
  id: string;
  label: string;
  status: 'pending' | 'pass' | 'fail';
  detail?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isCreator: boolean;
  creator: Creator | null;
}
