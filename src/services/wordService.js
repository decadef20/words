import { loadWords, getWordsFilePath } from './wordLoader.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache for loaded words per language/category
const wordsCache = new Map();

/**
 * Get cache key for language/category combination
 */
const getCacheKey = (language, category) => `${language}:${category}`;

/**
 * Get words for a specific language and category (with caching)
 * @param {string} language - Language code (default: 'en')
 * @param {string} category - Category name (default: 'ielts')
 * @returns {Promise<Array>} Array of word objects
 */
const getWords = async (language = 'en', category = 'ielts') => {
  const cacheKey = getCacheKey(language, category);
  
  if (wordsCache.has(cacheKey)) {
    return wordsCache.get(cacheKey);
  }
  
  const words = await loadWords(language, category);
  wordsCache.set(cacheKey, words);
  return words;
};

/**
 * Get a random word from the words database
 * @param {string} language - Language code (default: 'en')
 * @param {string} category - Category name (default: 'ielts')
 * @returns {Promise<Object>} A random word object
 */
export const getRandomWord = async (language = 'en', category = 'ielts') => {
  const words = await getWords(language, category);
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

/**
 * Get a word using memory algorithm (spaced repetition)
 * Prioritizes words due for review, then new words, then random
 * @param {string} language - Language code (default: 'en')
 * @param {string} category - Category name (default: 'ielts')
 * @returns {Promise<Object>} Word object with priority and progress info
 */
export const getWordWithMemoryAlgorithm = async (language = 'en', category = 'ielts') => {
  const words = await getWords(language, category);
  const { getWordWithPriority } = await import('./memoryService.js');
  return getWordWithPriority(words, language, category);
};

/**
 * Get all words for a language/category
 * @param {string} language - Language code (default: 'en')
 * @param {string} category - Category name (default: 'ielts')
 * @returns {Promise<Array>} Array of all words
 */
export const getAllWords = async (language = 'en', category = 'ielts') => {
  return await getWords(language, category);
};

/**
 * Delete a word from a language/category collection
 * @param {string} word - The word to delete
 * @param {string} language - Language code (default: 'en')
 * @param {string} category - Category name (default: 'ielts')
 * @returns {Promise<Object>} Deletion result
 */
export const deleteWord = async (word, language = 'en', category = 'ielts') => {
  const words = await getWords(language, category);

  const wordIndex = words.findIndex(w => w.word === word);

  if (wordIndex === -1) {
    throw new Error(`Word "${word}" not found in ${language}/${category}`);
  }

  const updatedWords = [
    ...words.slice(0, wordIndex),
    ...words.slice(wordIndex + 1)
  ];

  // Update cache with the new list
  const cacheKey = getCacheKey(language, category);
  wordsCache.set(cacheKey, updatedWords);

  // Read existing file to preserve header/comments when rebuilding
  const WORDS_FILE = getWordsFilePath(language, category);
  const fileContent = await fs.readFile(WORDS_FILE, 'utf-8');

  // Capture everything up to the start of the array so we keep metadata
  const headerMatch = fileContent.match(/^[\s\S]*?export const words = /);
  const baseHeader = headerMatch ? headerMatch[0] : `// ${category.toUpperCase()} ${language.toUpperCase()} words database\n// Total entries: ${updatedWords.length}\n// Updated: ${new Date().toISOString()}\nexport const words = `;

  // Keep total count up to date if it exists in header
  const headerWithTotals = baseHeader.replace(/Total entries:\s*\d+/i, `Total entries: ${updatedWords.length}`);

  const wordsArray = updatedWords.map(w => {
    return `  {\n    word: '${escapeJsString(w.word)}',\n    pronunciation: '${escapeJsString(w.pronunciation)}',\n    wordClass: '${escapeJsString(w.wordClass)}',\n    definition: '${escapeJsString(w.definition)}',\n    example: '${escapeJsString(w.example)}'\n  }`;
  }).join(',\n');

  const newContent = `${headerWithTotals}[\n${wordsArray}\n];`;
  await fs.writeFile(WORDS_FILE, newContent, 'utf-8');

  return {
    removed: word,
    remaining: updatedWords.length
  };
};

/**
 * Escape string for JavaScript single-quoted string
 */
const escapeJsString = (str) => {
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/'/g, "\\'")     // Escape single quotes
    .replace(/\n/g, '\\n')     // Escape newlines
    .replace(/\r/g, '\\r')     // Escape carriage returns
    .replace(/\t/g, '\\t');    // Escape tabs
};

/**
 * Update the example for a specific word
 * @param {string} word - The word to update
 * @param {string} newExample - The new example text
 * @param {string} language - Language code (default: 'en')
 * @param {string} category - Category name (default: 'ielts')
 * @returns {Promise<Object>} Updated word object
 */
export const updateWordExample = async (word, newExample, language = 'en', category = 'ielts') => {
  const words = await getWords(language, category);
  
  // Find the word in the current words array
  const wordIndex = words.findIndex(w => w.word === word);
  
  if (wordIndex === -1) {
    throw new Error(`Word "${word}" not found in ${language}/${category}`);
  }
  
  // Update the word in memory
  words[wordIndex] = {
    ...words[wordIndex],
    example: newExample
  };
  
  // Update cache
  const cacheKey = getCacheKey(language, category);
  wordsCache.set(cacheKey, words);
  
  // Read the file content
  const WORDS_FILE = getWordsFilePath(language, category);
  let fileContent = await fs.readFile(WORDS_FILE, 'utf-8');
  
  // Find the word entry using a more robust approach
  // Look for the word entry and replace its example field
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Pattern to match: word: 'wordname' ... example: 'old example'
  // This handles multi-line word objects
  const pattern = new RegExp(
    `(word:\\s*['"]${escapedWord}['"][\\s\\S]*?example:\\s*['"])([^'"]*)(['"])`,
    'g'
  );
  
  const match = pattern.exec(fileContent);
  if (match) {
    const escapedExample = escapeJsString(newExample);
    fileContent = fileContent.substring(0, match.index + match[1].length) +
                  escapedExample +
                  fileContent.substring(match.index + match[1].length + match[2].length);
  } else {
    // Fallback: rebuild the entire file
    // Read the header (everything before the array)
    const headerMatch = fileContent.match(/^([^[]*)/);
    const header = headerMatch ? headerMatch[0] : `// ${category.toUpperCase()} ${language.toUpperCase()} words database\n// Total words: ${words.length}\n// Examples from dictionary API, vocabulary.txt, or generated\nexport const words = `;
    
    // Build the words array
    const wordsArray = words.map(w => {
      return `  {\n    word: '${escapeJsString(w.word)}',\n    pronunciation: '${escapeJsString(w.pronunciation)}',\n    wordClass: '${escapeJsString(w.wordClass)}',\n    definition: '${escapeJsString(w.definition)}',\n    example: '${escapeJsString(w.example)}'\n  }`;
    }).join(',\n');
    
    fileContent = `${header}[\n${wordsArray}\n];`;
  }
  
  // Write the updated content back to the file
  await fs.writeFile(WORDS_FILE, fileContent, 'utf-8');
  
  return words[wordIndex];
};

/**
 * Clear the words cache (useful for testing or reloading)
 * @param {string} language - Language code (optional, clears all if not provided)
 * @param {string} category - Category name (optional, clears all if not provided)
 */
export const clearCache = (language = null, category = null) => {
  if (language && category) {
    wordsCache.delete(getCacheKey(language, category));
  } else {
    wordsCache.clear();
  }
};
