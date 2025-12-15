#!/bin/bash

# Script to mark a word as known/unknown or delete it
# Usage: 
#   ./mark-word.sh <word> <known|unknown|delete>                    # Use localhost:3000 (default)
#   ./mark-word.sh <word> <known|unknown|delete> https://api.example.com  # Use custom URL
#   BASE_URL=https://api.example.com ./mark-word.sh <word> <known|unknown|delete>  # Or use environment variable

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

# Language and category (default: en/ielts)
LANGUAGE=${LANGUAGE:-en}
CATEGORY=${CATEGORY:-ielts}

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ $# -lt 2 ]; then
    echo -e "${RED}Usage: ./mark-word.sh <word> <known|unknown|delete> [base_url]${NC}"
    echo -e "${RED}       LANGUAGE=en CATEGORY=ielts ./mark-word.sh <word> <known|unknown|delete>${NC}"
    exit 1
fi

WORD=$1
STATUS=$2

# URL encode the word (properly handle Unicode/Japanese characters)
# Use python3 for proper URL encoding, fallback to basic encoding
ENCODED_WORD=$(echo "$WORD" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip(), safe=''))" 2>/dev/null)
if [ -z "$ENCODED_WORD" ]; then
    # Fallback: try with basic encoding
    ENCODED_WORD=$(echo "$WORD" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))" 2>/dev/null || echo "$WORD")
fi

# Create JSON payload with language and category
JSON_PAYLOAD=$(python3 -c "import json; print(json.dumps({'language': '${LANGUAGE}', 'category': '${CATEGORY}'}))" 2>/dev/null || echo "{\"language\": \"${LANGUAGE}\", \"category\": \"${CATEGORY}\"}")

if [ "$STATUS" = "known" ]; then
    RESPONSE=$(curl -s -X POST "${BASE_URL}/api/words/${ENCODED_WORD}/known?language=${LANGUAGE}&category=${CATEGORY}" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -d "$JSON_PAYLOAD")
    if echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if data.get('success') else 1)" 2>/dev/null; then
        echo -e "${GREEN}✓ Word '${WORD}' marked as known (${LANGUAGE}/${CATEGORY})${NC}"
        echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    else
        echo -e "${RED}✗ Failed to mark word${NC}"
        echo -e "${RED}Response: ${RESPONSE}${NC}"
        ERROR_MSG=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('message', data.get('error', 'Unknown error')))" 2>/dev/null || echo "Check server logs")
        echo -e "${RED}Error: ${ERROR_MSG}${NC}"
        exit 1
    fi
elif [ "$STATUS" = "unknown" ]; then
    RESPONSE=$(curl -s -X POST "${BASE_URL}/api/words/${ENCODED_WORD}/unknown?language=${LANGUAGE}&category=${CATEGORY}" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -d "$JSON_PAYLOAD")
    if echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if data.get('success') else 1)" 2>/dev/null; then
        echo -e "${YELLOW}✓ Word '${WORD}' marked as unknown (${LANGUAGE}/${CATEGORY})${NC}"
        echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    else
        echo -e "${RED}✗ Failed to mark word${NC}"
        echo -e "${RED}Response: ${RESPONSE}${NC}"
        ERROR_MSG=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('message', data.get('error', 'Unknown error')))" 2>/dev/null || echo "Check server logs")
        echo -e "${RED}Error: ${ERROR_MSG}${NC}"
        exit 1
    fi
elif [ "$STATUS" = "delete" ]; then
    RESPONSE=$(curl -s -X DELETE "${BASE_URL}/api/words/${ENCODED_WORD}?language=${LANGUAGE}&category=${CATEGORY}" \
        -H "Accept: application/json")
    if echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if data.get('success') else 1)" 2>/dev/null; then
        echo -e "${GREEN}✓ Word '${WORD}' deleted (${LANGUAGE}/${CATEGORY})${NC}"
        echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    else
        echo -e "${RED}✗ Failed to delete word${NC}"
        echo -e "${RED}Response: ${RESPONSE}${NC}"
        ERROR_MSG=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('message', data.get('error', 'Unknown error')))" 2>/dev/null || echo "Check server logs")
        echo -e "${RED}Error: ${ERROR_MSG}${NC}"
        exit 1
    fi
else
    echo -e "${RED}Invalid status. Use 'known', 'unknown', or 'delete'${NC}"
    exit 1
fi

