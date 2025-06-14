import { OnboardingStep, Language } from '@/types';

export const onboardingSteps: OnboardingStep[] = [
  {
    id: '1',
    title: 'Find Your Anime Soulmate',
    description: 'Connect with people who share your passion for anime and manga.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000',
  },
  {
    id: '2',
    title: 'Match Based on Anime Taste',
    description: 'Our algorithm finds people with similar anime preferences.',
    imageUrl: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000',
  },
  {
    id: '3',
    title: 'Chat About Your Favorite Shows',
    description: 'Discuss episodes, characters, and theories with your matches.',
    imageUrl: 'https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?q=80&w=1000',
  },
  {
    id: '4',
    title: 'Join Watch Parties',
    description: 'Watch anime together with people who love the same shows.',
    imageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1000',
  },
];

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
];