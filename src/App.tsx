import { useState, useMemo, useRef, useCallback, lazy, Suspense } from 'react';
import { useOSINTToolsSuspense } from './hooks/useOSINTToolsSuspense';
import { useToolFilters } from './hooks/useToolFilters';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { getUniqueCategories } from './services/googleSheets';
import { ToolCard } from './components/ToolCard';
import { CategoryFilter } from './components/CategoryFilter';
import type { OSINTTool, FilterState } from './types';
import './App.css';

// React 19.2: Code splitting - Lazy load heavy components
// These components are loaded on-demand to reduce initial bundle size
const CommandPalette = lazy(() =>
  import('./components/CommandPalette').then(module => ({ default: module.CommandPalette }))
);
const Menu = lazy(() =>
  import('./components/Menu').then(module => ({ default: module.Menu }))
);
const InstallPrompt = lazy(() =>
  import('./components/InstallPrompt').then(module => ({ default: module.InstallPrompt }))
);

function App() {
  // React 19: use() hook with Suspense - no loading/error states needed!
  // The Suspense boundary in main.tsx handles loading
  // The DataErrorBoundary in main.tsx handles errors
  const tools = useOSINTToolsSuspense();

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    searchQuery: '',
  });

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [highlightedToolId, setHighlightedToolId] = useState<string | null>(null);
  const toolRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const categories = useMemo(() => getUniqueCategories(tools), [tools]);

  // Refactored: Extracted filter logic to custom hook
  const filteredTools = useToolFilters(tools, filters);

  // Refactored: Extracted keyboard shortcuts to custom hook
  useKeyboardShortcuts(() => setIsCommandPaletteOpen(true));

  const handleSelectTool = useCallback((tool: OSINTTool) => {
    const toolId = `${tool.navn}-${tool.kategori}`;
    const toolElement = toolRefs.current.get(toolId);

    if (toolElement) {
      // Scroll to the tool card
      toolElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Highlight the tool card
      setHighlightedToolId(toolId);

      // Remove highlight after animation
      setTimeout(() => {
        setHighlightedToolId(null);
      }, 2000);
    }
  }, []);

  // React 19: No loading/error checks needed - Suspense + ErrorBoundary handle it!
  // Loading state is handled by <Suspense fallback={<LoadingFallback />}> in main.tsx
  // Error state is handled by <DataErrorBoundary> in main.tsx

  return (
    <>
      {/* Accessibility: Skip navigation link (WCAG 2.4.1 Bypass Blocks) */}
      <a href="#main-content" className="skip-link">
        Hopp til hovedinnhold
      </a>

      {/* React 19 native metadata support - automatically hoisted to <head> */}
      <title>Sporjeger - Verktøykasse for digital skattejakt</title>
      <meta name="description" content="Oppdag og filtrer verktøy for digital skattejakt. Søk blant hundrevis av verktøy kategorisert etter kostnad, vanskelighetsgrad og språk." />
      <meta name="keywords" content="OSINT, verktøy, digital etterforskning, open source intelligence, sporjeger, cybersikkerhet" />
      <meta property="og:title" content="Sporjeger - OSINT-verktøykasse" />
      <meta property="og:description" content="Katalog med OSINT-verktøy og ressurser" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="Sporjeger - OSINT-verktøykasse" />
      <meta name="twitter:description" content="Oppdag og filtrer verktøy for digital skattejakt" />

      <div className="app">
        <header className="app-header">
        <div className="header-top">
          <div className="header-left">
            <Suspense fallback={<div style={{ width: '40px', height: '40px' }} />}>
              <Menu />
            </Suspense>
          </div>

          <div className="app-title">
            <h1 className="app-name">
              <div className="neural-icon">
                <svg viewBox="0 0 48 48" xmlns="https://www.w3.org/2000/svg">
                  {/* Connections */}
                  <line className="connection" x1="12" y1="12" x2="24" y2="24" strokeDasharray="4 2" />
                  <line className="connection" x1="12" y1="36" x2="24" y2="24" strokeDasharray="4 2" />
                  <line className="connection" x1="24" y1="24" x2="36" y2="12" strokeDasharray="4 2" />
                  <line className="connection" x1="24" y1="24" x2="36" y2="36" strokeDasharray="4 2" />
                  <line className="connection" x1="12" y1="12" x2="36" y2="12" strokeDasharray="4 2" />
                  <line className="connection" x1="12" y1="36" x2="36" y2="36" strokeDasharray="4 2" />

                  {/* Nodes */}
                  <circle className="node" cx="12" cy="12" r="4" />
                  <circle className="node" cx="12" cy="36" r="4" />
                  <circle className="node" cx="24" cy="24" r="5" fill="var(--matrix-green)" fillOpacity="0.2" />
                  <circle className="node" cx="36" cy="12" r="4" />
                  <circle className="node" cx="36" cy="36" r="4" />
                </svg>
              </div>
              <span>SPORJEGER</span>
            </h1>
            <p className="app-tagline">Verktøykasse for digital skattejakt</p>
          </div>

          <div className="header-right">
            {/* Spacer to keep title centered */}
          </div>
        </div>

        <div className="header-search">
          <button
            className="search-bar"
            onClick={() => setIsCommandPaletteOpen(true)}
            title="Søk etter verktøy (⌘K)"
          >
            <span className="material-symbols-outlined">search</span>
            <span className="search-placeholder">Søk etter verktøy...</span>
            <kbd className="search-kbd">⌘K</kbd>
          </button>
        </div>
      </header>

      <main id="main-content" className="main-content">
        <CategoryFilter
          categories={categories}
          selectedCategories={filters.categories}
          onCategoriesChange={(categories) =>
            setFilters(prev => ({ ...prev, categories }))
          }
          toolCount={filteredTools.length}
        />

        <div className="tools-grid">
          {filteredTools.map((tool, index) => {
            const toolId = `${tool.navn}-${tool.kategori}`;
            return (
              <div
                key={`${tool.navn}-${index}`}
                ref={(el) => {
                  if (el) {
                    toolRefs.current.set(toolId, el);
                  } else {
                    toolRefs.current.delete(toolId);
                  }
                }}
                className={highlightedToolId === toolId ? 'tool-card-wrapper highlighted' : 'tool-card-wrapper'}
              >
                <ToolCard tool={tool} />
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="empty-state">
            <span className="material-symbols-outlined" aria-hidden="true">
              search_off
            </span>
            <h3>Ingen verktøy funnet</h3>
            {(filters.categories.length > 0 ||
              filters.searchQuery) ? (
              <>
                <p>Ingen verktøy matcher dine valgte filtre.</p>
                <button
                  className="clear-filters-button"
                  onClick={() => setFilters({
                    categories: [],
                    searchQuery: '',
                  })}
                  aria-label="Fjern alle filtre"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    filter_list_off
                  </span>
                  Fjern alle filtre
                </button>
              </>
            ) : (
              <p>Prøv å justere søkekriteriene dine.</p>
            )}
          </div>
        )}
      </main>

      <Suspense fallback={null}>
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          tools={tools}
          onSelectTool={handleSelectTool}
        />
      </Suspense>

      {/* iOS 26: Web App Install Prompt */}
      <Suspense fallback={null}>
        <InstallPrompt />
      </Suspense>
      </div>
    </>
  );
}

export default App;
