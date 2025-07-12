export async function uploadToCloudinary(file: File): Promise<string> {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) throw new Error('Dosya boyutu 10MB\'dan büyük olamaz!');
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/wav', 'audio/ogg'
  ];
  if (!allowedTypes.includes(file.type)) throw new Error('Desteklenmeyen dosya tipi!');
  const url = 'https://api.cloudinary.com/v1_1/dejdb80bv/auto/upload';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'enerjibobinaj'); // kendi preset adını kullan!
  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Yükleme hatası: ' + res.statusText);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url;
} 