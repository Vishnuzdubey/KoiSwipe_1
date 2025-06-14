import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimeGenre } from '@/types';
import colors from '@/constants/colors';

interface GenreCardProps {
  genre: AnimeGenre;
  onPress?: () => void;
  selected?: boolean;
}

export const GenreCard: React.FC<GenreCardProps> = ({
  genre,
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
        source={{ uri: genre.imageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <Text style={styles.name}>{genre.name}</Text>
      </LinearGradient>
      
      {selected && (
        <View style={styles.selectedOverlay}>
          <View style={styles.selectedIndicator} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
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
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(138, 111, 223, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});