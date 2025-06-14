import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Anime } from '@/types';
import colors from '@/constants/colors';

interface AnimeCardProps {
  anime: Anime;
  onPress?: () => void;
  selected?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onPress,
  selected = false,
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        selected && styles.selectedContainer
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: anime.imageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.overlay}>
        <Text style={styles.title} numberOfLines={2}>{anime.title}</Text>
        
        <View style={styles.genresContainer}>
          {anime.genres.slice(0, 2).map((genre, index) => (
            <View key={index} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
          {anime.genres.length > 2 && (
            <Text style={styles.moreGenres}>+{anime.genres.length - 2}</Text>
          )}
        </View>
      </View>
      
      {selected && (
        <View style={styles.selectedIndicator} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    marginBottom: 12,
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 4,
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  moreGenres: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});