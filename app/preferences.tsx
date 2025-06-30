import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { FontAwesome, Feather, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { AnimeCard } from '@/components/AnimeCard';
import { GenreCard } from '@/components/GenreCard';
import { useAuthStore } from '@/store/auth-store';
import { animeGenres, popularAnime } from '@/mocks/anime';
import { Anime, AnimeGenre } from '@/types';
import colors from '@/constants/colors';

export default function PreferencesScreen() {
  const { user, updateUser } = useAuthStore();
  
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [selectedGenres, setSelectedGenres] = useState(user?.favoriteGenres || []);
  const [selectedAnime, setSelectedAnime] = useState(user?.favoriteAnime || []);
  const [tags, setTags] = useState(user?.tags || []);
  const [newTag, setNewTag] = useState('');
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const toggleGenre = (genre: AnimeGenre) => {
    if (selectedGenres.includes(genre.name)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre.name));
    } else {
      setSelectedGenres([...selectedGenres, genre.name]);
    }
  };

  const toggleAnime = (anime: Anime) => {
    if (selectedAnime.some(a => a.id === anime.id)) {
      setSelectedAnime(selectedAnime.filter(a => a.id !== anime.id));
    } else {
      setSelectedAnime([...selectedAnime, anime]);
    }
  };

  const addTag = () => {
    if (newTag.trim() !== '' && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    updateUser({
      username,
      bio,
      location,
      age: parseInt(age),
      gender,
      avatarUrl,
      favoriteGenres: selectedGenres,
      favoriteAnime: selectedAnime,
      tags,
    });
    
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Edit Profile',
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
              {/* Replace Check icon */}
              <Feather name="check" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                {/* Replace Camera icon */}
                <Feather name="camera" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <Input
              label="Username"
              placeholder="Your username"
              value={username}
              onChangeText={setUsername}
            />
            
            <Input
              label="Age"
              placeholder="Your age"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
            />
            
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity 
                style={[
                  styles.genderOption,
                  gender === 'male' && styles.selectedGenderOption
                ]}
                onPress={() => setGender('male')}
              >
                <Text style={[
                  styles.genderText,
                  gender === 'male' && styles.selectedGenderText
                ]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.genderOption,
                  gender === 'female' && styles.selectedGenderOption
                ]}
                onPress={() => setGender('female')}
              >
                <Text style={[
                  styles.genderText,
                  gender === 'female' && styles.selectedGenderText
                ]}>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.genderOption,
                  gender === 'non-binary' && styles.selectedGenderOption
                ]}
                onPress={() => setGender('non-binary')}
              >
                <Text style={[
                  styles.genderText,
                  gender === 'non-binary' && styles.selectedGenderText
                ]}>Non-binary</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.genderOption,
                  gender === 'other' && styles.selectedGenderOption
                ]}
                onPress={() => setGender('other')}
              >
                <Text style={[
                  styles.genderText,
                  gender === 'other' && styles.selectedGenderText
                ]}>Other</Text>
              </TouchableOpacity>
            </View>
            
            <Input
              label="Location"
              placeholder="City, Country"
              value={location}
              onChangeText={setLocation}
            />
            
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.bioInput}
              placeholder="Tell others about yourself and your anime interests..."
              placeholderTextColor={colors.textLight}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Anime Tags</Text>
            <Text style={styles.sectionDescription}>
              Add tags that describe your anime preferences
            </Text>
            
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    {/* Replace X icon */}
                    <AntDesign name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            
            <View style={styles.addTagContainer}>
              <TextInput
                style={styles.addTagInput}
                placeholder="Add a tag (e.g. Mecha Fan)"
                placeholderTextColor={colors.textLight}
                value={newTag}
                onChangeText={setNewTag}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                {/* Replace Plus icon */}
                <Feather name="plus" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorite Genres</Text>
            <Text style={styles.sectionDescription}>
              Select genres you enjoy watching
            </Text>
            
            <View style={styles.genreGrid}>
              {animeGenres.map((genre) => (
                <GenreCard
                  key={genre.id}
                  genre={genre}
                  selected={selectedGenres.includes(genre.name)}
                  onPress={() => toggleGenre(genre)}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorite Anime</Text>
            <Text style={styles.sectionDescription}>
              Select anime you love
            </Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.animeList}
            >
              {popularAnime.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  selected={selectedAnime.some(a => a.id === anime.id)}
                  onPress={() => toggleAnime(anime)}
                />
              ))}
            </ScrollView>
          </View> */}
          
          <Button
            title="Save Profile"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  headerButton: {
    marginRight: 16,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genderOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedGenderOption: {
    backgroundColor: colors.primary,
  },
  genderText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedGenderText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bioInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  addTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTagInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  animeList: {
    paddingRight: 16,
  },
  saveButton: {
    margin: 16,
  },
});