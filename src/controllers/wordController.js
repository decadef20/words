import { getRandomWord, getWordWithMemoryAlgorithm, updateWordExample } from '../services/wordService.js';
import { markWordAsKnown, markWordAsUnknown, getStatistics, getDailyWeeklyStats } from '../services/memoryService.js';

/**
 * Get a word (using memory algorithm by default, or random if algorithm=false)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRandomWordHandler = async (req, res) => {
  try {
    const useAlgorithm = req.query.algorithm !== 'false';
    
    let wordData;
    if (useAlgorithm) {
      wordData = await getWordWithMemoryAlgorithm();
    } else {
      const word = getRandomWord();
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
        daysOverdue: daysOverdue || null
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
    const { word } = req.params;
    const { quality } = req.body; // Optional: 3-5 (default 5)
    
    if (!word) {
      return res.status(400).json({
        success: false,
        message: 'Word parameter is required'
      });
    }
    
    const progress = await markWordAsKnown(word, quality || 5);
    
    res.status(200).json({
      success: true,
      message: 'Word marked as known',
      data: {
        word,
        progress
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
    const { word } = req.params;
    
    if (!word) {
      return res.status(400).json({
        success: false,
        message: 'Word parameter is required'
      });
    }
    
    const progress = await markWordAsUnknown(word);
    
    res.status(200).json({
      success: true,
      message: 'Word marked as unknown',
      data: {
        word,
        progress
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
    const stats = await getDailyWeeklyStats();
    res.status(200).json({
      success: true,
      data: stats
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
 * Update the example for a word
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateWordExampleHandler = async (req, res) => {
  try {
    const { word } = req.params;
    const { example } = req.body;
    
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
    
    const updatedWord = await updateWordExample(word, example.trim());
    
    res.status(200).json({
      success: true,
      message: 'Word example updated successfully',
      data: updatedWord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating word example',
      error: error.message
    });
  }
};

