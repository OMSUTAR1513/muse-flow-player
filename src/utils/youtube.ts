import { Song } from '@/types/youtube'

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'medium'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`
}

export async function getVideoTitle(videoId: string): Promise<string> {
  try {
    // This is a simple approach - in production you might want to use YouTube Data API
    // For now, we'll return a placeholder and let users see the actual title when the video loads
    return `Video ${videoId.substring(0, 8)}`
  } catch (error) {
    console.error('Failed to fetch video title:', error)
    return `Video ${videoId.substring(0, 8)}`
  }
}

export function createSongFromUrl(url: string): Promise<Song> {
  return new Promise((resolve, reject) => {
    const videoId = extractVideoId(url)
    if (!videoId) {
      reject(new Error('Invalid YouTube URL'))
      return
    }

    // Try to get title from YouTube oEmbed API
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      .then(response => response.json())
      .then(data => {
        const song: Song = {
          id: Date.now().toString(),
          title: data.title || `YouTube Video ${videoId.substring(0, 8)}`,
          videoId,
          thumbnail: getThumbnailUrl(videoId, 'medium'),
          addedAt: new Date()
        }
        resolve(song)
      })
      .catch(() => {
        // Fallback if oEmbed fails
        const song: Song = {
          id: Date.now().toString(),
          title: `YouTube Video ${videoId.substring(0, 8)}`,
          videoId,
          thumbnail: getThumbnailUrl(videoId, 'medium'),
          addedAt: new Date()
        }
        resolve(song)
      })
  })
}