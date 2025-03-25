import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, RotateCcw } from 'lucide-react';
import { MusicList, Node, Song } from '../types/MusicPlayer';
import '../index.css';

type CurrentSongType = {
  song: Song;
  next: Node | null;
  prev: Node | null;
} | null;

const playlist = new MusicList();

// Canciones de ejemplo con tipo explícito
const sampleSongs: Omit<Song, 'id'>[] = [
  { title: "Se me Nota", artist: "Hansel y Raul", file: "/Canciones/Se me nota.mp3" },
  { title: "COCO LOCO", artist: "Maluma", file: "/Canciones/COCO LOCO.mp3" },
  { title: "De la Vida Como Pelicula, Tragedia, Comedia y Ficcion", artist: "Canserbero", file: "/Canciones/De la Vida Como Pelicula, Tragedia, Comedia y Ficcion.mp3" },
  { title: "I Think They Call This Love", artist: "Elliot James Reay", file: "/Canciones/I Think They Call This Love.mp3" },
  { title: "Khe", artist: "Romeo Santos y Rauw Alejandro", file: "/Canciones/Khe.mp3" },
  { title: "La Vida Sin Ti", artist: "Rels b", file: "/Canciones/La Vida Sin Ti.mp3" },
  { title: "Let Me Blow Ya Love", artist: "2pac", file: "/Canciones/Let Me Blow Ya Love.mp3" },
  { title: "Me Fui de Vacaciones", artist: "Bad Bunny", file: "/Canciones/Me Fui de Vacaciones.mp3" },
  { title: "Me Libere", artist: "El Gran Combo", file: "/Canciones/Me Libere.mp3" },
  { title: "MEJOR NO NOS VEMOS", artist: "Rels b", file: "/Canciones/MEJOR NO NOS VEMOS.mp3" },
  { title: "No, No, No", artist: "The Real Eve", file: "/Canciones/No, No, No.mp3" },
  { title: "pa quererte", artist: "Rels b", file: "/Canciones/pa quererte.mp3" },
  { title: "PALABRAS SOBRAN", artist: "Blessd", file: "/Canciones/PALABRAS SOBRAN.mp3" },
  { title: "Que Puedo Hacer Yo", artist: "Albert Mendez", file: "/Canciones/Que Puedo Hacer Yo.mp3" },
  { title: "Rara vez", artist: "Milo J", file: "/Canciones/Rara vez.mp3" },
  { title: "Best Friend", artist: "50cent", file: "/Canciones/Best Friend.mp3" },
  { title: "Sobrio", artist: "Maluma", file: "/Canciones/Sobrio.mp3" },
  { title: "Volver", artist: "Los Inquietos del Vallenato", file: "/Canciones/Volver.mp3" },
  { title: "Y No Hago Mas Na", artist: "El Gran Combo", file: "/Canciones/Y No Hago Mas Na.mp3" },
].map((song, index) => ({ ...song, id: `song-${index + 1}` }));

