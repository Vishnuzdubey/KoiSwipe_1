import { Match } from '@/types';

export const mockMatches: Match[] = [
  {
    id: '1',
    userId: 'current-user',
    matchedUserId: '1',
    createdAt: Date.now() - 500000,
    lastMessageAt: Date.now() - 10000,
  },
  {
    id: '2',
    userId: 'current-user',
    matchedUserId: '2',
    createdAt: Date.now() - 1000000,
    lastMessageAt: Date.now() - 300000,
  },
  {
    id: '3',
    userId: 'current-user',
    matchedUserId: '3',
    createdAt: Date.now() - 2000000,
    lastMessageAt: Date.now() - 100000,
  },
];