'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const themeStyles: Record<string, any> = {
  padre: {
    dark: '#020617',
    navy: '#0F172A',
    gold: '#D4AF37',
    goldDark: '#B8860B',
    light: '#F8FAFC',
    title1: 'Feliz Día',
    title2: 'Papá',
    icon: 'fa-crown',
    pedidosText: 'MOMENTOS ESPECIALES'
  },
  alianza: {
    dark: '#001a4d', // Blue very dark
    navy: '#003399', // Blue Alianza
    gold: '#ffffff', // White
    goldDark: '#e2e8f0',
    light: '#ffffff',
    title1: 'Arriba',
    title2: 'Alianza',
    icon: 'fa-futbol',
    pedidosText: 'CORAZÓN BLANQUIAZUL'
  },
  universitario: {
    dark: '#4A0B17', // Guinda Dark
    navy: '#811429', // Guinda
    gold: '#FFFDD0', // Crema
    goldDark: '#D4AF37', // Accent gold
    light: '#ffffff',
    title1: 'Y Dale',
    title2: 'U',
    icon: 'fa-futbol',
    pedidosText: 'GARRA CREMA'
  },
  mundial: {
    dark: '#064e3b',
    navy: '#166534',
    gold: '#fde047',
    goldDark: '#ca8a04',
    light: '#ffffff',
    title1: 'Pasión',
    title2: 'Mundialista',
    icon: 'fa-trophy',
    pedidosText: 'RUMBO A LA COPA'
  }
};

