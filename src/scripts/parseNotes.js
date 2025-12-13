import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse reading notes from text files
 * Extracts entries starting with '◆' and saves them to data directory
 */
function parseNotesFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const entries = [];
  
  let currentEntry = null;
  
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
      
      // Create new entry
      currentEntry = {
        text: text,
        source: path.basename(filePath, path.extname(filePath)),
        lineNumber: i + 1
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
 * Parse all note files from a directory
 */
function parseNotesDirectory(dirPath) {
  const entries = [];
  
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist. Skipping...`);
    return entries;
  }
  
  const files = fs.readdirSync(dirPath);
  const txtFiles = files.filter(file => file.endsWith('.txt'));
  
  for (const file of txtFiles) {
    const filePath = path.join(dirPath, file);
    console.log(`Parsing ${filePath}...`);
    const fileEntries = parseNotesFile(filePath);
    entries.push(...fileEntries);
  }
  
  return entries;
}

/**
 * Save parsed entries to data directory
 */
function saveParsedNotes(entries, outputPath) {
  // Create data directory if it doesn't exist
  const dataDir = path.dirname(outputPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Create JavaScript module format
  const content = `// Reading notes parsed from notes/raws directories
// Total entries: ${entries.length}
// Generated: ${new Date().toISOString()}
export const readingNotes = ${JSON.stringify(entries, null, 2)};
`;
  
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`Saved ${entries.length} entries to ${outputPath}`);
}

/**
 * Main function
 */
function main() {
  const projectRoot = path.resolve(__dirname, '../..');
  const notesDir = path.join(projectRoot, 'notes');
  const rawsDir = path.join(projectRoot, 'raws');
  const outputPath = path.join(projectRoot, 'data', 'readingNotes.js');
  
  let allEntries = [];
  
  // Parse notes directory
  if (fs.existsSync(notesDir)) {
    const notesEntries = parseNotesDirectory(notesDir);
    allEntries.push(...notesEntries);
  }
  
  // Parse raws directory if it exists
  if (fs.existsSync(rawsDir)) {
    const rawsEntries = parseNotesDirectory(rawsDir);
    allEntries.push(...rawsEntries);
  }
  
  if (allEntries.length === 0) {
    console.log('No entries found to parse.');
    return;
  }
  
  // Save parsed entries
  saveParsedNotes(allEntries, outputPath);
  
  console.log(`\nParsing complete! Found ${allEntries.length} entries.`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { parseNotesFile, parseNotesDirectory, saveParsedNotes };

