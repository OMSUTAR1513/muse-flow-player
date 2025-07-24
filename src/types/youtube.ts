export interface Song {
  id: string
  title: string
  videoId: string
  thumbnail: string
  duration?: string
  addedAt: Date
}

export interface PlayerState {
  isPlaying: boolean
  currentSong: Song | null
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isLoading: boolean
}

export interface PlaylistState {
  songs: Song[]
  currentIndex: number
  isShuffled: boolean
  repeatMode: 'none' | 'one' | 'all'
}