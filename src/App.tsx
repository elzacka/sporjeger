import { useState, useEffect } from 'react';
import { useOSINTTools } from './hooks/useOSINTTools';
import { getUniqueCategories } from './services/googleSheets';
import { ToolCard } from './components/ToolCard';
import { CommandPalette } from './components/CommandPalette';
import { CategoryFilter } from './components/CategoryFilter';
import { Toast } from './components/Toast';
import type { OSINTTool, FilterState } from './types';
import './App.css';

function App() {
  const { tools, loading, error } = useOSINTTools();
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    costTypes: [],
    searchQuery: ''
  });

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', isVisible: false });

  const categories = getUniqueCategories(tools);

  const filteredTools = tools.filter(tool => {
    // Category filter - if categories are selected, tool must match one of them
    if (filters.categories.length > 0 && !filters.categories.includes(tool.kategori)) {
      return false;
    }

    // Cost filter - if cost types are selected, tool must match one of them
    if (filters.costTypes.length > 0) {
      const kostnadLower = tool.kostnad.toLowerCase();
      const isGratis = kostnadLower.includes('gratis') && !kostnadLower.includes('gratis med kjøp') ||
                      kostnadLower.includes('free') ||
                      tool.kostnad === '';
      const isGratisMedKjop = kostnadLower.includes('gratis med kjøp');
      const isBetalt = !isGratis && !isGratisMedKjop;

      let matchesCostType = false;
      if (filters.costTypes.includes('gratis') && isGratis) {
        matchesCostType = true;
      }
      if (filters.costTypes.includes('betalt') && isBetalt) {
        matchesCostType = true;
      }
      if (filters.costTypes.includes('gratis_med_kjop') && isGratisMedKjop) {
        matchesCostType = true;
      }

      if (!matchesCostType) {
        return false;
      }
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        tool.navn.toLowerCase().includes(query) ||
        tool.beskrivelse.toLowerCase().includes(query) ||
        tool.kategori.toLowerCase().includes(query) ||
        tool.detaljer.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleSelectTool = (tool: OSINTTool) => {
    if (tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="app loading-state">
        <div className="loading-spinner">
          <span className="material-symbols-outlined">sync</span>
          <p>Laster Sporjeger...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app error-state">
        <div className="error-message">
          <span className="material-symbols-outlined">error</span>
          <h2>Kunne ikke laste verktøy</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="app-title">
            <h1 className="app-name">
              <div className="neural-icon">
                <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
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
        </div>

        <div className="header-search">
          <button
            className="search-bar"
            onClick={() => setIsCommandPaletteOpen(true)}
            title="Søk i verktøy (⌘K)"
          >
            <span className="material-symbols-outlined">search</span>
            <span className="search-placeholder">Søk i verktøy...</span>
            <kbd className="search-kbd">⌘K</kbd>
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="filters-section">
          <div className="filters-container">
            <CategoryFilter
              categories={categories}
              selectedCategories={filters.categories}
              onCategoriesChange={(categories) =>
                setFilters(prev => ({ ...prev, categories }))
              }
              selectedCostTypes={filters.costTypes}
              onCostTypesChange={(costTypes) =>
                setFilters(prev => ({ ...prev, costTypes }))
              }
            />

            {(filters.categories.length > 0 || filters.costTypes.length > 0) && (
              <button
                className="clear-filters-button"
                onClick={() => setFilters(prev => ({ ...prev, categories: [], costTypes: [] }))}
                title="Nullstill filtre"
              >
                <span className="material-symbols-outlined">close</span>
                <span>Nullstill</span>
              </button>
            )}
          </div>

          <div className="results-info">
            <span>{filteredTools.length} verktøy</span>
          </div>
        </div>

        <div className="tools-grid">
          {filteredTools.map((tool, index) => (
            <ToolCard
              key={`${tool.navn}-${index}`}
              tool={tool}
            />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="empty-state">
            <span className="material-symbols-outlined">search_off</span>
            <h3>Ingen verktøy funnet</h3>
            <p>Prøv å justere filtrene eller søk etter noe annet.</p>
          </div>
        )}
      </main>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tools={tools}
        onSelectTool={handleSelectTool}
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}

export default App;
