import { useEffect, useRef, useState, useCallback } from 'react'
import { PlayerState, Song } from '@/types/youtube'

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
    YT: any
  }
}

export function useYouTubePlayer() {
  const playerRef = useRef<any>(null)
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentSong: null,
    currentTime: 0,
    duration: 0,
    volume: 50,
    isMuted: false,
    isLoading: false
  })
  const [isReady, setIsReady] = useState(false)

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsReady(true)
      return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      setIsReady(true)
    }
  }, [])

  // Initialize player
  const initializePlayer = useCallback((song: Song) => {
    if (!isReady || !window.YT) return

    if (playerRef.current) {
      playerRef.current.destroy()
    }

    playerRef.current = new window.YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId: song.videoId,
      playerVars: {
        playsinline: 1,
        controls: 0,
        rel: 0,
        showinfo: 0,
        modestbranding: 1
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    })

    setPlayerState(prev => ({ 
      ...prev, 
      currentSong: song,
      isLoading: true 
    }))
  }, [isReady])

  const onPlayerReady = useCallback((event: any) => {
    const duration = event.target.getDuration()
    const volume = event.target.getVolume()
    
    setPlayerState(prev => ({
      ...prev,
      duration,
      volume,
      isLoading: false
    }))
  }, [])

  const onPlayerStateChange = useCallback((event: any) => {
    const state = event.data
    let isPlaying = false

    if (state === window.YT.PlayerState.PLAYING) {
      isPlaying = true
    } else if (state === window.YT.PlayerState.PAUSED) {
      isPlaying = false
    } else if (state === window.YT.PlayerState.ENDED) {
      isPlaying = false
      // Handle next song logic here if needed
    }

    setPlayerState(prev => ({
      ...prev,
      isPlaying,
      isLoading: state === window.YT.PlayerState.BUFFERING
    }))
  }, [])

  const onPlayerError = useCallback((event: any) => {
    console.error('YouTube Player Error:', event.data)
    setPlayerState(prev => ({
      ...prev,
      isLoading: false,
      isPlaying: false
    }))
  }, [])

  // Update current time
  useEffect(() => {
    if (!playerRef.current || !playerState.isPlaying) return

    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime()
        setPlayerState(prev => ({ ...prev, currentTime }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [playerState.isPlaying])

  // Player controls
  const play = useCallback(() => {
    if (playerRef.current && playerRef.current.playVideo) {
      playerRef.current.playVideo()
    }
  }, [])

  const pause = useCallback(() => {
    if (playerRef.current && playerRef.current.pauseVideo) {
      playerRef.current.pauseVideo()
    }
  }, [])

  const seekTo = useCallback((time: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(time, true)
      setPlayerState(prev => ({ ...prev, currentTime: time }))
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(volume)
      setPlayerState(prev => ({ ...prev, volume, isMuted: volume === 0 }))
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (playerRef.current) {
      if (playerState.isMuted) {
        playerRef.current.unMute()
        setPlayerState(prev => ({ ...prev, isMuted: false }))
      } else {
        playerRef.current.mute()
        setPlayerState(prev => ({ ...prev, isMuted: true }))
      }
    }
  }, [playerState.isMuted])

  return {
    playerState,
    isReady,
    initializePlayer,
    play,
    pause,
    seekTo,
    setVolume,
    toggleMute
  }
}