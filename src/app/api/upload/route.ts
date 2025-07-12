import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'Dosya bulunamadı veya tip hatası' }, { status: 400 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = 'enerjibobinaj';

  // Dosyayı base64 olarak oku
  const arrayBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString('base64');
  const dataUrl = `data:${file.type};base64,${base64String}`;

  // Cloudinary'ye fetch ile yükle
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const body = new FormData();
  body.append('file', dataUrl);
  body.append('upload_preset', uploadPreset);

  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body,
  });

  const data = await response.json();
  if (data.secure_url) {
    return NextResponse.json({ url: data.secure_url });
  } else {
    return NextResponse.json({ error: 'Yükleme hatası', detail: data }, { status: 500 });
  }
} 