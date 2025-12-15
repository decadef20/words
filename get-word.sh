#!/bin/bash

# Interactive script to get words and mark them
# Usage: 
#   ./get-word.sh                    # Use localhost:3000 (default)
#   ./get-word.sh https://api.example.com  # Use custom URL
#   BASE_URL=https://api.example.com ./get-word.sh  # Or use environment variable

# Allow BASE_URL to be set via environment variable or command line argument
if [ -n "$1" ]; then
    BASE_URL="$1"
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
LANGUAGE=${LANGUAGE:-ja}
CATEGORY=${CATEGORY:-n5}

# Colors for terminal output
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if server is running
check_server() {
    echo -e "${CYAN}🔗 Connecting to: ${BASE_URL}${NC}"
    if ! curl -s --max-time 5 "${BASE_URL}" > /dev/null 2>&1; then
        echo -e "${YELLOW}❌ Cannot connect to server at ${BASE_URL}${NC}"
        if [[ "$BASE_URL" == *"localhost"* ]] || [[ "$BASE_URL" == *"127.0.0.1"* ]]; then
            echo -e "${YELLOW}   Make sure server is running with: npm start${NC}"
        else
            echo -e "${YELLOW}   Check the URL and network connection${NC}"
            echo -e "${YELLOW}   Test with: curl ${BASE_URL}${NC}"
        fi
        exit 1
    fi
    echo ""
}

# Global variables for word data
CURRENT_WORD=""
CURRENT_PRONUNCIATION=""
CURRENT_DEFINITION=""
CURRENT_EXAMPLE=""

# Function to fetch and display a word
fetch_word() {
    # Fetch the word data with language and category
    RESPONSE=$(curl -s "${BASE_URL}/api/words/random?language=${LANGUAGE}&category=${CATEGORY}")
    
    # Check if response is valid
    if [ $? -ne 0 ] || [ -z "$RESPONSE" ]; then
        echo -e "${YELLOW}❌ Failed to fetch word. Is the server running?${NC}"
        return 1
    fi
    
    # Extract data using python (most reliable for JSON parsing)
    CURRENT_WORD=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('word', ''))" 2>/dev/null)
    CURRENT_PRONUNCIATION=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('pronunciation', ''))" 2>/dev/null)
    CURRENT_WORD_CLASS=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('wordClass', ''))" 2>/dev/null)
    CURRENT_DEFINITION=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('definition', ''))" 2>/dev/null)
    CURRENT_EXAMPLE=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('example', ''))" 2>/dev/null)
    PRIORITY=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('meta', {}).get('priority', ''))" 2>/dev/null)
    DAYS_OVERDUE=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('meta', {}).get('daysOverdue', ''))" 2>/dev/null)
    
    # Fallback to grep/sed if python is not available
    if [ -z "$CURRENT_WORD" ]; then
        CURRENT_WORD=$(echo "$RESPONSE" | grep -o '"word":"[^"]*' | sed 's/"word":"//')
        CURRENT_PRONUNCIATION=$(echo "$RESPONSE" | grep -o '"pronunciation":"[^"]*' | sed 's/"pronunciation":"//')
        CURRENT_DEFINITION=$(echo "$RESPONSE" | grep -o '"definition":"[^"]*' | sed 's/"definition":"//')
        CURRENT_EXAMPLE=$(echo "$RESPONSE" | grep -o '"example":"[^"]*' | sed 's/"example":"//')
    fi
    
    # Check if we got valid data
    if [ -z "$CURRENT_WORD" ]; then
        echo -e "${YELLOW}❌ Failed to parse response. Raw response:${NC}"
        echo "$RESPONSE"
        return 1
    fi
    
    # Clear screen for better UX (optional - comment out if you prefer)
    # clear
    
    # Display formatted output
    echo -e "${BOLD}${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${GREEN}║${NC}                    ${BOLD}${CYAN}📖 WORD OF THE MOMENT${NC}                   ${BOLD}${GREEN}║${NC}"
    echo -e "${BOLD}${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo -e "  ${CYAN}${LANGUAGE}/${CATEGORY}${NC}"
    echo ""
    
    # Show review status if available
    if [ -n "$PRIORITY" ] && [ "$PRIORITY" != "None" ]; then
        case "$PRIORITY" in
            "review")
                if [ -n "$DAYS_OVERDUE" ] && [ "$DAYS_OVERDUE" != "None" ] && [ "$DAYS_OVERDUE" != "0" ]; then
                    echo -e "${YELLOW}🔄 Review due (${DAYS_OVERDUE} days overdue)${NC}"
                else
                    echo -e "${YELLOW}🔄 Time for review${NC}"
                fi
                ;;
            "new")
                echo -e "${GREEN}✨ New word${NC}"
                ;;
        esac
        echo ""
    fi
    
    echo -e "${BOLD}${BLUE}Word:${NC} ${BOLD}${YELLOW}${CURRENT_WORD}${NC}"
    if [ -n "$CURRENT_PRONUNCIATION" ]; then
        echo -e "${BOLD}${BLUE}Pronunciation:${NC} ${CYAN}${CURRENT_PRONUNCIATION}${NC}"
    fi
    if [ -n "$CURRENT_WORD_CLASS" ]; then
        echo -e "${BOLD}${BLUE}Word Class:${NC} ${CYAN}${CURRENT_WORD_CLASS}${NC}"
    fi
    echo ""
    if [ -n "$CURRENT_DEFINITION" ]; then
        echo -e "${BOLD}${BLUE}Definition:${NC}"
        echo -e "  ${CURRENT_DEFINITION}"
        echo ""
    fi
    echo -e "${BOLD}${BLUE}Example:${NC}"
    echo -e "  ${CYAN}${CURRENT_EXAMPLE}${NC}"
    echo ""
    echo -e "${BOLD}${GREEN}────────────────────────────────────────────────────────────${NC}"
    echo ""
    
    return 0
}

