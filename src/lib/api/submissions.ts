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

export async function getSubmission(id: string) {
  return request<import('@/lib/types').Submission>(`/api/submissions/${id}`);
}

export async function getSubmissions() {
  return request<import('@/lib/types').Submission[]>('/api/submissions');
}
