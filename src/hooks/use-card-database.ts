
// Re-export everything from the new modular structure
export * from './card-database/useCardDatabase';

// For backward compatibility, export the default hook
import { useCardDatabase } from './card-database/useCardDatabase';
export default useCardDatabase;
