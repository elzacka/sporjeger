# OSINT Verktøy

En modern norsk webapp for OSINT-verktøy og ressurser. Bygget med React 19, TypeScript og Vite.

## Funksjoner

- 🔍 **Text-first søk** - CMD+K command palette for rask navigering
- 📱 **Responsiv design** - Optimalisert for mobil og desktop
- 🌙 **Mørk/lys modus** - Automatisk temadeteksjon
- 📊 **Google Sheets integrasjon** - Live data fra Google Sheets
- ⚡ **PWA-støtte** - Offline-funksjonalitet med service workers
- 🏷️ **Kategorisering og filtrering** - Filtrer på kategori og kostnad
- 📋 **Kopier URL** - Enkel kopiering av verktøy-URLer

## Utvikling

```bash
# Installer avhengigheter
npm install

# Start utviklingsserver
npm run dev

# Bygg for produksjon
npm run build

# Preview produksjonsbygg
npm run preview
```

## Miljøvariabler

Kopier `.env.example` til `.env` og fyll ut:

```
VITE_GOOGLE_SHEETS_API_KEY=din_api_nøkkel
VITE_GOOGLE_SHEET_ID=1HOxZklC4NPdyDV7GSaRBWdY_MXCDvVN6Qw5DpnVohmI
```

## Deployment

Appen deployes automatisk til GitHub Pages ved push til main branch.

## Teknisk stack

- React 19 med TypeScript
- Vite for bygging og utvikling
- CSS Custom Properties for theming
- Google Sheets API v4
- Material Symbols for ikoner
- Service Workers for PWA-funksjonalitet
