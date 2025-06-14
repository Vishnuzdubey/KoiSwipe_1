import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { User, Anime } from '@/types';
import colors from '@/constants/colors';

interface ProfileCardProps {
  user: User;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSuperLike?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
}) => {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: user.avatarUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.infoContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.username}, {user.age}</Text>
            {user.compatibility && (
              <View style={styles.compatibilityContainer}>
                <Text style={styles.compatibilityText}>{user.compatibility}% Match</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.location}>{user.location}</Text>
          
          <View style={styles.tagsContainer}>
            {user.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
          
          <View style={styles.animeContainer}>
            <Text style={styles.sectionTitle}>Favorite Anime</Text>
            <View style={styles.animeList}>
              {user.favoriteAnime.slice(0, 3).map((anime, index) => (
                <AnimeItem key={index} anime={anime} />
              ))}
            </View>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.nopeButton]} 
          onPress={onSwipeLeft}
        >
          {/* X icon replaced with Feather */}
          <Feather name="x" size={30} color="#F44336" />
        </TouchableOpacity>
        
        {onSuperLike && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.superLikeButton]} 
            onPress={onSuperLike}
          >
            {/* Star icon replaced with FontAwesome */}
            <FontAwesome name="star" size={30} color="#2196F3" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]} 
          onPress={onSwipeRight}
        >
          {/* Heart icon replaced with FontAwesome */}
          <FontAwesome name="heart" size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AnimeItem: React.FC<{ anime: Anime }> = ({ anime }) => {
  return (
    <View style={styles.animeItem}>
      <Image 
        source={{ uri: anime.imageUrl }} 
        style={styles.animeImage}
        resizeMode="cover"
      />
      <Text style={styles.animeTitle} numberOfLines={1}>{anime.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  infoContainer: {
    padding: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  compatibilityContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compatibilityText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  location: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  bio: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  animeContainer: {
    marginBottom: 16,
  },
  animeList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  animeItem: {
    width: '30%',
    alignItems: 'center',
  },
  animeImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
  },
  animeTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  likeButton: {
    backgroundColor: '#FFFFFF',
  },
  nopeButton: {
    backgroundColor: '#FFFFFF',
  },
  superLikeButton: {
    backgroundColor: '#FFFFFF',
  },
});