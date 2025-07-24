import { useState, useEffect, useCallback } from 'react'
import { Song, PlaylistState } from '@/types/youtube'

const STORAGE_KEY = 'youtube-music-playlist'

export function usePlaylist() {
  const [playlist, setPlaylist] = useState<PlaylistState>({
    songs: [],
    currentIndex: -1,
    isShuffled: false,
    repeatMode: 'none'
  })

  // Load playlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPlaylist(parsed)
      } catch (error) {
        console.error('Failed to parse stored playlist:', error)
      }
    }
  }, [])

  // Save playlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlist))
  }, [playlist])

  const addSong = useCallback((song: Song) => {
    setPlaylist(prev => {
      // Check if song already exists
      const exists = prev.songs.some(s => s.videoId === song.videoId)
      if (exists) return prev

      const newSongs = [...prev.songs, song]
      return {
        ...prev,
        songs: newSongs,
        currentIndex: prev.currentIndex === -1 ? 0 : prev.currentIndex
      }
    })
  }, [])

  const removeSong = useCallback((index: number) => {
    setPlaylist(prev => {
      const newSongs = prev.songs.filter((_, i) => i !== index)
      let newIndex = prev.currentIndex

      if (index === prev.currentIndex) {
        // If removing current song, move to next or previous
        newIndex = newSongs.length > 0 ? Math.min(index, newSongs.length - 1) : -1
      } else if (index < prev.currentIndex) {
        // If removing song before current, adjust index
        newIndex = prev.currentIndex - 1
      }

      return {
        ...prev,
        songs: newSongs,
        currentIndex: newIndex
      }
    })
  }, [])

  const setCurrentIndex = useCallback((index: number) => {
    setPlaylist(prev => ({
      ...prev,
      currentIndex: Math.max(-1, Math.min(index, prev.songs.length - 1))
    }))
  }, [])

  const nextSong = useCallback(() => {
    setPlaylist(prev => {
      if (prev.songs.length === 0) return prev

      let nextIndex = prev.currentIndex + 1

      if (nextIndex >= prev.songs.length) {
        if (prev.repeatMode === 'all') {
          nextIndex = 0
        } else {
          return prev // Stay at current song if not repeating
        }
      }

      return {
        ...prev,
        currentIndex: nextIndex
      }
    })
  }, [])

  const previousSong = useCallback(() => {
    setPlaylist(prev => {
      if (prev.songs.length === 0) return prev

      let prevIndex = prev.currentIndex - 1

      if (prevIndex < 0) {
        if (prev.repeatMode === 'all') {
          prevIndex = prev.songs.length - 1
        } else {
          prevIndex = 0
        }
      }

      return {
        ...prev,
        currentIndex: prevIndex
      }
    })
  }, [])

  const toggleShuffle = useCallback(() => {
    setPlaylist(prev => ({
      ...prev,
      isShuffled: !prev.isShuffled
    }))
  }, [])

  const toggleRepeat = useCallback(() => {
    setPlaylist(prev => {
      const modes: PlaylistState['repeatMode'][] = ['none', 'all', 'one']
      const currentMode = prev.repeatMode
      const nextMode = modes[(modes.indexOf(currentMode) + 1) % modes.length]
      
      return {
        ...prev,
        repeatMode: nextMode
      }
    })
  }, [])

  const clearPlaylist = useCallback(() => {
    setPlaylist({
      songs: [],
      currentIndex: -1,
      isShuffled: false,
      repeatMode: 'none'
    })
  }, [])

  const currentSong = playlist.currentIndex >= 0 ? playlist.songs[playlist.currentIndex] : null

  return {
    playlist,
    currentSong,
    addSong,
    removeSong,
    setCurrentIndex,
    nextSong,
    previousSong,
    toggleShuffle,
    toggleRepeat,
    clearPlaylist
  }
}