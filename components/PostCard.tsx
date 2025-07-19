import colors from '@/constants/colors';
import { Post } from '@/types';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (post: Post) => void;
  onMoreOptions: (post: Post) => void;
  onBookmark?: (postId: string) => void;
  onReport?: (post: Post) => void;
  isBookmarked?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onMoreOptions,
  onBookmark,
  onReport,
  isBookmarked = false,
}) => {
  const [imageError, setImageError] = useState(false);
  // Use post data directly from props (no local state needed)
  const liked = post.isLiked || false;
  const likesCount = post.likesCount;

  const handleLike = () => {
    // Just call the parent handler - optimistic update will be handled by parent
    onLike(post.id);
  };

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(post.id);
    }
  };

  const handleCopyLink = async () => {
    try {
      const postUrl = `https://koiswipe.app/post/${post.id}`;
      await Clipboard.setStringAsync(postUrl);
      Alert.alert('Success', 'Post link copied to clipboard!');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  const handleShare = async () => {
    try {
      const postUrl = `https://koiswipe.app/post/${post.id}`;
      await Share.share({
        message: `Check out this post: ${post.title}\n\n${postUrl}`,
        url: postUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleReport = () => {
    Alert.alert(
      'Report Post',
      'Why are you reporting this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Inappropriate Content', 
          onPress: () => onReport && onReport(post)
        },
        { 
          text: 'Spam', 
          onPress: () => onReport && onReport(post)
        },
        { 
          text: 'Harassment', 
          onPress: () => onReport && onReport(post)
        },
      ]
    );
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => router.push(`/profile/${post.user?.username || 'unknown'}`)}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {post.user?.fullname?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.username}>{post.user?.username || 'Unknown User'}</Text>
            <Text style={styles.timeAgo}>{getTimeAgo(post.createdAt)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => onMoreOptions(post)}
          activeOpacity={0.7}
        >
          <Feather name="more-horizontal" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {post.title && (
          <Text style={styles.title}>{post.title}</Text>
        )}
        <Text style={styles.postContent}>{post.content}</Text>

        {post.imageUrl && !imageError && (
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.postImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <LinearGradient
              colors={liked ? [colors.error, '#FF6B9D'] : ['transparent', 'transparent']}
              style={[styles.actionGradient, !liked && styles.transparentAction]}
            >
              <Feather
                name="heart"
                size={20}
                color={liked ? '#FFF' : colors.textLight}
                fill={liked ? '#FFF' : 'none'}
              />
            </LinearGradient>
            <Text style={[styles.actionText, liked && styles.likedText]}>
              {likesCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComment(post)}
          >
            <View style={styles.actionGradient}>
              <Feather name="message-circle" size={20} color={colors.textLight} />
            </View>
            <Text style={styles.actionText}>{post.commentsCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <View style={styles.actionGradient}>
              <Feather name="share" size={20} color={colors.textLight} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCopyLink}>
            <View style={styles.actionGradient}>
              <MaterialIcons name="content-copy" size={20} color={colors.textLight} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
            <LinearGradient
              colors={isBookmarked ? [colors.primary, colors.secondary] : ['transparent', 'transparent']}
              style={[styles.actionGradient, !isBookmarked && styles.transparentAction]}
            >
              <Feather
                name="bookmark"
                size={20}
                color={isBookmarked ? '#FFF' : colors.textLight}
                fill={isBookmarked ? '#FFF' : 'none'}
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleReport}>
            <View style={styles.actionGradient}>
              <MaterialIcons name="report" size={20} color="#FF6B6B" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: colors.textLight,
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  transparentAction: {
    backgroundColor: 'transparent',
  },
  actionText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 6,
    fontWeight: '500',
  },
  likedText: {
    color: colors.error,
  },
  saveButton: {
    padding: 4,
  },
});
