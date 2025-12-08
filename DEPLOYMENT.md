# Deployment Guide

This guide explains how to use the Words Memory Service scripts with a deployed service.

## Local Development

By default, scripts connect to `http://localhost:3000` and use English (en) / IELTS category:

```bash
./get-word.sh
./mark-word.sh serendipity known
```

### Using Different Languages and Categories

You can specify language and category using environment variables:

```bash
# Use different category (e.g., TOEFL)
LANGUAGE=en CATEGORY=toefl ./get-word.sh

# Use different language (e.g., Spanish)
LANGUAGE=es CATEGORY=common ./get-word.sh

# Combine with custom BASE_URL
BASE_URL=https://api.example.com LANGUAGE=en CATEGORY=toefl ./get-word.sh
```

## Using with Deployed Service

### Option 1: Command Line Argument (Recommended)

Pass the base URL as the first argument. **Important: Include the port number if your service uses a non-standard port (not 80 for HTTP or 443 for HTTPS):**

```bash
# For get-word.sh
./get-word.sh https://your-api-domain.com

# For mark-word.sh
./mark-word.sh serendipity known https://your-api-domain.com
```

### Option 2: Environment Variable

Set `BASE_URL`, `LANGUAGE`, and `CATEGORY` environment variables:

```bash
# One-time use
BASE_URL=https://your-api-domain.com LANGUAGE=en CATEGORY=ielts ./get-word.sh

# Or export for current session
export BASE_URL=https://your-api-domain.com
export LANGUAGE=en
export CATEGORY=ielts
./get-word.sh
./mark-word.sh serendipity known
```

**Available Options:**
- `LANGUAGE`: Language code (default: `en`). Examples: `en`, `es`, `fr`
- `CATEGORY`: Category name (default: `ielts`). Examples: `ielts`, `toefl`, `gre`, `common`

### Option 3: Configuration File

1. Copy the example config file:
   ```bash
   cp config.sh.example config.sh
   ```

2. Edit `config.sh` and set your configuration:
   ```bash
   BASE_URL="https://your-api-domain.com"
   LANGUAGE="en"
   CATEGORY="ielts"
   export BASE_URL LANGUAGE CATEGORY
   ```

3. Source it before running scripts:
   ```bash
   source config.sh
   ./get-word.sh
   ```

   Or add to your `~/.bashrc` or `~/.zshrc`:
   ```bash
   source /path/to/words/config.sh
   ```

## Deployment Platforms

### Heroku

```bash
./get-word.sh https://your-app.herokuapp.com
```

### Vercel

```bash
./get-word.sh https://your-app.vercel.app
```

### Railway

```bash
./get-word.sh https://your-app.railway.app
```

### Custom Domain

```bash
./get-word.sh https://api.yourdomain.com
```

### Custom Port

If your service runs on a non-standard port, include it in the URL:

```bash
# HTTP with custom port
./get-word.sh http://dev.example.com:3000

# HTTPS with custom port
./get-word.sh https://api.example.com:8443
```

## Testing Connection

The script will automatically check if it can connect to the server. If connection fails, you'll see:

```
❌ Cannot connect to server at https://your-api-domain.com
   For local: Make sure server is running with 'npm start'
   For remote: Check the URL and network connection
```

## Language and Category Support

The service supports multiple languages and categories. Words are organized in the structure:
- `data/{language}/{category}/words.js`
- Example: `data/en/ielts/words.js`, `data/en/toefl/words.js`, `data/es/common/words.js`

**Default values:**
- Language: `en` (English)
- Category: `ielts`

**To use different language/category:**
- Set `LANGUAGE` and `CATEGORY` environment variables
- Or pass them as query parameters in API calls
- The progress tracking is separate for each language/category combination

## Tips

1. **Create an alias** for convenience:
   ```bash
   alias words='BASE_URL=https://your-api-domain.com LANGUAGE=en CATEGORY=ielts ./get-word.sh'
   ```

2. **Use a wrapper script**:
   ```bash
   #!/bin/bash
   # words-remote.sh
   BASE_URL="https://your-api-domain.com"
   LANGUAGE="${LANGUAGE:-en}"
   CATEGORY="${CATEGORY:-ielts}"
   BASE_URL="$BASE_URL" LANGUAGE="$LANGUAGE" CATEGORY="$CATEGORY" ./get-word.sh "$@"
   ```

3. **Check your deployment URL** - Make sure your deployed service is accessible and the API endpoints are working:
   ```bash
   # Default (en/ielts)
   curl https://your-api-domain.com/api/words/random
   
   # With specific language/category
   curl "https://your-api-domain.com/api/words/random?language=en&category=toefl"
   ```

4. **List available languages and categories**:
   ```bash
   curl https://your-api-domain.com/api/words/options
   ```

