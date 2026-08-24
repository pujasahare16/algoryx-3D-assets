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

export async function getAssets(status?: string) {
  const query = status && status !== 'all' ? `?status=${status}` : '';
  return request<import('@/lib/types').Asset[]>(`/api/assets${query}`);
}

export async function getAsset(id: string) {
  return request<import('@/lib/types').Asset>(`/api/assets/${id}`);
}

export async function createAsset(data: FormData) {
  const url = `${API_URL}/api/assets`;
  const res = await fetch(url, { method: 'POST', body: data });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export async function updateAsset(id: string, data: Partial<import('@/lib/types').Asset>) {
  return request<import('@/lib/types').Asset>(`/api/assets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteAsset(id: string) {
  return request<void>(`/api/assets/${id}`, { method: 'DELETE' });
}

export async function submitAsset(id: string) {
  return request<import('@/lib/types').Asset>(`/api/assets/${id}/submit`, {
    method: 'POST',
  });
}

export async function getDashboardStats() {
  return request<import('@/lib/types').DashboardStats>('/api/assets/stats');
}
