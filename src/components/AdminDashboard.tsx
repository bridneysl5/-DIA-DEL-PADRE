'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Plus, Trash2, Edit2, X } from 'lucide-react';

export default function AdminDashboard() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form states
  const [buyerId, setBuyerId] = useState('');
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('padre');
  const [celebration, setCelebration] = useState('Cumpleaños');
  const [songMode, setSongMode] = useState<'preset' | 'custom'>('preset');
  const [song, setSong] = useState('song1.mp3');
  const [customSong, setCustomSong] = useState<File | null>(null);
  const [photos, setPhotos] = useState<FileList | null>(null);

  // Edit states
  const [editingAlbum, setEditingAlbum] = useState<any>(null);
  const [editSongMode, setEditSongMode] = useState<'preset' | 'custom'>('preset');
  const [editSong, setEditSong] = useState('');
  const [editCustomSong, setEditCustomSong] = useState<File | null>(null);
  const [editPhotos, setEditPhotos] = useState<FileList | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

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
    
    if (songMode === 'custom' && customSong) {
      formData.append('song', customSong);
    } else {
      formData.append('song', song);
    }
    
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
        setCustomSong(null);
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

  const handleEditClick = (album: any) => {
    setEditingAlbum(album);
    const isBase64 = album.song.startsWith('data:');
    setEditSongMode(isBase64 ? 'custom' : 'preset');
    setEditSong(isBase64 ? '' : album.song);
    setEditCustomSong(null);
    setEditPhotos(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEdit(true);

    const formData = new FormData();
    
    // Solo enviar canción si se seleccionó una predefinida o se subió una nueva
    if (editSongMode === 'preset' && editSong) {
      formData.append('song', editSong);
    } else if (editSongMode === 'custom' && editCustomSong) {
      formData.append('song', editCustomSong);
    }
    
    if (editPhotos) {
      for (let i = 0; i < editPhotos.length; i++) {
        formData.append('photos', editPhotos[i]);
      }
    }

    try {
      const res = await fetch(`/api/albums/${editingAlbum.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (res.ok) {
        setEditingAlbum(null);
        fetchAlbums();
        alert('Álbum actualizado exitosamente');
      } else {
        alert('Error al actualizar el álbum');
      }
    } catch (error) {
      console.error(error);
      alert('Error al actualizar los datos');
    } finally {
      setSavingEdit(false);
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
    <div className="space-y-10 relative">
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
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Música de Fondo</label>
            <div className="flex space-x-4 mb-2">
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-indigo-600" name="songMode" checked={songMode === 'preset'} onChange={() => setSongMode('preset')} />
                <span className="ml-2 text-sm">Seleccionar Lista</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-indigo-600" name="songMode" checked={songMode === 'custom'} onChange={() => setSongMode('custom')} />
                <span className="ml-2 text-sm">Subir Propia (MP3)</span>
              </label>
            </div>
            {songMode === 'preset' ? (
              <select value={song} onChange={e => setSong(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                <option value="song1.mp3">Canción 1 (Feliz Día)</option>
                <option value="song2.mp3">Canción 2 (Deportes)</option>
                <option value="song3.mp3">Canción 3 (Emotiva)</option>
              </select>
            ) : (
              <input type="file" required accept="audio/*" onChange={e => setCustomSong(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            )}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700">Fotos</label>
            <input type="file" required multiple accept="image/*" onChange={e => setPhotos(e.target.files)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>
          <button type="submit" disabled={creating} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
            {creating ? 'Creando...' : <><Plus className="w-4 h-4 mr-2" /> Crear Álbum</>}
          </button>
        </form>
      </div>

      {/* Edit Modal */}
      {editingAlbum && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setEditingAlbum(null)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleEditSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Editar Álbum: {editingAlbum.name}
                    </h3>
                    <button type="button" onClick={() => setEditingAlbum(null)} className="text-gray-400 hover:text-gray-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mb-4">
                      Aquí puedes cambiar la música y las fotos. El enlace y código QR seguirán siendo los mismos.
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cambiar Música (Opcional)</label>
                      <div className="flex space-x-4 mb-2">
                        <label className="inline-flex items-center">
                          <input type="radio" className="form-radio text-indigo-600" name="editSongMode" checked={editSongMode === 'preset'} onChange={() => setEditSongMode('preset')} />
                          <span className="ml-2 text-sm">Lista predefinida</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" className="form-radio text-indigo-600" name="editSongMode" checked={editSongMode === 'custom'} onChange={() => setEditSongMode('custom')} />
                          <span className="ml-2 text-sm">Subir Propia</span>
                        </label>
                      </div>
                      {editSongMode === 'preset' ? (
                        <select value={editSong} onChange={e => setEditSong(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                          <option value="">-- Mantener la canción actual --</option>
                          <option value="song1.mp3">Canción 1 (Feliz Día)</option>
                          <option value="song2.mp3">Canción 2 (Deportes)</option>
                          <option value="song3.mp3">Canción 3 (Emotiva)</option>
                        </select>
                      ) : (
                        <div>
                          <input type="file" accept="audio/*" onChange={e => setEditCustomSong(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                          <p className="text-xs text-gray-500 mt-1">Si no subes nada, se mantendrá la canción actual.</p>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <label className="block text-sm font-medium text-gray-700">Cambiar Fotos (Opcional)</label>
                      <input type="file" multiple accept="image/*" onChange={e => setEditPhotos(e.target.files)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                      <p className="text-xs text-red-500 mt-1">⚠️ Si subes nuevas fotos, se borrarán las fotos anteriores de este álbum.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" disabled={savingEdit} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400">
                    {savingEdit ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button type="button" onClick={() => setEditingAlbum(null)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Albums List */}
      <div>
        <h2 className="text-xl font-bold mb-4">Álbumes Creados</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID Comprador</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Festejado</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Temática</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">URL / QR</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
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
                        <a href={`/album/${album.id}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-900 font-medium">Ver</a>
                        <button onClick={() => downloadQR(album.id, album.name, album.buyerId)} className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium">
                          <Download className="w-4 h-4 ml-1" /> QR
                        </button>
                      </div>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end space-x-3">
                        <button onClick={() => handleEditClick(album)} className="text-blue-600 hover:text-blue-900" title="Editar">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteAlbum(album.id)} className="text-red-600 hover:text-red-900" title="Eliminar">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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
