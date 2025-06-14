import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Input } from '@/components/Input';
import { AnimeCard } from '@/components/AnimeCard';
import { GenreCard } from '@/components/GenreCard';
import { animeGenres, popularAnime, trendingAnime } from '@/mocks/anime';
import colors from '@/constants/colors';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search anime or users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Feather name="search" size={20} color={colors.textLight} />}
          rightIcon={
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
              <Feather name="filter" size={20} color={colors.textLight} />
            </TouchableOpacity>
          }
          containerStyle={styles.searchInputContainer}
        />
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Filter by:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsContainer}
          >
            <TouchableOpacity style={[styles.filterChip, styles.activeFilterChip]}>
              <Text style={[styles.filterChipText, styles.activeFilterChipText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Anime</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Groups</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Events</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {trendingAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Genre</Text>
          <View style={styles.genreGrid}>
            {animeGenres.slice(0, 6).map((genre) => (
              <GenreCard key={genre.id} genre={genre} />
            ))}
          </View>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Genres</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Anime</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {popularAnime.slice(0, 10).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Watch Parties</Text>
          <View style={styles.watchPartyCard}>
            <Text style={styles.watchPartyTitle}>Demon Slayer Season 3 Finale</Text>
            <Text style={styles.watchPartyInfo}>Saturday, 8:00 PM • 24 Attendees</Text>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join Party</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.watchPartyCard}>
            <Text style={styles.watchPartyTitle}>My Hero Academia Movie Night</Text>
            <Text style={styles.watchPartyInfo}>Sunday, 7:30 PM • 18 Attendees</Text>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join Party</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: 8,
  },
  filterChipsContainer: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.text,
  },
  activeFilterChipText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  horizontalList: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  viewAllButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  viewAllText: {
    color: colors.primary,
    fontWeight: '600',
  },
  watchPartyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  watchPartyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  watchPartyInfo: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});