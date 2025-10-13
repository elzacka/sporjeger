# Sporjeger

🔍 A Norwegian web application for browsing and discovering OSINT (Open Source Intelligence) tools and resources.

**Live Demo**: [elzacka.github.io/sporjeger](https://elzacka.github.io/sporjeger/)

## About

Sporjeger (Norwegian for "Tracker") is a curated directory of OSINT tools designed for digital investigators, researchers, and journalists. The application provides an intuitive interface for discovering and filtering tools based on category, cost, difficulty level, and language.

## Features

- 🔍 **Quick Search** - CMD+K command palette for instant tool discovery
- ⌨️ **Keyboard Shortcuts** - Navigate efficiently with CMD+B to toggle filters, CMD+K for search
- 📱 **Mobile Optimized** - Full iOS Safari support with PWA capabilities
- 🎯 **Advanced Filtering** - Filter by category, cost, difficulty, design quality, and registration requirements
- ⭐ **Difficulty Ratings** - Visual 1-5 star system for tool complexity
- 🎨 **Design Quality Indicators** - Visual quality ratings for tool interfaces
- 🌐 **Language Support** - Flag emoji indicators for tool language availability
- 📖 **Integrated Guides** - Direct links to tool documentation and guides
- 🎨 **Matrix Theme** - Neural network-inspired dark interface
- ⚡ **Performance** - Fast loading with code splitting and optimization
- 💾 **Offline Ready** - PWA support with service worker for offline access
- 🛡️ **Error Boundaries** - Graceful error handling prevents crashes

## Tech Stack

- **Frontend**: React 19.1.1 with TypeScript 5.8.3
- **Build Tool**: Vite 7.1.2
- **Styling**: Custom CSS with matrix-inspired theme
- **Icons**: Google Material Symbols
- **Data Source**: Google Sheets API
- **PWA**: Service Worker for offline functionality
- **Deployment**: GitHub Pages

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
| G | Krever registrering | Registration requirement: "Ja", "Delvis", or "Nei" |
| H | Designkvalitet | Design quality rating (1-3: Poor, Medium, Good) |
| I | Vanskelighetsgrad | Difficulty level (1-5) |
| J | Veiledning | URL to guide/documentation |
| K | Endre eller slette | Protection flag ("Nei" = protected from edits) |

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
│   │   ├── AttributionModal.tsx # Credits and attribution
│   │   ├── CategoryFilter.tsx   # Filter panel with all controls
│   │   ├── CommandPalette.tsx   # CMD+K search interface
│   │   ├── ErrorBoundary.tsx    # Error handling boundary
│   │   ├── FilterModal.tsx      # Multi-select filter modal
│   │   ├── GuideModal.tsx       # Guide content display
│   │   ├── ToolCard.tsx         # Tool display card
│   │   └── Toast.tsx            # Toast notifications
│   ├── hooks/               # Custom React hooks
│   │   └── useOSINTTools.ts     # Data fetching hook
│   ├── services/            # External services
│   │   └── googleSheets.ts      # Google Sheets API client
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
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

## Keyboard Shortcuts

- **`Cmd/Ctrl + K`** - Focus search bar (if side panel open) or open command palette
- **`Cmd/Ctrl + B`** - Toggle filter side panel open/closed
- **`ESC`** - Close modals and command palette

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
