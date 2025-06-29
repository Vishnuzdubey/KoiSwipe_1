import { Button } from '@/components/Button';
import colors from '@/constants/colors';
import { languages, onboardingSteps } from '@/mocks/onboarding';
import { useAppStore } from '@/store/app-store';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLanguages, setShowLanguages] = useState(false);
  const flatListRef = useRef < FlatList > (null);

  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const selectedLanguage = useAppStore((state) => state.language);

  // Prevent going back to auth screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Return true to prevent default back behavior
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [])
  );

  const handleNext = () => {
    if (currentIndex < onboardingSteps.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
      router.replace('/src/AnimePreferencesScreen');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/src/AnimePreferencesScreen');
  };

  const handleSelectLanguage = (language) => {
    setLanguage(language);
    setShowLanguages(false);
  };

  const renderOnboardingItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const renderLanguageSelector = () => {
    return (
      <View style={styles.languageContainer}>
        <Text style={styles.languageTitle}>Select Your Language</Text>
        <FlatList
          data={languages}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.languageItem,
                selectedLanguage.code === item.code && styles.selectedLanguageItem
              ]}
              onPress={() => handleSelectLanguage(item)}
            >
              <Text style={[
                styles.languageName,
                selectedLanguage.code === item.code && styles.selectedLanguageName
              ]}>
                {item.name}
              </Text>
              <Text style={[
                styles.nativeName,
                selectedLanguage.code === item.code && styles.selectedNativeName
              ]}>
                {item.nativeName}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.languageList}
        />
        <Button
          title="Confirm"
          onPress={() => setShowLanguages(false)}
          style={styles.confirmButton}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {showLanguages ? (
        renderLanguageSelector()
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setShowLanguages(true)}>
              <Text style={styles.languageButton}>{selectedLanguage.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipButton}>Skip</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={onboardingSteps}
            renderItem={renderOnboardingItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
          />

          <View style={styles.footer}>
            <View style={styles.pagination}>
              {onboardingSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentIndex && styles.paginationDotActive
                  ]}
                />
              ))}
            </View>

            <Button
              title={currentIndex === onboardingSteps.length - 1 ? "Get Started" : "Next"}
              onPress={handleNext}
              style={styles.nextButton}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

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
  },
  languageButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  skipButton: {
    fontSize: 16,
    color: colors.textLight,
  },
  slide: {
    width,
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    marginTop: 20,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  nextButton: {
    width: '80%',
  },
  languageContainer: {
    flex: 1,
    padding: 20,
  },
  languageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  languageList: {
    flex: 1,
  },
  languageItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedLanguageItem: {
    backgroundColor: `${colors.primary}20`,
  },
  languageName: {
    fontSize: 16,
    color: colors.text,
  },
  selectedLanguageName: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  nativeName: {
    fontSize: 16,
    color: colors.textLight,
  },
  selectedNativeName: {
    color: colors.primary,
  },
  confirmButton: {
    marginTop: 20,
  },
});