# Function to mark word
mark_word() {
    local word=$1
    local status=$2
    local language=${3:-$LANGUAGE}
    local category=${4:-$CATEGORY}
    
    # URL encode the word
    local encoded_word=$(echo "$word" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))" 2>/dev/null || echo "$word")
    
    # Create JSON payload with language and category
    local json_payload=$(python3 -c "import json; print(json.dumps({'language': '${language}', 'category': '${category}'}))" 2>/dev/null || echo "{\"language\": \"${language}\", \"category\": \"${category}\"}")
    
    local response
    if [ "$status" = "known" ]; then
        response=$(curl -s -X POST "${BASE_URL}/api/words/${encoded_word}/known?language=${language}&category=${category}" \
            -H "Content-Type: application/json" \
            -d "$json_payload")
    else
        response=$(curl -s -X POST "${BASE_URL}/api/words/${encoded_word}/unknown?language=${language}&category=${category}" \
            -H "Content-Type: application/json" \
            -d "$json_payload")
    fi
    
    # Check if successful
    if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if data.get('success') else 1)" 2>/dev/null; then
        if [ "$status" = "known" ]; then
            echo -e "${GREEN}${BOLD}✓ Successfully marked as known!${NC} ${CYAN}(Next review scheduled)${NC}"
        else
            echo -e "${YELLOW}${BOLD}✓ Marked as unknown${NC} ${CYAN}(Will review again soon)${NC}"
        fi
        return 0
    else
        echo -e "${RED}${BOLD}✗ Failed to mark word. Please try again.${NC}"
        return 1
    fi
}

# Function to delete a word entry
delete_word() {
    local word=$1
    local language=${2:-$LANGUAGE}
    local category=${3:-$CATEGORY}

    # URL encode the word
    local encoded_word=$(echo "$word" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))" 2>/dev/null || echo "$word")

    local response=$(curl -s -X DELETE "${BASE_URL}/api/words/${encoded_word}?language=${language}&category=${category}" \
        -H "Accept: application/json")

    if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if data.get('success') else 1)" 2>/dev/null; then
        echo -e "${GREEN}${BOLD}✓ Word deleted (${language}/${category})${NC}"
        return 0
    else
        echo -e "${RED}${BOLD}✗ Failed to delete word${NC}"
        echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
        return 1
    fi
}