export default function AlbumViewer({ album }: { album: any }) {
  const t = themeStyles[album.theme] || themeStyles['padre'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  let title1 = t.title1;
  let title2 = t.title2;

  if (album.celebration === 'Cumpleaños') {
    title1 = 'Feliz';
    title2 = 'Cumpleaños';
  } else if (album.celebration === 'Día del Padre') {
    title1 = 'Feliz Día';
    title2 = 'del Padre';
  } else if (album.celebration === 'Aniversario') {
    title1 = 'Feliz';
    title2 = 'Aniversario';
  } else if (album.celebration === 'Graduación') {
    title1 = 'Feliz';
    title2 = 'Graduación';
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const src = album.song.startsWith('data:') ? album.song : `/music/${album.song}`;
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    return () => {
      audioRef.current?.pause();
    };
  }, [album.song]);

  const startCelebration = () => {
    setShowWelcome(false);
    playMusic();
  };

  const playMusic = () => {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (showWelcome) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % album.photos.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [showWelcome, album.photos.length]);

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center p-0 md:p-4 text-white overflow-hidden"
      style={{ backgroundColor: t.dark, fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Confetti Container - Simplificado con CSS local o Framer */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: `${Math.random() * 100}vw`, opacity: Math.random() * 0.6 + 0.4 }}
              animate={{ 
                y: '110vh', 
                rotate: Math.random() * 360 + 360,
                opacity: 0 
              }}
              transition={{
                duration: 6 + Math.random() * 8,
                repeat: Infinity,
                delay: Math.random() * -10,
                ease: 'linear'
              }}
              className="absolute shadow-sm"
              style={{
                backgroundColor: [t.gold, t.goldDark, t.light][Math.floor(Math.random() * 3)],
                width: `${Math.random() * 6 + 4}px`,
                height: `${Math.random() * 6 + 4}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%'
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ backgroundColor: t.dark }}
          >
            {/* Decoraciones en esquinas del welcome */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-30 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current" style={{ color: t.gold }}>
                    <path d="M100,0 Q80,10 60,0 T20,0 T0,0 L100,100 Z" />
                </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-32 h-32 opacity-30 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current rotate-180" style={{ color: t.gold }}>
                    <path d="M100,0 Q80,10 60,0 T20,0 T0,0 L100,100 Z" />
                </svg>
            </div>

            <div className="text-center p-6 max-w-sm mx-auto relative z-10">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-bounce mb-6 border-4"
                  style={{ backgroundColor: t.navy, borderColor: t.gold, boxShadow: `0 0 20px ${t.gold}4D` }}
                >
                    <i className={`fa-solid ${t.icon} text-4xl`} style={{ color: t.gold }}></i>
                </div>
                
                <h1 className="text-3xl font-bold tracking-wide text-white mb-2">{title1} {title2}!</h1>
                <p className="text-sm font-semibold mb-6" style={{ color: t.gold }}>Toca el botón para abrir tu regalo especial</p>
                
                <button 
                  onClick={startCelebration} 
                  className="w-full py-4 rounded-full font-bold text-lg shadow-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-3 text-black hover:opacity-90"
                  style={{ backgroundColor: t.gold, borderColor: t.goldDark, color: t.navy }}
                >
                    <i className="fa-solid fa-gift animate-pulse"></i>
                    <span>Abrir Regalo</span>
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showWelcome && (
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 w-full max-w-[430px] aspect-[9/16] rounded-[32px] overflow-hidden flex flex-col justify-between py-8 px-6 border-2"
          style={{ backgroundColor: t.navy, borderColor: t.gold, boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
        >
          {/* DECORACIONES DE ESQUINA */}
          <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none z-10 opacity-60">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current stroke-[3] stroke-linecap-round" style={{ color: t.gold }}>
                  <path d="M60,0 C65,20 80,35 100,40" />
                  <path d="M40,0 C48,28 72,52 100,60" />
                  <path d="M80,0 C83,10 90,17 100,20" />
              </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-28 h-28 pointer-events-none z-10 opacity-60">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current stroke-[3] stroke-linecap-round rotate-180" style={{ color: t.gold }}>
                  <path d="M60,0 C65,20 80,35 100,40" />
                  <path d="M40,0 C48,28 72,52 100,60" />
                  <path d="M80,0 C83,10 90,17 100,20" />
              </svg>
          </div>

          {/* SECCIÓN SUPERIOR */}
          <div className="text-center space-y-2 pt-2 z-10">
              <h2 className="text-2xl font-bold tracking-[0.2em] uppercase select-none flex justify-center items-center gap-2">
                  <span className="text-white">{title1}</span>
              </h2>
              <h1 className="font-cursive text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none" style={{ color: t.gold }}>
                  {title2}
              </h1>
              <p className="text-white text-lg mt-2 tracking-wide font-light">{album.name}</p>
          </div>

          {/* SECCIÓN CENTRAL: Carrusel de Fotos Polaroid Flotantes */}
          <div className="relative w-full flex items-center justify-center my-auto min-h-[310px] z-10">
              
              {/* Polaroid de fondo izquierda */}
              <div 
                className="absolute left-2 w-32 aspect-[4/5] p-2 pb-5 shadow-lg rounded-sm border-2 -rotate-12 opacity-40 animate-float-bg-left"
                style={{ backgroundColor: t.light, borderColor: t.gold }}
              >
                  <div className="w-full h-[82%] bg-slate-300 overflow-hidden rounded-sm relative">
                      {album.photos.length > 0 && (
                        <img src={album.photos[(currentIdx + 1) % album.photos.length]?.url} alt="Decoración Izquierda" className="absolute inset-0 w-full h-full object-cover" />
                      )}
                  </div>
              </div>

              {/* Polaroid de fondo derecha */}
              <div 
                className="absolute right-2 w-32 aspect-[4/5] p-2 pb-5 shadow-lg rounded-sm border-2 rotate-12 opacity-40 animate-float-bg-right"
                style={{ backgroundColor: t.light, borderColor: t.gold }}
              >
                  <div className="w-full h-[82%] bg-slate-300 overflow-hidden rounded-sm relative">
                      {album.photos.length > 0 && (
                        <img src={album.photos[(currentIdx + (album.photos.length > 2 ? 2 : 0)) % album.photos.length]?.url} alt="Decoración Derecha" className="absolute inset-0 w-full h-full object-cover" />
                      )}
                  </div>
              </div>

              {/* Polaroid Central Principal Animada */}
              <div 
                className="relative w-56 aspect-[4/5] p-3 pb-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] rounded-sm border-2 animate-float-main z-20"
                style={{ backgroundColor: t.light, borderColor: t.gold }}
              >
                  <div className="w-full h-[84%] overflow-hidden bg-slate-100 rounded-sm relative">
                    <AnimatePresence>
                      <motion.img 
                        key={currentIdx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        src={album.photos[currentIdx]?.url} 
                        alt="Foto Recuerdo" 
                        className="absolute inset-0 w-full h-full object-cover" 
                      />
                    </AnimatePresence>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-center">
                      <p className="font-cursive text-lg font-bold truncate" style={{ color: t.dark }}>¡Momentos Especiales! 🎁</p>
                  </div>
              </div>
              
              <i className="fa-solid fa-star absolute top-2 left-6 text-lg animate-pulse" style={{ color: t.gold }}></i>
              <i className="fa-solid fa-star absolute bottom-4 right-8 text-sm animate-bounce opacity-70" style={{ color: t.gold }}></i>
              <i className={`fa-solid ${t.icon} absolute bottom-12 left-8 text-md -rotate-12 opacity-60`} style={{ color: t.gold }}></i>
          </div>

          {/* SECCIÓN INFERIOR: Reproductor Musical */}
          <div className="space-y-4 w-full z-10 px-2 flex flex-col items-center">
              
              {/* Disco musical giratorio */}
              <div className="flex justify-center mb-4">
                  <button 
                    onClick={toggleMusic} 
                    className="relative w-20 h-20 bg-black rounded-full border-2 flex items-center justify-center cursor-pointer" 
                    style={{ borderColor: t.gold, boxShadow: `0 0 15px ${t.gold}33`, animation: isPlaying ? 'spin 3s linear infinite' : 'none' }}
                  >
                      {/* Centro del disco */}
                      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center z-10" style={{ backgroundColor: t.navy, borderColor: t.gold }}>
                          <i className="fa-solid fa-music text-[10px]" style={{ color: t.gold }}></i>
                      </div>
                      {/* Surcos del disco */}
                      <div className="absolute inset-1.5 rounded-full border border-white/10 pointer-events-none"></div>
                      <div className="absolute inset-3 rounded-full border border-white/5 pointer-events-none"></div>
                      <div className="absolute inset-4.5 rounded-full border border-white/5 pointer-events-none"></div>
                  </button>
              </div>

              {/* Footer de Pedidos con Botón de WhatsApp */}
              <div className="text-center pt-1 pb-2 space-y-1.5 mt-6 border-t border-white/10">
                  <p className="text-[10px] tracking-widest font-bold uppercase mt-2" style={{ color: t.gold }}>{t.pedidosText}</p>
                  <a href="https://wa.me/51916098803?text=Hola,%20deseo%20hacer%20un%20pedido%20de%20un%20regalo%20virtual" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 text-[11px] bg-black/20 hover:bg-black/40 border px-4 py-1.5 rounded-full tracking-wider font-bold transition-all hover:scale-105 active:scale-95" style={{ color: t.gold, borderColor: `${t.gold}33` }}>
                      <i className="fa-brands fa-whatsapp text-[#25D366] text-sm"></i>
                      PEDIDOS AL 916098803
                  </a>
              </div>
          </div>
        </motion.main>
      )}
    </div>
  );
}
