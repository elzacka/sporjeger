# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sporjeger is a Norwegian OSINT (Open Source Intelligence) tool directory. It's a React 19.1.1 + TypeScript 5.8.3 single-page application that fetches tool data from Google Sheets and provides filtering, search, and offline PWA capabilities.

**Live site**: https://elzacka.github.io/sporjeger/

## Development Commands

```bash
# Development server (localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

## Key Architecture

### Data Flow

1. **Google Sheets as Database**: The app fetches data from a read-only Google Sheets API
2. **11-Column Structure**: Data is mapped to the `OSINTTool` interface (see `src/types/index.ts`)
3. **Single API Call**: All data is fetched once on load via `useOSINTTools` hook
4. **Client-Side Filtering**: All filtering/search happens in-memory in React

**Column Mapping**:
```
A: Kategori (Category)
B: Navn (Tool name)
C: URL (Tool website)
D: Beskrivelse (Description)
E: Kostnad (Cost: "Gratis"/"Betalt"/"Gratis med kjøp")
F: Språk (Language with flag emoji, e.g., "🇳🇴 Norsk")
G: Krever registrering (Registration required: "Ja"/"Delvis"/"Nei")
H: Designkvalitet (Design quality 1-3: 1=Poor, 2=Medium, 3=Good)
I: Vanskelighetsgrad (Difficulty 1-5)
J: Veiledning (Guide URL)
K: Endre eller slette (Protection flag: "Nei" = protected)
```

### State Management

**No external state library** - uses React hooks:
- `useOSINTTools`: Fetches and caches tool data
- `useTheme`: Manages dark mode (localStorage-backed)
- Local component state for filters and UI

### Filter System

The `CategoryFilter` component contains ALL filters in a collapsible section (default: collapsed):
1. **Category filter**: Multi-select modal
2. **Cost filter**: Multi-select modal (Gratis/Betalt/Gratis med kjøp)
3. **Registration filter**: Multi-select modal (Ja/Delvis/Nei)
4. **Difficulty filter**: 1-5 star buttons (inline)
5. **Design quality filter**: 1-3 quality buttons with color indicators (inline)
   - 🔴 1 = Dårlig grensesnitt (Poor interface)
   - 🟡 2 = Middels grensesnitt (Medium interface)
   - 🟢 3 = God grensesnitt (Good interface)

All filters work together with AND logic in `App.tsx` via `useMemo`.

### Component Architecture

**Main Components**:
- `App.tsx`: Root component, filter state, tool grid rendering, attribution modal
- `CategoryFilter.tsx`: Collapsible filter section (contains all 5 filter types)
- `ToolCard.tsx`: Individual tool display with stars, registration badges, language tags, guide modal
- `CommandPalette.tsx`: CMD+K search interface (fuzzy search)
- `GuideModal.tsx`: Displays Bellingcat guide content in modal
- `AttributionModal.tsx`: Displays credits and data source information
- `FilterModal.tsx`: Generic multi-select modal (reused for category, cost, & registration)
- `Toast.tsx`: Toast notifications

**Custom Hooks**:
- `useOSINTTools.ts`: Google Sheets data fetching with error handling
- `useTheme.ts`: Dark mode toggle with localStorage persistence

**Services**:
- `googleSheets.ts`: Google Sheets API integration (read-only)

### Styling

**Matrix Theme**: All styling in `src/App.css` with CSS custom properties:
```css
--matrix-green: #00ff41
--matrix-green-bright: #00ff65
--matrix-green-dark: #00cc33
```

**Key UI Patterns**:
- SVG stars (not emoji) for difficulty ratings - allows CSS color control
- Flag emoji extracted using `.split(' ')[0]` from "🇳🇴 Norsk" format
- Collapsible filter section (mobile-first)
- Modal system for multi-select filters
- Command palette with keyboard shortcuts

## Important Constraints

### Google Sheet Access

**CRITICAL**: The production Google Sheet is manually managed. Never write/edit/sync data to the sheet programmatically unless explicitly instructed. The app only reads data via the Google Sheets API (v4).

Environment variables required:
```
VITE_GOOGLE_SHEET_ID=<sheet_id>
VITE_GOOGLE_SHEETS_API_KEY=<api_key>
```

These must be set in:
- `.env.local` for local development
- GitHub repository secrets for deployment

### Deployment

**GitHub Pages**: Automatic deployment via `.github/workflows/deploy.yml`
- Builds on push to `main`
- Base path is `/sporjeger/` (set in `vite.config.ts`)
- Secrets: `VITE_GOOGLE_SHEETS_API_KEY`, `VITE_GOOGLE_SHEET_ID`

### Performance Considerations

- Tool list is memoized with `useMemo`
- `ToolCard` uses `React.memo` to prevent unnecessary re-renders
- Categories are memoized from tool list
- Vite code splitting: React/React-DOM in separate chunk
- Service worker for offline PWA support (production only)

## Code Patterns

### Filter Logic

Filters are applied in sequence (ALL must pass):
```typescript
const filteredTools = useMemo(() => tools.filter(tool => {
  // 1. Category filter (if any selected)
  if (filters.categories.length > 0 && !filters.categories.includes(tool.kategori)) {
    return false;
  }

  // 2. Cost type filter (if any selected)
  if (filters.costTypes.length > 0) {
    // Determine cost type from tool.kostnad string
    // Must match one of selected types
  }

  // 3. Difficulty filter (if any selected)
  if (filters.difficulties.length > 0) {
    const difficulty = parseInt(tool.vanskelighetsgrad || '0');
    if (!filters.difficulties.includes(difficulty)) {
      return false;
    }
  }

  // 4. Design quality filter (if any selected)
  if (filters.designQualities.length > 0) {
    const designQuality = parseInt(tool.designkvalitet || '0');
    if (!filters.designQualities.includes(designQuality)) {
      return false;
    }
  }

  // 5. Registration requirement filter (if any selected)
  if (filters.registrationRequirements.length > 0) {
    const requirement = tool.kreverRegistrering || 'Nei';
    if (!filters.registrationRequirements.includes(requirement)) {
      return false;
    }
  }

  // 6. Search query (if provided)
  if (filters.searchQuery) {
    // Search across navn, beskrivelse, kategori, språk, veiledning
  }

  return true;
}), [tools, filters]);
```

### Cost Type Detection

Cost types are determined from the `kostnad` string:
- "Gratis" or "Free" (but NOT "Gratis med kjøp") → `gratis`
- "Gratis med kjøp" → `gratis_med_kjop`
- Everything else → `betalt`

### Language Tag Display

Extract flag emoji from "🇳🇴 Norsk" format:
```typescript
tool.språk.split(' ')[0]  // Returns just "🇳🇴"
```

### Difficulty Stars

Use SVG stars (NOT emoji ⭐) for CSS color control:
```typescript
{[...Array(5)].map((_, i) => (
  <svg className={`star ${i < level ? 'filled' : 'empty'}`}>
    <path d="M8 1.5l1.545 4.757h5.005..." fill="currentColor"/>
  </svg>
))}
```

## Testing Notes

No automated tests currently. Test manually:
1. Verify filters work independently and together
2. Test CMD+K search functionality
3. Check mobile responsive layout
4. Verify difficulty stars render correctly
5. Test offline PWA mode

## Browser Support

Modern browsers only (ES2020+):
- Chrome/Edge 90+
- Firefox 88+
- Safari 14.1+

Uses native ESM, optional chaining, nullish coalescing.
