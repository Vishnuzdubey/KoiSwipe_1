import colors from '@/constants/colors';
import { Post } from '@/types';
import { postApi } from '@/utils/api';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Clipboard,
  Dimensions,
  Modal,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');

interface MoreOptionsBottomSheetProps {
  visible: boolean;
  post: Post | null;
  onClose: () => void;
  onPostDeleted?: () => void;
  currentUserId?: string;
}

export const MoreOptionsBottomSheet: React.FC<MoreOptionsBottomSheetProps> = ({
  visible,
  post,
  onClose,
  onPostDeleted,
  currentUserId,
}) => {
  const [loading, setLoading] = useState(false);

  const isOwnPost = post?.userId === currentUserId;

  const handleDeletePost = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!post) return;

            setLoading(true);
            try {
              await postApi.deletePost(post.id);
              onClose();
              onPostDeleted?.();
              Alert.alert('Success', 'Post deleted successfully');
            } catch (error) {
              console.error('Failed to delete post:', error);
              Alert.alert('Error', 'Failed to delete post');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleReportUser = () => {
    if (!post) return;

    Alert.alert(
      'Report User',
      `Why are you reporting ${post.user?.username || 'this user'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Spam',
          onPress: () => submitReport('SPAM', 'This user is posting spam content'),
        },
        {
          text: 'Harassment',
          onPress: () => submitReport('HARASSMENT', 'This user is engaging in harassment'),
        },
        {
          text: 'Inappropriate Content',
          onPress: () => submitReport('INAPPROPRIATE_CONTENT', 'This post contains inappropriate content'),
        },
        {
          text: 'Other',
          onPress: () => {
            Alert.prompt(
              'Report Details',
              'Please describe the issue:',
              (text) => {
                if (text) {
                  submitReport('OTHER', text);
                }
              }
            );
          },
        },
      ]
    );
  };

  const submitReport = async (reason: string, description: string) => {
    if (!post) return;

    setLoading(true);
    try {
      await postApi.reportUser(post.userId, reason, description);
      onClose();
      Alert.alert('Thank you', 'Your report has been submitted. We\'ll review it shortly.');
    } catch (error) {
      console.error('Failed to report user:', error);
      Alert.alert('Error', 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = () => {
    // TODO: Implement save post functionality
    Alert.alert('Feature Coming Soon', 'Save post feature will be available soon!');
    onClose();
  };

  const handleSharePost = async () => {
    if (!post) return;

    try {
      const result = await Share.share({
        message: `Check out this post by ${post.user?.fullname || 'someone'} (@${post.user?.username || 'unknown'}):\n\n${post.title ? post.title + '\n\n' : ''}${post.content}`,
        title: post.title || `Post by ${post.user?.username || 'someone'}`,
      });

      if (result.action === Share.sharedAction) {
        onClose();
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert('Error', 'Failed to share post');
    }
  };

  const handleCopyLink = async () => {
    if (!post) return;

    try {
      const postLink = `https://koiswipe.app/post/${post.id}`;
      await Clipboard.setString(postLink);
      Alert.alert('Success', 'Post link copied to clipboard!');
      onClose();
    } catch (error) {
      console.error('Error copying link:', error);
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  const handleHidePost = () => {
    Alert.alert('Feature Coming Soon', 'Hide post feature will be available soon!');
    onClose();
  };

  const handleUnfollow = () => {
    if (!post) return;

    Alert.alert(
      'Unfollow User',
      `Are you sure you want to unfollow ${post.user?.username || 'this user'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unfollow',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement unfollow functionality
            Alert.alert('Feature Coming Soon', 'Unfollow feature will be available soon!');
            onClose();
          },
        },
      ]
    );
  };

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
          <View style={styles.header}>
            <View style={styles.handle} />
          </View>

          <View style={styles.optionsContainer}>
            {/* Save Post */}
            <TouchableOpacity style={styles.option} onPress={handleSavePost}>
              <Feather name="bookmark" size={24} color={colors.text} />
              <Text style={styles.optionText}>Save</Text>
            </TouchableOpacity>

            {/* Share Post */}
            <TouchableOpacity style={styles.option} onPress={handleSharePost}>
              <Feather name="share" size={24} color={colors.text} />
              <Text style={styles.optionText}>Share</Text>
            </TouchableOpacity>

            {/* Copy Link */}
            <TouchableOpacity style={styles.option} onPress={handleCopyLink}>
              <Feather name="link" size={24} color={colors.text} />
              <Text style={styles.optionText}>Copy Link</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Delete Post (only for own posts) */}
            {isOwnPost && (
              <TouchableOpacity style={styles.option} onPress={handleDeletePost}>
                <Feather name="trash-2" size={24} color={colors.error} />
                <Text style={[styles.optionText, { color: colors.error }]}>Delete Post</Text>
              </TouchableOpacity>
            )}

            {/* Report User (only for other users' posts) */}
            {!isOwnPost && (
              <TouchableOpacity style={styles.option} onPress={handleReportUser}>
                <Feather name="flag" size={24} color={colors.error} />
                <Text style={[styles.optionText, { color: colors.error }]}>Report</Text>
              </TouchableOpacity>
            )}
          </View>
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
    paddingBottom: 34, // Safe area padding
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
    flex: 1,
  },
  destructiveText: {
    color: colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
});
