# CLAUDE.md - AI Assistant Context

**Last Updated**: 2025-10-19 (Post-Code Review & Refactoring)
**Project**: Sporjeger 2.0 - OSINT Tools Directory PWA (Vue 3 Rebuild)
**Repository**: https://github.com/[username]/sporjeger2
**Status**: Production Ready 🚀 - Code Reviewed & Refactored ✅

---

## 📋 Project Overview

Sporjeger 2.0 is a complete rebuild of the OSINT (Open Source Intelligence) tools directory Progressive Web App. This version migrates from **React 19.2 to Vue 3 + TypeScript** to resolve critical iOS 26.0.1 compatibility issues and leverage modern **WebKit 26.0 CSS features** for optimal performance on Apple devices.

### Key Characteristics
- **Language**: Norwegian UI with English code/comments
- **Target Users**: Digital investigators, researchers, journalists
- **Data Source**: Google Sheets API v4 (read-only)
- **Deployment**: GitHub Pages (or similar)
- **Privacy**: Zero tracking, no analytics, no cookies
- **Migration Reason**: React 19.2 has compatibility issues on iOS 26.0.1; Vue 3 allows direct use of WebKit 26.0 CSS features

---

## 🏗️ Architecture & Tech Stack

### Core Technologies
```
Frontend Framework: Vue 3.5+ (Composition API with <script setup>)
Language:           TypeScript 5.9+ (Strict mode)
Build Tool:         Vite 7.1+
State Management:   Pinia 2.2+
Router:             Vue Router 4.5+
HTTP Client:        Fetch API (native)
PWA:                Vite PWA Plugin (Workbox)
Styling:            Custom CSS + PostCSS
Icons:              Material Symbols
Node.js:            22.20.0 LTS
```

### Why Vue 3 Instead of Flutter Web?
1. **Direct CSS Access**: Can use WebKit 26.0 features (anchor positioning, `text-wrap: pretty`, `contrast-color()`, scroll-driven animations)
2. **Smaller Bundle Size**: ~50-80 kB vs Flutter's 2-3 MB
3. **Better SEO**: Renders to DOM, not Canvas/WebGL
4. **Proven PWA Support**: Excellent Service Worker integration
5. **TypeScript Integration**: First-class TypeScript support
6. **Avoids React 19.2 Issues**: No iOS 26.0.1 compatibility problems

---

## 📁 Project Structure

