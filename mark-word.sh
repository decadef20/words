#!/bin/bash

# Script to mark a word as known or unknown
# Usage: 
#   ./mark-word.sh <word> <known|unknown>                    # Use localhost:3000 (default)
#   ./mark-word.sh <word> <known|unknown> https://api.example.com  # Use custom URL
#   BASE_URL=https://api.example.com ./mark-word.sh <word> <known|unknown>  # Or use environment variable

# Allow BASE_URL to be set via environment variable or command line argument
if [ -n "$3" ]; then
    BASE_URL="$3"
elif [ -n "$BASE_URL" ]; then
    # BASE_URL already set from environment
    :
else
    # Default to localhost
    PORT=${PORT:-3000}
    BASE_URL="http://localhost:${PORT}"
fi

# Remove trailing slash if present
BASE_URL="${BASE_URL%/}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ $# -lt 2 ]; then
    echo -e "${RED}Usage: ./mark-word.sh <word> <known|unknown>${NC}"
    exit 1
fi

WORD=$1
STATUS=$2

# URL encode the word (basic version)
ENCODED_WORD=$(echo "$WORD" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))" 2>/dev/null || echo "$WORD")

if [ "$STATUS" = "known" ]; then
    RESPONSE=$(curl -s -X POST "${BASE_URL}/api/words/${ENCODED_WORD}/known")
    if echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if data.get('success') else 1)" 2>/dev/null; then
        echo -e "${GREEN}✓ Word '${WORD}' marked as known${NC}"
        echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    else
        echo -e "${RED}✗ Failed to mark word${NC}"
        echo "$RESPONSE"
        exit 1
    fi
elif [ "$STATUS" = "unknown" ]; then
    RESPONSE=$(curl -s -X POST "${BASE_URL}/api/words/${ENCODED_WORD}/unknown")
    if echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if data.get('success') else 1)" 2>/dev/null; then
        echo -e "${YELLOW}✓ Word '${WORD}' marked as unknown${NC}"
        echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    else
        echo -e "${RED}✗ Failed to mark word${NC}"
        echo "$RESPONSE"
        exit 1
    fi
else
    echo -e "${RED}Invalid status. Use 'known' or 'unknown'${NC}"
    exit 1
fi

