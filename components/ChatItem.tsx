import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { formatDistanceToNow } from '@/utils/date';
import { User, Match } from '@/types';
import colors from '@/constants/colors';

interface ChatItemProps {
  match: Match;
  user: User;
  lastMessage?: string;
  unreadCount?: number;
  onPress: () => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  match,
  user,
  lastMessage,
  unreadCount = 0,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        {user.lastActive > Date.now() - 600000 && (
          <View style={styles.onlineIndicator} />
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.time}>{formatDistanceToNow(match.lastMessageAt)}</Text>
        </View>
        
        <View style={styles.messageContainer}>
          <Text style={styles.message} numberOfLines={1}>
            {lastMessage || "You matched with " + user.username}
          </Text>
          
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  time: {
    fontSize: 12,
    color: colors.textLight,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});