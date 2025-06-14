import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  ActivityIndicator,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useMatchesStore } from '@/store/matches-store';
import { ChatItem } from '@/components/ChatItem';
import { EmptyState } from '@/components/EmptyState';
import { mockUsers } from '@/mocks/users';
import { mockMessages } from '@/mocks/messages';
import colors from '@/constants/colors';

export default function MessagesScreen() {
  const { matches, isLoading, loadMatches } = useMatchesStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadMatches();
  }, []);

  const getLastMessage = (matchId: string): string | undefined => {
    const matchMessages = mockMessages.filter(msg => msg.matchId === matchId);
    if (matchMessages.length > 0) {
      const sortedMessages = [...matchMessages].sort((a, b) => b.createdAt - a.createdAt);
      return sortedMessages[0].text;
    }
    return undefined;
  };

  const getUnreadCount = (matchId: string): number => {
    return mockMessages.filter(
      msg => msg.matchId === matchId && msg.senderId !== 'current-user' && !msg.read
    ).length;
  };

  const getUserById = (userId: string) => {
    return mockUsers.find(user => user.id === userId);
  };

  const handleChatPress = (matchId: string, userId: string) => {
    router.push(`/chat/${matchId}?userId=${userId}`);
  };

  const filteredMatches = matches.filter(match => {
    const user = getUserById(match.matchedUserId);
    return user && user.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <View style={styles.clearButton}>
              <Feather name="x" size={16} color={colors.textLight} />
            </View>
          </TouchableOpacity>
        )}
      </View>
      
      {matches.length === 0 ? (
        <EmptyState
          title="No Matches Yet"
          description="Start swiping to find your anime soulmate!"
          imageUrl="https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?q=80&w=1000"
          buttonTitle="Start Matching"
          onButtonPress={() => router.push('/(tabs)')}
        />
      ) : filteredMatches.length === 0 ? (
        <EmptyState
          title="No Results"
          description="We couldn't find any matches for your search."
          buttonTitle="Clear Search"
          onButtonPress={() => setSearchQuery('')}
        />
      ) : (
        <FlatList
          data={filteredMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const user = getUserById(item.matchedUserId);
            if (!user) return null;
            
            return (
              <ChatItem
                match={item}
                user={user}
                lastMessage={getLastMessage(item.id)}
                unreadCount={getUnreadCount(item.id)}
                onPress={() => handleChatPress(item.id, user.id)}
              />
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 8,
  },
});