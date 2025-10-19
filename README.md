# Sporjeger 2.0

[![Vue 3](https://img.shields.io/badge/Vue-3.5+-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1+-purple.svg)](https://vitejs.dev/)

**Sporjeger 2.0** is a Progressive Web App (PWA) for discovering and using OSINT (Open Source Intelligence) tools. Built with Vue 3, TypeScript, and modern web standards for optimal performance on iOS and WebKit-based browsers.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 22.20.0 LTS or higher
- **npm**: 10+
- **Google Sheets API Key**: [Get one here](https://console.cloud.google.com/)

### Installation

```bash
# Clone repository
git clone https://github.com/[username]/sporjeger2.git
cd sporjeger2

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your Google Sheets credentials

# Start dev server
npm run dev
```

Visit `http://localhost:5173/`

### Environment Variables

Create `.env.local`:

```env
VITE_GOOGLE_SHEET_ID=your_google_sheet_id
VITE_GOOGLE_SHEETS_API_KEY=your_api_key
```

## 📦 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev -- --host` | Dev server with network access (mobile testing) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run type-check` | TypeScript type checking |

## 🏗️ Project Structure

```
src/
├── components/          # Vue components
│   ├── layout/          # Header, footer, hamburger menu
│   ├── tools/           # Tool cards and grid
│   ├── search/          # Search bar, command palette
│   ├── filters/         # Category filter (multiselect)
│   ├── guide/           # Guide modal with markdown
│   ├── ui/              # Base components (modal, buttons)
│   └── pwa/             # iOS install prompt
├── composables/         # Reusable Vue logic
├── stores/              # Pinia state management
├── services/            # API services (Google Sheets)
├── types/               # TypeScript definitions
├── utils/               # Utility functions
├── constants/           # App constants
└── styles/              # Global CSS
```

## 🎨 Design System

### Colors

```css
--matrix-bright: #00FF41;    /* Primary */
--matrix-medium: #00CC33;    /* Secondary */
--matrix-dim: #008F11;       /* Accent */
--bg-primary: #0D0208;       /* Background */
```

### Typography

- **Font**: JetBrains Mono (monospace)
- **Sizes**: 0.75rem - 2rem
- **Line Heights**: 1.2 (headings), 1.6-1.8 (body)

### Breakpoints

- 390px (mobile)
- 768px (tablet)
- 1400px (desktop)

## ⌨️ Keyboard Shortcuts

- `CMD/Ctrl + K` - Open command palette
- `ESC` - Close modals/dropdowns
- `↑/↓` - Navigate command palette
- `Enter` - Select tool
- `Tab` - Navigate elements

## 🧪 Testing

### Manual Test Checklist

- [ ] Search (real-time filtering)
- [ ] Category filter (multiselect)
- [ ] Command palette (CMD+K)
- [ ] Guide modals (markdown)
- [ ] Keyboard navigation
- [ ] Responsive (390px - 1400px)
- [ ] iOS PWA install
- [ ] Offline mode
- [ ] Click-outside closes dropdowns

### Browser Support

- ✅ iOS Safari 17+
- ✅ Chrome 120+
- ✅ Edge 120+
- ✅ Firefox 120+

## 🔧 Tech Stack

- **Vue 3.5** - Composition API with `<script setup>`
- **TypeScript 5.9** - Strict mode
- **Vite 7.1** - Build tool
- **Pinia 2.2** - State management
- **Vue Router 4.5** - Routing
- **Vite PWA Plugin** - Service Worker

## 📝 Code Style

- TypeScript strict mode
- Vue 3 Composition API
- `<script setup>` syntax
- Norwegian UI, English code/comments
- ARIA labels on interactive elements
- Event listener cleanup (onUnmounted)

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation
- Focus management
- ARIA attributes
- 48px touch targets (mobile)
- 4.5:1 color contrast

## 🐛 Known Issues

- Empty vendor chunk warning (harmless)
- ESLint v9 migration pending

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Detailed technical docs for AI assistants
- **[spec.md](spec.md)** - Complete technical specification

## 📄 License

MIT License - See [LICENSE](LICENSE)

## 👥 Author

elzacka

## 🙏 Acknowledgments

- Bellingcat - OSINT tool source
- Vue.js Team
- Material Symbols
- JetBrains Mono font

---

**Made with Vue 3 and TypeScript**
