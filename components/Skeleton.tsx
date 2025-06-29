import colors from '@/constants/colors';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const AnimeCardSkeleton: React.FC = () => (
  <View style={skeletonStyles.animeCard}>
    <Skeleton width="100%" height={120} borderRadius={12} />
    <View style={skeletonStyles.animeInfo}>
      <Skeleton width="80%" height={16} />
      <Skeleton width="60%" height={12} style={{ marginTop: 4 }} />
    </View>
  </View>
);

export const GenreCardSkeleton: React.FC = () => (
  <View style={skeletonStyles.genreCard}>
    <Skeleton width="100%" height={40} borderRadius={8} />
  </View>
);

export const AnimeListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <View style={skeletonStyles.grid}>
    {Array.from({ length: count }).map((_, index) => (
      <AnimeCardSkeleton key={index} />
    ))}
  </View>
);

export const GenreListSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <View style={skeletonStyles.genreGrid}>
    {Array.from({ length: count }).map((_, index) => (
      <GenreCardSkeleton key={index} />
    ))}
  </View>
);

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const skeletonStyles = StyleSheet.create({
  animeCard: {
    width: cardWidth,
    marginBottom: 16,
  },
  animeInfo: {
    paddingTop: 8,
  },
  genreCard: {
    flex: 1,
    minWidth: cardWidth,
    marginBottom: 12,
    marginHorizontal: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
  },
});
