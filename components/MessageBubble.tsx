import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Message } from '@/types';
import { formatTime } from '@/utils/date';
import colors from '@/constants/colors';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
}) => {
  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        <Text style={[
          styles.text,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {message.text}
        </Text>
      </View>
      
      <Text style={[
        styles.time,
        isCurrentUser ? styles.currentUserTime : styles.otherUserTime
      ]}>
        {formatTime(message.createdAt)}
        {isCurrentUser && (
          <Text style={styles.readStatus}>
            {message.read ? ' • Read' : ''}
          </Text>
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  currentUserBubble: {
    backgroundColor: colors.primary,
  },
  otherUserBubble: {
    backgroundColor: colors.card,
  },
  text: {
    fontSize: 16,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: colors.text,
  },
  time: {
    fontSize: 12,
    marginTop: 2,
  },
  currentUserTime: {
    color: colors.textLight,
  },
  otherUserTime: {
    color: colors.textLight,
  },
  readStatus: {
    fontSize: 12,
    color: colors.textLight,
  },
});