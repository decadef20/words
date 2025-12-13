import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse reading notes from text files
 * Extracts entries starting with '◆' and converts them to word format
 */
function parseNotesFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const entries = [];
  
  let currentEntry = null;
  const sourceName = path.basename(filePath, path.extname(filePath));
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if line starts with '◆'
    if (line.startsWith('◆')) {
      // Save previous entry if exists
      if (currentEntry) {
        entries.push(currentEntry);
      }
      
      // Extract text after '◆' and trim
      const text = line.substring(1).trim();
      
      // Convert to word format structure compatible with wordService
      // The text becomes the 'word' field, and we use it as the example too
      currentEntry = {
        word: text,
        pronunciation: '',
        wordClass: 'phrase', // Reading notes are typically phrases or sentences
        definition: '', // Can be filled in later if needed
        example: text // Use the text itself as the example
      };
    } else if (currentEntry && line.length > 0) {
      // If we have a current entry and this line is not empty,
      // it might be additional context (like Chinese translation or original text)
      // For now, we'll just store the main text
      // You can extend this to capture additional context if needed
    }
  }
  
  // Don't forget the last entry
  if (currentEntry) {
    entries.push(currentEntry);
  }
  
  return entries;
}

/**
 * Escape string for JavaScript single-quoted string
 */
const escapeJsString = (str) => {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/'/g, "\\'")     // Escape single quotes
    .replace(/\n/g, '\\n')     // Escape newlines
    .replace(/\r/g, '\\r')     // Escape carriage returns
    .replace(/\t/g, '\\t');    // Escape tabs
};

/**
 * Save parsed entries to data directory following the structure: data/{language}/{originalName}/words.js
 * This format is compatible with wordLoader.js which expects words.js files in data/{language}/{category}/words.js
 * The original filename becomes the category name
 * @param {Array} entries - Array of parsed entries (in word format)
 * @param {string} originalFileName - Original filename without extension (becomes the category)
 * @param {string} language - Language code (default: 'en')
 * @param {string} category - Category name (unused, originalFileName is used as category)
 * @param {string} projectRoot - Project root directory
 */
function saveParsedNotes(entries, originalFileName, language = 'en', category = 'reading', projectRoot) {
  // Create output path: data/{language}/{originalName}/words.js
  // The original filename becomes the category name for compatibility with wordLoader
  const outputDir = path.join(projectRoot, 'data', language, originalFileName);
  const outputPath = path.join(outputDir, 'words.js');
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Build the words array in the same format as other words.js files
  const wordsArray = entries.map(entry => {
    return `  {
    word: '${escapeJsString(entry.word)}',
    pronunciation: '${escapeJsString(entry.pronunciation)}',
    wordClass: '${escapeJsString(entry.wordClass)}',
    definition: '${escapeJsString(entry.definition)}',
    example: '${escapeJsString(entry.example)}'
  }`;
  }).join(',\n');
  
  // Create JavaScript module format matching the structure of other words.js files
  const content = `// Reading notes parsed from ${originalFileName}.txt
// Language: ${language}
// Category: ${originalFileName} (reading notes)
// Total entries: ${entries.length}
// Generated: ${new Date().toISOString()}
export const words = [
${wordsArray}
];
`;
  
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`Saved ${entries.length} entries to ${outputPath}`);
}

/**
 * Parse all note files from a directory and save each with its original name
 * @param {string} dirPath - Directory path to parse
 * @param {string} language - Language code (default: 'en')
 * @param {string} category - Category name (default: 'reading')
 * @param {string} projectRoot - Project root directory
 */
function parseNotesDirectory(dirPath, language = 'en', category = 'reading', projectRoot) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist. Skipping...`);
    return;
  }
  
  const files = fs.readdirSync(dirPath);
  const txtFiles = files.filter(file => file.endsWith('.txt'));
  
  if (txtFiles.length === 0) {
    console.log(`No .txt files found in ${dirPath}`);
    return;
  }
  
  for (const file of txtFiles) {
    const filePath = path.join(dirPath, file);
    const originalFileName = path.basename(file, path.extname(file));
    
    console.log(`Parsing ${filePath}...`);
    const entries = parseNotesFile(filePath);
    
    if (entries.length > 0) {
      saveParsedNotes(entries, originalFileName, language, category, projectRoot);
    } else {
      console.log(`No entries found in ${filePath}`);
    }
  }
}

/**
 * Main function
 */
function main() {
  const projectRoot = path.resolve(__dirname, '../..');
  const notesDir = path.join(projectRoot, 'notes');
  const rawsDir = path.join(projectRoot, 'raws');
  
  let processedCount = 0;
  
  // Parse notes directory (assumed to be English reading notes)
  if (fs.existsSync(notesDir)) {
    parseNotesDirectory(notesDir, 'en', 'reading', projectRoot);
    processedCount++;
  }
  
  // Parse raws directory if it exists (assumed to be English reading notes)
  if (fs.existsSync(rawsDir)) {
    parseNotesDirectory(rawsDir, 'en', 'reading', projectRoot);
    processedCount++;
  }
  
  if (processedCount === 0) {
    console.log('No directories found to parse.');
    return;
  }
  
  console.log(`\nParsing complete!`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { parseNotesFile, parseNotesDirectory, saveParsedNotes };

