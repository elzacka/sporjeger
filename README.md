# Sporjeger 2.0

🔍 A Norwegian Progressive Web App for browsing and discovering OSINT (Open Source Intelligence) tools and resources.

**Live Demo**: [elzacka.github.io/sporjeger](https://elzacka.github.io/sporjeger/)

---

## About

Sporjeger (Norwegian for "Tracker") is a curated directory of OSINT tools designed for digital investigators, researchers, and journalists. Built with Vue 3 + TypeScript, it provides a fast, accessible, and privacy-focused interface for discovering tools based on category, cost, difficulty, and language.

---

## Tech Stack

- **Vue 3.5** - Composition API with `<script setup>`
- **TypeScript 5.9** - Strict mode for type safety
- **Vite 7.1** - Lightning-fast build tool
- **Pinia 2.2** - State management
- **Vue Router 4.5** - Client-side routing
- **Google Sheets API v4** - Live data source
- **Material Symbols** - Lightweight icons
- **Node.js 22.20.0 LTS**

---

## Features

### Core Features
- 🔍 **Quick Search** - CMD+K command palette with keyboard navigation
- 📱 **Mobile Optimized** - iOS 26 Safari support with safe area insets
- 🎯 **Category Filtering** - Real-time filtering with sticky header
- ⭐ **Difficulty Ratings** - Visual 1-5 star system
- 🌐 **Language Display** - Alpha-3 country codes (NOR, USA, GBR, etc.)
- 📖 **Guide Modals** - Markdown-formatted tool documentation
- 🎨 **Matrix Terminal Theme** - JetBrains Mono font with green phosphor glow

### Progressive Web App (PWA)
- 💾 **Offline Ready** - Service Worker with smart caching
- 📲 **Installable** - Add to Home Screen on iOS/Android
- ⚡ **Blazing Fast** - ~50 kB gzipped, 425ms build time
- 🔄 **Auto-updates** - Cache-first for assets, network-first for data

### Developer Experience
- 🛡️ **Type Safe** - Strict TypeScript with union types
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 🎯 **Zero Tracking** - No analytics, no cookies
- 🚀 **Modern WebKit CSS** - Anchor positioning, scroll animations, text-wrap: pretty

---

## Getting Started

### Prerequisites

- Node.js 22.20.0 or higher
- npm 10+ or yarn 4+

### Installation

```bash
# Clone the repository
git clone https://github.com/elzacka/sporjeger.git
cd sporjeger

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Google Sheets credentials to .env.local
# VITE_GOOGLE_SHEET_ID=your_sheet_id
# VITE_GOOGLE_API_KEY=your_api_key

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

### Available Scripts

```bash
npm run dev           # Start dev server with HMR
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run type-check    # TypeScript validation
npm run generate-icons # Regenerate PWA icons
```

---

## Google Sheets Setup

The app reads data from a Google Sheet with this structure:

| Column | Header | Type | Example |
|--------|--------|------|---------|
| A | Kategori | string | "Social Media" |
| B | Navn | string | "Twitter Search" |
| C | URL | string | "https://twitter.com/search" |
| D | Beskrivelse | string | "Search tweets..." |
| E | Kostnad | GRATIS \| KOSTNAD \| GRATISH | "GRATIS" |
| F | Språk | string (Alpha-3) | "NOR" |
| G | Krever registrering | Ja \| Delvis \| Nei | "Nei" |
| H | Designkvalitet | 1 \| 2 \| 3 | "3" |
| I | Vanskelighetsgrad | 1-5 | "2" |
| J | Veiledning | string (Markdown) | "# Guide..." |
| K | Endre eller slette | string | "Nei" |

### Configuration Steps

1. Create a Google Sheet with the structure above
2. Enable **Google Sheets API v4** in [Google Cloud Console](https://console.cloud.google.com/)
3. Create an API key with HTTP referrer restrictions:
   - **Development**: `http://localhost:5173/*`
   - **Production**: `https://yourdomain.com/*`
4. Make your sheet **publicly readable** (Share → Anyone with link can view)
5. Add credentials to `.env.local`:
   ```env
   VITE_GOOGLE_SHEET_ID=your_sheet_id_from_url
   VITE_GOOGLE_API_KEY=your_api_key
   ```

**Sheet Name**: The app expects a tab named **"Ark 1"** (Norwegian for "Sheet 1"). Update `src/services/googleSheetsService.ts` line 28 if using a different name.

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # AppHeader, HamburgerMenu, MainLayout
│   ├── tools/           # ToolCard, ToolGrid
│   ├── search/          # SearchBar, CommandPalette
│   ├── filters/         # CategoryFilter
│   ├── ui/              # MatrixLogo, StarRating, BaseModal, LoadingSpinner
│   ├── guide/           # GuideModal
│   └── pwa/             # IOSInstallPrompt
├── composables/         # useKeyboardShortcuts, useFocusTrap, useToolFilters
├── stores/              # toolsStore (Pinia), uiStore
├── services/            # googleSheetsService (API v4 client)
├── types/               # TypeScript interfaces and union types
├── utils/               # validateEnv, helper functions
├── constants/           # Application constants
├── styles/              # Global CSS (variables, animations, responsive)
├── router/              # Vue Router configuration
├── App.vue              # Root component
└── main.ts              # Entry point
```

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
  språk?: string;                      // Alpha-3 codes (NOR, USA, GBR)
  kreverRegistrering?: RegistreringKrav;
  vanskelighetsgrad?: Vanskelighetsgrad;
  veiledning?: string;
  enderEllerSlette?: string;
}
```

---

## Deployment

### GitHub Pages (Automated)

The project includes a GitHub Actions workflow for automated deployment:

1. Push to `main` branch
2. Add GitHub Secrets:
   - `VITE_GOOGLE_SHEET_ID`
   - `VITE_GOOGLE_API_KEY`
3. Enable **GitHub Pages** → Source: **GitHub Actions**
4. Workflow runs automatically on push

### Manual Deployment

```bash
npm run build       # Builds to dist/
npm run preview     # Test production build locally
```

Deploy the `dist/` folder to your hosting provider.

---

## Design System

### Matrix Terminal Theme

**Colors:**
```css
--background: #0a0e0a           /* Dark background */
--matrix-bright: #00ff41        /* Primary green */
--matrix-medium: #00cc33        /* Medium green */
--matrix-dim: #008f11           /* Dim green */
```

**Typography:**
- Font: JetBrains Mono (monospace)
- Sharp corners (no border-radius)
- Terminal aesthetic with phosphor glow effects

**Icons:**
- Material Symbols (weight 100)
- Guide: `book_2` (22px)
- Play: `play_arrow` (44px)
- Favicon/PWA: `>_` symbol (terminal prompt)

---

## Accessibility

- ✅ **WCAG 2.1 AA** compliant
- ✅ **Keyboard navigation** - Full app accessible via keyboard
- ✅ **Focus management** - Focus trap in modals
- ✅ **ARIA labels** - All interactive elements labeled
- ✅ **Color contrast** - 4.5:1 minimum ratio
- ✅ **Touch targets** - 48px minimum for mobile

### Keyboard Shortcuts

- `Cmd/Ctrl + K` - Open command palette
- `ESC` - Close modals/menus
- `Enter` - Select from command palette
- `Arrow Up/Down` - Navigate results
- `Tab/Shift+Tab` - Navigate elements

---

## Performance

**Bundle Size (Production):**
```
Total gzipped: ~50 kB ✅
Build time: ~425ms ⚡
Code splitting: 4 chunks
```

**Optimizations:**
- Code splitting (vue-vendor, components, views)
- CSS splitting enabled
- Lazy loading for route components
- Material Symbols loaded from Google Fonts CDN
- Service Worker with cache-first strategy

---

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| iOS Safari | 26.0+ | ✅ Optimized |
| Chrome | 120+ | ✅ Full support |
| Firefox | 120+ | ✅ Full support |
| Edge | 120+ | ✅ Full support |
| Safari | 17+ | ✅ Full support |

---

## Contributing

Contributions are welcome! Please ensure:

1. Vue 3 Composition API with `<script setup>`
2. TypeScript strict mode (no `any` types)
3. WCAG 2.1 AA accessibility compliance
4. Matrix terminal theme consistency
5. Norwegian UI text, English code/comments

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgments

- **Bellingcat's OSINT Toolkit** - Inspiration for tool directory
- **Vue 3** - Excellent framework with TypeScript support
- **Vite** - Lightning-fast development experience

---

## Important Notice

**This application is designed for educational and research purposes.** OSINT activities must be conducted ethically and in compliance with applicable laws and regulations. Users are responsible for ensuring their activities respect:

- **Privacy rights** - Respect individuals' right to privacy
- **Data protection laws** - Comply with GDPR, CCPA, and local regulations
- **Terms of service** - Follow platform rules and guidelines
- **Professional ethics** - Maintain journalistic and research integrity

Always verify information from multiple sources and consider the ethical implications of your research activities.

---

**Built with Vue 3.5 + TypeScript 5.9 + Vite 7.1**
