import express from 'express';
import { 
  getRandomWordHandler, 
  markWordKnownHandler, 
  markWordUnknownHandler,
  getStatisticsHandler,
  getDailyWeeklyStatsHandler,
  updateWordExampleHandler
} from '../controllers/wordController.js';

const router = express.Router();

/**
 * @route   GET /api/words/random
 * @desc    Get a word (uses memory algorithm by default, add ?algorithm=false for random)
 * @access  Public
 */
router.get('/random', getRandomWordHandler);

/**
 * @route   POST /api/words/:word/known
 * @desc    Mark a word as known (successfully recalled)
 * @access  Public
 */
router.post('/:word/known', markWordKnownHandler);

/**
 * @route   POST /api/words/:word/unknown
 * @desc    Mark a word as unknown (failed to recall)
 * @access  Public
 */
router.post('/:word/unknown', markWordUnknownHandler);

/**
 * @route   GET /api/words/statistics
 * @desc    Get learning statistics
 * @access  Public
 */
router.get('/statistics', getStatisticsHandler);

/**
 * @route   GET /api/words/statistics/daily-weekly
 * @desc    Get daily and weekly learning statistics
 * @access  Public
 */
router.get('/statistics/daily-weekly', getDailyWeeklyStatsHandler);

/**
 * @route   PUT /api/words/:word/example
 * @desc    Update the example for a word
 * @access  Public
 */
router.put('/:word/example', updateWordExampleHandler);

export default router;

