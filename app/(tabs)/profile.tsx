import { Skeleton } from '@/components/Skeleton';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useProfileStore } from '@/store/profile-store';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const {
    profile,
    favoriteAnimes,
    favoriteGenres,
    isLoading,
    loadProfile,
    loadFavoriteAnimes,
    loadFavoriteGenres,
    deleteFavoriteAnime,
    deleteFavoriteGenre
  } = useProfileStore();

  useEffect(() => {
    loadProfile();
    loadFavoriteAnimes();
    loadFavoriteGenres();
  }, []);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleDeleteAnime = (animeId: string, animeTitle: string) => {
    Alert.alert(
      'Remove Anime',
      `Remove "${animeTitle}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteFavoriteAnime(animeId)
        }
      ]
    );
  };

  const handleDeleteGenre = (genreId: string, genreName: string) => {
    Alert.alert(
      'Remove Genre',
      `Remove "${genreName}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteFavoriteGenre(genreId)
        }
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigate to auth screen after successful logout
              router.replace('/auth/auth');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (!user || !profile) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Skeleton height={300} width="100%" />
        </View>
        <View style={styles.section}>
          <Skeleton height={20} width="40%" style={{ marginBottom: 12 }} />
          <Skeleton height={60} width="100%" />
        </View>
        <View style={styles.section}>
          <Skeleton height={20} width="30%" style={{ marginBottom: 12 }} />
          <View style={styles.tagsContainer}>
            <Skeleton height={32} width={80} style={{ marginRight: 8, marginBottom: 8 }} />
            <Skeleton height={32} width={100} style={{ marginRight: 8, marginBottom: 8 }} />
            <Skeleton height={32} width={90} style={{ marginRight: 8, marginBottom: 8 }} />
          </View>
        </View>
      </View>
    );
  }

  const profileImageUrl = profile.profilePicture && profile.profilePicture.length > 0
    ? profile.profilePicture[0]
    : `https://picsum.photos/400/600?random=${profile.id}`;

  const age = calculateAge(profile.dateOfBirth);
  const location = `${profile.latitude.toFixed(2)}, ${profile.longitude.toFixed(2)}`; // You can use reverse geocoding for actual location names

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
          source={{ uri: profileImageUrl }}
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
              source={{ uri: profileImageUrl }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.username}>{profile.username}, {age}</Text>
          <Text style={styles.location}>{location}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              {/* Heart icon */}
              <FontAwesome name="heart" size={20} color="#FFFFFF" />
              <Text style={styles.statValue}>{favoriteAnimes.length}</Text>
              <Text style={styles.statLabel}>Anime</Text>
            </View>
            <View style={styles.statItem}>
              {/* Star icon */}
              <FontAwesome name="star" size={20} color="#FFFFFF" />
              <Text style={styles.statValue}>{favoriteGenres.length}</Text>
              <Text style={styles.statLabel}>Genres</Text>
            </View>
            <View style={styles.statItem}>
              {/* User icon */}
              <Feather name="user" size={20} color="#FFFFFF" />
              <Text style={styles.statValue}>{profile.gender}</Text>
              <Text style={styles.statLabel}>Gender</Text>
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
        <Text style={styles.bioText}>
          {profile.fullname} • Looking for {profile.lookingFor.toLowerCase()}
          {'\n'}Joined from coordinates: {location}
          {'\n\n'}Edit your profile to add a custom bio!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Favorite Genres</Text>
        <View style={styles.tagsContainer}>
          {favoriteGenres.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.genreTag}
              onLongPress={() => handleDeleteGenre(item.genreId, item.genre.name)}
            >
              <Text style={styles.genreTagText}>{item.genre.name}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteGenre(item.genreId, item.genre.name)}
              >
                <Feather name="x" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          {favoriteGenres.length === 0 && (
            <Text style={styles.emptyText}>No favorite genres added yet</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Anime ({favoriteAnimes.length})</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.animeList}
        >
          {favoriteAnimes.map((item, index) => (
            <View key={index} style={styles.animeItemContainer}>
              <View style={styles.animeItem}>
                <Image
                  source={{ uri: item.anime.imageUrl }}
                  style={styles.animeImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.animeDeleteButton}
                  onPress={() => handleDeleteAnime(item.anime.id, item.anime.titleEnglish)}
                >
                  <Feather name="x" size={14} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.ratingBadge}>
                  <FontAwesome name="star" size={10} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={styles.animeTitle} numberOfLines={2}>
                {item.anime.titleEnglish || item.anime.titleJapanese}
              </Text>
            </View>
          ))}
          {favoriteAnimes.length === 0 && (
            <Text style={styles.emptyText}>No favorite anime added yet</Text>
          )}
        </ScrollView>
      </View>

      {profile.AnimeRating && profile.AnimeRating.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Reviews ({profile.AnimeRating.length})</Text>
          {profile.AnimeRating.slice(0, 3).map((rating, index) => (
            <View key={index} style={styles.reviewItem}>
              <Image
                source={{ uri: rating.anime.imageUrl }}
                style={styles.reviewImage}
              />
              <View style={styles.reviewContent}>
                <Text style={styles.reviewTitle}>{rating.anime.titleEnglish}</Text>
                <View style={styles.reviewRating}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome
                      key={i}
                      name={i < rating.rating / 2 ? "star" : "star-o"}
                      size={12}
                      color="#FFD700"
                    />
                  ))}
                  <Text style={styles.reviewRatingText}>({rating.rating}/10)</Text>
                </View>
                <Text style={styles.reviewText} numberOfLines={2}>{rating.review}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
  deleteButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animeList: {
    paddingRight: 20,
  },
  animeItemContainer: {
    marginRight: 12,
    width: 120,
  },
  animeItem: {
    position: 'relative',
    marginBottom: 8,
  },
  animeImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
  },
  animeDeleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  animeTitle: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
  },
  reviewImage: {
    width: 60,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewRatingText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
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