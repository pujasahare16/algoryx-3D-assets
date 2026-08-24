const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export async function getCreatorProfile() {
  return request<import('@/lib/types').Creator>('/api/creator/profile');
}

export async function updateCreatorProfile(data: Partial<import('@/lib/types').Creator>) {
  return request<import('@/lib/types').Creator>('/api/creator/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function applyForCreatorAccess(data: import('@/lib/types').CreatorApplication) {
  return request<{ status: import('@/lib/types').ApplicationStatus }>('/api/creator/apply', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getApplicationStatus() {
  return request<{ status: import('@/lib/types').ApplicationStatus }>('/api/creator/application-status');
}