# Function to show statistics
show_statistics() {
    # Fetch statistics with language and category
    local response=$(curl -s "${BASE_URL}/api/words/statistics/daily-weekly?language=${LANGUAGE}&category=${CATEGORY}")
    
    # Check if response is valid
    if [ $? -ne 0 ] || [ -z "$response" ]; then
        echo -e "${YELLOW}❌ Failed to fetch statistics. Is the server running?${NC}"
        return 1
    fi
    
    # Extract data using python
    local words_today=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('wordsToday', 0))" 2>/dev/null)
    local words_week=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('wordsThisWeek', 0))" 2>/dev/null)
    
    # Fallback if python fails
    if [ -z "$words_today" ] || [ -z "$words_week" ]; then
        words_today=$(echo "$response" | grep -o '"wordsToday":[0-9]*' | grep -o '[0-9]*')
        words_week=$(echo "$response" | grep -o '"wordsThisWeek":[0-9]*' | grep -o '[0-9]*')
    fi
    
    # Display statistics with nice formatting
    echo ""
    echo -e "${BOLD}${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${GREEN}║${NC}                  ${BOLD}📊 LEARNING STATISTICS${NC}                    ${BOLD}${GREEN}║${NC}"
    echo -e "${BOLD}${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  ${CYAN}Language:${NC} ${BOLD}${LANGUAGE}${NC}  ${CYAN}Category:${NC} ${BOLD}${CATEGORY}${NC}"
    echo ""
    echo -e "  ${CYAN}📅 Today:${NC}     ${BOLD}${GREEN}${words_today:-0}${NC} ${CYAN}words reviewed${NC}"
    echo -e "  ${CYAN}📆 This Week:${NC} ${BOLD}${GREEN}${words_week:-0}${NC} ${CYAN}words reviewed${NC}"
    echo ""
    echo -e "${BOLD}${GREEN}────────────────────────────────────────────────────────────${NC}"
    echo ""
}

# Function to update word example
update_example() {
    local word=$1
    local current_example=$2
    
    # Show current example
    echo -e "${CYAN}Current example:${NC}"
    echo -e "  ${current_example}"
    echo ""
    echo -e "${BOLD}Enter new example (press Enter to keep current, or type new example):${NC}"
    echo -ne "${CYAN}> ${NC}"
    
    # Read new example (allow multi-line input)
    read -r new_example
    
    # If empty, keep current
    if [ -z "$new_example" ]; then
        echo -e "${YELLOW}Example unchanged.${NC}"
        return 0
    fi
    
    # URL encode the word
    local encoded_word=$(echo "$word" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))" 2>/dev/null || echo "$word")
    
    # Create JSON payload with proper escaping using python
    # Use a temporary approach that handles special characters properly
    local json_payload=$(printf '%s' "$new_example" | python3 -c "import sys, json; print(json.dumps({'example': sys.stdin.read(), 'language': '${LANGUAGE}', 'category': '${CATEGORY}'}))" 2>/dev/null)
    
    # Fallback if python fails
    if [ -z "$json_payload" ] || [ "$json_payload" = "null" ]; then
        # Use a simpler approach: escape and wrap manually
        local escaped_example=$(printf '%s' "$new_example" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed 's/$/\\n/' | tr -d '\n' | sed 's/\\n$//')
        json_payload="{\"example\": \"${escaped_example}\", \"language\": \"${LANGUAGE}\", \"category\": \"${CATEGORY}\"}"
    fi
    
    # Send PUT request to update example
    local response=$(curl -s -X PUT "${BASE_URL}/api/words/${encoded_word}/example?language=${LANGUAGE}&category=${CATEGORY}" \
        -H "Content-Type: application/json" \
        -d "$json_payload")
    
    # Check if successful
    if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if data.get('success') else 1)" 2>/dev/null; then
        echo -e "${GREEN}${BOLD}✓ Example updated successfully!${NC}"
        # Update current example in memory
        CURRENT_EXAMPLE="$new_example"
        return 0
    else
        echo -e "${RED}${BOLD}✗ Failed to update example. Please try again.${NC}"
        echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
        return 1
    fi
}

