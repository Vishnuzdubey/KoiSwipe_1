import { Skeleton } from '@/components/Skeleton';
import colors from '@/constants/colors';
import { Comment, Post } from '@/types';
import { postApi } from '@/utils/api';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');

interface CommentsBottomSheetProps {
  visible: boolean;
  post: Post | null;
  onClose: () => void;
  onCommentAdded: () => void;
}

export const CommentsBottomSheet: React.FC<CommentsBottomSheetProps> = ({
  visible,
  post,
  onClose,
  onCommentAdded,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible && post) {
      loadComments();
    }
  }, [visible, post]);

  const loadComments = async () => {
    if (!post) return;

    setLoading(true);
    try {
      const commentsData = await postApi.getComments(post.id);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to load comments:', error);
      Alert.alert('Error', 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!post || !commentText.trim()) return;

    setSubmitting(true);
    try {
      await postApi.createComment(post.id, commentText.trim());
      setCommentText('');
      await loadComments(); // Reload comments
      onCommentAdded(); // Update parent component
    } catch (error) {
      console.error('Failed to submit comment:', error);
      Alert.alert('Error', 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>
          {item.user?.fullname?.charAt(0).toUpperCase() || 'U'}
        </Text>
      </View>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUsername}>{item.user?.username || 'Unknown User'}</Text>
          <Text style={styles.commentTime}>{getTimeAgo(item.createdAt)}</Text>
        </View>
        <Text style={styles.commentText}>{item.content}</Text>
      </View>
    </View>
  );

  const emojiReactions = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😂'];

  if (!visible || !post) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />

        <View style={styles.bottomSheet}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.handle} />
              <Text style={styles.title}>Comments</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={renderComment}
              style={styles.commentsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                loading ? (
                  <View style={styles.skeletonContainer}>
                    {[1, 2, 3].map((item) => (
                      <View key={item} style={styles.skeletonComment}>
                        <Skeleton width={32} height={32} borderRadius={16} />
                        <View style={styles.skeletonCommentContent}>
                          <Skeleton width={100} height={16} borderRadius={8} />
                          <Skeleton width="80%" height={14} borderRadius={7} style={{ marginTop: 8 }} />
                          <Skeleton width="60%" height={14} borderRadius={7} style={{ marginTop: 4 }} />
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No comments yet</Text>
                  </View>
                )
              }
            />

            {/* Comment Input */}
            <View style={styles.inputContainer}>
              {/* Quick Emoji Reactions */}
              <View style={styles.emojiContainer}>
                {emojiReactions.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.emojiButton}
                    onPress={() => setCommentText(prev => prev + emoji)}
                  >
                    <Text style={styles.emoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Text Input */}
              <View style={styles.textInputContainer}>
                <View style={styles.inputAvatar}>
                  <Feather name="user" size={20} color={colors.textLight} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder={`Add a comment for ${post.user?.username || 'this post'}`}
                  placeholderTextColor={colors.textLight}
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    (!commentText.trim() || submitting) && styles.sendButtonDisabled
                  ]}
                  onPress={submitComment}
                  disabled={!commentText.trim() || submitting}
                >
                  <Feather
                    name="send"
                    size={20}
                    color={(!commentText.trim() || submitting) ? colors.textLight : colors.primary}
                  />
                </TouchableOpacity>
              </View>

              {/* Additional Options */}
              <View style={styles.additionalOptions}>
                <TouchableOpacity style={styles.optionButton}>
                  <Feather name="camera" size={20} color={colors.textLight} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                  <Feather name="image" size={20} color={colors.textLight} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                  <Text style={styles.gifText}>GIF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                  <Feather name="mic" size={20} color={colors.textLight} />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    minHeight: height * 0.6,
  },
  container: {
    flex: 1,
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
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
    position: 'absolute',
    top: -20,
    left: '50%',
    marginLeft: -20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: colors.textLight,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
  skeletonContainer: {
    paddingVertical: 20,
  },
  skeletonComment: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  skeletonCommentContent: {
    flex: 1,
    marginLeft: 12,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  emojiButton: {
    padding: 8,
  },
  emoji: {
    fontSize: 20,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },
  inputAvatar: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  additionalOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionButton: {
    padding: 8,
  },
  gifText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textLight,
  },
});