sampleSongs.forEach(song => playlist.addSong(song));

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<CurrentSongType>(playlist.current);
  const [volume, setVolume] = useState(0.5);
  const [songs, setSongs] = useState<Node[]>(playlist.getAllSongs());
  const [deletedSongs, setDeletedSongs] = useState<Node[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'playlist' | 'deleted'>('playlist');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && currentSong?.song.file) {
      audioRef.current.src = currentSong.song.file;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error al reproducir:", error);
        });
      }
    }
  }, [currentSong, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error al reproducir:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    const nextSong = playlist.nextSong();
    if (nextSong) {
      setCurrentSong(nextSong as CurrentSongType);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    const prevSong = playlist.previousSong();
    if (prevSong) {
      setCurrentSong(prevSong as CurrentSongType);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggingId(id);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('dragging');
    setDraggingId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === targetId) return;

    const draggedIndex = songs.findIndex(s => s.song.id === draggedId);
    const targetIndex = songs.findIndex(s => s.song.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newSongs = [...songs];
    const [removed] = newSongs.splice(draggedIndex, 1);
    newSongs.splice(targetIndex, 0, removed);

    // Actualizar la lista enlazada
    playlist.head = null;
    playlist.tail = null;
    playlist.current = null;
    newSongs.forEach(song => {
      playlist.addSong(song.song);
    });

    setSongs(newSongs);
    
    if (currentSong && !newSongs.some(s => s.song.id === currentSong.song.id)) {
      setCurrentSong(playlist.current as CurrentSongType);
    }
  };

  const removeSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const songToRemove = songs.find(s => s.song.id === id);
    if (!songToRemove) return;

    // Eliminar de la lista principal
    playlist.removeSong(id);
    const newSongs = playlist.getAllSongs();
    setSongs(newSongs);

    // Añadir a la lista de eliminadas
    setDeletedSongs([...deletedSongs, songToRemove]);
    
    if (currentSong?.song.id === id) {
      setCurrentSong(playlist.current as CurrentSongType);
      setIsPlaying(false);
    }
  };

  const restoreSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const songToRestore = deletedSongs.find(s => s.song.id === id);
    if (!songToRestore) return;

    // Eliminar de la lista de eliminadas
    const newDeletedSongs = deletedSongs.filter(s => s.song.id !== id);
    setDeletedSongs(newDeletedSongs);

    // Añadir al final de la lista principal
    playlist.addSong(songToRestore.song);
    setSongs(playlist.getAllSongs());
  };

  return (
    <div className="music-player-container">
      <div className="player-wrapper">
        <div className="player-card">
          <div className="song-title">
            {currentSong?.song.title || 'No hay canción seleccionada'}
          </div>
          <div className="song-artist">
            {currentSong?.song.artist || 'Artista desconocido'}
          </div>

          <audio
            ref={audioRef}
            onEnded={playNext}
          />

          <div className="controls">
            <button onClick={playPrevious} className="control-button">
              <SkipBack size={32} />
            </button>
            <button onClick={togglePlay} className="play-button">
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button onClick={playNext} className="control-button">
              <SkipForward size={32} />
            </button>
          </div>

          <div className="volume-control">
            <Volume2 size={20} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>

        <div className="playlist-container">
          <div className="playlist-tabs">
            <button 
              className={`tab-button ${activeTab === 'playlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('playlist')}
            >
              Lista de reproducción
            </button>
            <button 
              className={`tab-button ${activeTab === 'deleted' ? 'active' : ''}`}
              onClick={() => setActiveTab('deleted')}
            >
              Canciones eliminadas ({deletedSongs.length})
            </button>
          </div>

          {activeTab === 'playlist' ? (
            <div className="playlist">
              {songs.map((songNode) => (
                <div
                  key={songNode.song.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, songNode.song.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, songNode.song.id)}
                  className={`playlist-item ${currentSong?.song.id === songNode.song.id ? 'active' : ''} ${draggingId === songNode.song.id ? 'dragging' : ''}`}
                  onClick={() => {
                    playlist.current = songNode;
                    setCurrentSong(songNode as CurrentSongType);
                    setIsPlaying(true);
                  }}
                >
                  <div className="playlist-item-content">
                    <div className="playlist-item-title">{songNode.song.title}</div>
                    <div className="playlist-item-artist">{songNode.song.artist}</div>
                  </div>
                  <button 
                    className="remove-song-button"
                    onClick={(e) => removeSong(songNode.song.id, e)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="deleted-songs-list">
              {deletedSongs.length === 0 ? (
                <div className="empty-message">No hay canciones eliminadas</div>
              ) : (
                deletedSongs.map((songNode) => (
                  <div
                    key={songNode.song.id}
                    className="deleted-song-item"
                  >
                    <div className="playlist-item-content">
                      <div className="playlist-item-title">{songNode.song.title}</div>
                      <div className="playlist-item-artist">{songNode.song.artist}</div>
                    </div>
                    <button 
                      className="restore-song-button"
                      onClick={(e) => restoreSong(songNode.song.id, e)}
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}