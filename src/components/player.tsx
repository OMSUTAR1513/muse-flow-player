import { useEffect, useState } from 'react'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Song } from '@/types/youtube'
import { formatTime } from '@/utils/youtube'
import { useYouTubePlayer } from '@/hooks/use-youtube-player'

interface PlayerProps {
  currentSong: Song | null
  isShuffled: boolean
  repeatMode: 'none' | 'one' | 'all'
  onNext: () => void
  onPrevious: () => void
  onToggleShuffle: () => void
  onToggleRepeat: () => void
  onPlayStateChange?: (isPlaying: boolean) => void
}

export function Player({
  currentSong,
  isShuffled,
  repeatMode,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleRepeat,
  onPlayStateChange
}: PlayerProps) {
  const {
    playerState,
    isReady,
    initializePlayer,
    play,
    pause,
    seekTo,
    setVolume,
    toggleMute
  } = useYouTubePlayer()

  const [isDragging, setIsDragging] = useState(false)
  const [dragTime, setDragTime] = useState(0)

  // Initialize player when song changes
  useEffect(() => {
    if (currentSong && isReady) {
      initializePlayer(currentSong)
    }
  }, [currentSong, isReady, initializePlayer])

  // Notify parent of play state changes
  useEffect(() => {
    onPlayStateChange?.(playerState.isPlaying)
  }, [playerState.isPlaying, onPlayStateChange])

  // Auto-play next song when current ends
  useEffect(() => {
    if (playerState.currentTime > 0 && 
        playerState.duration > 0 && 
        playerState.currentTime >= playerState.duration - 1 &&
        !playerState.isPlaying) {
      if (repeatMode === 'one') {
        // Restart current song
        seekTo(0)
        setTimeout(play, 100)
      } else {
        // Play next song
        onNext()
      }
    }
  }, [playerState.currentTime, playerState.duration, playerState.isPlaying, repeatMode, onNext, seekTo, play])

  const handlePlayPause = () => {
    if (playerState.isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const handleProgressChange = (value: number[]) => {
    const newTime = value[0]
    setDragTime(newTime)
    if (!isDragging) {
      setIsDragging(true)
    }
  }

  const handleProgressCommit = (value: number[]) => {
    const newTime = value[0]
    seekTo(newTime)
    setIsDragging(false)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const currentTime = isDragging ? dragTime : playerState.currentTime
  const progressPercentage = playerState.duration > 0 
    ? (currentTime / playerState.duration) * 100 
    : 0

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat

  if (!currentSong) {
    return (
      <div className="bg-player border-t p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Select a song to start playing</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hidden YouTube player */}
      <div id="youtube-player" style={{ display: 'none' }} />
      
      <div className="bg-player border-t p-3 md:p-4 fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto">
          {/* Progress bar */}
          <div className="mb-3 md:mb-4">
            <Slider
              value={[currentTime]}
              max={playerState.duration || 100}
              step={1}
              onValueChange={handleProgressChange}
              onValueCommit={handleProgressCommit}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(playerState.duration)}</span>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden">
            {/* Song info */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={currentSong.thumbnail}
                alt={currentSong.title}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate text-sm">{currentSong.title}</p>
                <p className="text-xs text-muted-foreground">YouTube Music</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleShuffle}
                className={`player-control ${isShuffled ? 'text-primary' : ''}`}
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onPrevious}
                className="player-control"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                onClick={handlePlayPause}
                disabled={playerState.isLoading}
                className="btn-spotify w-14 h-14 rounded-full p-0"
              >
                {playerState.isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : playerState.isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                className="player-control"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleRepeat}
                className={`player-control ${repeatMode !== 'none' ? 'text-primary' : ''}`}
              >
                <RepeatIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="player-control"
              >
                {playerState.isMuted || playerState.volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <div className="w-24">
                <Slider
                  value={[playerState.isMuted ? 0 : playerState.volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            {/* Song info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img
                src={currentSong.thumbnail}
                alt={currentSong.title}
                className="w-14 h-14 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="font-medium truncate">{currentSong.title}</p>
                <p className="text-sm text-muted-foreground">YouTube Music</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleShuffle}
                className={`player-control ${isShuffled ? 'text-primary' : ''}`}
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onPrevious}
                className="player-control"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                onClick={handlePlayPause}
                disabled={playerState.isLoading}
                className="btn-spotify w-12 h-12 rounded-full p-0"
              >
                {playerState.isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : playerState.isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                className="player-control"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleRepeat}
                className={`player-control ${repeatMode !== 'none' ? 'text-primary' : ''}`}
              >
                <RepeatIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="player-control"
              >
                {playerState.isMuted || playerState.volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <div className="w-24">
                <Slider
                  value={[playerState.isMuted ? 0 : playerState.volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}