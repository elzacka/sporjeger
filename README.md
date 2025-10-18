# Sporjeger 2.0

🔍 A Norwegian Progressive Web App for browsing and discovering OSINT (Open Source Intelligence) tools and resources.

**Version**: 2.0 (Vue 3 Rebuild)
**Status**: Milestone 3 Complete ✅ - Production Ready 🚀

---

## About

Sporjeger (Norwegian for "Tracker") is a curated directory of OSINT tools designed for digital investigators, researchers, and journalists. This is a complete rebuild using **Vue 3 + TypeScript** to address iOS 26.0.1 compatibility issues and leverage modern WebKit 26.0 features.

### Why Vue 3?

The original version (1.0) used React 19.2 but encountered critical compatibility issues on iOS 26.0.1. Version 2.0 migrates to **Vue 3** for:

- **Direct WebKit 26.0 CSS access** - Use anchor positioning, `text-wrap: pretty`, `contrast-color()`, and scroll-driven animations
- **Smaller bundle size** - ~100 kB vs 2-3 MB for Flutter Web alternatives
- **Better iOS compatibility** - Avoids React 19.2 iOS issues
- **Excellent PWA support** - Native Service Worker integration
- **Great TypeScript support** - First-class type safety

---

## Tech Stack

### Core Technologies
- **Vue 3.5+** - Progressive JavaScript framework with Composition API
- **TypeScript 5.9+** - Type safety and compile-time validation
- **Vite 7.1+** - Lightning-fast build tool and dev server
- **Pinia 2.2+** - Official Vue 3 state management
- **Vue Router 4.5+** - Official Vue 3 routing solution

### Styling
- **Custom CSS** - Matrix terminal theme with JetBrains Mono font
- **CSS Variables** - Centralized design tokens
- **WebKit 26.0 Features** - Modern CSS features for iOS Safari

---

## Features

### ✅ Milestone 1 (Complete)
- ✅ **Matrix Terminal Theme** - Authentic terminal interface with green phosphor glow
- ✅ **Responsive Layout** - Mobile-first design (390px, 768px, 1400px breakpoints)
- ✅ **Tool Grid Display** - Clean card-based layout with dummy data
- ✅ **Type-Safe Data Model** - Strict TypeScript types with union type validation
- ✅ **State Management** - Pinia stores for tools and UI state
- ✅ **Accessibility** - WCAG 2.1 AA compliance foundations

### ✅ Milestone 2 (Complete)
- ✅ **WebKit 26.0 CSS Features** - Anchor positioning, scroll animations, text-wrap: pretty
- ✅ **Quick Search (CMD+K)** - Command palette with keyboard navigation
- ✅ **Category Filtering** - Real-time filtering by tool category
- ✅ **Keyboard Shortcuts** - Full keyboard navigation support (arrows, ESC, Enter)
- ✅ **Focus Management** - Focus trap for modals, accessibility enhancements
- ✅ **Composables** - Reusable logic for shortcuts, filters, and focus

### ✅ Milestone 3 (Complete)
- ✅ **Google Sheets Integration** - Live data from Google Sheets API v4 with Norwegian sheet support ("Ark 1")
- ✅ **Guide Modal System** - Markdown-formatted tool guides with close-on-backdrop functionality
- ✅ **Material Symbols Icons** - Lightweight, scalable icons for guide/play buttons
- ✅ **PWA Features** - Service Worker, offline support, installable
- ✅ **iOS Install Prompt** - Smart installation guide for iOS 26 users
- ✅ **Performance Optimization** - Code splitting, lazy loading, CSS splitting
- ✅ **Production Deployment** - GitHub Actions workflow for automated deployment

### ✅ Recent UI/UX Improvements
- ✅ **Tool Card Layout** - Consistent footer positioning with auto-spacing
- ✅ **Typography** - Uppercase labels, reduced font sizes for metadata
- ✅ **Alpha-3 Country Codes** - Compact language display (NOR, USA, GBR, etc.)
- ✅ **Updated Cost Values** - GRATIS, KOSTNAD, GRATISH in uppercase
- ✅ **Icon Improvements** - Material Symbols (book_2, play_arrow) with weight 100
- ✅ **Vertical Alignment** - Star rating aligned with VANSKELIGHETSGRAD label
- ✅ **Reduced Spacing** - Tighter metadata rows for cleaner appearance

---

## Getting Started

### Prerequisites
- **Node.js** 22.20.0 or higher (LTS recommended)
- **npm** 10+ or yarn 4+

### Installation

1. **Clone the repository** (or navigate to the project directory):
```bash
cd /Users/lene/dev/sporjeger\ web_parent/sporjeger2
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file** (for future Google Sheets integration):
```bash
cp .env.example .env.local
```

4. **Start the development server**:
```bash
npm run dev
```

The application will be available at [http://localhost:5173/](http://localhost:5173/)

---

## Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality
npm run format       # Run Prettier for code formatting
npm run type-check   # TypeScript type checking only
```

---

## Project Structure

