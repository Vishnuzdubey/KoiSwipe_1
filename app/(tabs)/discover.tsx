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
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [reportedPosts, setReportedPosts] = useState<Set<string>>(new Set());
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'popular' | 'bookmarked'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'most_liked'>('newest');

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

  const handleBookmark = (postId: string) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        Alert.alert('Removed', 'Post removed from bookmarks');
      } else {
        newSet.add(postId);
        Alert.alert('Saved', 'Post saved to bookmarks');
      }
      return newSet;
    });
  };

  const handleReport = (post: Post) => {
    Alert.alert(
      'Report Post',
      `Report from ${post.user?.username || 'Unknown User'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            setReportedPosts(prev => new Set(prev).add(post.id));
            Alert.alert('Reported', 'Thank you for reporting. We will review this content.');
          }
        }
      ]
    );
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
      onBookmark={handleBookmark}
      onReport={handleReport}
      isBookmarked={bookmarkedPosts.has(item.id)}
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
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Single Consolidated Header */}
      <LinearGradient
        colors={[colors.background, colors.card]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Explore</Text>
          <View style={styles.headerActions}>
            {/* Filter Type Quick Toggle */}
            <TouchableOpacity 
              style={[styles.filterButton, { marginRight: 8 }]}
              onPress={() => setFilterType(filterType === 'bookmarked' ? 'all' : 'bookmarked')}
            >
              <LinearGradient
                colors={filterType === 'bookmarked' ? [colors.primary, colors.secondary] : ['transparent', 'transparent']}
                style={[styles.filterButtonGradient, filterType !== 'bookmarked' && styles.transparentButton]}
              >
                <Feather 
                  name="bookmark" 
                  size={18} 
                  color={filterType === 'bookmarked' ? '#FFF' : colors.textLight} 
                />
              </LinearGradient>
            </TouchableOpacity>

            {/* Filter Modal Button */}
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.filterButtonGradient}
              >
                <MaterialIcons name="tune" size={18} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Compact Filter Indicator */}
        {filterType !== 'all' && (
          <View style={styles.activeFilterIndicator}>
            <View style={styles.filterIndicatorChip}>
              <Text style={styles.filterIndicatorText}>
                {filterType === 'recent' && '📅 Recent'}
                {filterType === 'popular' && '🔥 Popular'}
                {filterType === 'bookmarked' && '🔖 Saved'}
              </Text>
              <TouchableOpacity 
                onPress={() => setFilterType('all')}
                style={styles.clearFilterButton}
              >
                <MaterialIcons name="close" size={16} color={colors.textLight} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>

      <FlatList
        data={posts.filter(post => {
          if (filterType === 'bookmarked') return bookmarkedPosts.has(post.id);
          if (filterType === 'recent') return new Date(post.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000;
          if (filterType === 'popular') return post.likesCount > 5;
          return !reportedPosts.has(post.id);
        })}
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

      {/* Advanced Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.modalHeader}
          >
            <View style={styles.modalHeaderContent}>
              <Text style={styles.modalTitle}>Filters & Sort</Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView style={styles.modalContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Content Type</Text>
              {[
                { key: 'all', label: 'All Posts', icon: 'apps' },
                { key: 'recent', label: 'Recent (24h)', icon: 'schedule' },
                { key: 'popular', label: 'Popular', icon: 'trending-up' },
                { key: 'bookmarked', label: 'Saved Posts', icon: 'bookmark' },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterOption,
                    filterType === filter.key && styles.activeFilterOption
                  ]}
                  onPress={() => setFilterType(filter.key as any)}
                >
                  <MaterialIcons 
                    name={filter.icon as any} 
                    size={24} 
                    color={filterType === filter.key ? colors.primary : colors.textLight} 
                  />
                  <Text style={[
                    styles.filterOptionText,
                    filterType === filter.key && styles.activeFilterOptionText
                  ]}>
                    {filter.label}
                  </Text>
                  {filterType === filter.key && (
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort Order</Text>
              {[
                { key: 'newest', label: 'Newest First', icon: 'arrow-downward' },
                { key: 'oldest', label: 'Oldest First', icon: 'arrow-upward' },
                { key: 'most_liked', label: 'Most Liked', icon: 'favorite' },
              ].map((sort) => (
                <TouchableOpacity
                  key={sort.key}
                  style={[
                    styles.filterOption,
                    sortOrder === sort.key && styles.activeFilterOption
                  ]}
                  onPress={() => setSortOrder(sort.key as any)}
                >
                  <MaterialIcons 
                    name={sort.icon as any} 
                    size={24} 
                    color={sortOrder === sort.key ? colors.primary : colors.textLight} 
                  />
                  <Text style={[
                    styles.filterOptionText,
                    sortOrder === sort.key && styles.activeFilterOptionText
                  ]}>
                    {sort.label}
                  </Text>
                  {sortOrder === sort.key && (
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Quick Actions</Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  setFilterType('all');
                  setSortOrder('newest');
                }}
              >
                <LinearGradient
                  colors={[colors.textLight, colors.border]}
                  style={styles.actionButtonGradient}
                >
                  <MaterialIcons name="refresh" size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>Reset Filters</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.applyButtonGradient}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButtonGradient: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparentButton: {
    backgroundColor: colors.card,
  },
  activeFilterIndicator: {
    paddingBottom: 8,
  },
  filterIndicatorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  filterIndicatorText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  clearFilterButton: {
    marginLeft: 8,
    padding: 2,
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
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 30,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterOption: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  filterOptionText: {
    fontSize: 16,
    color: colors.textLight,
    marginLeft: 12,
    flex: 1,
  },
  activeFilterOptionText: {
    color: colors.text,
    fontWeight: '600',
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalFooter: {
    padding: 20,
    paddingBottom: 40,
  },
  applyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});