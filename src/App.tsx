import { useState, useEffect } from 'react';
import { useOSINTTools } from './hooks/useOSINTTools';
import { useTheme } from './hooks/useTheme';
import { getUniqueCategories } from './services/googleSheets';
import { ToolCard } from './components/ToolCard';
import { CommandPalette } from './components/CommandPalette';
import { CategoryFilter } from './components/CategoryFilter';
import { Toast } from './components/Toast';
import type { OSINTTool, FilterState } from './types';
import './App.css';

function App() {
  const { tools, loading, error } = useOSINTTools();
  const { theme, toggleTheme } = useTheme();
  
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    costType: 'all',
    searchQuery: ''
  });
  
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', isVisible: false });

  const categories = getUniqueCategories(tools);

  const filteredTools = tools.filter(tool => {
    // Category filter
    if (filters.category && tool.kategori !== filters.category) {
      return false;
    }

    // Cost filter
    if (filters.costType !== 'all') {
      const kostnadLower = tool.kostnad.toLowerCase();
      const isGratis = kostnadLower.includes('gratis') || 
                      kostnadLower.includes('free') ||
                      tool.kostnad === '';
      const isGratisMedKjop = kostnadLower.includes('gratis med kjøp');
      const isBetalt = !isGratis && !isGratisMedKjop;
      
      if (filters.costType === 'gratis' && !isGratis) {
        return false;
      }
      if (filters.costType === 'betalt' && !isBetalt) {
        return false;
      }
      if (filters.costType === 'gratis_med_kjop' && !isGratisMedKjop) {
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

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setToast({ message: 'URL kopiert til utklippstavle', isVisible: true });
    } catch (err) {
      setToast({ message: 'Kunne ikke kopiere URL', isVisible: true });
    }
  };

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
        <div className="header-content">
          <div className="app-title">
            <h1 className="app-name">
              <span className="material-symbols-outlined">network_intel_node</span>
              Sporjeger
            </h1>
            <p className="app-tagline">Verktøykasse for digital skattejakt</p>
          </div>
          
          <div className="header-actions">
            <button
              className="search-button"
              onClick={() => setIsCommandPaletteOpen(true)}
              title="Søk (⌘K)"
            >
              <span className="material-symbols-outlined">search</span>
              <span className="search-hint">⌘K</span>
            </button>
            
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Bytt til ${theme === 'light' ? 'mørk' : 'lys'} modus`}
            >
              <span className="material-symbols-outlined">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="filters-section">
          <CategoryFilter
            categories={categories}
            selectedCategory={filters.category}
            onCategoryChange={(category) => 
              setFilters(prev => ({ ...prev, category }))
            }
            selectedCostType={filters.costType}
            onCostTypeChange={(costType) => 
              setFilters(prev => ({ ...prev, costType }))
            }
          />
          
          <div className="results-info">
            <span>{filteredTools.length} verktøy funnet</span>
          </div>
        </div>

        <div className="tools-grid">
          {filteredTools.map((tool, index) => (
            <ToolCard
              key={`${tool.navn}-${index}`}
              tool={tool}
              onCopyUrl={handleCopyUrl}
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
