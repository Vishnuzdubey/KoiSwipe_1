import { Skeleton } from '@/components/Skeleton';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useProfileStore } from '@/store/profile-store';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
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

  const [refreshing, setRefreshing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    loadProfile();
    loadFavoriteAnimes();
    loadFavoriteGenres();
  }, []);

  // Refresh profile data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Profile screen focused - refreshing data');
      refreshProfileData();
    }, [])
  );

  const refreshProfileData = async () => {
    try {
      await Promise.all([
        loadProfile(),
        loadFavoriteAnimes(),
        loadFavoriteGenres()
      ]);
      console.log('Profile data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing profile data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshProfileData();
    setRefreshing(false);
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
        <StatusBar hidden={true} />
        <View style={[styles.header, { height: 300 + insets.top }]}>
          <Skeleton height={300 + insets.top} width="100%" />
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

  // Create multiple images for carousel effect
  const profileImages = profile.profilePicture && profile.profilePicture.length > 0
    ? profile.profilePicture
    : [
        `https://picsum.photos/400/600?random=${profile.id}`,
        `https://picsum.photos/400/600?random=${profile.id + 1}`,
        `https://picsum.photos/400/600?random=${profile.id + 2}`
      ];

  const age = calculateAge(profile.dateOfBirth);
  const location = `${profile.latitude.toFixed(2)}, ${profile.longitude.toFixed(2)}`; // You can use reverse geocoding for actual location names

  const handleImageScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentImageIndex(roundIndex);
  };

  const handleEditProfile = () => {
    router.push('/preferences');
  };

  const handleSettings = () => {
    router.push('/settings');
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header with Image Carousel */}
        <View style={[styles.header, { height: 520 + insets.top }]}>
          {/* Image Carousel */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
            style={styles.imageCarousel}
          >
            {profileImages.map((imageUrl, index) => (
              <Image
                key={index}
                source={{ uri: imageUrl }}
                style={[styles.carouselImage, { width }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {profileImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  { backgroundColor: index === currentImageIndex ? '#FFFFFF' : 'rgba(255,255,255,0.5)' }
                ]}
              />
            ))}
          </View>

          {/* Header Navigation */}
          <View style={[styles.headerNav, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={() => setShowOptionsModal(true)}
            >
              <Feather name="more-vertical" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Enhanced Profile Info Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.profileGradient}
          >
            <View style={styles.profileInfo}>
              <View style={styles.profileHeader}>
                <View style={styles.profileBasicInfo}>
                  <Text style={styles.profileName}>{profile.username}</Text>
                  <Text style={styles.profileAge}>{age}</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Feather name="check-circle" size={20} color="#4CAF50" />
                </View>
              </View>
              
              <View style={styles.locationContainer}>
                <Feather name="map-pin" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.locationText}>{location}</Text>
              </View>

              {/* Quick Info Grid */}
              <View style={styles.quickInfoGrid}>
                <View style={styles.quickInfoItem}>
                  <Text style={styles.quickInfoLabel}>Gender</Text>
                  <Text style={styles.quickInfoValue}>{profile.gender}</Text>
                </View>
                <View style={styles.quickInfoItem}>
                  <Text style={styles.quickInfoLabel}>Looking for</Text>
                  <Text style={styles.quickInfoValue}>{profile.lookingFor}</Text>
                </View>
                <View style={styles.quickInfoItem}>
                  <Text style={styles.quickInfoLabel}>Anime</Text>
                  <Text style={styles.quickInfoValue}>{favoriteAnimes.length}</Text>
                </View>
                <View style={styles.quickInfoItem}>
                  <Text style={styles.quickInfoLabel}>Genres</Text>
                  <Text style={styles.quickInfoValue}>{favoriteGenres.length}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Enhanced Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.secondaryActionButton} onPress={handleEditProfile}>
            <LinearGradient
              colors={['rgba(138, 111, 223, 0.1)', 'rgba(255, 166, 201, 0.1)']}
              style={styles.actionButtonGradient}
            >
              <Feather name="edit-3" size={20} color={colors.primary} />
              <Text style={styles.secondaryActionText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryActionButton} onPress={handleSettings}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.actionButtonGradient}
            >
              <Feather name="settings" size={20} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Settings</Text>
            </LinearGradient>
          </TouchableOpacity>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Favorite Genres</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/add-genres' as any)}
            >
              <Feather name="plus" size={16} color={colors.primary} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Favorite Anime ({favoriteAnimes.length})</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/add-anime' as any)}
            >
              <Feather name="plus" size={16} color={colors.primary} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
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

        {/* Bottom spacing to prevent content being cut off */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOptionsModal}
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowOptionsModal(false);
                handleSettings();
              }}
            >
              <Feather name="settings" size={20} color={colors.text} />
              <Text style={styles.modalOptionText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowOptionsModal(false);
                handleEditProfile();
              }}
            >
              <Feather name="edit-3" size={20} color={colors.text} />
              <Text style={styles.modalOptionText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, styles.modalOptionDanger]}
              onPress={() => {
                setShowOptionsModal(false);
                handleLogout();
              }}
            >
              <Feather name="log-out" size={20} color={colors.error} />
              <Text style={[styles.modalOptionText, { color: colors.error }]}>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowOptionsModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'relative',
  },
  imageCarousel: {
    flex: 1,
  },
  carouselImage: {
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  headerNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: 'flex-end',
  },
  profileInfo: {
    padding: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  profileBasicInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  profileName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  profileAge: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
  },
  quickInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  quickInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  primaryActionButton: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  secondaryActionButton: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryActionText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  genreTagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  animeList: {
    paddingRight: 20,
  },
  animeItemContainer: {
    marginRight: 16,
    width: 140,
  },
  animeItem: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  animeImage: {
    width: 140,
    height: 200,
  },
  animeDeleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  animeTitle: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewImage: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  reviewContent: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewRatingText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 6,
  },
  reviewText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  emptyText: {
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 16,
    backgroundColor: colors.error,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalOptionDanger: {
    backgroundColor: `${colors.error}10`,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
  modalCancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.border,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  // Legacy styles (keeping for compatibility)
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
    paddingBottom: 40,
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
});