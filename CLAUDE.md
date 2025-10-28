# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Project**: Sporjeger 2.0 - OSINT Tools Directory PWA
**Status**: Production Ready
**Last Updated**: 2025-10-28

---

## Project Overview

Sporjeger 2.0 is a Norwegian OSINT (Open Source Intelligence) tools directory with 1174+ tools. It's a Vue 3 + TypeScript PWA that fetches data from Google Sheets API and provides advanced search/filtering with a Matrix terminal theme.

**Key Characteristics**:
- Norwegian UI with English code/comments
- Vue 3.5 Composition API with `<script setup>` + TypeScript strict mode
- Data source: Google Sheets API v4 → static JSON at build time
- Privacy-first: Zero tracking, no analytics, no cookies
- Target: 390px (mobile) to 1400px+ (desktop)

---

## Development Commands

```bash
# Development
npm run dev              # Start dev server (port 5173)
npm run type-check       # TypeScript validation (strict mode)
npm run lint             # ESLint with auto-fix
npm run format           # Prettier formatting

# Building
npm run fetch-tools      # Fetch tools from Google Sheets → src/data/tools.json
npm run build            # Type check + fetch-tools + build for production
npm run preview          # Preview production build locally

# Utilities
npm run generate-icons   # Generate PWA icons from source
```

**Pre-commit validation**: Always run `npm run type-check && npm run lint && npm run build` before committing.

**Environment Variables** (`.env.local`):
```env
VITE_GOOGLE_SHEET_ID=your_sheet_id_here
VITE_GOOGLE_API_KEY=your_api_key_here
```

---

## Architecture Patterns

### 1. Data Loading Strategy (3-Tier Fallback)

The app uses a prioritized data loading strategy implemented in [src/stores/toolsStore.ts](src/stores/toolsStore.ts):

1. **Static JSON** (instant load): `src/data/tools.json` - pre-fetched at build time
2. **Google Sheets API** (fresh data): Background fetch if credentials exist
3. **Dummy data** (dev fallback): `src/data/dummyTools.ts` when API unavailable

**Build-time data fetching**: The `npm run build` script calls `scripts/fetch-tools.js` which fetches from Google Sheets and saves to `src/data/tools.json`. This ensures fast initial page load with pre-cached data, while still allowing runtime API updates.

### 2. State Management (Pinia)

Two main stores:

- **[toolsStore.ts](src/stores/toolsStore.ts)**: Tool data, loading states, category tree (hierarchical)
- **[uiStore.ts](src/stores/uiStore.ts)**: UI state (modals, menus, install prompts)

**Pattern**: Setup stores with `defineStore` using Composition API syntax:
```typescript
export const useToolsStore = defineStore('tools', () => {
  const state = ref(initialValue);
  const getter = computed(() => derivedValue);
  function action() { /* mutation */ }
  return { state, getter, action };
});
```

### 3. Composables (Business Logic)

Reusable logic extracted into composables in [src/composables/](src/composables/):

- **[useToolFilters.ts](src/composables/useToolFilters.ts)**: Search with operators (`category:`, `tag:`, `platform:`, `type:`), fuzzy matching, multi-select categories
- **[useKeyboardShortcuts.ts](src/composables/useKeyboardShortcuts.ts)**: Global keyboard shortcuts (Cmd+K, Esc, ?)
- **[useFocusTrap.ts](src/composables/useFocusTrap.ts)**: Modal focus management for accessibility
- **[useExport.ts](src/composables/useExport.ts)**: Export tools to JSON/CSV/Markdown

**Pattern**: Composables accept reactive refs as parameters and return reactive state:
```typescript
export function useToolFilters(tools: Ref<OSINTTool[]>) {
  const searchQuery = ref('');
  const filteredTools = computed(() => /* filter logic */);
  return { searchQuery, filteredTools };
}
```

### 4. TypeScript Strict Mode with Union Types

All types defined in [src/types/](src/types/) with strict union types for validation:

```typescript
export type Kostnad = 'GRATIS' | 'KOSTNAD' | 'GRATISH';
export type Vanskelighetsgrad = '1' | '2' | '3' | '4' | '5';

export interface OSINTTool {
  kategori: string;
  navn: string;
  url: string;
  beskrivelse: string;
  kostnad: Kostnad; // ✅ Compile-time validation
  vanskelighetsgrad?: Vanskelighetsgrad;
  // ... optional fields
}
```

**Note**: `tsconfig.app.json` has `strict: true` with additional flags (`noUncheckedIndexedAccess`, `noUnusedLocals`, etc.). The codebase should have **zero** type errors.

### 5. Google Sheets Integration

**Schema** (columns A-Q in "Ark 1" sheet - Norwegian name):
- A-E: Required (Kategori, Navn, URL, Beskrivelse, Kostnad)
- F-K: Optional metadata (Språk, Krever registrering, Designkvalitet, Vanskelighetsgrad, Veiledning, Endre/slette)
- L-Q: Enhanced fields (Tool Type, Platform, Tags CSV, Category Path CSV, Last Verified, Alternatives CSV)

**Implementation**: [src/services/googleSheetsService.ts](src/services/googleSheetsService.ts)
- Uses Fetch API with AbortController for timeout
- Validates all union types during transformation
- Parses comma-separated fields (tags, categoryPath, alternatives)
- Graceful error handling with Norwegian error messages

### 6. Performance Optimizations

**Bundle splitting** ([vite.config.ts](vite.config.ts)):
- `vue-vendor` chunk: Vue + Pinia (~95 kB → 37 kB gzipped)
- `components` chunk: All Vue components
- Lazy-loaded routes with `defineAsyncComponent`

