# Google Sheets API Setup Guide

This document explains how the Google Sheets API is configured for the Sporjeger application.

## Current Configuration

### API Key Restrictions

The Google API key is configured with **HTTP referrer restrictions** for security:

**Allowed Referrers:**
```
http://localhost:5173/*
http://127.0.0.1:5173/*
https://elzacka.github.io/sporjeger/*
```

This means the API will **only work when called from these URLs** (browser-based calls).

### Google Sheet Details

- **Sheet ID:** `1HOxZklC4NPdyDV7GSaRBWdY_MXCDvVN6Qw5DpnVohmI`
- **Sheet Name:** `Ark 1` (Norwegian for "Sheet 1")
- **Data Range:** `A2:Q` (skips header row, includes columns A through Q)
- **Expected Columns:**
  - A: Kategori
  - B: Navn
  - C: URL
  - D: Beskrivelse
  - E: Kostnad
  - F: Språk
  - G: Krever registrering
  - H: Designkvalitet
  - I: Vanskelighetsgrad
  - J: Veiledning
  - K: Endre eller slette
  - L: Tool Type
  - M: Platform
  - N: Tags (comma-separated)
  - O: Category Path (comma-separated)
  - P: Last Verified
  - Q: Alternatives (comma-separated)

## How Data Loading Works

The application uses a **three-tier fallback system**:

### 1. Static JSON (Fastest - Always Available)
- File: `src/data/tools.json`
- Built at compile time
- **1,174 tools** currently cached
- Loads instantly on page load

### 2. Google Sheets API (Fresh Data - Browser Only)
- Fetches in background after static JSON loads
- Updates UI with latest data if available
- **Only works in browser** (not during build)
- Requires proper referrer (see above)

### 3. Dummy Data (Fallback)
- Used only if both above fail
- Contains 9 sample tools
- For development/testing only

## Why Build Script Fails (This is Normal!)

When you run `npm run build`, you'll see:

```
❌ Error fetching from Google Sheets: HTTP 403: Forbidden
ℹ️  No fresh data from API - using existing tools.json
✨ Build will continue with cached data
```

**This is expected behavior!** The build script runs in Node.js (server-side), which:
- ❌ Has no HTTP referrer (not a browser request)
- ❌ Cannot pass referrer restrictions
- ✅ Falls back to cached `tools.json` gracefully

## How to Update Tool Data

### Option 1: Live App Fetches Automatically (Recommended)
1. Update data in Google Sheets
2. Open live site: https://elzacka.github.io/sporjeger/
3. App fetches fresh data from API in background
4. Users see updated data immediately

### Option 2: Manual Rebuild (When Adding Many Tools)
1. Update Google Sheets with new data
2. You need to manually export and update `tools.json` because build can't access API
3. Methods to update `tools.json`:
   - **Method A:** Open [test-api.html](test-api.html) in browser at localhost:5173, fetch data, copy to tools.json
   - **Method B:** Export CSV from Google Sheets, run conversion script
   - **Method C:** Create browser-based admin tool to fetch and download JSON

### Option 3: Create Server-Side API Key (For CI/CD)
If you want build scripts to fetch fresh data:

1. Create a **separate API key** in Google Cloud Console
2. Set **IP restriction** instead of referrer restriction
3. Add your build server IP (or GitHub Actions IP range)
4. Use this key only in `.env` for build scripts
5. Keep referrer-restricted key for browser use

## Testing API Access

### Test Locally (Browser)
1. Open: http://localhost:5173/test-api.html
2. Click "Test API Call"
3. Should show: `✅ SUCCESS! Tools found: XXX`

### Test Live Site (Browser)
1. Open: https://elzacka.github.io/sporjeger/
2. Open DevTools Console
3. Look for: `✅ Lastet XXX verktøy fra Google Sheets (fresh data)`

### Test Build Script (Node.js - Expected to Fail)
```bash
npm run fetch-tools
```
Expected output:
```
❌ Error fetching from Google Sheets: HTTP 403: Forbidden
ℹ️  No fresh data from API - using existing tools.json
```

## Adding New Allowed URLs

If you deploy to a new domain, update the API key restrictions:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find API key: `AIzaSyCs_Iq905EYrlu4bo4COu6l7CxRDz6Y6vQ`
3. Click to edit
4. Under "Application restrictions" → "HTTP referrers (web sites)"
5. Click "Add an item"
6. Add new URL (e.g., `https://newdomain.com/*`)
7. Click "Save"

**Remember:** Changes take a few minutes to propagate.

## Security Notes

- ✅ API key is safe to commit to `.env.local` (not in git)
- ✅ Referrer restrictions prevent unauthorized use
- ✅ API key only has read access to Google Sheets API
- ⚠️ Don't commit API keys to git (already in .gitignore)
- ⚠️ Don't expose API key in client-side code that's publicly accessible (it's already exposed in network requests, which is fine with referrer restrictions)

## Current Data Status

- **Cached JSON:** 1,174 tools
- **Google Sheet:** Unknown (API not accessible from build script)
- **Live Site:** Will show data from Google Sheets API if accessible, falls back to cached JSON

## Troubleshooting

### "403 Forbidden" in Browser
- Check if current URL is in allowed referrers list
- Wait 2-3 minutes after adding new referrer
- Check browser console for exact error

### "403 Forbidden" in Build Script
- This is normal! Build script can't access API with referrer restrictions
- App will use cached `tools.json`
- Update `tools.json` manually or use browser-based export

### "No data found in sheet"
- Check sheet name is exactly "Ark 1"
- Verify data starts at row 2 (row 1 should be headers)
- Check sheet has data in columns A-Q

### Data Not Updating on Live Site
- Clear browser cache
- Check DevTools console for API errors
- Verify Google Sheets contains updated data
- Check if API key restrictions were recently changed (takes time to propagate)