```
sporjeger2/
├── src/
│   ├── components/              # Vue components
│   │   ├── layout/
│   │   │   ├── AppHeader.vue        # Header with logo, search, menu
│   │   │   ├── AppFooter.vue        # Footer (if needed)
│   │   │   └── MainLayout.vue       # Main app layout wrapper
│   │   ├── tools/
│   │   │   ├── ToolCard.vue         # Individual tool display card
│   │   │   ├── ToolGrid.vue         # Tool grid container
│   │   │   └── ToolDetails.vue      # Tool detail modal/view
│   │   ├── search/
│   │   │   ├── SearchBar.vue        # Terminal-style search input
│   │   │   ├── CommandPalette.vue   # CMD+K quick search modal
│   │   │   └── SearchResults.vue    # Search results display
│   │   ├── filters/
│   │   │   ├── CategoryFilter.vue   # Category filter dropdown
│   │   │   └── FilterModal.vue      # Advanced filters modal
│   │   ├── ui/
│   │   │   ├── MatrixLogo.vue       # Terminal-style logo with cursor
│   │   │   ├── LoadingSpinner.vue   # Loading state indicator
│   │   │   ├── ErrorDisplay.vue     # Error state display
│   │   │   ├── StarRating.vue       # Star rating display (1-5)
│   │   │   ├── BaseModal.vue        # Reusable modal component
│   │   │   └── BaseButton.vue       # Reusable button component
│   │   └── guide/
│   │       ├── GuideModal.vue       # Guide content display
│   │       └── MarkdownRenderer.vue # Markdown content renderer
│   ├── composables/             # Vue composables (like React hooks)
│   │   ├── useOSINTTools.ts         # Tool data fetching and caching
│   │   ├── useToolFilters.ts        # Filter logic
│   │   ├── useSearch.ts             # Search logic
│   │   ├── useKeyboardShortcuts.ts  # Global keyboard navigation
│   │   ├── useFocusTrap.ts          # Modal focus management
│   │   └── useModalEscapeKey.ts     # ESC key handling
│   ├── stores/                  # Pinia state management
│   │   ├── toolsStore.ts            # Tools data and cache
│   │   ├── uiStore.ts               # UI state (modals, menus)
│   │   └── preferencesStore.ts      # User preferences (install prompt)
│   ├── services/                # External service integrations
│   │   └── googleSheetsService.ts   # Google Sheets API client
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts                 # Exported types
│   │   ├── osintTool.ts             # OSINTTool interface and types
│   │   └── api.ts                   # API response types
│   ├── utils/                   # Utility functions
│   │   ├── arrayHelpers.ts          # Array utilities (groupBy, unique)
│   │   ├── formatText.ts            # Text formatting (Markdown)
│   │   ├── performance.ts           # Web Vitals tracking
│   │   └── validateEnv.ts           # Environment validation
│   ├── constants/               # Application constants
│   │   └── index.ts                 # Centralized constants
│   ├── styles/                  # Global styles
│   │   ├── main.css                 # Main stylesheet (Matrix theme)
│   │   ├── variables.css            # CSS custom properties
│   │   ├── animations.css           # Animations (cursor, scanlines)
│   │   └── responsive.css           # Responsive breakpoints
│   ├── App.vue                  # Root application component
│   └── main.ts                  # Application entry point
├── public/
│   ├── sporjeger-logo.svg       # Neural network logo (to be created)
│   ├── favicon.svg              # Simplified hexagon favicon
│   ├── icon-192.png             # PWA icon 192x192
│   ├── icon-512.png             # PWA icon 512x512
│   ├── manifest.json            # PWA manifest
│   └── robots.txt               # SEO robots file
├── .github/
│   └── workflows/
│       └── deploy.yml           # Automated deployment workflow
├── .env.local                   # Local environment variables (not committed)
├── .env.example                 # Example environment variables
├── index.html                   # HTML entry point
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.node.json           # TypeScript config for Node scripts
├── package.json                 # Dependencies and scripts
├── .eslintrc.cjs                # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── spec.md                      # Technical specification (THIS IS THE SOURCE OF TRUTH)
├── CLAUDE.md                    # This file - AI assistant context
├── todo.md                      # Milestone 1 implementation todos
└── README.md                    # User-facing documentation (to be created)
```

---

## 🔑 Key Architecture Decisions

### 1. Vue 3 Composition API with `<script setup>`
**Why**: Modern Vue 3 pattern, better TypeScript support, cleaner code, automatic component registration.

**Example**:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { OSINTTool } from '@/types';

const searchQuery = ref('');
const tools = ref<OSINTTool[]>([]);