# Main loop
main() {
    check_server
    
    while true; do
        # Fetch and display word
        if ! fetch_word; then
            break
        fi
        
        # Menu loop - stay on same word until valid action or next/quit
        while true; do
            # Show interactive menu with better formatting
            echo -e "${BOLD}${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
            echo -e "${BOLD}${CYAN}║${NC}                    ${BOLD}What's next?${NC}                            ${BOLD}${CYAN}║${NC}"
            echo -e "${BOLD}${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
            echo ""
            echo -e "  ${GREEN}${BOLD}[K]${NC}${GREEN}nown${NC}     ${CYAN}→${NC} I remember this word"
            echo -e "  ${YELLOW}${BOLD}[U]${NC}${YELLOW}nknown${NC}   ${CYAN}→${NC} I don't remember this word"
            echo -e "  ${BLUE}${BOLD}[E]${NC}${BLUE}dit${NC}      ${CYAN}→${NC} Update example sentence"
            echo -e "  ${RED}${BOLD}[D]${NC}${RED}elete${NC}    ${CYAN}→${NC} Remove this word entirely"
            echo -e "  ${CYAN}${BOLD}[S]${NC}${CYAN}tatistics${NC} ${CYAN}→${NC} Show daily/weekly stats"
            echo -e "  ${BLUE}${BOLD}[N]${NC}${BLUE}ext${NC}      ${CYAN}→${NC} Skip to next word"
            echo -e "  ${RED}${BOLD}[Q]${NC}${RED}uit${NC}      ${CYAN}→${NC} Exit"
            echo ""
            echo -ne "${BOLD}${CYAN}Press a key: ${NC}"
            
            # Read single character (no Enter needed, silent mode)
            stty -echo
            read -n 1 -r choice
            stty echo
            echo ""
            echo ""
            
            # Convert to lowercase
            choice=$(echo "$choice" | tr '[:upper:]' '[:lower:]')
            
            case "$choice" in
                k)
                echo -e "${GREEN}${BOLD}✓ Marking as known...${NC}"
                mark_word "$CURRENT_WORD" "known" "$LANGUAGE" "$CATEGORY"
                echo ""
                sleep 0.8  # Brief pause for feedback
                break  # Exit menu loop to fetch next word
                ;;
            u)
                echo -e "${YELLOW}${BOLD}✓ Marking as unknown...${NC}"
                mark_word "$CURRENT_WORD" "unknown" "$LANGUAGE" "$CATEGORY"
                echo ""
                sleep 0.8  # Brief pause for feedback
                break  # Exit menu loop to fetch next word
                ;;
        d)
            echo -e "${RED}${BOLD}⚠ Delete '${CURRENT_WORD}'? Type 'delete' to confirm:${NC}"
            echo -ne "${CYAN}> ${NC}"
            read -r confirm_delete
            if [ "$confirm_delete" = "delete" ]; then
                delete_word "$CURRENT_WORD" "$LANGUAGE" "$CATEGORY"
                echo ""
                sleep 0.8
                break  # Exit menu loop to fetch next word
            else
                echo -e "${YELLOW}Deletion cancelled.${NC}"
                echo ""
                sleep 0.5
            fi
            ;;
                e)
                    echo ""
                    update_example "$CURRENT_WORD" "$CURRENT_EXAMPLE"
                    echo ""
                    sleep 0.8  # Brief pause for feedback
                    # Stay in menu loop to show updated example
                    ;;
                s)
                    show_statistics
                    sleep 1.5  # Brief pause to read statistics
                    # Stay in menu loop
                    ;;
                n)
                    echo -e "${CYAN}${BOLD}→ Fetching next word...${NC}"
                    echo ""
                    sleep 0.3
                    break  # Exit menu loop to fetch next word
                    ;;
                q)
                    echo ""
                    echo -e "${CYAN}${BOLD}👋 Goodbye! Keep learning!${NC}"
                    echo ""
                    exit 0
                    ;;
                *)
                    echo -e "${YELLOW}⚠ Invalid choice. Press K, U, E, S, N, or Q${NC}"
                    echo ""
                    sleep 0.5
                    # Stay in menu loop - don't fetch new word
                    ;;
            esac
        done
    done
}

# Run main function
main