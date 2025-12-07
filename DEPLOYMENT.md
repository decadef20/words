# Deployment Guide

This guide explains how to use the Words Memory Service scripts with a deployed service.

## Local Development

By default, scripts connect to `http://localhost:3000`:

```bash
./get-word.sh
./mark-word.sh serendipity known
```

## Using with Deployed Service

### Option 1: Command Line Argument (Recommended)

Pass the base URL as the first argument:

```bash
# For get-word.sh
./get-word.sh https://your-api-domain.com

# For mark-word.sh
./mark-word.sh serendipity known https://your-api-domain.com
```

### Option 2: Environment Variable

Set `BASE_URL` environment variable:

```bash
# One-time use
BASE_URL=https://your-api-domain.com ./get-word.sh

# Or export for current session
export BASE_URL=https://your-api-domain.com
./get-word.sh
./mark-word.sh serendipity known
```

### Option 3: Configuration File

1. Copy the example config file:
   ```bash
   cp config.sh.example config.sh
   ```

2. Edit `config.sh` and set your BASE_URL:
   ```bash
   BASE_URL="https://your-api-domain.com"
   export BASE_URL
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

## Testing Connection

The script will automatically check if it can connect to the server. If connection fails, you'll see:

```
❌ Cannot connect to server at https://your-api-domain.com
   For local: Make sure server is running with 'npm start'
   For remote: Check the URL and network connection
```

## Tips

1. **Create an alias** for convenience:
   ```bash
   alias words='BASE_URL=https://your-api-domain.com ./get-word.sh'
   ```

2. **Use a wrapper script**:
   ```bash
   #!/bin/bash
   # words-remote.sh
   BASE_URL="https://your-api-domain.com" ./get-word.sh "$@"
   ```

3. **Check your deployment URL** - Make sure your deployed service is accessible and the API endpoints are working:
   ```bash
   curl https://your-api-domain.com/api/words/random
   ```