const filteredTools = computed(() => {
  return tools.value.filter(tool =>
    tool.navn.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>
```

### 2. Pinia for State Management
**Why**: Official Vue 3 state library, TypeScript-first, DevTools support, simpler than Vuex.

**Example**:
```typescript
// stores/toolsStore.ts
import { defineStore } from 'pinia';
import type { OSINTTool } from '@/types';

export const useToolsStore = defineStore('tools', () => {
  const tools = ref<OSINTTool[]>([]);
  const isLoading = ref(false);

  async function fetchTools() {
    isLoading.value = true;
    // ... fetch logic
  }

  return { tools, isLoading, fetchTools };
});
```

### 3. Composables for Business Logic
**Why**: Reusable logic, separation of concerns, testability.

**Example**:
```typescript
// composables/useToolFilters.ts
export function useToolFilters(tools: Ref<OSINTTool[]>) {
  const selectedCategory = ref<string>('');

  const filteredTools = computed(() => {
    if (!selectedCategory.value) return tools.value;
    return tools.value.filter(t => t.kategori === selectedCategory.value);
  });

  return { selectedCategory, filteredTools };
}
```

### 4. TypeScript Strict Mode with Union Types
**Why**: Compile-time validation, data integrity, better IDE support.

**Example**:
```typescript
// types/osintTool.ts
export type Kostnad = 'Gratis' | 'Betalt' | 'Gratis med kjøp';
export type Vanskelighetsgrad = '1' | '2' | '3' | '4' | '5';

export interface OSINTTool {
  kategori: string;
  navn: string;
  kostnad: Kostnad;  // ✅ Only valid values allowed
  vanskelighetsgrad?: Vanskelighetsgrad;
}
```

---

## 🎨 Design System - Matrix Terminal Theme

### Color Palette
```css
:root {
  /* Background Colors */
  --background: #0a0e0a;
  --bg-primary: #0D0208;
  --bg-secondary: #001400;
  --bg-card: rgba(0, 20, 0, 0.6);

  /* Matrix Green Palette */
  --matrix-bright: #00FF41;       /* Primary (uppercase) */
  --matrix-medium: #00CC33;
  --matrix-dim: #008F11;
  --matrix-green-bright: #39FF14; /* Accent */

  /* Functional Colors */
  --text-primary: var(--matrix-bright);
  --border-color: var(--matrix-dim);
  --focus-color: var(--matrix-green-bright);
}
```

### Typography
- **Font**: JetBrains Mono (terminal aesthetic)
- **Fallbacks**: 'Fira Code', 'IBM Plex Mono', 'Courier New', monospace
- **Preload**: Add to `index.html` for instant rendering

### Layout Principles
- **Sharp Corners**: `border-radius: 0 !important` enforced globally
- **Grid-Based**: CSS Grid for header (3-column) and tool grid
- **Responsive Breakpoints**: 390px (mobile), 768px (tablet), 1400px (desktop)
- **Safe Area Insets**: iOS notch and home indicator support

### Visual Effects
- **Blinking Cursor**: Terminal authenticity in logo (`1s step-end infinite`)
- **Scanline CRT Effect**: Header with `repeating-linear-gradient` (2px intervals)
- **Green Phosphor Glow**: `box-shadow` on interactive elements
- **Backdrop Blur**: Modal backgrounds (`backdrop-filter: blur(10px)`)
- **Scroll Animations**: WebKit 26.0 `animation-timeline: view()`

---

## 📊 Data Model

### Google Sheets Structure (11 columns A-K)

| Column | Header | Type | Required | Example |
|:---|:---|:---|:---|:---|
| A | Kategori | string | Yes | "Social Media" |
| B | Navn | string | Yes | "Twitter Search" |
| C | URL | string | Yes | "https://twitter.com/search" |
| D | Beskrivelse | string | Yes | "Search tweets" |
| E | Kostnad | Kostnad | Yes | "Gratis" |
| F | Språk | string | No | "🇬🇧 Engelsk" |
| G | Krever registrering | RegistreringKrav | No | "Ja" |
| H | Designkvalitet | Designkvalitet | No | "3" |
| I | Vanskelighetsgrad | Vanskelighetsgrad | No | "2" |
| J | Veiledning | string | No | "# Guide..." |
| K | Endre eller slette | string | No | "Nei" |

### TypeScript Types
```typescript
export type Kostnad = 'Gratis' | 'Betalt' | 'Gratis med kjøp';
export type RegistreringKrav = 'Ja' | 'Delvis' | 'Nei';
export type Designkvalitet = '1' | '2' | '3';
export type Vanskelighetsgrad = '1' | '2' | '3' | '4' | '5';
```

---

## 🚀 WebKit 26.0 Features to Implement

### Critical Features (Milestone 2)

1. **Anchor Positioning** (`position-area`, `anchor()`)
   - Use Case: Category filter dropdown, tooltips, menus
   - Benefit: Responsive positioning without JavaScript calculations

2. **Text Wrapping** (`text-wrap: pretty`)
   - Use Case: Tool descriptions, guide content
   - Benefit: Improved readability, even ragged edges

3. **Dynamic Contrast** (`contrast-color()`)
   - Use Case: Text on dynamic backgrounds
   - Benefit: Accessibility, WCAG compliance

4. **Scroll Animations** (`animation-timeline: view()`)
   - Use Case: Tool cards entering viewport
   - Benefit: Modern, smooth feel without JavaScript

5. **SVG Icons** (All visual assets)
   - Use Case: Favicon, Home Screen icons, UI icons
   - Benefit: Infinite scaling, sharp on all devices

### Progressive Enhancement Strategy
- **Modern browsers**: Get full WebKit 26.0 experience
- **Older browsers**: Graceful degradation with fallbacks
- **Feature detection**: Use `@supports` CSS queries

**Example**:
```css
/* Modern: Anchor positioning */
@supports (position-area: top) {
  .dropdown {
    position: absolute;
    position-area: bottom;
    anchor-name: --filter-button;
  }
}

/* Fallback: Traditional positioning */
@supports not (position-area: top) {
  .dropdown {
    position: absolute;
    top: calc(100% + 8px);
  }
}
```

---

## 🎯 Development Workflow

### Local Development
```bash
npm install           # Install dependencies
npm run dev           # Start dev server (http://localhost:5173/)
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run type-check    # TypeScript type checking
npm run format        # Prettier formatting
```

### Code Quality Checks
```bash
# TypeScript validation
npm run type-check

# Linting (ESLint)
npm run lint

# Code formatting (Prettier)
npm run format

# Full validation before commit
npm run type-check && npm run lint && npm run build
```

### Environment Variables
Create `.env.local`:
```env
VITE_GOOGLE_SHEET_ID=your_sheet_id_here
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
```

**Security**: These are validated on app startup by `src/utils/validateEnv.ts`.

---

## ♿ Accessibility Requirements (WCAG 2.1 AA)

### Mandatory Features

| Feature | Implementation | Priority |
|:---|:---|:---|
| **Keyboard Navigation** | Tab order, focus indicators, skip navigation | Critical |
| **Focus Management** | Focus trap in modals, return focus on close | Critical |
| **ARIA Labels** | All interactive elements properly labeled | Critical |
| **Color Contrast** | 4.5:1 minimum (matrix green on dark bg) | Critical |
| **Touch Targets** | 48px minimum for iOS compliance | High |
| **Screen Readers** | Semantic HTML, ARIA attributes, live regions | High |
| **Reduced Motion** | Respect `prefers-reduced-motion` | Medium |

### Keyboard Shortcuts
- **CMD/Ctrl+K**: Open command palette
- **ESC**: Close modals/menus/command palette
- **Enter**: Select tool from command palette
- **Arrow Up/Down**: Navigate command palette results
- **Tab/Shift+Tab**: Navigate interactive elements

---

## 🔧 Milestone 1 Implementation Focus

### Goal
Initialize Vue 3 project, set up routing and state management, implement responsive layout with Matrix terminal theme and dummy data.

### Key Deliverables (see todo.md for detailed tasks)
1. Project initialization (Vite + Vue 3 + TypeScript + Pinia + Vue Router)
2. Matrix terminal theme CSS (colors, typography, animations)
3. Responsive layout (mobile-first, 390px → 1400px)
4. Basic components (Header, ToolCard, ToolGrid)
5. Dummy OSINT tool data
6. TypeScript types and interfaces
7. Development environment validation

### Success Criteria
- ✅ App loads on mobile (390px) and desktop (1400px)
- ✅ Matrix terminal theme applied consistently
- ✅ TypeScript compiles with zero errors
- ✅ ESLint passes with zero warnings
- ✅ Build completes successfully
- ✅ Dummy data displays in tool grid

---

## 🤖 AI Assistant Guidelines

### When Working on This Project

1. **Always Read Before Editing**
   - Use Read tool before Edit/Write
   - Understand existing code context

2. **TypeScript Strict Mode**
   - No `any` types (use `unknown` if necessary)
   - Use union types for validation
   - Prefer `interface` for objects, `type` for unions

3. **Vue 3 Best Practices**
   - Use `<script setup>` syntax
   - Prefer Composition API over Options API
   - Use `defineProps`, `defineEmits` for type-safe props/events
   - Use `computed` for derived state, `ref`/`reactive` for mutable state

4. **Accessibility Priority**
   - WCAG 2.1 AA compliance is non-negotiable
   - Test keyboard navigation
   - Include ARIA labels
   - Maintain 4.5:1 color contrast

5. **Performance Considerations**
   - Lazy load heavy components (`defineAsyncComponent`)
   - Use `computed` for expensive calculations
   - Consider bundle size impact

6. **Matrix Terminal Theme Adherence**
   - Sharp corners only (`border-radius: 0`)
   - JetBrains Mono font exclusively
   - Uppercase hex colors (#00FF41 not #00ff41)
   - Green phosphor glow effects

7. **Privacy-First Design**
   - Never add analytics or tracking
   - No external scripts
   - Local storage only for user preferences

8. **Norwegian UI, English Code**
   - All user-facing text in Norwegian
   - All code, comments, variable names in English

9. **Update Documentation**
   - Keep CLAUDE.md current with changes
   - Update todo.md as tasks progress
   - Document architectural decisions

### Common Vue 3 Patterns

**Component with Props and Emits**:
```vue
<script setup lang="ts">
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

function handleGuideClick() {
  emit('openGuide', props.tool.navn);
}
</script>

<template>
  <div class="tool-card">
    <h3>{{ tool.navn }}</h3>
    <button v-if="showGuide" @click="handleGuideClick">
      Åpne veiledning
    </button>
  </div>
</template>
```

**Composable Pattern**:
```typescript
// composables/useKeyboardShortcuts.ts
import { onMounted, onUnmounted } from 'vue';

export function useKeyboardShortcuts(callbacks: {
  onCmdK?: () => void;
  onEscape?: () => void;
}) {
  function handleKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      callbacks.onCmdK?.();
    }
    if (event.key === 'Escape') {
      callbacks.onEscape?.();
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
}
```

**Store Pattern**:
```typescript
// stores/toolsStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { OSINTTool } from '@/types';

export const useToolsStore = defineStore('tools', () => {
  // State
  const tools = ref<OSINTTool[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const toolCount = computed(() => tools.value.length);
  const categories = computed(() => {
    return [...new Set(tools.value.map(t => t.kategori))];
  });

  // Actions
  async function fetchTools() {
    isLoading.value = true;
    error.value = null;
    try {
      // ... fetch logic
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  return {
    tools,
    isLoading,
    error,
    toolCount,
    categories,
    fetchTools
  };
});
```

---

## 📝 Testing Checklist (Pre-Commit)

Before committing code, verify:

- [ ] TypeScript compiles (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Dev server runs (`npm run dev`)
- [ ] No console errors in browser
- [ ] Keyboard navigation works
- [ ] ARIA labels present on interactive elements
- [ ] Matrix terminal theme consistent (sharp corners, JetBrains Mono, green colors)
- [ ] Responsive layout works (390px, 768px, 1400px)
- [ ] No hardcoded strings (use Norwegian for UI text)

---

## 🔮 Future Considerations (Not Milestone 1)

**Do NOT implement these proactively** - wait for user request:

- Unit tests (Vitest + Vue Test Utils)
- E2E tests (Playwright)
- Internationalization (i18n)
- Dark/light mode toggle
- Component documentation (Storybook/Histoire)
- Virtual scrolling
- Advanced filtering
- User favorites/bookmarks
- Social sharing
- Export functionality

---

## 📚 Useful Resources

### Documentation
- **Vue 3**: https://vuejs.org/
- **TypeScript**: https://www.typescriptlang.org/
- **Vite**: https://vitejs.dev/
- **Pinia**: https://pinia.vuejs.org/
- **Vue Router**: https://router.vuejs.org/
- **WebKit Features**: https://webkit.org/status/
- **Google Sheets API**: https://developers.google.com/sheets/api
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/

### Vue 3 Ecosystem
- **Vue DevTools**: Browser extension for debugging
- **Volar**: VS Code extension for Vue 3 (replaces Vetur)
- **Vue Macros**: Additional compiler macros for DX

---

## 🎓 Educational Notes for User (Product Manager Learning Tech)

### Why Vue 3 Over Other Frameworks?

**Vue 3 Advantages**:
1. **Gentle Learning Curve**: Easier to understand than React or Angular
2. **Reactive System**: Changes automatically update the UI
3. **TypeScript Support**: Catch bugs before they happen
4. **Performance**: Smaller bundle size, faster rendering than React
5. **Composition API**: Organize code by feature, not lifecycle
6. **Great Documentation**: Clear, comprehensive, beginner-friendly

**Composition API vs Options API**:
- **Options API** (Vue 2 style): Organize code by option type (`data`, `methods`, `computed`)
- **Composition API** (Vue 3 style): Organize code by feature/concern (better for large apps)

**Example Comparison**:
```vue
<!-- Options API (old style) -->
<script>
export default {
  data() {
    return { count: 0 };
  },
  methods: {
    increment() { this.count++; }
  }
}
</script>

<!-- Composition API (new style - what we use) -->
<script setup lang="ts">
import { ref } from 'vue';
const count = ref(0);
const increment = () => count.value++;
</script>
```

### Key Concepts to Understand

1. **Reactivity**: Vue automatically tracks dependencies and updates the DOM
2. **Components**: Reusable UI building blocks with their own logic and styles
3. **Props**: Data passed from parent to child component
4. **Emits**: Events sent from child to parent component
5. **Composables**: Reusable logic functions (like React hooks)
6. **Stores**: Global state accessible from any component
7. **TypeScript**: Adds types to JavaScript for better reliability

---

## 📞 Support & Common Issues

### "Import path not found"
- **Cause**: TypeScript path alias not configured
- **Solution**: Check `vite.config.ts` has `@` alias pointing to `src/`

### "Type error in template"
- **Cause**: Vue template type checking
- **Solution**: Ensure Volar extension installed, check prop types

### "Build fails with type errors"
- **Cause**: Strict TypeScript mode
- **Solution**: Run `npm run type-check` to see detailed errors

### "Hot module reload not working"
- **Cause**: Vite dev server issue
- **Solution**: Restart dev server, check for syntax errors

### "iOS Safari not loading app"
- **Cause**: Could be many things
- **Debug**: Check iOS console, verify HTTPS in production, check Service Worker registration

---

## 📝 Recent Updates (Post-Milestone 3)

### Session Date: 2025-10-18

This session focused on comprehensive UI/UX improvements, Google Sheets integration refinements, and documentation updates following the completion of Milestone 3.

#### Material Symbols Icon Integration
**Objective**: Replace text symbols with scalable Material Symbols icons for a more polished look.

**Changes**:
- Replaced `■` (guide button) with Material Symbols `book_2` icon
- Replaced `▶` (play button) with Material Symbols `play_arrow` icon
- Added Google Fonts link in `index.html` for Material Symbols
- Configured font-variation-settings: weight 100 for thin, outlined appearance
- Final icon sizes: book_2 (22px), play_arrow (44px) for visual balance

**Files Modified**:
- `src/components/tools/ToolCard.vue` - Updated template and CSS
- `index.html` - Added Material Symbols font link

#### Modal and Menu Simplification
**Objective**: Reduce visual clutter by removing unnecessary decorative elements.

**Changes**:
- Removed icons from hamburger menu items (ℹ and 🔗)
- Removed header sections from all modals (Om Sporjeger and Guide modals)
- Repositioned close button to top-right corner as absolute positioned element
- Simplified modal structure for cleaner appearance

**Files Modified**:
- `src/components/layout/HamburgerMenu.vue` - Removed `.hamburger-menu__item-icon` elements and CSS
- `src/components/ui/BaseModal.vue` - Removed header section, repositioned close button

#### Alpha-3 Country Codes Implementation
**Objective**: Replace emoji flags with compact, professional Alpha-3 country codes (ISO 3166-1 alpha-3).

**Changes**:
- Changed `languageFlag` computed property to `countryCode`
- Updated template to display codes like NOR, USA, GBR, RUS
- Removed emoji extraction regex
- Updated Google Sheets to use Alpha-3 codes in Språk column
- Added separator dot (•) between Kostnad and Språk values
- Conditional rendering: separator only shown when Språk value exists

**Files Modified**:
- `src/components/tools/ToolCard.vue` - Updated computed property and template

#### Kostnad Type Values Update
**Objective**: Standardize cost values to uppercase for consistency with terminal theme.

**Changes**:
- Updated TypeScript type: `'Gratis' | 'Betalt' | 'Gratis med kjøp'` → `'GRATIS' | 'KOSTNAD' | 'GRATISH'`
- Updated validation in Google Sheets service
- Updated all dummy data tools
- Updated Google Sheets to match new values

**Files Modified**:
- `src/types/osintTool.ts` - Updated `Kostnad` type definition
- `src/services/googleSheetsService.ts` - Updated validation (lines 94-96)
- `src/data/dummyTools.ts` - Updated all tool kostnad values

#### Tool Card Layout Refinements
**Objective**: Ensure consistent footer positioning and improved typography across all tool cards.

**Changes**:
- Moved `.tool-card__meta` section inside `.tool-card__footer` for consistent positioning
- Added flexbox properties to footer: `display: flex`, `flex-direction: column`, `gap: var(--spacing-sm)`
- Leveraged `margin-top: auto` on footer to push it to bottom regardless of description length
- Changed "Vanskelighetsgrad:" to "VANSKELIGHETSGRAD:" (uppercase)
- Reduced font sizes for metadata from `--font-size-sm` to `--font-size-xs`
- Unified font styling across Vanskelighetsgrad, Kostnad, and Språk
- Reduced vertical spacing between metadata rows by 50% (`gap: 0.125rem`)

**Files Modified**:
- `src/components/tools/ToolCard.vue` - Updated template structure and CSS

#### Star Rating Vertical Alignment Fix
**Objective**: Align star rating perfectly with VANSKELIGHETSGRAD label text.

**Problem**: Stars appeared lower than the label text, creating misalignment.

**Attempted Solutions**:
1. `align-items: center` with `line-height: 1` - didn't work
2. `align-items: baseline` with adjusted line-height - didn't work
3. `transform: translateY(-2px)` - ✅ **Final solution that worked**

**Files Modified**:
- `src/components/ui/StarRating.vue` - Added `transform: translateY(-2px)` to `.star-rating`

#### Google Sheets Integration Fixes
**Objective**: Resolve multiple issues preventing real data from loading.

**Issues Identified and Resolved**:

1. **Environment Variable Name Mismatch**
   - Problem: Service expected `VITE_GOOGLE_SHEETS_API_KEY` but `.env.local` had `VITE_GOOGLE_API_KEY`
   - Fix: Updated service and validation to use `VITE_GOOGLE_API_KEY`
   - Files: `src/services/googleSheetsService.ts` (line 11), `src/utils/validateEnv.ts` (line 21)

2. **Wrong Sheet Name (Norwegian UI)**
   - Problem: Code expected "Sheet1" but Norwegian Google Sheets uses "Ark 1"
   - Fix: Changed range from `'Sheet1!A2:K'` to `'Ark 1!A2:K'`
   - File: `src/services/googleSheetsService.ts` (line 28)

3. **Wrong Spreadsheet ID**
   - Problem: Fetching from test sheet instead of production sheet
   - Fix: Updated `.env.local` with correct Sheet ID: `1HOxZklC4NPdyDV7GSaRBWdY_MXCDvVN6Qw5DpnVohmI`
   - File: `.env.local`

4. **API Key HTTP Referrer Restrictions**
   - Problem: Google API key blocked requests from localhost
   - Solution: User configured `http://localhost:5173/*` in Google Cloud Console
   - Note: Restrictions take 1-5 minutes to propagate

**Verification Steps Taken**:
- Confirmed `.gitignore` includes `*.local` pattern for credential security
- Verified `.env.example` exists with empty placeholder values
- Confirmed GitHub Actions uses repository secrets (not environment file)
- Tested API directly with curl to isolate authentication issues

**Files Modified**:
- `src/services/googleSheetsService.ts` - Fixed environment variable name and sheet range
- `src/utils/validateEnv.ts` - Fixed environment variable name
- `.env.local` - Updated with correct Sheet ID and API key

#### Documentation Updates
**Objective**: Keep documentation synchronized with latest changes and improvements.

**README.md Updates**:
- Added "Recent UI/UX Improvements" section listing all changes
- Updated Data Model section with new Kostnad values (GRATIS, KOSTNAD, GRATISH)
- Added note about Alpha-3 country codes in TypeScript interface
- Expanded Google Sheets Configuration section with:
  - HTTP referrer restrictions requirements
  - Sheet name requirements ("Ark 1" for Norwegian UI)
  - Data format requirements (uppercase Kostnad, Alpha-3 codes)
- Updated Build Results section with latest bundle sizes:
  - components CSS: 14.97 kB → 19.40 kB (due to Material Symbols styles)
  - Total gzipped: ~48 kB → ~50 kB
  - Build time: ~405ms → ~425ms

**CLAUDE.md Updates**:
- Updated status header to "All Milestones Complete ✅ - Production Ready 🚀"
- Updated "Last Updated" date to 2025-10-18
- Added comprehensive "Recent Updates" section (this section) documenting all changes
- Added troubleshooting entries for Google Sheets integration issues

**Files Modified**:
- `README.md` - Comprehensive updates across multiple sections
- `CLAUDE.md` - Status update and detailed session documentation

### Code Review Results

**TypeScript Type Check**: ✅ PASSED
```bash
npm run type-check
```
- No type errors found
- Strict mode enforced throughout
- Only 1 file uses `any` type (`IOSInstallPrompt.vue` - justified for iOS detection)

**Production Build**: ✅ PASSED
```bash
npm run build
```
- Build time: 425ms ⚡
- Total gzipped size: ~50 kB
- Code splitting: 4 chunks (vue-vendor, components, HomeView, index)
- CSS splitting enabled
- No build warnings or errors

**Bundle Size Analysis**:
- `components.css`: 19.40 kB (3.07 kB gzipped) - slight increase due to Material Symbols styles
- `vue-vendor.js`: 95.86 kB (37.49 kB gzipped) - Vue core, stable
- Total initial load: ~50 kB gzipped - excellent performance ✅

### Key Technical Patterns Established

1. **Flexbox Footer Positioning**
   ```css
   .tool-card {
     display: flex;
     flex-direction: column;
   }

   .tool-card__footer {
     margin-top: auto; /* Push to bottom */
     display: flex;
     flex-direction: column;
     gap: var(--spacing-sm);
   }
   ```

2. **Material Symbols Integration**
   ```vue
   <span class="material-symbols-outlined">book_2</span>

   .material-symbols-outlined {
     font-size: 22px;
     font-variation-settings:
       'FILL' 0,
       'wght' 100,
       'GRAD' 0,
       'opsz' 22;
   }
   ```

3. **Fine-Tuned CSS Alignment**
   ```css
   .star-rating {
     transform: translateY(-2px); /* Micro-adjustment for pixel-perfect alignment */
   }
   ```

4. **Conditional Rendering with Visual Separators**
   ```vue
   <div class="tool-card__meta-row">
     <span class="tool-card__cost">{{ tool.kostnad }}</span>
     <template v-if="countryCode">
       <span class="tool-card__separator">•</span>
       <span class="tool-card__country">{{ countryCode }}</span>
     </template>
   </div>
   ```

5. **Google Sheets API Integration**
   ```typescript
   const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
   const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
   const range = 'Ark 1!A2:K'; // Norwegian sheet name

   const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
   ```

### Lessons Learned

1. **Vertical Alignment Complexity**: Sometimes `align-items` isn't enough - micro-adjustments with `transform: translateY()` may be necessary for pixel-perfect alignment

2. **Environment Variable Consistency**: Always verify environment variable names match across:
   - `.env.local` or `.env.example`
   - Service files (`googleSheetsService.ts`)
   - Validation utilities (`validateEnv.ts`)
   - GitHub Actions workflow (if using secrets)

3. **Google Sheets API Quirks**:
   - Sheet names are localized (e.g., "Ark 1" in Norwegian, "Sheet1" in English)
   - API key restrictions can take several minutes to propagate
   - Testing with curl is invaluable for isolating authentication vs. code issues

4. **Icon Sizing Iteration**: Getting visual balance right often requires user feedback and multiple iterations - initial guesses rarely hit the target

5. **Documentation is Code**: Keeping README.md and CLAUDE.md synchronized with changes is as important as the code itself for maintainability

### Security Verification Completed

✅ **Credentials Protection**:
- `.env.local` excluded via `.gitignore` (`*.local` pattern)
- `.env.example` contains only placeholders (no real values)
- GitHub Actions uses repository secrets (`VITE_GOOGLE_SHEET_ID`, `VITE_GOOGLE_API_KEY`)
- No hardcoded credentials in source files
- API key has HTTP referrer restrictions enabled

✅ **Build Security**:
- No secrets in bundle (verified build output)
- Environment variables prefixed with `VITE_` (exposed to client, public API key expected)
- Google Sheets set to "Anyone with link can view" (read-only, public data)

### Next Steps for User

The application is now production-ready with all milestones complete. Recommended next steps:

1. **Deploy to Production**:
   - Push code to GitHub repository
   - Add Google Sheets credentials as GitHub Secrets
   - Enable GitHub Pages deployment from GitHub Actions
   - Verify production build works with real data

2. **Optional Enhancements** (not critical):
   - Add unit tests (Vitest + Vue Test Utils)
   - Add E2E tests (Playwright)
   - Implement user favorites/bookmarks (localStorage)
   - Add export functionality (CSV, JSON)
   - Consider internationalization (i18n) if targeting non-Norwegian users

3. **Monitoring and Maintenance**:
   - Monitor Google Sheets API quotas
   - Keep dependencies updated (`npm outdated`, `npm update`)
   - Test on new iOS versions as they release
   - Gather user feedback for future improvements

---

**End of CLAUDE.md**

*This file is maintained for AI assistants (like Claude Code) to understand the project context, architecture, and implementation guidelines. Keep it updated with significant changes.*

---

## 🔗 Quick Links

- **Specification**: [spec.md](spec.md) - Complete technical specification (SOURCE OF TRUTH)
- **Todos**: [todo.md](todo.md) - Milestone implementation checklists
- **Instructions**: [Instructions for Claude Code.md](Instructions%20for%20Claude%20Code.md) - Original project requirements
- **Original App Context**: `/Users/lene/dev/sporjeger web_parent/sporjeger/CLAUDE.md` - Reference only, do not copy code