**Filtering optimization** ([useToolFilters.ts](src/composables/useToolFilters.ts:88-91)):
- Shows **zero tools** by default when no filters active (performance for 1200+ tools)
- Only renders filtered results when user searches or selects categories
- Fuzzy matching with scoring (exact > contains > fuzzy)

**Service Worker** ([src/main.ts](src/main.ts:19-43)):
- Registered in production only
- Auto-update check every hour
- Unregistered in development to avoid caching issues

---

## Code Patterns & Conventions

### Vue 3 Component Structure

Always use `<script setup>` syntax with TypeScript:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { OSINTTool } from '@/types';

interface Props {
  tool: OSINTTool;
  showGuide?: boolean;
}

interface Emits {
  (e: 'openGuide', toolId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  showGuide: true
});

const emit = defineEmits<Emits>();

const localState = ref('');
const derivedValue = computed(() => props.tool.navn.toUpperCase());

function handleClick() {
  emit('openGuide', props.tool.navn);
}
</script>

<template>
  <div class="tool-card">
    <h3>{{ derivedValue }}</h3>
    <button v-if="showGuide" @click="handleClick">
      Åpne veiledning
    </button>
  </div>
</template>

<style scoped>
.tool-card {
  /* Component-specific styles */
}
</style>
```

### TypeScript Guidelines

- **No `any` types**: Use `unknown` if type truly unknown, or create proper interface
- **Prefer `interface` for objects**, `type` for unions/primitives
- **Optional chaining**: Use `tool.vanskelighetsgrad?.toString()` for optional fields
- **Type guards**: Check union types with `if (kostnad === 'GRATIS')` for narrowing

### Accessibility Requirements (WCAG 2.1 AA)

- **Keyboard navigation**: All interactive elements reachable via Tab, shortcuts via composables
- **Focus management**: `useFocusTrap` for modals, return focus on close
- **ARIA labels**: Required on all buttons/links without visible text
- **Color contrast**: 4.5:1 minimum (Matrix green #00FF41 on dark backgrounds)
- **Touch targets**: 48x48px minimum for mobile
- **Reduced motion**: Respect `prefers-reduced-motion` media query

### Matrix Terminal Theme

**Design system**:
- Colors: Matrix green (#00FF41) on dark (#0a0e0a), see [src/styles/variables.css](src/styles/variables.css)
- Typography: JetBrains Mono monospace (preloaded in [index.html](index.html))
- Layout: Sharp corners only (`border-radius: 0` enforced globally)
- Effects: Blinking cursor animation, scanline CRT effect, green phosphor glow

**Material Symbols**: Icons loaded from Google Fonts with `font-variation-settings: 'wght' 100` for thin outlined style.

---

## Important Patterns to Follow

### When adding new features:

1. **Data model changes**: Update TypeScript types in `src/types/osintTool.ts` first
2. **Google Sheets integration**: Update column range in `googleSheetsService.ts` and `fetch-tools.js`
3. **Search operators**: Add new operators in `useToolFilters.ts` `parseSearchOperators()`
4. **New modals**: Use `BaseModal.vue` component with `useFocusTrap` composable
5. **Global shortcuts**: Add to `useKeyboardShortcuts.ts` and update `KeyboardShortcutsModal.vue`

### When debugging data issues:

1. Check `src/data/tools.json` - this is what gets bundled
2. Run `npm run fetch-tools` manually to refresh from Google Sheets
3. Check browser console for validation warnings from `googleSheetsService.ts`
4. Verify sheet name is "Ark 1" (Norwegian) not "Sheet1" (English)

### When refactoring:

- Maintain the 3-tier data loading strategy (static → API → dummy)
- Keep composables pure (no direct store mutations)
- Preserve TypeScript strict mode compliance
- Test keyboard navigation and screen reader compatibility

---

## Deployment

**GitHub Actions** ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)):
- Triggers on push to `main` branch
- Fetches fresh data from Google Sheets using repository secrets
- Runs type check before build
- Deploys to GitHub Pages

**Required GitHub Secrets**:
- `VITE_GOOGLE_SHEET_ID`
- `VITE_GOOGLE_API_KEY`

**Base path**: Production uses `/sporjeger/` base path (configured in [vite.config.ts](vite.config.ts:7))

---

## Common Tasks

**Add a new tool manually**:
1. Add to Google Sheets (preferred) or `src/data/dummyTools.ts` (dev only)
2. Run `npm run fetch-tools` to update static JSON
3. Verify in dev server

**Add a new category filter**:
1. Data automatically creates categories from `tool.kategori` field
2. Hierarchical categories use `tool.categoryPath` array
3. Category tree computed in `toolsStore.categoryTree` getter

**Add a new search operator**:
1. Update `parseSearchOperators()` in [useToolFilters.ts](src/composables/useToolFilters.ts:12-46)
2. Add filtering logic in `filteredTools` computed property
3. Document in help modal

**Change theme colors**:
1. Update CSS custom properties in [src/styles/variables.css](src/styles/variables.css)
2. Verify contrast ratios meet WCAG 2.1 AA (4.5:1 minimum)

---

## Do Not Proactively Add

- Unit tests (unless explicitly requested)
- E2E tests (unless explicitly requested)
- Dark/light mode toggle (Matrix theme is fixed)
- Internationalization (Norwegian UI only)
- Analytics or tracking (privacy-first design)
- New dependencies without justification

---

## References

- **Vue 3 Docs**: https://vuejs.org/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Pinia Docs**: https://pinia.vuejs.org/
- **Vite Config**: https://vitejs.dev/config/
- **Google Sheets API v4**: https://developers.google.com/sheets/api/reference/rest
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/

For more detailed documentation, see [README.md](README.md).
