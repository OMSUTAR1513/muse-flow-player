import { useEffect, useState } from 'react'
import { Music, Github } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { YouTubeInput } from '@/components/youtube-input'
import { Playlist } from '@/components/playlist'
import { Player } from '@/components/player'
import { usePlaylist } from '@/hooks/use-playlist'

const Index = () => {
  const {
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
  } = usePlaylist()

  const [isPlaying, setIsPlaying] = useState(false)

  // Auto-play first song when added
  useEffect(() => {
    if (playlist.songs.length === 1 && playlist.currentIndex === -1) {
      setCurrentIndex(0)
    }
  }, [playlist.songs.length, playlist.currentIndex, setCurrentIndex])

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="bg-player border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Music className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-spotify-green">YouTube Music</h1>
              <p className="text-sm text-muted-foreground">Stream YouTube videos as music</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="player-control text-muted-foreground hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Add song section */}
          <YouTubeInput onAddSong={addSong} />

          {/* Playlist */}
          <Playlist
            songs={playlist.songs}
            currentIndex={playlist.currentIndex}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onSongSelect={setCurrentIndex}
            onSongRemove={removeSong}
            onClearAll={clearPlaylist}
          />

          {/* Instructions */}
          {playlist.songs.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Welcome to YouTube Music Player</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>🎵 Paste any YouTube video URL to add it to your playlist</p>
                  <p>🎮 Use the player controls to play, pause, and navigate songs</p>
                  <p>🔀 Shuffle and repeat modes available</p>
                  <p>💾 Your playlist is automatically saved locally</p>
                  <p>🌙 Toggle between light and dark themes</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Player */}
      <Player
        currentSong={currentSong}
        isShuffled={playlist.isShuffled}
        repeatMode={playlist.repeatMode}
        onNext={nextSong}
        onPrevious={previousSong}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        onPlayStateChange={setIsPlaying}
      />
    </div>
  );
};

export default Index;
