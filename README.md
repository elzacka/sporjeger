# Sporjeger

🔍 A Norwegian web application for OSINT (Open Source Intelligence) tools and resources. Built with React 19, TypeScript, and Vite.

**Live Demo**: [sporjeger.elzacka.github.io](https://elzacka.github.io/sporjeger/)

## Features

- 🔍 **Text-first search** - CMD+K command palette for quick navigation
- 📱 **Responsive design** - Optimized for mobile and desktop
- 🌙 **Dark/light mode** - Automatic theme detection with manual toggle
- 📊 **Google Sheets integration** - Live data from Google Sheets
- ⚡ **PWA support** - Offline functionality with service workers
- 🏷️ **Category and filtering** - Filter by category and cost type
- 📋 **Copy URL** - Easy copying of tool URLs
- 🚀 **Fast performance** - Modern build tools and optimizations

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS
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

| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| Kategori | Navn     | URL      | Beskrivelse | Kostnad | Detaljer |
| Category | Name     | URL      | Description | Cost    | Details  |

### Required Setup:

1. Create a Google Sheet with the above structure
2. Make the sheet publicly readable
3. Enable Google Sheets API and get an API key
4. Add the Sheet ID and API key to your `.env` file

## Project Structure

```
src/
├── components/          # React components
│   ├── CommandPalette.tsx
│   ├── CategoryFilter.tsx
│   ├── ToolCard.tsx
│   └── Toast.tsx
├── hooks/              # Custom React hooks
│   ├── useOSINTTools.ts
│   └── useTheme.ts
├── services/           # API and external services
│   └── googleSheets.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── App.css            # Styles
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
