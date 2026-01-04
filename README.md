# OliviaTube 📺

OliviaTube is a premium YouTube-clone iOS application built with React Native and Expo. It features a sleek dark-mode interface, seamless video playback, and auto-advancing feeds.

## ✨ Features

*   **Premium UI**: Dark mode aesthetic inspired by modern streaming apps.
*   **Video Feed**: Scrollable list of videos with auto-play capabilities.
*   **Auto-Advance**: When a video finishes, the app automatically scrolls to and plays the next video.
*   **Local Streaming**: Optimized to handle high-quality local video files via a local HTTP server.
*   **Glassmorphism**: Modern design elements including blurred navigation tabs.

## 🚀 Getting Started

### Prerequisites

*   Node.js installed
*   Xcode and iOS Simulator (for Mac users)
*   React Native / Expo CLI installed

### Installation

1.  Navigate to the project directory:
    ```bash
    cd ios-app
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## 🏃‍♂️ Running the App

Because the app loads high-quality local videos, it requires a local file server to stream content efficiently to the iOS Simulator.

**You will need two terminal windows:**

### Terminal 1: Video Server 🎥
Start the local HTTP server to host the video assets:
```bash
# Run from the project root (olivia-tube)
npx -y http-server ./ios-app/assets/videos -p 3333 --cors
```

### Terminal 2: The App 📱
Start the Expo development server:
```bash
# Run from the ios-app directory
cd ios-app
npm run ios
```

## 🛠️ Technical Notes

*   **Video Codecs**: iOS Simulators strictly require **H.264** encoded videos. VP9 or other web-optimized formats may fail to play.
    *   The app expects videos with the `_h264.mp4` suffix in the assets folder.
    *   If adding new videos, convert them using ffmpeg:
        ```bash
        ffmpeg -i input.mp4 -c:v libx264 -c:a aac output_h264.mp4
        ```
*   **Networking**: The app automatically detects if it's running on a simulator (`localhost`) or a physical device (LAN IP) to connect to the video server.

## 📱 Screenshots

<div align="center">
  <img src="../screenshot.png" width="300" alt="OliviaTube Screenshot" />
</div>
