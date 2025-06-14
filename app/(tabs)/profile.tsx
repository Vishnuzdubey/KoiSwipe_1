import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { router } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/auth-store';
import { AnimeCard } from '@/components/AnimeCard';
import colors from '@/constants/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  
  if (!user) {
    return null;
  }

  const handleEditProfile = () => {
    router.push('/preferences');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
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
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              {/* Heart icon */}
              <FontAwesome name="heart" size={20} color="#FFFFFF" />
              <Text style={styles.statValue}>128</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statItem}>
              {/* MessageCircle icon */}
              <Feather name="message-circle" size={20} color="#FFFFFF" />
              <Text style={styles.statValue}>43</Text>
              <Text style={styles.statLabel}>Chats</Text>
            </View>
            <View style={styles.statItem}>
              {/* Star icon */}
              <FontAwesome name="star" size={20} color="#FFFFFF" />
              <Text style={styles.statValue}>92%</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleEditProfile}
            >
              {/* Edit icon */}
              <Feather name="edit" size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleSettings}
            >
              {/* Settings icon */}
              <Feather name="settings" size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.bioText}>{user.bio || "No bio yet. Tap 'Edit Profile' to add one!"}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Anime Tags</Text>
        <View style={styles.tagsContainer}>
          {user.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {user.tags.length === 0 && (
            <Text style={styles.emptyText}>No tags added yet</Text>
          )}
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
          {user.favoriteGenres.length === 0 && (
            <Text style={styles.emptyText}>No favorite genres added yet</Text>
          )}
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
          {user.favoriteAnime.length === 0 && (
            <Text style={styles.emptyText}>No favorite anime added yet</Text>
          )}
        </ScrollView>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: colors.primary,
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
  emptyText: {
    color: colors.textLight,
    fontStyle: 'italic',
  },
  logoutButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#F44336',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});