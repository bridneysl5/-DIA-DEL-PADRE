import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        photos: true
      }
    });

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    return NextResponse.json({ album });
  } catch (error) {
    console.error('Error fetching album:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    const updateData: any = {};
    
    // Update song if provided
    const songEntry = formData.get('song');
    if (songEntry) {
      if (songEntry instanceof File) {
        const bytes = await songEntry.arrayBuffer();
        const buffer = Buffer.from(bytes);
        updateData.song = `data:${songEntry.type};base64,${buffer.toString('base64')}`;
      } else {
        updateData.song = songEntry as string;
      }
    }
    
    // Update photos if provided
    const photos = formData.getAll('photos') as File[];
    if (photos && photos.length > 0) {
      const photoUrls: string[] = [];
      for (const photo of photos) {
        if (photo instanceof File) {
          const bytes = await photo.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const base64 = buffer.toString('base64');
          const dataUri = `data:${photo.type};base64,${base64}`;
          photoUrls.push(dataUri);
        }
      }
      
      if (photoUrls.length > 0) {
        // Delete old photos
        await prisma.photo.deleteMany({ where: { albumId: id } });
        
        // Add new photos
        updateData.photos = {
          create: photoUrls.map(url => ({ url }))
        };
      }
    }
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No data provided to update' }, { status: 400 });
    }
    
    const album = await prisma.album.update({
      where: { id },
      data: updateData,
      include: { photos: true }
    });
    
    return NextResponse.json({ album });
  } catch (error) {
    console.error('Error updating album:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.album.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting album:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
