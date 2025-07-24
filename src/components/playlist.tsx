import { Play, Trash2, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Song } from '@/types/youtube'
import { formatTime } from '@/utils/youtube'

interface PlaylistProps {
  songs: Song[]
  currentIndex: number
  currentSong: Song | null
  isPlaying: boolean
  onSongSelect: (index: number) => void
  onSongRemove: (index: number) => void
  onClearAll: () => void
}

export function Playlist({
  songs,
  currentIndex,
  currentSong,
  isPlaying,
  onSongSelect,
  onSongRemove,
  onClearAll
}: PlaylistProps) {
  if (songs.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 text-center shadow-sm border">
        <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No songs in playlist</h3>
        <p className="text-muted-foreground">
          Add your first YouTube song using the input above
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Playlist ({songs.length})</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="text-destructive hover:text-destructive"
        >
          Clear All
        </Button>
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="p-2">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className={`playlist-item flex items-center gap-3 ${
                index === currentIndex ? 'bg-primary/10 border border-primary/20' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-12 h-12 rounded object-cover"
                />
                {index === currentIndex && isPlaying && (
                  <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${
                  index === currentIndex ? 'text-primary' : ''
                }`}>
                  {song.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  Added {song.addedAt.toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSongSelect(index)}
                  className="player-control"
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSongRemove(index)}
                  className="player-control text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}