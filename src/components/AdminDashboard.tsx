'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Plus, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form states
  const [buyerId, setBuyerId] = useState('');
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('padre');
  const [celebration, setCelebration] = useState('Cumpleaños');
  const [song, setSong] = useState('song1.mp3');
  const [photos, setPhotos] = useState<FileList | null>(null);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/albums');
      const data = await res.json();
      if (data.albums) {
        setAlbums(data.albums);
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    const formData = new FormData();
    formData.append('buyerId', buyerId);
    formData.append('name', name);
    formData.append('theme', theme);
    formData.append('celebration', celebration);
    formData.append('song', song);
    
    if (photos) {
      for (let i = 0; i < photos.length; i++) {
        formData.append('photos', photos[i]);
      }
    }

    try {
      const res = await fetch('/api/albums', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setBuyerId('');
        setName('');
        setPhotos(null);
        fetchAlbums();
        alert('Álbum creado exitosamente');
      } else {
        alert('Error al crear el álbum');
      }
    } catch (error) {
      console.error(error);
      alert('Error al subir los datos');
    } finally {
      setCreating(false);
    }
  };

  const deleteAlbum = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este álbum?')) return;
    try {
      await fetch(`/api/albums/${id}`, { method: 'DELETE' });
      fetchAlbums();
    } catch (error) {
      console.error(error);
    }
  };

  const downloadQR = async (albumId: string, albumName: string, buyerId: string) => {
    const url = `${window.location.origin}/album/${albumId}`;
    try {
      const dataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2 });
      const link = document.createElement('a');
      const cleanName = albumName.replace(/\s+/g, '_');
      link.download = `${buyerId}-${cleanName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Error generando QR');
    }
  };

  return (
    <div className="space-y-10">
      {/* Create Form */}
      <div>
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Álbum</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-gray-50 p-6 rounded-lg border">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID del Comprador (Oculto al público)</label>
            <input type="text" required value={buyerId} onChange={e => setBuyerId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="Ej: VENTA-001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Festejado</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="Ej: Juan Pérez" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Celebración</label>
            <select value={celebration} onChange={e => setCelebration(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
              <option value="Cumpleaños">Cumpleaños</option>
              <option value="Día del Padre">Día del Padre</option>
              <option value="Aniversario">Aniversario</option>
              <option value="Graduación">Graduación</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Temática</label>
            <select value={theme} onChange={e => setTheme(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
              <option value="padre">Día del Padre</option>
              <option value="alianza">Alianza Lima</option>
              <option value="universitario">Universitario</option>
              <option value="mundial">Mundial de Fútbol</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Música de Fondo</label>
            <select value={song} onChange={e => setSong(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
              <option value="song1.mp3">Canción 1 (Feliz Día)</option>
              <option value="song2.mp3">Canción 2 (Deportes)</option>
              <option value="song3.mp3">Canción 3 (Emotiva)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fotos</label>
            <input type="file" required multiple accept="image/*" onChange={e => setPhotos(e.target.files)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>
          <button type="submit" disabled={creating} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
            {creating ? 'Creando...' : <><Plus className="w-4 h-4 mr-2" /> Crear Álbum</>}
          </button>
        </form>
      </div>

      {/* Albums List */}
      <div>
        <h2 className="text-xl font-bold mb-4">Álbumes Creados</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID Comprador</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Festejado</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Temática</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">URL / QR</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {albums.map((album) => (
                  <tr key={album.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{album.buyerId}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{album.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{album.theme}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <a href={`/album/${album.id}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900">Ver</a>
                        <button onClick={() => downloadQR(album.id, album.name, album.buyerId)} className="inline-flex items-center text-gray-600 hover:text-gray-900">
                          <Download className="w-4 h-4 ml-2" /> QR
                        </button>
                      </div>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button onClick={() => deleteAlbum(album.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {albums.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">No hay álbumes creados aún.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
