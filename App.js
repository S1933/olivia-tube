import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { SafeAreaView as SafeAreaViewContext, SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

// Get server URL - use your machine's IP for simulator access
const getVideoServerUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:3333`;
  }
  return 'http://127.0.0.1:3333';
};

const VIDEO_SERVER = getVideoServerUrl();

// --- Mock Data ---
const VIDEOS = [
  {
    id: '1',
    title: 'Buster Hosts Auditions at his Failing Theatre | Sing',
    channel: 'Illumination',
    avatar: '#FFD700',
    views: '12M views',
    time: '2 years ago',
    uri: `${VIDEO_SERVER}/sing_audition_h264.mp4`,
  },
  {
    id: '2',
    title: "Randy Newman - You've Got a Friend in Me (From \"Toy Story\")",
    channel: 'DisneyMusicVEVO',
    avatar: '#FF4500',
    views: '54M views',
    time: '4 years ago',
    uri: `${VIDEO_SERVER}/toy_story_h264.mp4`,
  },
  {
    id: '3',
    title: 'Sing Auditions (Reprise)',
    channel: 'Illumination',
    avatar: '#FFD700',
    views: '1.2M views',
    time: '1 day ago',
    uri: `${VIDEO_SERVER}/sing_audition_h264.mp4`,
  }
];



// --- Components ---

const Header = () => (
  <View style={styles.header}>
    <View style={styles.logoContainer}>
      <View style={styles.logoIcon}>
        <Ionicons name="play" size={16} color="white" />
      </View>
      <Text style={styles.logoText}>OliviaTube</Text>
    </View>
    <View style={styles.headerIcons}>
      <TouchableOpacity style={styles.iconButton}><Ionicons name="tv-outline" size={24} color="white" /></TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}><Ionicons name="notifications-outline" size={24} color="white" /></TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}><Ionicons name="search-outline" size={24} color="white" /></TouchableOpacity>
    </View>
  </View>
);



const VideoCard = ({ video, isPlaying, onFinish, onLayout }) => {
  const player = useVideoPlayer(video.uri, player => {
    player.loop = false;
  });

  useEffect(() => {
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, player]);

  useEffect(() => {
    const subscription = player.addListener('playToEnd', () => {
      onFinish();
    });
    return () => subscription.remove();
  }, [player, onFinish]);

  return (
    <View style={styles.card} onLayout={onLayout}>
      {/* Video Player / Thumbnail Area */}
      <View style={styles.videoContainer}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      </View>

      {/* Info Area */}
      <View style={styles.metaContainer}>
        <View style={[styles.avatar, { backgroundColor: video.avatar }]}>
            <Text style={styles.avatarText}>{video.channel[0]}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
          <Text style={styles.subtitle}>{video.channel} • {video.views} • {video.time}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={16} color="#AAA" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BottomTab = () => (
  <View style={styles.bottomTab}>
    <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
    <TouchableOpacity style={styles.tabItem}>
      <Ionicons name="home" size={24} color="white" />
      <Text style={styles.tabTextActive}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabItem}>
      <Ionicons name="albums-outline" size={24} color="white" />
      <Text style={styles.tabText}>Shorts</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabItem}>
      <Ionicons name="add-circle-outline" size={36} color="white" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.tabItem}>
      <Ionicons name="desktop-outline" size={24} color="white" />
      <Text style={styles.tabText}>Subs</Text>
    </TouchableOpacity>
     <TouchableOpacity style={styles.tabItem}>
      <Ionicons name="person-circle-outline" size={24} color="white" />
      <Text style={styles.tabText}>You</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  const [playingIndex, setPlayingIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [cardLayouts, setCardLayouts] = useState({});

  const handleVideoFinish = (index) => {
    if (index < VIDEOS.length - 1) {
      const nextIndex = index + 1;
      setPlayingIndex(nextIndex);

      // Auto-scroll to next video
      const nextLayout = cardLayouts[nextIndex];
      if (nextLayout && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: nextLayout.y,
          animated: true,
        });
      }
    }
  };

  const handleCardLayout = (index, event) => {
    const layout = event.nativeEvent.layout;
    setCardLayouts(prev => ({
      ...prev,
      [index]: layout
    }));
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaViewContext style={styles.safeArea}>
          <Header />

          <ScrollView
            ref={scrollViewRef}
            style={styles.feed}
            contentContainerStyle={styles.feedContent}
          >
            {VIDEOS.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                isPlaying={index === playingIndex}
                onFinish={() => handleVideoFinish(index)}
                onLayout={(event) => handleCardLayout(index, event)}
              />
            ))}
          </ScrollView>
          <BottomTab />
        </SafeAreaViewContext>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  safeArea: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoIcon: {
    backgroundColor: 'red',
    borderRadius: 8,
    width: 28,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 2,
  },
  // Filters

  // Feed
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 20,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  metaContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  subtitle: {
    color: '#AAA',
    fontSize: 12,
  },
  // Bottom Tab
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 49,
    backgroundColor: '#0f0f0f',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabText: {
    color: 'white',
    fontSize: 10,
  },
  tabTextActive: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
