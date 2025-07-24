# 🎵 YouTube Music Player

A beautiful, Spotify-inspired YouTube music player built with React, TypeScript, and Tailwind CSS. Stream YouTube videos as music with a clean, modern interface.

![YouTube Music Player](https://img.shields.io/badge/YouTube-Music%20Player-red?style=for-the-badge&logo=youtube)

## ✨ Features

- 🎵 **YouTube Integration**: Paste any YouTube URL to add songs
- 🎮 **Full Player Controls**: Play, pause, next, previous, volume control
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🎨 **Spotify-like UI**: Clean, modern interface inspired by Spotify
- 🌙 **Dark/Light Mode**: Toggle between themes
- 📝 **Playlist Management**: Add, remove, and organize songs
- 💾 **Local Storage**: Automatically saves your playlist
- 🔀 **Shuffle & Repeat**: Full playlist control options
- ⏱️ **Progress Bar**: Seek to any position in the song
- 🔊 **Volume Control**: Adjust volume and mute/unmute

## 🚀 Quick Start

1. **Clone and Install**:
   ```bash
   git clone <your-repo>
   cd youtube-music-player
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:8080`

## 🎯 How to Use

1. **Add Songs**: Paste a YouTube URL in the input field and click "Add"
2. **Play Music**: Click on any song in the playlist to start playing
3. **Control Playback**: Use the player controls at the bottom
4. **Manage Playlist**: Remove songs or clear the entire playlist
5. **Customize**: Toggle between dark and light themes

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **UI Components**: Radix UI (via shadcn/ui)
- **Icons**: Lucide React
- **YouTube API**: YouTube IFrame Player API
- **Build Tool**: Vite
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── player.tsx       # Main player component
│   ├── playlist.tsx     # Playlist component
│   ├── youtube-input.tsx # URL input component
│   └── theme-toggle.tsx # Dark mode toggle
├── hooks/               # Custom React hooks
│   ├── use-youtube-player.ts # YouTube player logic
│   ├── use-playlist.ts  # Playlist management
│   └── use-toast.ts     # Toast notifications
├── providers/           # React context providers
│   └── theme-provider.tsx # Theme management
├── types/               # TypeScript type definitions
│   └── youtube.ts       # YouTube-related types
├── utils/               # Utility functions
│   └── youtube.ts       # YouTube URL parsing
└── pages/               # Page components
    └── Index.tsx        # Main page
```

## 🔧 Key Features Explained

### YouTube Integration
- Supports multiple URL formats (`youtube.com/watch?v=...`, `youtu.be/...`)
- Extracts video metadata and thumbnails
- Uses YouTube IFrame Player API for playback

### Player Controls
- **Play/Pause**: Toggle playback state
- **Next/Previous**: Navigate through playlist
- **Shuffle**: Randomize song order
- **Repeat**: None, All, or One song repeat modes
- **Volume**: Slider control with mute toggle
- **Progress**: Seekable progress bar with time display

### Playlist Management
- **Add Songs**: From YouTube URLs
- **Remove Songs**: Individual or clear all
- **Reorder**: Click to play any song
- **Persistence**: Automatically saved to localStorage

### Design System
- **Colors**: Spotify-inspired green (#1DB954) with semantic tokens
- **Typography**: Clean, readable fonts with proper hierarchy
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

## 🚀 Deployment

This app is ready for deployment on Vercel:

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Configure Build**: Vite build settings are pre-configured
3. **Deploy**: Push to main branch to auto-deploy

### Environment Variables
No environment variables required - the app uses YouTube's public IFrame API.

## 🎨 Customization

### Themes
The app supports custom themes through CSS variables in `src/index.css`:
- Light theme: Clean, minimal design
- Dark theme: Spotify-inspired dark interface

### Colors
Modify the design system in `src/index.css`:
```css
:root {
  --spotify-green: 141 76% 48%;
  --player-bg: 0 0% 98%;
  /* ... more variables */
}
```

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

**Note**: Requires modern browser with ES6+ support.

## 🔒 Privacy & Security

- **No Data Collection**: All data stays in your browser
- **Local Storage Only**: Playlists saved locally
- **No Backend**: Pure client-side application
- **YouTube API**: Uses public, read-only YouTube IFrame API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **YouTube**: For the IFrame Player API
- **Spotify**: For design inspiration
- **shadcn/ui**: For beautiful UI components
- **Radix UI**: For accessible primitives
- **Lucide**: For gorgeous icons

---

**Enjoy your music! 🎵**