```
sporjeger2/
├── src/
│   ├── components/          # Vue components
│   │   ├── layout/              # AppHeader, HamburgerMenu, MainLayout
│   │   ├── tools/               # ToolCard, ToolGrid
│   │   ├── search/              # SearchBar, CommandPalette
│   │   ├── filters/             # CategoryFilter
│   │   ├── ui/                  # MatrixLogo, LoadingSpinner, StarRating, BaseModal
│   │   └── pwa/                 # IOSInstallPrompt
│   ├── composables/         # Vue composables
│   │   ├── useKeyboardShortcuts.ts  # Global keyboard shortcuts
│   │   ├── useFocusTrap.ts          # Modal focus management
│   │   └── useToolFilters.ts        # Search and filter logic
│   ├── stores/              # Pinia state management
│   │   ├── toolsStore.ts        # Tools data and Google Sheets integration
│   │   └── uiStore.ts           # UI state (modals, menus)
│   ├── services/            # External service integrations
│   │   └── googleSheetsService.ts   # Google Sheets API v4 client
│   ├── types/               # TypeScript type definitions
│   │   ├── osintTool.ts         # OSINTTool interface and types
│   │   ├── api.ts               # API response types
│   │   └── index.ts             # Exported types
│   ├── utils/               # Utility functions
│   │   └── validateEnv.ts       # Environment variable validation
│   ├── constants/           # Application constants
│   ├── styles/              # Global styles
│   │   ├── main.css             # Main stylesheet
│   │   ├── variables.css        # CSS custom properties
│   │   ├── animations.css       # Animations (cursor, scanlines)
│   │   └── responsive.css       # Responsive breakpoints
│   ├── data/                # Dummy data (replaced in Milestone 3)
│   ├── views/               # Vue views/pages
│   ├── router/              # Vue Router configuration
│   ├── App.vue              # Root application component
│   └── main.ts              # Application entry point
├── public/                  # Static assets
│   └── favicon.svg              # Hexagon favicon with "S"
├── spec.md                  # Technical specification (SOURCE OF TRUTH)
├── CLAUDE.md                # AI assistant context and guidelines
├── todo.md                  # Milestone 1 implementation checklist
└── README.md                # This file
```

---

## Design System - Matrix Terminal Theme

### Color Palette
```css
--background: #0a0e0a;           /* Dark background */
--matrix-bright: #00FF41;         /* Primary matrix green */
--matrix-medium: #00CC33;         /* Medium green */
--matrix-dim: #008F11;            /* Dimmed green */
--matrix-green-bright: #39FF14;   /* Bright accent green */
```

### Typography
- **Font**: JetBrains Mono (monospace terminal font)
- **Fallbacks**: Fira Code, IBM Plex Mono, Courier New, monospace
- **Loaded from**: Google Fonts (preloaded in `index.html`)

### Key Design Principles
- **Sharp Corners**: No border-radius (enforced globally)
- **Terminal Aesthetic**: Blinking cursor, scanline CRT effects
- **Green Phosphor Glow**: Interactive elements have green box-shadow on hover
- **Mobile-First**: Responsive design starting at 390px (iPhone 14 Pro)

---

## Data Model

### TypeScript Types
```typescript
// Strict union types for compile-time validation
export type Kostnad = 'GRATIS' | 'KOSTNAD' | 'GRATISH';
export type RegistreringKrav = 'Ja' | 'Delvis' | 'Nei';
export type Vanskelighetsgrad = '1' | '2' | '3' | '4' | '5';

export interface OSINTTool {
  kategori: string;
  navn: string;
  url: string;
  beskrivelse: string;
  kostnad: Kostnad;
  språk?: string; // Alpha-3 country codes (NOR, USA, GBR, etc.)
  kreverRegistrering?: RegistreringKrav;
  vanskelighetsgrad?: Vanskelighetsgrad;
  veiledning?: string;
  enderEllerSlette?: string;
}
```

**Current**: Using dummy data (9 sample tools in [src/data/dummyTools.ts](src/data/dummyTools.ts))
**Milestone 3**: Will integrate with Google Sheets API v4

---

## Development

### TypeScript Configuration
- **Strict Mode**: Enabled for maximum type safety
- **Path Aliases**: `@/` maps to `src/`
- **Additional Checks**: `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`

### Code Quality
- **ESLint**: Configured for Vue 3 + TypeScript
- **Prettier**: Consistent code formatting
- **No `any` Types**: Enforced via ESLint rule

### Browser Support
- **Target**: ES2019 (for iOS Safari compatibility)
- **Primary Focus**: iOS Safari 26.0.1 (critical requirement)
- **Secondary**: Chrome 120+, Firefox 120+, Edge 120+

---

## Milestones

### ✅ Milestone 1: Core Setup and Mobile UI (COMPLETE)
- Project initialization with Vite + Vue 3 + TypeScript
- State management (Pinia) and routing (Vue Router)
- Matrix terminal theme CSS
- Responsive layout with dummy data
- Basic components (ToolCard, ToolGrid, Header, Logo)

