const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function uploadAssetFile(
  file: File,
  onProgress?: (progress: import('@/lib/types').UploadProgress) => void
): Promise<{ fileUrl: string; fileName: string; fileSize: number }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percentage: Math.round((e.loaded / e.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Upload failed')));
    xhr.open('POST', `${API_URL}/api/upload`);
    xhr.send(formData);
  });
}

export async function uploadPreviewImage(
  file: File
): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/api/upload/preview`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}
