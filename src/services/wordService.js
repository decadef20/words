// Sample English words database
const words = [
  {
    word: 'serendipity',
    pronunciation: '/ˌserənˈdipitē/',
    definition: 'the occurrence and development of events by chance in a happy or beneficial way',
    example: 'A fortunate stroke of serendipity brought the two old friends together.'
  },
  {
    word: 'ephemeral',
    pronunciation: '/əˈfem(ə)rəl/',
    definition: 'lasting for a very short time',
    example: 'The ephemeral beauty of cherry blossoms makes them all the more precious.'
  },
  {
    word: 'eloquent',
    pronunciation: '/ˈeləkwənt/',
    definition: 'fluent or persuasive in speaking or writing',
    example: 'She gave an eloquent speech that moved the entire audience.'
  },
  {
    word: 'resilient',
    pronunciation: '/rəˈzilyənt/',
    definition: 'able to withstand or recover quickly from difficult conditions',
    example: 'The resilient community rebuilt after the natural disaster.'
  },
  {
    word: 'meticulous',
    pronunciation: '/məˈtikyələs/',
    definition: 'showing great attention to detail; very careful and precise',
    example: 'He was meticulous in his research, checking every source twice.'
  },
  {
    word: 'ubiquitous',
    pronunciation: '/yo͞oˈbikwətəs/',
    definition: 'present, appearing, or found everywhere',
    example: 'Smartphones have become ubiquitous in modern society.'
  },
  {
    word: 'paradigm',
    pronunciation: '/ˈperəˌdīm/',
    definition: 'a typical example or pattern of something; a model',
    example: 'The new technology represents a paradigm shift in how we work.'
  },
  {
    word: 'pragmatic',
    pronunciation: '/praɡˈmadik/',
    definition: 'dealing with things sensibly and realistically',
    example: 'She took a pragmatic approach to solving the problem.'
  },
  {
    word: 'ambiguous',
    pronunciation: '/amˈbigyo͞oəs/',
    definition: 'having more than one possible meaning; unclear',
    example: 'His ambiguous statement left everyone confused about his intentions.'
  },
  {
    word: 'profound',
    pronunciation: '/prəˈfound/',
    definition: 'having or showing great knowledge or insight',
    example: 'The book had a profound impact on her worldview.'
  }
];

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

