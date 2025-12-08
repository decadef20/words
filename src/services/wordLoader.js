import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');

/**
 * Word Loader Service
 * Handles loading words from different languages and categories
 */

/**
 * Get available languages
 * @returns {Promise<Array<string>>} Array of language codes
 */
export const getAvailableLanguages = async () => {
  try {
    const entries = await fs.readdir(DATA_DIR, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory() && entry.name !== 'node_modules')
      .map(entry => entry.name);
  } catch (error) {
    return [];
  }
};

/**
 * Get available categories for a language
 * @param {string} language - Language code (e.g., 'en', 'es')
 * @returns {Promise<Array<string>>} Array of category names
 */
export const getAvailableCategories = async (language = 'en') => {
  try {
    const langDir = path.join(DATA_DIR, language);
    const entries = await fs.readdir(langDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  } catch (error) {
    return [];
  }
};

/**
 * Load words from a specific language and category
 * @param {string} language - Language code (default: 'en')
 * @param {string} category - Category name (default: 'ielts')
 * @returns {Promise<Array>} Array of word objects
 */
export const loadWords = async (language = 'en', category = 'ielts') => {
  try {
    const wordsFile = path.join(DATA_DIR, language, category, 'words.js');
    
    // Dynamic import of the words file
    const wordsModule = await import(`../../data/${language}/${category}/words.js`);
    
    if (!wordsModule.words || !Array.isArray(wordsModule.words)) {
      throw new Error(`Invalid words file format for ${language}/${category}`);
    }
    
    return wordsModule.words;
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' || error.code === 'ENOENT') {
      throw new Error(`Words not found for language: ${language}, category: ${category}`);
    }
    throw error;
  }
};

/**
 * Get the file path for a word category
 * @param {string} language - Language code
 * @param {string} category - Category name
 * @returns {string} File path
 */
export const getWordsFilePath = (language = 'en', category = 'ielts') => {
  return path.join(DATA_DIR, language, category, 'words.js');
};

/**
 * Check if a language/category combination exists
 * @param {string} language - Language code
 * @param {string} category - Category name
 * @returns {Promise<boolean>} True if exists
 */
export const categoryExists = async (language = 'en', category = 'ielts') => {
  try {
    const wordsFile = getWordsFilePath(language, category);
    await fs.access(wordsFile);
    return true;
  } catch (error) {
    return false;
  }
};

