import { Skeleton } from '@/components/Skeleton';
import colors from '@/constants/colors';
import { genreApi } from '@/utils/api';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Genre {
  id: string;
  name: string;
}

export default function AddGenresScreen() {
  const insets = useSafeAreaInsets();
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    setLoading(true);
    try {
      const data = await genreApi.getAllGenres();
      setAllGenres(data);
    } catch (error) {
      console.error('Error loading genres:', error);
      Alert.alert('Error', 'Failed to load genres');
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres(prev => {
      const isSelected = prev.find(g => g.id === genre.id);
      if (isSelected) {
        return prev.filter(g => g.id !== genre.id);
      } else {
        return [...prev, genre];
      }
    });
  };

  const saveGenres = async () => {
    if (selectedGenres.length === 0) {
      Alert.alert('No Selection', 'Please select at least one genre');
      return;
    }

    setLoading(true);
    try {
      const genreIds = selectedGenres.map(genre => genre.id);
      await genreApi.addFavoriteGenres(genreIds);
      Alert.alert('Success', 'Favorite genres added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            console.log('Navigating back to profile after adding genres');
            router.back();
          }
        }
      ]);
    } catch (error) {
      console.error('Error saving genres:', error);
      Alert.alert('Error', 'Failed to save favorite genres');
    } finally {
      setLoading(false);
    }
  };

  const getGenreIcon = (genreName: string) => {
    const genreIcons: { [key: string]: string } = {
      'Action': '⚔️',
      'Adventure': '🗺️',
      'Comedy': '😂',
      'Drama': '🎭',
      'Fantasy': '🧙‍♂️',
      'Horror': '👻',
      'Romance': '💕',
      'Sci-Fi': '🚀',
      'Thriller': '😱',
      'Mystery': '🔍',
      'Slice of Life': '🌸',
      'Sports': '⚽',
      'Supernatural': '👁️',
      'Music': '🎵',
      'Historical': '🏰',
      'Military': '🪖',
      'School': '🎓',
      'Mecha': '🤖',
      'Magic': '✨',
      'Psychological': '🧠',
    };
    return genreIcons[genreName] || '🎯';
  };

  const renderGenreItem = (genre: Genre) => {
    const isSelected = selectedGenres.find(g => g.id === genre.id);

    return (
      <TouchableOpacity
        key={genre.id}
        style={[styles.genreItem, isSelected && styles.selectedGenreItem]}
        onPress={() => toggleGenre(genre)}
      >
        <Text style={styles.genreIcon}>{getGenreIcon(genre.name)}</Text>
        <Text style={[styles.genreName, isSelected && styles.selectedGenreName]}>
          {genre.name}
        </Text>
        {isSelected && (
          <View style={styles.checkIcon}>
            <Feather name="check" size={16} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderGenreSkeletons = () => (
    <View style={styles.genresGrid}>
      {[...Array(8)].map((_, index) => (
        <View key={index} style={styles.genreItem}>
          <Skeleton width={40} height={40} borderRadius={20} style={{ marginBottom: 12 }} />
          <Skeleton width="70%" height={16} />
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Favorite Genres</Text>
        <TouchableOpacity onPress={saveGenres} style={styles.saveButton} disabled={loading}>
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : `Save (${selectedGenres.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Select your favorite anime genres to help us recommend better matches
        </Text>
      </View>

      {/* Selected Genres Preview */}
      {selectedGenres.length > 0 && (
        <View style={styles.selectedSection}>
          <Text style={styles.sectionTitle}>Selected Genres ({selectedGenres.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.selectedGenresContainer}>
              {selectedGenres.map(genre => (
                <View key={genre.id} style={styles.selectedGenreChip}>
                  <Text style={styles.selectedGenreChipText}>{genre.name}</Text>
                  <TouchableOpacity onPress={() => toggleGenre(genre)}>
                    <Feather name="x" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* All Genres */}
      <ScrollView style={styles.genresList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>All Genres</Text>

        {loading ? (
          renderGenreSkeletons()
        ) : (
          <View style={styles.genresGrid}>
            {allGenres.map(genre => renderGenreItem(genre))}
          </View>
        )}
      </ScrollView>
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
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.primary + '10',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  selectedGenresContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  selectedGenreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedGenreChipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  genresList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  genreItem: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  selectedGenreItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  genreIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  genreName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  selectedGenreName: {
    color: colors.primary,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
