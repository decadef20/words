import { words } from '../../data/words.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORDS_FILE = path.join(__dirname, '../../data/words.js');

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
 * @returns {Promise<Object>} Updated word object
 */
export const updateWordExample = async (word, newExample) => {
  // Find the word in the current words array
  const wordIndex = words.findIndex(w => w.word === word);
  
  if (wordIndex === -1) {
    throw new Error(`Word "${word}" not found`);
  }
  
  // Update the word in memory
  words[wordIndex] = {
    ...words[wordIndex],
    example: newExample
  };
  
  // Read the file content
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
    const header = headerMatch ? headerMatch[0] : '// English words database\n// Total words: ' + words.length + '\n// Examples from dictionary API, vocabulary.txt, or generated\nexport const words = ';
    
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
