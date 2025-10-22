# >_ SPORJEGER _

**En norsk OSINT-verktøykasse**  
Progressive Web App for å finne og jobbe med materiale fra åpne kilder på internett.

![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite)
![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8)

## 🎯 Om Sporjeger

Sporjeger er en norsk OSINT-katalog (Open Source Intelligence) som samler over **1174 verktøy** for etterretning fra åpne kilder. Applikasjonen hjelper journalister, forskere, og sikkerhetsprofesjonelle med å finne riktig verktøy for jobben.

### Hva kan du bruke Sporjeger til?

- 🔍 **Søke** blant 1174 OSINT-verktøy med sanntids fuzzy-søk
- 🗂️ **Filtrer** etter hierarkiske kategorier (Sosiale medier, Domenenavn, etc.)
- ⌨️ **Tastatur-snarveier** for rask navigasjon (⌘K, ?, Esc)
- 📱 **PWA** - Installer som app på mobil og desktop
- 🌙 **Matrix-tema** - Mørk, minimalistisk design
- 🇳🇴 **Norsk** - Fullt lokalisert brukergrensesnitt

## ✨ Funksjoner

### Søk og Filtrering
- **Fuzzy search** med operatører (`category:`, `tag:`, `platform:`, `type:`)
- **Hierarkisk kategorifilter** med ekspanderbare underkategorier
- **Multi-select kategorier** for avansert filtrering
- **Kommandopalett** (⌘K / Ctrl+K) for rask tilgang

### Verktøyinformasjon
- **Detaljerte kort** med beskrivelse, kostnad, plattform, språk
- **Type-badges** - (W) Web, (T) Terminal, (D) Dork, (M) Mobile
- **Hierarkiske kategoristier** - Full kategoristruktur
- **Eksportfunksjon** - JSON, CSV, eller Markdown

## 🛠️ Teknologistakk

- **Vue 3.5** - Composition API med `<script setup>`
- **TypeScript 5.9** - Strict mode for type safety
- **Vite 7.1** - Lightning-fast build tool
- **Pinia 2.2** - State management
- **Google Sheets API** - CMS backend
- **PWA** - Offline-støtte

## 🚀 Kom i gang

### Installasjon

\`\`\`bash
# Klon repository
git clone <repo-url>
cd sporjeger2

# Installer dependencies
npm install

# Opprett .env.local fil med Google Sheets credentials
# VITE_GOOGLE_SHEET_ID=your_sheet_id
# VITE_GOOGLE_API_KEY=your_api_key

# Start utviklingsserver
npm run dev
\`\`\`

### Bygg for produksjon

\`\`\`bash
# Hent fersk data fra Google Sheets
npm run fetch-tools

# Bygg produksjonsversjonen
npm run build
\`\`\`

## 📁 Prosjektstruktur

\`\`\`
sporjeger2/
├── src/
│   ├── components/      # Vue-komponenter
│   ├── composables/     # Gjenbrukbar logikk
│   ├── stores/          # Pinia stores
│   ├── services/        # API-tjenester
│   ├── types/           # TypeScript types
│   └── styles/          # Globale stiler
├── public/              # Statiske filer
└── scripts/             # Build scripts
\`\`\`

## ♿ Tilgjengelighet

- Full tastaturnavigasjon
- ARIA-labels på interaktive elementer
- Focus management
- Responsive design (390px - 1400px+)
- Touch targets 48x48px

## 📄 Lisens

MIT License - se [LICENSE](LICENSE) filen for detaljer.

---

**Laget med ❤️ i Norge**
