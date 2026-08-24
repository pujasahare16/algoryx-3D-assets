export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i > 1 ? 1 : 0)} ${units[i]}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isValidAssetFile(file: File): { valid: boolean; error?: string } {
  const ext = getFileExtension(file.name);

  if (!['glb', 'gltf'].includes(ext)) {
    return { valid: false, error: 'Unsupported file type. Please upload a .glb or .gltf file.' };
  }

  const maxSize = 50 * 1024 * 1024; // 50 MB
  if (file.size > maxSize) {
    return { valid: false, error: `File exceeds 50 MB limit. Your file is ${formatFileSize(file.size)}.` };
  }

  return { valid: true };
}

export function isValidPreviewImage(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported image format. Please use PNG, JPG, or WebP.' };
  }

  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image exceeds 10 MB limit.' };
  }

  return { valid: true };
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    ready: 'Ready',
    submitted: 'Submitted',
    under_review: 'Under Review',
    approved: 'Approved',
    published: 'Published',
    rejected: 'Rejected',
    not_applied: 'Not Applied',
  };
  return labels[status] || status;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
