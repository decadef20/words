import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROGRESS_FILE = path.join(__dirname, '../../data/progress.json');

/**
 * Memory Service - Implements spaced repetition algorithm based on memory curve
 * Uses a simplified SM-2 algorithm (SuperMemo 2)
 */

// Default ease factor (EF) - determines how quickly intervals increase
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

// Initial intervals (in days) for new words
const INITIAL_INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120];

/**
 * Load progress data from file
 * @returns {Promise<Object>} Progress data
 */
const loadProgress = async () => {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(PROGRESS_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    
    const data = await fs.readFile(PROGRESS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist, return empty progress
    return {};
  }
};

/**
 * Save progress data to file
 * @param {Object} progress - Progress data to save
 */
const saveProgress = async (progress) => {
  try {
    const dataDir = path.dirname(PROGRESS_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
};

/**
 * Get progress for a specific word
 * @param {string} word - The word to get progress for
 * @returns {Promise<Object|null>} Progress object or null if not found
 */
export const getWordProgress = async (word) => {
  const progress = await loadProgress();
  return progress[word] || null;
};

/**
 * Initialize progress for a word (first time seeing it)
 * @param {string} word - The word to initialize
 * @returns {Promise<Object>} Initial progress object
 */
const initializeWordProgress = async (word) => {
  const progress = await loadProgress();
  
  const wordProgress = {
    word,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0, // days until next review
    repetitions: 0, // number of successful reviews
    lastReviewed: null,
    nextReview: new Date().toISOString(), // Review immediately
    createdAt: new Date().toISOString()
  };
  
  progress[word] = wordProgress;
  await saveProgress(progress);
  return wordProgress;
};

/**
 * Calculate next review date based on current progress and quality
 * @param {Object} wordProgress - Current progress for the word
 * @param {number} quality - Quality of recall (0-5, where 5 is perfect)
 * @returns {Object} Updated progress object
 */
const calculateNextReview = (wordProgress, quality) => {
  let { easeFactor, interval, repetitions } = wordProgress;
  
  // Quality: 0-2 = incorrect, 3-4 = correct with difficulty, 5 = perfect
  if (quality < 3) {
    // Incorrect answer - reset but keep some progress
    repetitions = 0;
    interval = 1; // Review again in 1 day
  } else {
    // Correct answer
    repetitions += 1;
    
    // Calculate new interval based on repetitions and ease factor
    if (repetitions === 1) {
      interval = INITIAL_INTERVALS[1]; // 1 day
    } else if (repetitions === 2) {
      interval = INITIAL_INTERVALS[2]; // 3 days
    } else {
      // Use ease factor to calculate interval
      interval = Math.round(interval * easeFactor);
    }
    
    // Adjust ease factor based on quality
    // Higher quality = easier to remember = can increase interval more
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(easeFactor, MIN_EASE_FACTOR);
  }
  
  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  
  return {
    ...wordProgress,
    easeFactor: Math.round(easeFactor * 100) / 100, // Round to 2 decimals
    interval,
    repetitions,
    lastReviewed: new Date().toISOString(),
    nextReview: nextReview.toISOString()
  };
};

/**
 * Mark a word as known (user successfully recalled it)
 * @param {string} word - The word that was recalled
 * @param {number} quality - Quality of recall (3-5, where 5 is perfect)
 * @returns {Promise<Object>} Updated progress object
 */
export const markWordAsKnown = async (word, quality = 5) => {
  const progress = await loadProgress();
  let wordProgress = progress[word];
  
  if (!wordProgress) {
    wordProgress = await initializeWordProgress(word);
  }
  
  const updatedProgress = calculateNextReview(wordProgress, quality);
  progress[word] = updatedProgress;
  await saveProgress(progress);
  
  return updatedProgress;
};

/**
 * Mark a word as unknown (user failed to recall it)
 * @param {string} word - The word that was not recalled
 * @returns {Promise<Object>} Updated progress object
 */
export const markWordAsUnknown = async (word) => {
  return markWordAsKnown(word, 0);
};

/**
 * Get words that are due for review
 * @returns {Promise<Array>} Array of words that need review
 */
export const getWordsDueForReview = async () => {
  const progress = await loadProgress();
  const now = new Date();
  const dueWords = [];
  
  for (const [word, wordProgress] of Object.entries(progress)) {
    const nextReview = new Date(wordProgress.nextReview);
    if (nextReview <= now) {
      dueWords.push({
        word,
        ...wordProgress,
        daysOverdue: Math.floor((now - nextReview) / (1000 * 60 * 60 * 24))
      });
    }
  }
  
  // Sort by priority: most overdue first, then by next review date
  return dueWords.sort((a, b) => {
    if (a.daysOverdue !== b.daysOverdue) {
      return b.daysOverdue - a.daysOverdue;
    }
    return new Date(a.nextReview) - new Date(b.nextReview);
  });
};

/**
 * Get all words that have never been seen
 * @param {Array} allWords - Array of all available words
 * @returns {Promise<Array>} Array of words never seen
 */
export const getNewWords = async (allWords) => {
  const progress = await loadProgress();
  const seenWords = new Set(Object.keys(progress));
  
  return allWords.filter(wordObj => !seenWords.has(wordObj.word));
};

/**
 * Get word selection priority based on memory algorithm
 * Priority: 1. Words due for review, 2. New words, 3. Random words
 * @param {Array} allWords - Array of all available words
 * @returns {Promise<Object>} Selected word with priority info
 */
export const getWordWithPriority = async (allWords) => {
  // 1. Check for words due for review (highest priority)
  const dueWords = await getWordsDueForReview();
  if (dueWords.length > 0) {
    // Select the most overdue word
    const selectedWord = allWords.find(w => w.word === dueWords[0].word);
    if (selectedWord) {
      const progress = await getWordProgress(selectedWord.word);
      return {
        ...selectedWord,
        priority: 'review',
        progress,
        daysOverdue: dueWords[0].daysOverdue
      };
    }
  }
  
  // 2. Check for new words (medium priority)
  const newWords = await getNewWords(allWords);
  if (newWords.length > 0) {
    // Randomly select from new words
    const randomIndex = Math.floor(Math.random() * newWords.length);
    const selectedWord = newWords[randomIndex];
    return {
      ...selectedWord,
      priority: 'new',
      progress: null
    };
  }
  
  // 3. Fallback to random word (lowest priority)
  const randomIndex = Math.floor(Math.random() * allWords.length);
  const selectedWord = allWords[randomIndex];
  const progress = await getWordProgress(selectedWord.word);
  
  return {
    ...selectedWord,
    priority: 'random',
    progress
  };
};

/**
 * Get statistics about learning progress
 * @returns {Promise<Object>} Statistics object
 */
export const getStatistics = async () => {
  const progress = await loadProgress();
  const now = new Date();
  
  const stats = {
    totalWords: Object.keys(progress).length,
    wordsDueForReview: 0,
    wordsLearned: 0, // Words with repetitions >= 3
    wordsInProgress: 0, // Words with repetitions 1-2
    averageEaseFactor: 0,
    totalRepetitions: 0
  };
  
  let totalEaseFactor = 0;
  
  for (const wordProgress of Object.values(progress)) {
    const nextReview = new Date(wordProgress.nextReview);
    if (nextReview <= now) {
      stats.wordsDueForReview++;
    }
    
    if (wordProgress.repetitions >= 3) {
      stats.wordsLearned++;
    } else if (wordProgress.repetitions > 0) {
      stats.wordsInProgress++;
    }
    
    totalEaseFactor += wordProgress.easeFactor;
    stats.totalRepetitions += wordProgress.repetitions;
  }
  
  if (stats.totalWords > 0) {
    stats.averageEaseFactor = Math.round((totalEaseFactor / stats.totalWords) * 100) / 100;
  }
  
  return stats;
};

