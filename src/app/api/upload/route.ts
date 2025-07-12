import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = 'edge'; // Vercel uyumu için

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'Dosya bulunamadı veya tip hatası' }, { status: 400 });
  }
  // Dosyayı buffer'a çevir
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const upload = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream({ resource_type: 'auto' }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }).end(buffer);
    });
    // @ts-ignore
    return NextResponse.json({ url: upload.secure_url });
  } catch (e) {
    return NextResponse.json({ error: 'Yükleme hatası', detail: e }, { status: 500 });
  }
} 