### ✅ Milestone 2: WebKit Optimization and Interactivity (COMPLETE)
- WebKit 26.0 CSS features (anchor positioning, scroll animations, text-wrap: pretty)
- Search and filtering functionality with real-time updates
- Command palette (CMD+K) with keyboard navigation
- Keyboard shortcuts system (composable pattern)
- Accessibility enhancements (focus trap, ARIA labels)

### ✅ Milestone 3: Backend Integration and Full Feature Set (COMPLETE)
- Google Sheets API v4 integration with graceful fallback
- Service Worker with smart caching strategies
- PWA features (manifest, offline support, installable)
- iOS install prompt with localStorage dismissal
- Performance optimizations (code splitting, lazy loading, CSS splitting)
- Production deployment (GitHub Actions workflow)

---

## Build Results

**Latest Production Build (Post-Milestone 3 with UI Improvements)**:
```
dist/index.html                       1.58 kB │ gzip:  0.66 kB
dist/assets/HomeView-*.css            2.00 kB │ gzip:  0.55 kB
dist/assets/index-*.css               3.26 kB │ gzip:  1.29 kB
dist/assets/components-*.css         19.40 kB │ gzip:  3.07 kB
dist/assets/vendor-*.js               0.00 kB │ gzip:  0.02 kB
dist/assets/index-*.js                3.40 kB │ gzip:  1.74 kB
dist/assets/HomeView-*.js             5.85 kB │ gzip:  2.47 kB
dist/assets/components-*.js          13.85 kB │ gzip:  4.94 kB
dist/assets/vue-vendor-*.js          95.86 kB │ gzip: 37.49 kB
---------------------------------------------------
Total initial load: ~50 kB gzipped ✅
Build time: ~425ms ⚡
Code splitting: 4 chunks (vue-vendor, components, HomeView, index)
```

**Performance Improvements**:
- Optimized code splitting with separate chunks for components
- CSS code splitting enabled
- Lazy loading for all route components
- Material Symbols icons loaded from Google Fonts CDN
- Total bundle size reduced from M1 (~99 kB) to current (~50 kB) ⬇️ 49% reduction!

---

## Documentation

- **[spec.md](spec.md)** - Complete technical specification (SOURCE OF TRUTH)
- **[CLAUDE.md](CLAUDE.md)** - AI assistant context, architecture decisions, patterns
- **[todo.md](todo.md)** - Milestone 1 implementation checklist (completed)
- **[Instructions for Claude Code.md](Instructions%20for%20Claude%20Code.md)** - Original project requirements

---

## Contributing

This is a learning project for a Product Manager becoming more technical. Code contributions should:

1. Follow Vue 3 Composition API with `<script setup>`
2. Use TypeScript strict mode (no `any` types)
3. Maintain WCAG 2.1 AA accessibility
4. Follow Matrix terminal theme design system
5. Keep Norwegian UI text, English code/comments

---

## License

This project is open source and available under the MIT License.

---

## Acknowledgments

- **Original Sporjeger 1.0**: React 19.2 version (identified iOS 26.0.1 issues)
- **Bellingcat's OSINT Toolkit**: Inspiration for OSINT tool directory
- **Vue 3**: Excellent framework with great TypeScript support
- **Vite**: Lightning-fast development experience

---

## Deployment

### Google Sheets Configuration

To enable live data from Google Sheets:

1. Create a `.env.local` file in the project root:
```bash
VITE_GOOGLE_SHEET_ID=your_sheet_id_here
VITE_GOOGLE_API_KEY=your_api_key_here
```

2. Get your Google Sheets ID from the URL:
```
https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
```

3. Create a Google API Key with Sheets API v4 enabled
   - **Important**: Configure HTTP referrer restrictions to include `http://localhost:5173/*` for development
   - For production, add your deployed domain (e.g., `https://yourdomain.com/*`)

4. Make your Google Sheet publicly readable (Share > Anyone with the link can view)

5. **Sheet Name**: The app expects a sheet tab named "Ark 1" (Norwegian for "Sheet 1")
   - If using English UI in Google Sheets, rename the tab to "Ark 1"
   - Or update `src/services/googleSheetsService.ts` line 28 to match your sheet name

6. **Data Format**:
   - Kostnad values must be: `GRATIS`, `KOSTNAD`, or `GRATISH`
   - Språk values should be Alpha-3 country codes: `NOR`, `USA`, `GBR`, `RUS`, etc.

Without these credentials, the app will use dummy data automatically.

### GitHub Pages Deployment

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated deployment:

1. Push code to `main` branch
2. Add Google Sheets credentials as GitHub Secrets:
   - `VITE_GOOGLE_SHEET_ID`
   - `VITE_GOOGLE_API_KEY`
3. Enable GitHub Pages in repository settings (deploy from GitHub Actions)
4. The workflow will build and deploy automatically

### Manual Deployment

```bash
# Build for production
npm run build

# Preview locally
npm run preview

# Deploy the dist/ folder to your hosting provider
```

---

**Status**: All Milestones Complete ✅ - Production Ready 🚀
**Built with**: Vue 3.5 + TypeScript 5.9 + Vite 7.1
**Bundle Size**: ~48 kB gzipped
**Build Time**: ~405ms
