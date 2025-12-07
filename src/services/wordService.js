import { words } from '../../data/words.js';

/**
 * Get a random word from the words database
 * @returns {Object} A random word object with word, pronunciation, definition, and example
 */
export const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

/**
 * Get a word using memory algorithm (spaced repetition)
 * Prioritizes words due for review, then new words, then random
 * @returns {Promise<Object>} Word object with priority and progress info
 */
export const getWordWithMemoryAlgorithm = async () => {
  const { getWordWithPriority } = await import('./memoryService.js');
  return getWordWithPriority(words);
};

/**
 * Get all words (for future use)
 * @returns {Array} Array of all words
 */
export const getAllWords = () => {
  return words;
};
