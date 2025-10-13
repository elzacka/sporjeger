import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useOSINTTools } from './hooks/useOSINTTools';
import { getUniqueCategories } from './services/googleSheets';
import { ToolCard } from './components/ToolCard';
import { CommandPalette } from './components/CommandPalette';
import { CategoryFilter } from './components/CategoryFilter';
import { AttributionModal } from './components/AttributionModal';
import { Toast } from './components/Toast';
import type { OSINTTool, FilterState } from './types';
import './App.css';

function App() {
  const { tools, loading, error } = useOSINTTools();
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    costTypes: [],
    difficulties: [],
    designQualities: [],
    registrationRequirements: [],
    searchQuery: ''
  });

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAttributionModalOpen, setIsAttributionModalOpen] = useState(false);
  const [isSidePanelExpanded, setIsSidePanelExpanded] = useState(false);
  const [toast, setToast] = useState({ message: '', isVisible: false });
  const [highlightedToolId, setHighlightedToolId] = useState<string | null>(null);
  const toolRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => getUniqueCategories(tools), [tools]);

  const filteredTools = useMemo(() => tools.filter(tool => {
    // Category filter - if categories are selected, tool must match one of them
    if (filters.categories.length > 0 && !filters.categories.includes(tool.kategori)) {
      return false;
    }

    // Cost filter - if cost types are selected, tool must match one of them
    if (filters.costTypes.length > 0) {
      const kostnadLower = tool.kostnad.toLowerCase();
      const isGratis = (kostnadLower.includes('gratis') && !kostnadLower.includes('gratis med kjøp')) ||
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

    // Difficulty filter - if difficulties are selected, tool must match one of them
    if (filters.difficulties.length > 0) {
      const difficulty = parseInt(tool.vanskelighetsgrad || '0');
      if (!filters.difficulties.includes(difficulty)) {
        return false;
      }
    }

    // Design quality filter - if design qualities are selected, tool must match one of them
    if (filters.designQualities.length > 0) {
      const designQuality = parseInt(tool.designkvalitet || '0');
      if (!filters.designQualities.includes(designQuality)) {
        return false;
      }
    }

    // Registration requirement filter - if registration requirements are selected, tool must match one of them
    if (filters.registrationRequirements.length > 0) {
      const requirement = tool.kreverRegistrering || 'Nei';
      if (!filters.registrationRequirements.includes(requirement)) {
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
        (tool.språk && tool.språk.toLowerCase().includes(query)) ||
        (tool.veiledning && tool.veiledning.toLowerCase().includes(query))
      );
    }

    return true;
  }), [tools, filters]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K: Open command palette OR focus search if side panel is open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isSidePanelExpanded && searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        } else {
          setIsCommandPaletteOpen(true);
        }
      }

      // Cmd/Ctrl+B: Toggle side panel
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidePanelExpanded(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidePanelExpanded]);

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
      </header>

      <main className="main-content">
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
          selectedDifficulties={filters.difficulties}
          onDifficultiesChange={(difficulties) =>
            setFilters(prev => ({ ...prev, difficulties }))
          }
          selectedDesignQualities={filters.designQualities}
          onDesignQualitiesChange={(designQualities) =>
            setFilters(prev => ({ ...prev, designQualities }))
          }
          selectedRegistrationRequirements={filters.registrationRequirements}
          onRegistrationRequirementsChange={(registrationRequirements) =>
            setFilters(prev => ({ ...prev, registrationRequirements }))
          }
          searchQuery={filters.searchQuery}
          onSearchQueryChange={(searchQuery) =>
            setFilters(prev => ({ ...prev, searchQuery }))
          }
          onOpenInfo={() => setIsAttributionModalOpen(true)}
          isExpanded={isSidePanelExpanded}
          onToggleExpanded={() => setIsSidePanelExpanded(prev => !prev)}
          searchInputRef={searchInputRef}
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

      <AttributionModal
        isOpen={isAttributionModalOpen}
        onClose={() => setIsAttributionModalOpen(false)}
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
