import { CommentsBottomSheet } from '@/components/CommentsBottomSheet';
import { CreatePostModal } from '@/components/CreatePostModal';
import { EmptyState } from '@/components/EmptyState';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { MoreOptionsBottomSheet } from '@/components/MoreOptionsBottomSheet';
import { PostCard } from '@/components/PostCard';
import { Skeleton } from '@/components/Skeleton';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { Post } from '@/types';
import { postApi } from '@/utils/api';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';

export default function DiscoverScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const postsData = await postApi.getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handleLike = async (postId: string) => {
    console.log('Like button pressed for post:', postId);

    // Optimistically update the UI immediately
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
            ...post,
            isLiked: !post.isLiked,
            likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
          }
          : post
      )
    );

    try {
      // Make the POST request to toggle like
      console.log('Making API call to toggle like for post:', postId);
      const response = await postApi.toggleLike(postId);
      console.log('API response:', response);

      // Update the posts state with the actual response data
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
              ...post,
              isLiked: response.isLiked,
              likesCount: response.likesCount
            }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert the optimistic update on error
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
            }
            : post
        )
      );
    }
  };

  const handleComment = (post: Post) => {
    setSelectedPost(post);
    setShowComments(true);
  };

  const handleMoreOptions = (post: Post) => {
    setSelectedPost(post);
    setShowMoreOptions(true);
  };

  const handleCommentAdded = () => {
    // Refresh the post data to get updated comment count
    loadPosts();
  };

  const handlePostDeleted = () => {
    // Remove the deleted post from the list
    if (selectedPost) {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== selectedPost.id));
    }
  };

  const handlePostCreated = (newPost: Post) => {
    // Add the new post to the beginning of the list immediately
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onLike={handleLike}
      onComment={handleComment}
      onMoreOptions={handleMoreOptions}
    />
  );

  const renderSkeletonPost = () => (
    <View style={styles.skeletonPost}>
      <View style={styles.skeletonHeader}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.skeletonUserInfo}>
          <Skeleton width={120} height={16} borderRadius={8} />
          <Skeleton width={60} height={12} borderRadius={6} style={{ marginTop: 4 }} />
        </View>
      </View>
      <Skeleton width="100%" height={16} borderRadius={8} style={{ marginTop: 16 }} />
      <Skeleton width="80%" height={16} borderRadius={8} style={{ marginTop: 8 }} />
      <Skeleton width="60%" height={16} borderRadius={8} style={{ marginTop: 8 }} />
      <Skeleton width="100%" height={200} borderRadius={12} style={{ marginTop: 16 }} />
      <View style={styles.skeletonActions}>
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width={24} height={24} borderRadius={12} />
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <EmptyState
      title="No posts yet"
      description="Be the first to share something with the community!"
      buttonTitle="Create Post"
      onButtonPress={() => setShowCreatePost(true)}
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <FlatList
          data={[1, 2, 3]}
          renderItem={renderSkeletonPost}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.skeletonContainer}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={ListEmptyComponent}
      />

      <FloatingActionButton onPress={() => setShowCreatePost(true)} />

      <CommentsBottomSheet
        visible={showComments}
        post={selectedPost}
        onClose={() => {
          setShowComments(false);
          setSelectedPost(null);
        }}
        onCommentAdded={handleCommentAdded}
      />

      <MoreOptionsBottomSheet
        visible={showMoreOptions}
        post={selectedPost}
        onClose={() => {
          setShowMoreOptions(false);
          setSelectedPost(null);
        }}
        onPostDeleted={handlePostDeleted}
        currentUserId={user?.id}
      />

      <CreatePostModal
        visible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={handlePostCreated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonPost: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonUserInfo: {
    marginLeft: 12,
    flex: 1,
  },
  skeletonActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});