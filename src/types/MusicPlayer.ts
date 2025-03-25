export interface Song {
  id: string;
  title: string;
  artist: string;
  file: string;
}

export class Node {
  constructor(
    public song: Song,
    public next: Node | null = null,
    public prev: Node | null = null
  ) {}
}

export class MusicList {
  head: Node | null = null;
  tail: Node | null = null;
  current: Node | null = null;

  addSong(song: Omit<Song, 'id'> & { id?: string }): void {
    const songWithId: Song = {
      id: song.id || Math.random().toString(36).substring(2, 9),
      ...song
    };
    
    const newNode = new Node(songWithId);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
    } else {
      newNode.prev = this.tail;
      if (this.tail) {
        this.tail.next = newNode;
      }
      this.tail = newNode;
    }
  }

  nextSong(): Node | null {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return this.current;
    }
    return null;
  }

  previousSong(): Node | null {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
      return this.current;
    }
    return null;
  }

  getAllSongs(): Node[] {
    const songs: Node[] = [];
    let current = this.head;
    while (current) {
      songs.push(current);
      current = current.next;
    }
    return songs;
  }

  removeSong(id: string): void {
    let current = this.head;
    
    while (current) {
      if (current.song.id === id) {
        if (!current.prev && !current.next) {
          this.head = null;
          this.tail = null;
          if (this.current === current) {
            this.current = null;
          }
          return;
        }
        
        if (!current.prev) {
          this.head = current.next;
          if (this.head) this.head.prev = null;
          if (this.current === current) {
            this.current = this.head;
          }
          return;
        }
        
        if (!current.next) {
          this.tail = current.prev;
          if (this.tail) this.tail.next = null;
          if (this.current === current) {
            this.current = this.tail;
          }
          return;
        }
        
        if (current.prev && current.next) {
          current.prev.next = current.next;
          current.next.prev = current.prev;
          if (this.current === current) {
            this.current = current.next;
          }
        }
        return;
      }
      current = current.next;
    }
  }
}