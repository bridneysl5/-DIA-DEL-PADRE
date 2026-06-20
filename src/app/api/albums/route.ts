import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const buyerId = formData.get('buyerId') as string;
    const name = formData.get('name') as string;
    const theme = formData.get('theme') as string;
    const celebration = formData.get('celebration') as string || 'Cumpleaños';
    const song = formData.get('song') as string;
    const photos = formData.getAll('photos') as File[];

    if (!buyerId || !name || !theme || !song) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const photoUrls: string[] = [];

    for (const photo of photos) {
      if (photo instanceof File) {
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(filename, buffer, {
            contentType: photo.type,
            upsert: false
          });

        if (error) {
          console.error('Error uploading photo:', error);
          throw error;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(filename);

        photoUrls.push(publicUrl);
      }
    }

    const album = await prisma.album.create({
      data: {
        buyerId,
        name,
        theme,
        celebration,
        song,
        photos: {
          create: photoUrls.map(url => ({ url }))
        }
      }
    });

    return NextResponse.json({ album });
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { photos: true }
        }
      }
    });
    return NextResponse.json({ albums });
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
