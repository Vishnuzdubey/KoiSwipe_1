import { Anime, AnimeGenre, CharacterArchetype, WatchingStatus } from '@/types';

export const animeGenres: AnimeGenre[] = [
  { id: '1', name: 'Shounen', imageUrl: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000' },
  { id: '2', name: 'Shoujo', imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000' },
  { id: '3', name: 'Isekai', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000' },
  { id: '4', name: 'Slice of Life', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000' },
  { id: '5', name: 'Yaoi / Yuri', imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000' },
  { id: '6', name: 'Seinen', imageUrl: 'https://images.unsplash.com/photo-1509909756405-be0199881695?q=80&w=1000' },
  { id: '7', name: 'Romance', imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000' },
  { id: '8', name: 'Action / Adventure', imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000' },
  { id: '9', name: 'Comedy', imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=1000' },
  { id: '10', name: 'Horror', imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=1000' },
  { id: '11', name: 'Mecha', imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000' },
  { id: '12', name: 'Fantasy', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000' },
  { id: '13', name: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000' },
];

export const popularAnime = [
  { id: '1', title: 'Naruto', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000', genres: ['Shounen', 'Action'] },
  { id: '2', title: 'One Piece', imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000', genres: ['Shounen', 'Adventure'] },
  { id: '3', title: 'Demon Slayer', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000', genres: ['Shounen', 'Action'] },
  { id: '4', title: 'Death Note', imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=1000', genres: ['Seinen', 'Psychological'] },
  { id: '5', title: 'Spy x Family', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000', genres: ['Comedy', 'Action'] },
  { id: '6', title: 'Attack on Titan', imageUrl: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000', genres: ['Shounen', 'Action'] },
  { id: '7', title: 'My Hero Academia', imageUrl: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000', genres: ['Shounen', 'Superhero'] },
];

export const trendingAnime = [
  { id: '8', title: 'Jujutsu Kaisen', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000', genres: ['Shounen', 'Supernatural'] },
  { id: '9', title: 'Chainsaw Man', imageUrl: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000', genres: ['Seinen', 'Action'] },
  { id: '10', title: 'Mob Psycho 100', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000', genres: ['Shounen', 'Supernatural'] },
  { id: '11', title: 'Kaguya-sama: Love is War', imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000', genres: ['Romance', 'Comedy'] },
  { id: '12', title: 'Tokyo Revengers', imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000', genres: ['Shounen', 'Drama'] },
  { id: '13', title: 'Horimiya', imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000', genres: ['Romance', 'Slice of Life'] },
];

export const characterArchetypes: CharacterArchetype[] = [
  { id: '1', name: 'Tsundere', description: 'Cold on the outside, warm on the inside', emoji: '😤' },
  { id: '2', name: 'Yandere', description: 'Obsessively loving and protective', emoji: '😍' },
  { id: '3', name: 'Kuudere', description: 'Cool, aloof, and emotionally distant', emoji: '😐' },
  { id: '4', name: 'Dandere', description: 'Shy and quiet but sweet inside', emoji: '😊' },
  { id: '5', name: 'Protagonist', description: 'The main character type', emoji: '🌟' },
  { id: '6', name: 'Villain', description: 'The antagonist with complex motives', emoji: '😈' },
  { id: '7', name: 'Sensei', description: 'The wise mentor figure', emoji: '🧙‍♂️' },
];

export const watchingStatuses: WatchingStatus[] = [
  { id: '1', name: 'Currently Watching', description: 'Active viewer following multiple series', icon: '📺' },
  { id: '2', name: 'Just Started Watching Anime', description: 'New to the anime world', icon: '🌱' },
  { id: '3', name: 'Binge-watcher', description: 'Watches entire series in one sitting', icon: '🍿' },
  { id: '4', name: 'Occasional Viewer', description: 'Watches anime from time to time', icon: '⏰' },
  { id: '5', name: 'Seasonal Viewer', description: 'Follows seasonal releases', icon: '🌸' },
];

export const partnerInterestLevels = [
  { id: '1', name: 'Hardcore Otaku', description: 'Lives and breathes anime' },
  { id: '2', name: 'Moderate Anime Lover', description: 'Enjoys anime regularly' },
  { id: '3', name: 'Just Starting Anime', description: 'Open to exploring together' },
  { id: '4', name: "Doesn't Matter", description: 'Anime interest level is flexible' },
];

export const animeWorlds = [
  { id: '1', name: 'Naruto Universe', description: 'Hidden villages and ninja powers' },
  { id: '2', name: 'Attack on Titan', description: 'Fighting titans beyond the walls' },
  { id: '3', name: 'My Hero Academia', description: 'Quirks and superhero society' },
  { id: '4', name: 'One Piece', description: 'Pirate adventures on the Grand Line' },
  { id: '5', name: 'Demon Slayer', description: 'Slaying demons in Taisho era Japan' },
  { id: '6', name: 'Studio Ghibli World', description: 'Magical and peaceful landscapes' },
];

export const conventionOptions = [
  { id: '1', name: 'Yes', description: 'I love attending anime conventions' },
  { id: '2', name: 'No', description: 'Not interested in conventions' },
  { id: '3', name: 'Maybe', description: 'Open to the idea' },
];

export const subDubPreferences = [
  { id: '1', name: 'Sub', description: 'Original audio with subtitles' },
  { id: '2', name: 'Dub', description: 'Dubbed in my language' },
  { id: '3', name: 'Both', description: 'I enjoy both formats' },
  { id: '4', name: 'I fight over this', description: 'This matters a lot to me' },
];

export const dateIdeas = [
  { id: '1', name: 'Watch Party', description: 'Marathon favorite anime together' },
  { id: '2', name: 'Cosplay Picnic', description: 'Dress as characters for a date' },
  { id: '3', name: 'Anime Café Outing', description: 'Visit an anime-themed café' },
  { id: '4', name: 'Convention Date', description: 'Explore an anime convention together' },
  { id: '5', name: 'Manga Shopping', description: 'Build our collection together' },
];

export const relationshipGoals = [
  { id: '1', name: 'Serious Relationship', description: 'Looking for long-term partnership' },
  { id: '2', name: 'Friendship', description: 'Looking for anime friends' },
  { id: '3', name: 'Just Chat', description: 'Casual conversation about anime' },
  { id: '4', name: 'Cosplay Partner', description: 'Partner for cosplay events' },
];

export const watchPartyAvailability = [
  { id: '1', name: 'Yes', description: 'Always up for watching anime together' },
  { id: '2', name: 'No', description: 'Prefer to watch alone' },
  { id: '3', name: 'Sometimes', description: 'Depends on the anime and timing' },
];