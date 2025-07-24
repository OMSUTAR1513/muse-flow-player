import { useState } from 'react'
import { Plus, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isValidYouTubeUrl, createSongFromUrl } from '@/utils/youtube'
import { useToast } from '@/hooks/use-toast'

interface YouTubeInputProps {
  onAddSong: (song: any) => void
}

export function YouTubeInput({ onAddSong }: YouTubeInputProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAdd = async () => {
    if (!url.trim()) {
      toast({
        title: "Please enter a YouTube URL",
        variant: "destructive"
      })
      return
    }

    if (!isValidYouTubeUrl(url)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const song = await createSongFromUrl(url)
      onAddSong(song)
      setUrl('')
      toast({
        title: "Song added!",
        description: "The song has been added to your playlist"
      })
    } catch (error) {
      toast({
        title: "Failed to add song",
        description: "There was an error adding the song to your playlist",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <div className="flex items-center gap-3 mb-4">
        <Youtube className="h-6 w-6 text-red-500" />
        <h2 className="text-xl font-semibold">Add YouTube Song</h2>
      </div>
      
      <div className="flex gap-3">
        <Input
          type="url"
          placeholder="Paste YouTube video URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          onClick={handleAdd}
          disabled={isLoading || !url.trim()}
          className="btn-spotify"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isLoading ? 'Adding...' : 'Add'}
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mt-2">
        Supports youtube.com/watch?v=... and youtu.be/... URLs
      </p>
    </div>
  )
}