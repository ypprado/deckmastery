
// This file is now just re-exporting from the refactored files
// It's maintained for backwards compatibility

export { gameCategories } from '@/types/card';
export type { GameCategory, Card, Deck } from '@/types/card';
export { useDecks } from './use-deck-management';
export { useCards } from './use-cards-filtering';
