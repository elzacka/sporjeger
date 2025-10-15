# Sporjeger

🔍 A Norwegian web application for browsing and discovering OSINT (Open Source Intelligence) tools and resources.

**Live Demo**: [elzacka.github.io/sporjeger](https://elzacka.github.io/sporjeger/)

## About

Sporjeger (Norwegian for "Tracker") is a curated directory of OSINT tools designed for digital investigators, researchers, and journalists. The application provides an intuitive interface for discovering and filtering tools based on category, cost, difficulty level, and language.

## Features

- 🔍 **Quick Search** - CMD+K command palette for instant tool discovery
- ⌨️ **Keyboard Shortcuts** - Navigate efficiently with CMD+K for search
- 📱 **Mobile Optimized** - Full iOS Safari support with safe area insets for notch/home indicator
- 🎯 **Category Filtering** - Filter by tool category with real-time results
- ⭐ **Difficulty Ratings** - Visual 1-5 star system for tool complexity
- 🌐 **Language Support** - Flag emoji indicators for tool language availability
- 📖 **Integrated Guides** - Markdown-formatted guides with direct documentation links
- 🍔 **Info Menu** - Hamburger menu with app info and data sources
- 🎨 **Matrix Theme** - Neural network-inspired dark interface with animations
- ⚡ **Performance** - Fast loading with code splitting and React 19.2 optimizations
- 💾 **Offline Ready** - PWA support with service worker for offline access
- 🛡️ **Error Boundaries** - Graceful error handling with Suspense boundaries
- ♿ **Accessible** - WCAG 2.1 Level AA compliant with full keyboard navigation

## Tech Stack

- **Frontend**: React 19.2.0 with TypeScript 5.8.3
- **Build Tool**: Vite 7.1.9
- **Styling**: Custom CSS with matrix-inspired theme
- **Icons**: Google Material Symbols
- **Data Source**: Google Sheets API
- **PWA**: Service Worker for offline functionality
- **Deployment**: GitHub Pages

### React 19.2 Features Used

- **`use()` Hook** - Suspense-based data fetching
- **Activity Component** - Native transition animations
- **Native Metadata** - `<title>` and `<meta>` tags hoisted to `<head>`
- **React Compiler** - Automatic optimization (no manual `memo()`)
- **Suspense Boundaries** - Loading state management
- **Error Boundaries** - Graceful error handling

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/elzacka/sporjeger.git
cd sporjeger
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Google Sheets configuration:
```env
VITE_GOOGLE_SHEET_ID=your_sheet_id_here
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview  # Preview the production build locally
```

## Google Sheets Setup

The application reads data from a Google Sheet with the following structure:

| Column | Header | Description |
|--------|--------|-------------|
| A | Kategori | Tool category (e.g., "Social Media", "Geolocation") |
| B | Navn | Tool name |
| C | URL | Tool website URL |
| D | Beskrivelse | Brief description of the tool |
| E | Kostnad | Cost type: "Gratis", "Betalt", or "Gratis med kjøp" |
| F | Språk | Language with flag emoji (e.g., "🇳🇴 Norsk") |
| G | Vanskelighetsgrad | Difficulty level (1-5) |
| H | Veiledning | URL or Markdown-formatted guide content |

### Setting up Google Sheets API:

1. Create a new Google Sheet with the structure above
2. Go to [Google Cloud Console](https://console.cloud.google.com/)
3. Create a new project or select an existing one
4. Enable the Google Sheets API
5. Create credentials (API Key)
6. Make your sheet publicly readable:
   - Share > Change to "Anyone with the link"
   - Set permission to "Viewer"
7. Add the Sheet ID and API key to your `.env.local` file

**Sheet ID**: Found in the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

## Project Structure

```
sporjeger/
├── src/
│   ├── components/          # React components
│   │   ├── Activity.tsx         # React 19.2 Activity component
│   │   ├── CategoryFilter.tsx   # Category filter with modal
│   │   ├── CommandPalette.tsx   # CMD+K search interface
│   │   ├── DataErrorBoundary.tsx # Data error handling
│   │   ├── ErrorBoundary.tsx    # General error boundary
│   │   ├── FilterModal.tsx      # Category filter modal
│   │   ├── GuideModal.tsx       # Guide content display
│   │   ├── LoadingFallback.tsx  # Suspense loading state
│   │   ├── Menu.tsx             # Hamburger menu
│   │   ├── SkeletonLoader.tsx   # Loading skeleton
│   │   ├── StarIcon.tsx         # Reusable star icon
│   │   ├── ToolCard.tsx         # Tool display card
│   │   └── Toast.tsx            # Toast notifications
│   ├── constants/           # Application constants
│   │   └── index.ts             # Centralized constants
│   ├── hooks/               # Custom React hooks
│   │   ├── useEvent.ts          # Event callback hook
│   │   ├── useFocusTrap.ts      # Focus trap for modals
│   │   ├── useKeyboardShortcuts.ts # Keyboard navigation
│   │   ├── useModalEscapeKey.ts # ESC key handling
│   │   ├── useOSINTToolsSuspense.ts # Data fetching with Suspense
│   │   ├── useTheme.ts          # Theme management
│   │   └── useToolFilters.ts    # Filter logic
│   ├── services/            # External services
│   │   └── googleSheets.ts      # Google Sheets API client
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── arrayHelpers.ts      # Array utilities
│   │   ├── formatText.tsx       # Text formatting (Markdown)
│   │   ├── toolHelpers.ts       # Tool data processing
│   │   └── validateEnv.ts       # Environment validation
│   ├── App.tsx              # Main application
│   ├── App.css              # Styles and animations
│   └── main.tsx             # Entry point
├── public/                  # Static assets
│   ├── manifest.json        # PWA manifest
│   └── icon-*.png           # PWA icons
├── sw.js                    # Service worker for offline support
├── .github/workflows/       # GitHub Actions
│   └── deploy.yml           # Deployment workflow
└── package.json
```

## Architecture & Best Practices

### Code Organization

**Component Structure:**
- Components handle presentation logic only
- Business logic extracted to utility functions
- Custom hooks for reusable stateful logic
- Centralized constants for configuration

**Key Utilities:**
- `toolHelpers.ts` - Tool data processing (cost, difficulty, language)
- `formatText.tsx` - Markdown rendering
- `arrayHelpers.ts` - Array manipulation utilities

**Custom Hooks:**
- `useOSINTToolsSuspense` - Data fetching with React 19.2 `use()` hook
- `useToolFilters` - Filter logic with memoization
- `useFocusTrap` - Accessibility for modals
- `useKeyboardShortcuts` - Global keyboard navigation

### React 19.2 Patterns

1. **Suspense-based Data Fetching** - Using `use()` hook instead of useEffect
2. **Activity Component** - Native transitions for menu/modal animations
3. **Error Boundaries** - Graceful error handling at data and app levels
4. **React Compiler** - Automatic optimization without manual memoization
5. **Native Metadata** - Title and meta tags hoisted to document head

### Mobile Optimizations

- **Safe Area Insets** - Support for iPhone notch and home indicator
- **Touch Targets** - Minimum 44px (WCAG 2.1 AA) / 48px recommended
- **Viewport Fit** - `viewport-fit=cover` for edge-to-edge display
- **iOS Safari** - Momentum scrolling, text size adjustment prevention
- **Touch Detection** - Remove hover effects on touch devices (`@media (hover: none)`)
- **Responsive Breakpoints** - Optimized for 390px (iPhone 6.1"), 768px (tablet), 1400px (desktop)

### Accessibility (WCAG 2.1 Level AA)

- ✅ **Keyboard Navigation** - Full app accessible via keyboard
- ✅ **Focus Management** - Focus trap in modals, skip links
- ✅ **ARIA Labels** - All interactive elements properly labeled
- ✅ **Color Contrast** - Matrix green theme meets 4.5:1 ratio
- ✅ **Touch Targets** - All buttons meet 44px minimum
- ✅ **Screen Readers** - Semantic HTML and proper ARIA

## Keyboard Shortcuts

- **`Cmd/Ctrl + K`** - Open command palette for quick search
- **`ESC`** - Close modals, command palette, and menus
- **`Enter`** - Select tool from command palette
- **`Arrow Up/Down`** - Navigate command palette results
- **`Tab`** - Navigate interactive elements (WCAG 2.1 compliant)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Tool data inspired by [Bellingcat's OSINT Toolkit](https://github.com/bellingcat/toolkit)
- Matrix theme design inspired by classic terminal interfaces

---

**Note**: This application is designed for educational and research purposes. Always ensure you comply with relevant laws and regulations when conducting OSINT activities.
