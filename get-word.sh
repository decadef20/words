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
    # Fetch the word data
    RESPONSE=$(curl -s "${BASE_URL}/api/words/random")
    
    # Check if response is valid
    if [ $? -ne 0 ] || [ -z "$RESPONSE" ]; then
        echo -e "${YELLOW}❌ Failed to fetch word. Is the server running?${NC}"
        return 1
    fi
    
    # Extract data using python (most reliable for JSON parsing)
    CURRENT_WORD=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('word', ''))" 2>/dev/null)
    CURRENT_PRONUNCIATION=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('pronunciation', ''))" 2>/dev/null)
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
    echo -e "${BOLD}${GREEN}║${NC}                    ${BOLD}${CYAN}📖 WORD OF THE MOMENT${NC}                    ${BOLD}${GREEN}║${NC}"
    echo -e "${BOLD}${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
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
    echo ""
    echo -e "${BOLD}${BLUE}Definition:${NC}"
    echo -e "  ${CURRENT_DEFINITION}"
    echo ""
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
    
    # URL encode the word
    local encoded_word=$(echo "$word" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))" 2>/dev/null || echo "$word")
    
    local response
    if [ "$status" = "known" ]; then
        response=$(curl -s -X POST "${BASE_URL}/api/words/${encoded_word}/known")
    else
        response=$(curl -s -X POST "${BASE_URL}/api/words/${encoded_word}/unknown")
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

# Main loop
main() {
    check_server
    
    while true; do
        # Fetch and display word
        if ! fetch_word; then
            break
        fi
        
        # Show interactive menu with better formatting
        echo -e "${BOLD}${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${BOLD}${CYAN}║${NC}                    ${BOLD}What's next?${NC}                    ${BOLD}${CYAN}║${NC}"
        echo -e "${BOLD}${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "  ${GREEN}${BOLD}[K]${NC}${GREEN}nown${NC}     ${CYAN}→${NC} I remember this word"
        echo -e "  ${YELLOW}${BOLD}[U]${NC}${YELLOW}nknown${NC}   ${CYAN}→${NC} I don't remember this word"
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
                mark_word "$CURRENT_WORD" "known"
                echo ""
                sleep 0.8  # Brief pause for feedback
                ;;
            u)
                echo -e "${YELLOW}${BOLD}✓ Marking as unknown...${NC}"
                mark_word "$CURRENT_WORD" "unknown"
                echo ""
                sleep 0.8  # Brief pause for feedback
                ;;
            n)
                echo -e "${CYAN}${BOLD}→ Fetching next word...${NC}"
                echo ""
                sleep 0.3
                ;;
            q)
                echo ""
                echo -e "${CYAN}${BOLD}👋 Goodbye! Keep learning!${NC}"
                echo ""
                exit 0
                ;;
            *)
                echo -e "${YELLOW}⚠ Invalid choice. Press K, U, N, or Q${NC}"
                echo ""
                sleep 0.5
                continue
                ;;
        esac
    done
}

# Run main function
main