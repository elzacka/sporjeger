# Bellingcat OSINT Tools Sync

This document explains how the automated sync system keeps your Google Sheet updated with the latest tools from Bellingcat's OSINT Toolkit.

## Overview

The sync system automatically:
1. Downloads the latest `all-tools.csv` from [Bellingcat's toolkit repository](https://github.com/bellingcat/toolkit)
2. Compares tools with your existing Google Sheet
3. Adds new tools and updates changed tools
4. Optionally translates descriptions to Norwegian

## How It Works

### Automated Weekly Sync

The sync runs automatically **every Monday at 2 AM UTC** via GitHub Actions.

### Manual Sync

You can trigger a manual sync anytime:

1. Go to the [Actions tab](https://github.com/elzacka/sporjeger/actions) in your GitHub repository
2. Select "Sync Bellingcat OSINT Tools" from the workflows list
3. Click "Run workflow" → "Run workflow"

### Local Sync

To run the sync locally:

```bash
# Install dependencies if not already installed
npm install

# Set required environment variables
export VITE_GOOGLE_SHEET_ID="your-sheet-id"
export GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# Optional: Enable Claude translation
export TRANSLATE_DESCRIPTIONS="true"
export ANTHROPIC_API_KEY="your-anthropic-api-key"

# Run the sync
npm run sync-bellingcat
```

## Setup Instructions

### 1. Create a Google Service Account

The sync script needs write access to your Google Sheet:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **Service Account**
6. Name it (e.g., "Sporjeger Sync Bot")
7. Click **Create and Continue** → **Done**
8. Click on the created service account
9. Go to **Keys** tab → **Add Key** → **Create New Key** → **JSON**
10. Download the JSON key file

### 2. Share Google Sheet with Service Account

1. Open your Google Sheet
2. Click **Share**
3. Add the service account email (from the JSON key, looks like `name@project.iam.gserviceaccount.com`)
4. Give it **Editor** permissions
5. Click **Send**

### 3. Add GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** for each:

**Required:**
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Entire content of the JSON key file
- `VITE_GOOGLE_SHEET_ID`: Your Google Sheet ID (from the URL)

**Optional (for Claude translation):**
- `ANTHROPIC_API_KEY`: Your Anthropic API key

### 4. Enable Claude Translation (Optional)

To translate descriptions from English to Norwegian using Claude AI:

1. Get an [Anthropic API key](https://console.anthropic.com/)
2. Add it as `ANTHROPIC_API_KEY` secret in GitHub repository settings
3. Edit `.github/workflows/sync-bellingcat.yml`:
   ```yaml
   TRANSLATE_DESCRIPTIONS: 'true' # Change to 'true'
   ```

**Advantages of Claude translation:**
- **Context-aware**: Understands OSINT terminology
- **High quality**: Natural Norwegian translations tailored for security researchers
- **Customizable**: Follows specific instructions for technical terms
- **Efficient**: Batch processing (20 descriptions per API call) reduces costs

**Model Options (October 2025):**

| Model | Quality | Cost per Sync* | Best For | API Name |
|-------|---------|---------------|----------|----------|
| **Haiku 3.5** (Default) | Excellent | ~$0.01 | Cost optimization, fast | `claude-3-5-haiku-20241022` |
| **Sonnet 4.5** | Superior | ~$0.05 | Maximum quality, nuance | `claude-sonnet-4-5-20250929` |

*Estimated cost for ~1000 tools using batch processing

**To use Sonnet 4.5** instead of Haiku, add this to the workflow:
```yaml
CLAUDE_MODEL: 'claude-sonnet-4-5-20250929'
```

**Important Notes:**
- Claude Max subscription does NOT include API access (separate billing)
- Use your API key for automation, not your Max subscription
- For best cost optimization, consider using Anthropic's Batch API (50% discount) for future implementations

## What Gets Synced

The script syncs the following fields from Bellingcat's CSV:

| Bellingcat CSV | Google Sheet Column | Notes |
|----------------|---------------------|-------|
| Category | Kategori | Direct mapping |
| Name | Navn | Used as unique identifier |
| URL | URL | Checked for updates |
| Description | Beskrivelse | Translated if enabled |
| Cost | Kostnad | Mapped to Norwegian (Free→Gratis, etc.) |
| Details | Detaljer | Link to Bellingcat docs |
| - | Språk | Left empty (international tools) |

## Sync Logic

- **New tools**: Automatically added to the sheet
- **Existing tools**: Updated if URL or Description changed
- **Removed tools**: Not deleted (manual review recommended)
- **Norwegian tools**: Preserved (not in Bellingcat CSV)

## Cost Mapping

The script automatically maps cost types:

| Bellingcat | Sporjeger |
|------------|-----------|
| Free | Gratis |
| Partially Free | Gratis med kjøp |
| Paid | Betalt |

## Troubleshooting

### Sync fails with "403 Forbidden"

- Check that the service account has Editor access to the sheet
- Verify the service account key is correctly added as a secret

### Sync fails with "404 Not Found"

- Check that `VITE_GOOGLE_SHEET_ID` is correct
- Ensure the sheet exists and is accessible

### Translation not working

- Verify `ANTHROPIC_API_KEY` is set correctly
- Check that your API key has sufficient credits
- Review the logs for specific error messages

### No new tools added

This is normal if your sheet is already up to date! The script only adds/updates tools when changes are detected.

## Monitoring

Check sync status:
1. Go to [Actions tab](https://github.com/elzacka/sporjeger/actions)
2. Click on "Sync Bellingcat OSINT Tools"
3. View recent runs and logs

## Customization

### Change Sync Frequency

Edit `.github/workflows/sync-bellingcat.yml`:

```yaml
schedule:
  - cron: '0 2 * * 1'  # Every Monday at 2 AM UTC
  # Examples:
  # - cron: '0 0 * * *'   # Daily at midnight
  # - cron: '0 0 * * 0'   # Every Sunday
  # - cron: '0 0 1 * *'   # First day of month
```

### Disable Automatic Sync

Remove or comment out the `schedule` section in the workflow file.

### Add Custom Filtering

Edit `scripts/sync-bellingcat.js` to filter tools:

```javascript
// Example: Only sync "Archiving" category
const tools = await fetchBellingcatTools();
const filtered = tools.filter(t => t.Category === 'Archiving');
await syncToGoogleSheet(filtered, translateDescriptions);
```

## Data Source

Bellingcat updates their CSV file nightly from their [OSINT Toolkit](https://github.com/bellingcat/toolkit).

- **Source**: https://github.com/bellingcat/toolkit/releases/tag/csv
- **File**: `all-tools.csv`
- **Update Frequency**: Nightly
- **License**: Check [Bellingcat's repository](https://github.com/bellingcat/toolkit) for licensing information

## Support

If you encounter issues:
1. Check the [Actions logs](https://github.com/elzacka/sporjeger/actions) for error details
2. Review this documentation
3. Open an issue in the repository
