import { getRandomWord, getWordWithMemoryAlgorithm, updateWordExample, deleteWord } from '../services/wordService.js';
import { markWordAsKnown, markWordAsUnknown, getStatistics, getDailyWeeklyStats, deleteWordProgress } from '../services/memoryService.js';
import { getAvailableLanguages, getAvailableCategories } from '../services/wordLoader.js';

/**
 * Get a word (using memory algorithm by default, or random if algorithm=false)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRandomWordHandler = async (req, res) => {
  try {
    const useAlgorithm = req.query.algorithm !== 'false';
    const language = req.query.language || 'en';
    const category = req.query.category || 'ielts';
    
    let wordData;
    if (useAlgorithm) {
      wordData = await getWordWithMemoryAlgorithm(language, category);
    } else {
      const word = await getRandomWord(language, category);
      wordData = { ...word, priority: 'random', progress: null };
    }
    
    // Remove internal fields, keep only what's needed for display
    const { priority, progress, daysOverdue, ...word } = wordData;
    
    res.status(200).json({
      success: true,
      data: word,
      meta: {
        priority,
        hasProgress: !!progress,
        daysOverdue: daysOverdue || null,
        language,
        category
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching word',
      error: error.message
    });
  }
};

/**
 * Mark a word as known (successfully recalled)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const markWordKnownHandler = async (req, res) => {
  try {
    // Decode URL-encoded word parameter
    const word = decodeURIComponent(req.params.word);
    const { quality, language, category } = req.body;
    const lang = language || req.query.language || 'en';
    const cat = category || req.query.category || 'ielts';
    
    if (!word) {
      return res.status(400).json({
        success: false,
        message: 'Word parameter is required'
      });
    }
    
    const progress = await markWordAsKnown(word, quality || 5, lang, cat);
    
    res.status(200).json({
      success: true,
      message: 'Word marked as known',
      data: {
        word,
        progress,
        language: lang,
        category: cat
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking word',
      error: error.message
    });
  }
};

/**
 * Mark a word as unknown (failed to recall)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const markWordUnknownHandler = async (req, res) => {
  try {
    // Decode URL-encoded word parameter
    const word = decodeURIComponent(req.params.word);
    const { language, category } = req.body;
    const lang = language || req.query.language || 'en';
    const cat = category || req.query.category || 'ielts';
    
    if (!word) {
      return res.status(400).json({
        success: false,
        message: 'Word parameter is required'
      });
    }
    
    const progress = await markWordAsUnknown(word, lang, cat);
    
    res.status(200).json({
      success: true,
      message: 'Word marked as unknown',
      data: {
        word,
        progress,
        language: lang,
        category: cat
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking word',
      error: error.message
    });
  }
};

/**
 * Get learning statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getStatisticsHandler = async (req, res) => {
  try {
    const stats = await getStatistics();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

/**
 * Get daily and weekly learning statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDailyWeeklyStatsHandler = async (req, res) => {
  try {
    const language = req.query.language || null;
    const category = req.query.category || null;
    const stats = await getDailyWeeklyStats(language, category);
    res.status(200).json({
      success: true,
      data: {
        ...stats,
        language: language || 'all',
        category: category || 'all'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching daily/weekly statistics',
      error: error.message
    });
  }
};

/**
 * Get available languages and categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAvailableOptionsHandler = async (req, res) => {
  try {
    const languages = await getAvailableLanguages();
    const categoriesByLanguage = {};
    
    for (const lang of languages) {
      categoriesByLanguage[lang] = await getAvailableCategories(lang);
    }
    
    res.status(200).json({
      success: true,
      data: {
        languages,
        categoriesByLanguage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available options',
      error: error.message
    });
  }
};

/**
 * Update the example for a word
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateWordExampleHandler = async (req, res) => {
  try {
    // Decode URL-encoded word parameter
    const word = decodeURIComponent(req.params.word);
    const { example, language, category } = req.body;
    const lang = language || req.query.language || 'en';
    const cat = category || req.query.category || 'ielts';
    
    if (!word) {
      return res.status(400).json({
        success: false,
        message: 'Word parameter is required'
      });
    }
    
    if (!example || typeof example !== 'string' || example.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Example is required and must be a non-empty string'
      });
    }
    
    const updatedWord = await updateWordExample(word, example.trim(), lang, cat);
    
    res.status(200).json({
      success: true,
      message: 'Word example updated successfully',
      data: {
        ...updatedWord,
        language: lang,
        category: cat
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating word example',
      error: error.message
    });
  }
};

/**
 * Delete a word entry (and its progress) from a language/category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteWordHandler = async (req, res) => {
  try {
    const word = decodeURIComponent(req.params.word);
    const { language, category } = req.body;
    const lang = language || req.query.language || 'en';
    const cat = category || req.query.category || 'ielts';

    if (!word) {
      return res.status(400).json({
        success: false,
        message: 'Word parameter is required'
      });
    }

    const result = await deleteWord(word, lang, cat);
    const progressDeleted = await deleteWordProgress(word, lang, cat);

    res.status(200).json({
      success: true,
      message: 'Word deleted successfully',
      data: {
        word,
        language: lang,
        category: cat,
        remaining: result.remaining,
        progressDeleted
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting word',
      error: error.message
    });
  }
};

