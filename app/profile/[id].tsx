import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimeCard } from '@/components/AnimeCard';
import { mockUsers } from '@/mocks/users';
import { useMatchesStore } from '@/store/matches-store';
import colors from '@/constants/colors';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const user = mockUsers.find(u => u.id === id);
  
  const { matches } = useMatchesStore();
  const existingMatch = matches.find(m => m.matchedUserId === id);

  const handleMessage = () => {
    if (existingMatch) {
      router.push(`/chat/${existingMatch.id}?userId=${id}`);
    } else {
      // In a real app, we would create a match first
      router.back();
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: user.username }} />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={{ uri: user.avatarUrl }} 
            style={styles.coverImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user.avatarUrl }} 
                style={styles.avatar}
              />
            </View>
            <Text style={styles.username}>{user.username}, {user.age}</Text>
            <Text style={styles.location}>{user.location}</Text>
            
            {user.compatibility && (
              <View style={styles.compatibilityContainer}>
                <Text style={styles.compatibilityText}>{user.compatibility}% Match</Text>
              </View>
            )}
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                {/* Heart icon replaced with FontAwesome */}
                <FontAwesome name="heart" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.messageButton}
                onPress={handleMessage}
              >
                {/* MessageCircle icon replaced with Feather */}
                <Feather name="message-circle" size={20} color="#FFFFFF" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anime Tags</Text>
          <View style={styles.tagsContainer}>
            {user.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Genres</Text>
          <View style={styles.tagsContainer}>
            {user.favoriteGenres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreTagText}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Anime</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.animeList}
          >
            {user.favoriteAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.reportText}>Report {user.username}</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 300,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 12,
  },
  compatibilityContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  compatibilityText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  actionButton: {
    backgroundColor: colors.secondary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 8,
  },
  messageButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  genreTag: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreTagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  animeList: {
    paddingRight: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  reportText: {
    color: colors.error,
    fontSize: 14,
  },
});