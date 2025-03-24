import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { MusicList, Node } from '../types/MusicPlayer';

const playlist = new MusicList();

// Agregamos algunas canciones de ejemplo
const sampleSongs = [
  {title: "Se me Nota", artist: "Hansel y Raul", file: "/Canciones/Se me nota.mp3"},
  {title: "COCO LOCO",artist: "Maluma",file: "/Canciones/COCO LOCO.mp3"},
  {title: "De la Vida Como Pelicula, Tragedia, Comedia y Ficcion",artist: "Canserbero",file: "/Canciones/De la Vida Como Pelicula, Tragedia, Comedia y Ficcion.mp3"},
  {title: "I Think They Call This Love", artist: "Elliot James Reay", file: "/Canciones/I Think They Call This Love.mp3"},
  {title: "Khe", artist: "Romeo Santos y Rauw Alejandro", file: "/Canciones/Khe.mp3"},
  {title: "La Vida Sin Ti", artist: "Rels b", file: "/Canciones/La Vida Sin Ti.mp3"},
  {title: "Let Me Blow Ya Love", artist: "2pac", file: "/Canciones/Let Me Blow Ya Love.mp3"},
  {title: "Me Fui de Vacaciones", artist: "Bad Bunny", file: "/Canciones/Me Fui de Vacaciones.mp3"},
  {title: "Me Libere", artist: "El Gran Combo", file: "/Canciones/Me Libere.mp3"},
  {title: "MEJOR NO NOS VEMOS", artist: "Rels b", file: "/Canciones/MEJOR NO NOS VEMOS.mp3"},
  {title: "No, No, No", artist: "The Real Eve", file: "/Canciones/No, No, No.mp3"},
  {title: "pa quererte", artist: "Rels b", file: "/Canciones/pa quererte.mp3"},
  {title: "PALABRAS SOBRAN", artist: "Blessd", file: "/Canciones/PALABRAS SOBRAN.mp3"},
  {title: "Que Puedo Hacer Yo", artist: "Albert Mendez", file: "/Canciones/Que Puedo Hacer Yo.mp3"},
  {title: "MEJOR NO NOS VEMOS", artist: "Rels b", file: "/Canciones/MEJOR NO NOS VEMOS.mp3"},
  {title: "Rara vez", artist: "Milo J", file: "/Canciones/Rara vez.mp3"},
  {title: "Best Friend", artist: "50cent", file: "/Canciones/Best Friend.mp3"},
  {title: "Sobrio", artist: "Maluma", file: "/Canciones/Sobrio.mp3"},
  {title: "Volver", artist: "Los Inquietos del Vallenato", file: "/Canciones/Volver.mp3"},
  {title: "Y No Hago Mas Na", artist: "El Gran Combo", file: "/Canciones/Y No Hago Mas Na.mp3"},
];

sampleSongs.forEach(song => playlist.addSong(song));

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Node | null>(playlist.current);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Nuevo efecto para manejar la reproducción automática cuando cambia la canción
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.load();
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Error al reproducir:", error);
          });
        }
      }
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    const nextSong = playlist.nextSong();
    if (nextSong) {
      setCurrentSong(nextSong);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    const prevSong = playlist.previousSong();
    if (prevSong) {
      setCurrentSong(prevSong);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {currentSong?.song.title || 'No hay canción seleccionada'}
          </h2>
          <p className="text-gray-400">
            {currentSong?.song.artist || 'Artista desconocido'}
          </p>
        </div>

        <audio
          ref={audioRef}
          src={currentSong?.song.file}
          onEnded={playNext}
        />

        <div className="flex items-center justify-center space-x-6 mb-8">
          <button
            onClick={playPrevious}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack size={32} />
          </button>

          <button
            onClick={togglePlay}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 transition-colors"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>

          <button
            onClick={playNext}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward size={32} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Volume2 className="text-gray-400" size={20} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="mt-8">
          <h3 className="text-white font-semibold mb-4">Lista de reproducción</h3>
          <div className="space-y-2">
            {playlist.getAllSongs().map((song, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  currentSong === song
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-300'
                } cursor-pointer hover:bg-green-600 transition-colors`}
                onClick={() => {
                  playlist.current = song;
                  setCurrentSong(song);
                  setIsPlaying(true);
                }}
              >
                <p className="font-medium">{song.song.title}</p>
                <p className="text-sm opacity-75">{song.song.artist}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}