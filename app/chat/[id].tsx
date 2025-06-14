import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useMatchesStore } from '@/store/matches-store';
import { MessageBubble } from '@/components/MessageBubble';
import { mockUsers } from '@/mocks/users';
import colors from '@/constants/colors';

export default function ChatScreen() {
  const { id, userId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const { 
    messages, 
    loadMessages, 
    sendMessage, 
    markMessagesAsRead 
  } = useMatchesStore();
  
  const matchMessages = messages[id as string] || [];
  const user = mockUsers.find(u => u.id === userId);

  useEffect(() => {
    if (id) {
      loadMessages(id as string);
      markMessagesAsRead(id as string);
    }
  }, [id]);

  const handleSend = () => {
    if (message.trim() === '') return;
    
    sendMessage(id as string, message.trim());
    setMessage('');
  };

  const scrollToBottom = () => {
    if (matchMessages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [matchMessages]);

  const handleViewProfile = () => {
    router.push(`/profile/${userId}`);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: user.username,
          headerRight: () => (
            <TouchableOpacity onPress={handleViewProfile} style={styles.headerButton}>
              {/* Info icon replaced with Feather */}
              <Feather name="info" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            {user.lastActive > Date.now() - 600000 && (
              <View style={styles.onlineIndicator} />
            )}
          </View>
          <View>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.status}>
              {user.lastActive > Date.now() - 600000 
                ? 'Online' 
                : 'Last active ' + new Date(user.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            </Text>
          </View>
        </View>
        
        {matchMessages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyAvatarContainer}>
              <Image source={{ uri: user.avatarUrl }} style={styles.emptyAvatar} />
            </View>
            <Text style={styles.emptyTitle}>Start a conversation with {user.username}</Text>
            <Text style={styles.emptySubtitle}>Say hello and discuss your favorite anime!</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={matchMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isCurrentUser={item.senderId === 'current-user'}
              />
            )}
            contentContainerStyle={styles.messagesContainer}
            onLayout={scrollToBottom}
          />
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textLight}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              message.trim() === '' && styles.disabledSendButton
            ]} 
            onPress={handleSend}
            disabled={message.trim() === ''}
          >
            {/* Send icon replaced with Feather */}
            <Feather name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    marginRight: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  status: {
    fontSize: 12,
    color: colors.textLight,
  },
  messagesContainer: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: colors.text,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: colors.border,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});