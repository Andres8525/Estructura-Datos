export class Node {
  constructor(
    public song: {
      title: string;
      artist: string;
      file: string;
    },
    public next: Node | null = null,
    public prev: Node | null = null
  ) {}
}

export class MusicList {
  head: Node | null = null;
  tail: Node | null = null;
  current: Node | null = null;

  addSong(song: { title: string; artist: string; file: string }): void {
    const newNode = new Node(song);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
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
}