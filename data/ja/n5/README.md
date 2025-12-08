# Japanese N5 Vocabulary

This directory contains JLPT N5 level Japanese words for the Words Memory Service.

## Current Status

- **Language**: Japanese (ja)
- **Category**: N5 (Japanese Language Proficiency Test Level 5 - Beginner)
- **Current word count**: 15 (starter set)

## Resources for Finding N5 Words

Here are some reliable sources for JLPT N5 vocabulary:

1. **MLC Japanese School** - Complete N5 vocabulary list (802 words)
   - https://www.mlcjapanese.co.jp/n5_04_01.html
   - Provides words with readings, meanings, and example sentences

2. **JLPT Hub** - N5 vocabulary list with examples
   - https://www.jllpthub.com/vocabulary/n5-vocabulary-list/

3. **Coto Academy** - Top 100 JLPT N5 words by category
   - https://cotoacademy.com/top-100-jlpt-n5-words/

4. **Tofugu** - JLPT N5 vocabulary study guide
   - https://www.tofugu.com/japanese/jlpt-n5-vocabulary/

## Word Format

Each word should follow this structure:

```javascript
{
  word: 'こんにちは',           // Japanese word/kanji
  pronunciation: 'konnichiwa',  // Romaji pronunciation
  wordClass: 'greeting',        // Part of speech (noun, verb, adjective, etc.)
  definition: 'Hello',          // English definition
  example: 'こんにちは、元気ですか？'  // Example sentence in Japanese
}
```

## Adding More Words

To add more words:

1. Edit `words.js` in this directory
2. Add new word objects to the `words` array
3. Follow the format shown above
4. Update the total word count in the file header comment

## Usage

Once words are added, you can use them with:

```bash
LANGUAGE=ja CATEGORY=n5 ./get-word.sh
```

## Notes

- N5 is the beginner level of JLPT
- Typically includes ~800 basic words
- Focus on hiragana, katakana, and basic kanji
- Common categories: greetings, numbers, time, family, basic verbs/adjectives

