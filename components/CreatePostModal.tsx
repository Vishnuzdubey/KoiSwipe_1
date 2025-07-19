import colors from '@/constants/colors';
import { postApi } from '@/utils/api';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPostCreated: (newPost: any) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onPostCreated,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: handleCamera },
        { text: 'Photo Library', onPress: handleImagePicker },
      ]
    );
  };

    const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    setSubmitting(true);
    try {
      // In a real app, you would upload the image to a server and get a URL
      const newPost = await postApi.createPost(title.trim(), content.trim(), selectedImage || undefined);
      resetForm();
      onClose();
      onPostCreated(newPost);
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedImage(null);
  };

  const handleClose = () => {
    if (title.trim() || content.trim() || selectedImage) {
      Alert.alert(
        'Discard Post',
        'Are you sure you want to discard this post?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              resetForm();
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Post</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!title.trim() || !content.trim() || submitting}
            style={[
              styles.postButton,
              (!title.trim() || !content.trim() || submitting) && styles.postButtonDisabled
            ]}
          >
            <Text style={[
              styles.postButtonText,
              (!title.trim() || !content.trim() || submitting) && styles.postButtonTextDisabled
            ]}>
              {submitting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Feather name="user" size={20} color="white" />
            </View>
            <Text style={styles.username}>You</Text>
          </View>

          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="What's your post about?"
              placeholderTextColor={colors.textLight}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={styles.characterCount}>{title.length}/100</Text>
          </View>

          {/* Content Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Content</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Share your thoughts..."
              placeholderTextColor={colors.textLight}
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={1000}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{content.length}/1000</Text>
          </View>

          {/* Selected Image Preview */}
          {selectedImage && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <LinearGradient
                  colors={['rgba(255,0,0,0.8)', 'rgba(255,0,0,0.6)']}
                  style={styles.removeImageGradient}
                >
                  <MaterialIcons name="close" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Enhanced Media Options */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaOptions}>
            <TouchableOpacity style={styles.mediaOption} onPress={showImageOptions}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.mediaOptionGradient}
              >
                <MaterialIcons name="add-a-photo" size={24} color="#FFF" />
              </LinearGradient>
              <Text style={styles.mediaOptionText}>Add Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaOption} onPress={handleCamera}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.mediaOptionGradient}
              >
                <Feather name="camera" size={24} color="#FFF" />
              </LinearGradient>
              <Text style={styles.mediaOptionText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaOption} onPress={handleImagePicker}>
              <LinearGradient
                colors={['#4ECDC4', '#6EE7DF']}
                style={styles.mediaOptionGradient}
              >
                <Feather name="image" size={24} color="#FFF" />
              </LinearGradient>
              <Text style={styles.mediaOptionText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaOption}>
              <LinearGradient
                colors={['#45B7D1', '#69C9E8']}
                style={styles.mediaOptionGradient}
              >
                <Feather name="map-pin" size={24} color="#FFF" />
              </LinearGradient>
              <Text style={styles.mediaOptionText}>Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaOption}>
              <LinearGradient
                colors={['#96CEB4', '#B2DFCE']}
                style={styles.mediaOptionGradient}
              >
                <Feather name="users" size={24} color="#FFF" />
              </LinearGradient>
              <Text style={styles.mediaOptionText}>Tag People</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    fontSize: 16,
    color: colors.textLight,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  postButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: colors.border,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  postButtonTextDisabled: {
    color: colors.textLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 18,
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  contentInput: {
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    maxHeight: 200,
  },
  characterCount: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
    marginTop: 4,
  },
  imagePreview: {
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 15,
    overflow: 'hidden',
  },
  removeImageGradient: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaOptions: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  mediaOption: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 70,
  },
  mediaOptionGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mediaOptionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
});
