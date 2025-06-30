import { Skeleton } from '@/components/Skeleton';
import colors from '@/constants/colors';
import { animeApi } from '@/utils/api';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Anime {
  id: string;
  title: string;
  titleEnglish: string;
  titleJapanese: string;
  imageUrl: string;
  genres: Array<{
    genre: {
      name: string;
    };
  }>;
  startDate: string;
  rating?: number; // Optional rating for selected anime
}

export default function AddAnimeScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentAnime, setCurrentAnime] = useState<Anime | null>(null);
  const [currentRating, setCurrentRating] = useState(5);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAnime();
  }, []);

  const loadAnime = async () => {
    setLoading(true);
    try {
      const data = await animeApi.getAnime(page, 10);
      console.log('Loaded anime data:', data);
      setAnimeList(prev => page === 1 ? data : [...prev, ...data]);
    } catch (error) {
      console.error('Error loading anime:', error);
      Alert.alert('Error', 'Failed to load anime');
    } finally {
      setLoading(false);
    }
  };

  const searchAnime = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const data = await animeApi.searchAnime(query);
      console.log('Search results:', data);
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching anime:', error);
      Alert.alert('Error', 'Failed to search anime');
    } finally {
      setSearching(false);
    }
  };

  const handleAnimeSelect = (anime: Anime) => {
    setCurrentAnime(anime);
    setCurrentRating(5);
    setShowRatingModal(true);
  };

  const addToSelected = () => {
    if (currentAnime) {
      const animeWithRating = { ...currentAnime, rating: currentRating };
      setSelectedAnime(prev => [...prev, animeWithRating]);
      setShowRatingModal(false);
      setCurrentAnime(null);
    }
  };

  const removeFromSelected = (animeId: string) => {
    setSelectedAnime(prev => prev.filter(anime => anime.id !== animeId));
  };

  const saveFavorites = async () => {
    if (selectedAnime.length === 0) {
      Alert.alert('No Selection', 'Please select at least one anime');
      return;
    }

    setLoading(true);
    try {
      const animeIdswithRatings = selectedAnime.map(anime => ({
        animeId: anime.id,
        rating: anime.rating || 5
      }));

      await animeApi.addFavoriteAnime(animeIdswithRatings);
      Alert.alert('Success', 'Favorite anime added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            console.log('Navigating back to profile after adding anime');
            router.back();
          }
        }
      ]);
    } catch (error) {
      console.error('Error saving favorites:', error);
      Alert.alert('Error', 'Failed to save favorites');
    } finally {
      setLoading(false);
    }
  };

  const renderAnimeItem = (anime: Anime, isSelected = false) => (
    <TouchableOpacity
      key={anime.id}
      style={[styles.animeItem, isSelected && styles.selectedAnimeItem]}
      onPress={() => handleAnimeSelect(anime)}
      disabled={isSelected}
    >
      <Image source={{ uri: anime.imageUrl }} style={styles.animeImage} />
      <View style={styles.animeInfo}>
        <Text style={styles.animeTitle} numberOfLines={2}>
          {anime.titleEnglish || anime.titleJapanese || anime.title}
        </Text>
        <Text style={styles.animeGenres} numberOfLines={1}>
          {anime.genres?.map(g => g.genre.name).join(', ') || 'No genres'}
        </Text>
        {isSelected && (
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>Rating: {anime.rating}/10</Text>
          </View>
        )}
      </View>
      {isSelected && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromSelected(anime.id)}
        >
          <Feather name="x" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderAnimeSkeletons = () => (
    <>
      {[...Array(6)].map((_, index) => (
        <View key={index} style={styles.animeItem}>
          <Skeleton width={60} height={80} borderRadius={8} style={{ marginRight: 12 }} />
          <View style={styles.animeInfo}>
            <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
            <Skeleton width="60%" height={14} style={{ marginBottom: 4 }} />
            <Skeleton width="40%" height={12} />
          </View>
        </View>
      ))}
    </>
  );

  const displayList = searchQuery.trim() ? searchResults : animeList;
  const safeDisplayList = Array.isArray(displayList) ? displayList : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Favorite Anime</Text>
        <TouchableOpacity onPress={saveFavorites} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save ({selectedAnime.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search anime..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            searchAnime(text);
          }}
        />
        {searching && <ActivityIndicator size="small" color={colors.primary} />}
      </View>

      {/* Selected Anime */}
      {selectedAnime.length > 0 && (
        <View style={styles.selectedSection}>
          <Text style={styles.sectionTitle}>Selected Anime ({selectedAnime.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedAnime.map(anime => renderAnimeItem(anime, true))}
          </ScrollView>
        </View>
      )}

      {/* Anime List */}
      <ScrollView style={styles.animeList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {searchQuery.trim() ? 'Search Results' : 'Popular Anime'}
        </Text>
        {loading && page === 1 ? (
          renderAnimeSkeletons()
        ) : (
          safeDisplayList.map(anime => renderAnimeItem(anime))
        )}
      </ScrollView>

      {/* Rating Modal */}
      <Modal visible={showRatingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Rate this Anime</Text>
            {currentAnime && (
              <View style={styles.modalAnimeInfo}>
                <Image source={{ uri: currentAnime.imageUrl }} style={styles.modalAnimeImage} />
                <Text style={styles.modalAnimeTitle}>
                  {currentAnime.titleEnglish || currentAnime.titleJapanese}
                </Text>
              </View>
            )}

            <View style={styles.ratingSelector}>
              <Text style={styles.ratingLabel}>Rating: {currentRating}/10</Text>
              <View style={styles.ratingButtons}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      currentRating === rating && styles.selectedRatingButton
                    ]}
                    onPress={() => setCurrentRating(rating)}
                  >
                    <Text style={[
                      styles.ratingButtonText,
                      currentRating === rating && styles.selectedRatingButtonText
                    ]}>
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowRatingModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAddButton} onPress={addToSelected}>
                <Text style={styles.modalAddText}>Add to Favorites</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  selectedSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  animeList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animeItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedAnimeItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  animeImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  animeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  animeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  animeGenres: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: colors.error || '#F44336',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalAnimeInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalAnimeImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalAnimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  ratingSelector: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  ratingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedRatingButton: {
    backgroundColor: colors.primary,
  },
  ratingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  selectedRatingButtonText: {
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  modalAddButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  modalAddText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
