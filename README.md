# Sporjeger

🔍 A Norwegian web application for OSINT (Open Source Intelligence) tools and resources. Built with React 19, TypeScript, and Vite.

**Live Demo**: [elzacka.github.io/sporjeger](https://elzacka.github.io/sporjeger/)

## Features

- 🔍 **Text-first search** - CMD+K command palette for quick navigation and searching
- 📱 **Responsive design** - Optimized for mobile and desktop with collapsible filters
- 🌙 **Dark mode** - Persistent dark theme stored in localStorage
- 📊 **Google Sheets integration** - Live data from Google Sheets
- ⚡ **PWA support** - Offline functionality with service workers
- 🏷️ **Multi-select filtering** - Filter by multiple categories and cost types (Gratis, Betalt, Gratis med kjøp)
- 🇳🇴 **Norwegian tools indicator** - Visual flag indicators for Norwegian-specific tools
- 🚀 **Fast performance** - Modern build tools with code splitting and optimizations
- 🎨 **Matrix-inspired design** - Neural network themed interface with custom animations

## Tech Stack

- **Frontend**: React 19.1.1 + TypeScript 5.8.3
- **Build Tool**: Vite 7.1.2
- **Styling**: Custom CSS with Matrix-inspired theme
- **Icons**: Google Material Symbols
- **Data Source**: Google Sheets API
- **PWA**: Service Worker for offline support
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+
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

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your Google Sheets configuration to `.env`:
```env
VITE_GOOGLE_SHEET_ID=your_sheet_id_here
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

Build for production:
```bash
npm run build
```

Preview the build:
```bash
npm run preview
```

## Google Sheets Setup

The application fetches data from a Google Sheet with the following structure:

| Column A | Column B | Column C | Column D | Column E | Column F | Column G |
|----------|----------|----------|----------|----------|----------|----------|
| Kategori | Navn     | URL      | Beskrivelse | Kostnad | Detaljer | Språk |
| Category | Name     | URL      | Description | Cost    | Details  | Language |

**Cost Types:**
- `Gratis` or `Free` - Free tools
- `Betalt` - Paid tools
- `Gratis med kjøp` - Free with purchase/upgrade options

**Language:**
- Set to `Norsk` to display the Norwegian flag (🇳🇴) indicator

### Required Setup:

1. Create a Google Sheet with the above structure
2. Make the sheet publicly readable
3. Enable Google Sheets API and get an API key
4. Add the Sheet ID and API key to your `.env` file

## Project Structure

```
src/
├── components/          # React components
│   ├── CommandPalette.tsx   # CMD+K search interface
│   ├── CategoryFilter.tsx   # Main filter controls
│   ├── FilterModal.tsx      # Multi-select filter modal
│   ├── ToolCard.tsx         # Individual tool display card
│   └── Toast.tsx            # Toast notifications
├── hooks/              # Custom React hooks
│   ├── useOSINTTools.ts     # Google Sheets data fetching
│   └── useTheme.ts          # Theme management (localStorage)
├── services/           # API and external services
│   └── googleSheets.ts      # Google Sheets API integration
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── App.css            # Styles and animations
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or suggestions, please open an issue on GitHub.

---

**Note**: This application is designed for educational and research purposes. Always ensure you comply with relevant laws and regulations when conducting OSINT activities.
