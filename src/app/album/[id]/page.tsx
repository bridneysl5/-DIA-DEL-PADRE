import prisma from '@/lib/prisma';
import AlbumViewer from '@/components/AlbumViewer';
import { notFound } from 'next/navigation';

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      photos: true
    }
  });

  if (!album) {
    notFound();
  }

  return (
    <AlbumViewer album={album} />
  );
}
