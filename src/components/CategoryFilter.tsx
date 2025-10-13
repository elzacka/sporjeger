import { useState } from 'react';
import type { RefObject } from 'react';
import { FilterModal } from './FilterModal';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedCostTypes: string[];
  onCostTypesChange: (costTypes: string[]) => void;
  selectedDifficulties: number[];
  onDifficultiesChange: (difficulties: number[]) => void;
  selectedDesignQualities: number[];
  onDesignQualitiesChange: (designQualities: number[]) => void;
  selectedRegistrationRequirements: string[];
  onRegistrationRequirementsChange: (registrationRequirements: string[]) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onOpenInfo: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onCategoriesChange,
  selectedCostTypes,
  onCostTypesChange,
  selectedDifficulties,
  onDifficultiesChange,
  selectedDesignQualities,
  onDesignQualitiesChange,
  selectedRegistrationRequirements,
  onRegistrationRequirementsChange,
  searchQuery,
  onSearchQueryChange,
  onOpenInfo,
  isExpanded,
  onToggleExpanded,
  searchInputRef
}: CategoryFilterProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedCostTypes.length > 0 ||
    selectedDifficulties.length > 0 ||
    selectedDesignQualities.length > 0 ||
    selectedRegistrationRequirements.length > 0;

  const handleClearAllFilters = () => {
    onCategoriesChange([]);
    onCostTypesChange([]);
    onDifficultiesChange([]);
    onDesignQualitiesChange([]);
    onRegistrationRequirementsChange([]);
  };

  const getDisplayText = (selected: string[] | number[], allLabel: string = 'Alle') => {
    if (selected.length === 0) return allLabel;
    return `${selected.length} valgt`;
  };

  // Category handlers
  const handleToggleCategory = (value: string) => {
    if (selectedCategories.includes(value)) {
      onCategoriesChange(selectedCategories.filter(v => v !== value));
    } else {
      onCategoriesChange([...selectedCategories, value]);
    }
  };

  // Difficulty handlers
  const handleToggleDifficulty = (value: string) => {
    const numValue = parseInt(value);
    if (selectedDifficulties.includes(numValue)) {
      onDifficultiesChange(selectedDifficulties.filter(v => v !== numValue));
    } else {
      onDifficultiesChange([...selectedDifficulties, numValue]);
    }
  };

  // Cost handlers
  const handleToggleCost = (value: string) => {
    if (selectedCostTypes.includes(value)) {
      onCostTypesChange(selectedCostTypes.filter(v => v !== value));
    } else {
      onCostTypesChange([...selectedCostTypes, value]);
    }
  };

  // Registration handlers
  const handleToggleRegistration = (value: string) => {
    if (selectedRegistrationRequirements.includes(value)) {
      onRegistrationRequirementsChange(selectedRegistrationRequirements.filter(v => v !== value));
    } else {
      onRegistrationRequirementsChange([...selectedRegistrationRequirements, value]);
    }
  };

  // Design quality handlers
  const handleToggleDesignQuality = (value: string) => {
    const numValue = parseInt(value);
    if (selectedDesignQualities.includes(numValue)) {
      onDesignQualitiesChange(selectedDesignQualities.filter(v => v !== numValue));
    } else {
      onDesignQualitiesChange([...selectedDesignQualities, numValue]);
    }
  };

  return (
    <>
      <div className={`side-panel ${isExpanded ? 'open' : 'closed'}`}>
        <div className="side-panel-content">
          <div className="side-panel-section">
            <label className="side-panel-label">Søk</label>
            <div className="search-input-wrapper">
              <input
                ref={searchInputRef}
                type="text"
                className="side-panel-search"
                placeholder="Søk etter verktøy..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
              />
              <kbd className="search-shortcut">⌘K</kbd>
            </div>
            {hasActiveFilters && (
              <button
                className="clear-filters-btn"
                onClick={handleClearAllFilters}
                title="Nullstill alle filtre"
              >
                <span className="material-symbols-outlined">filter_alt_off</span>
                <span>Nullstill filtre</span>
              </button>
            )}
          </div>

          <div className="side-panel-section">
            <label className="side-panel-label">Kategori</label>
            <button
              className="filter-dropdown-btn"
              onClick={() => setOpenModal('category')}
            >
              <span>{getDisplayText(selectedCategories)}</span>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          <div className="side-panel-section">
            <label className="side-panel-label">Vanskelighetsgrad</label>
            <button
              className="filter-dropdown-btn"
              onClick={() => setOpenModal('difficulty')}
            >
              <span>{getDisplayText(selectedDifficulties)}</span>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          <div className="side-panel-section">
            <label className="side-panel-label">Kostnad</label>
            <button
              className="filter-dropdown-btn"
              onClick={() => setOpenModal('cost')}
            >
              <span>{getDisplayText(selectedCostTypes)}</span>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          <div className="side-panel-section">
            <label className="side-panel-label">Registrering</label>
            <button
              className="filter-dropdown-btn"
              onClick={() => setOpenModal('registration')}
            >
              <span>{getDisplayText(selectedRegistrationRequirements)}</span>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          <div className="side-panel-section">
            <label className="side-panel-label">Designkvalitet</label>
            <button
              className="filter-dropdown-btn"
              onClick={() => setOpenModal('design')}
            >
              <span>{getDisplayText(selectedDesignQualities)}</span>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          <div className="side-panel-footer">
            <button
              className="info-button"
              onClick={onOpenInfo}
              title="Om Sporjeger"
            >
              <span className="material-symbols-outlined">info</span>
              <span>Info</span>
            </button>
          </div>
        </div>
      </div>

      {!openModal && (
        <button
          className="side-panel-toggle"
          onClick={onToggleExpanded}
          aria-expanded={isExpanded}
          title={isExpanded ? 'Lukk filterpanel (⌘B)' : 'Åpne filterpanel (⌘B)'}
        >
          <span className="material-symbols-outlined">
            {isExpanded ? 'chevron_left' : 'chevron_right'}
          </span>
        </button>
      )}

      {/* Category Modal */}
      <FilterModal
        isOpen={openModal === 'category'}
        onClose={() => setOpenModal(null)}
        title="Kategori"
        options={categories.map(cat => ({ value: cat, label: cat }))}
        selectedValues={selectedCategories}
        onToggle={handleToggleCategory}
      />

      {/* Difficulty Modal */}
      <FilterModal
        isOpen={openModal === 'difficulty'}
        onClose={() => setOpenModal(null)}
        title="Vanskelighetsgrad"
        options={[
          { value: '1', label: '★ Veldig enkel' },
          { value: '2', label: '★★ Enkel' },
          { value: '3', label: '★★★ Middels' },
          { value: '4', label: '★★★★ Avansert' },
          { value: '5', label: '★★★★★ Ekspert' }
        ]}
        selectedValues={selectedDifficulties.map(String)}
        onToggle={handleToggleDifficulty}
      />

      {/* Cost Modal */}
      <FilterModal
        isOpen={openModal === 'cost'}
        onClose={() => setOpenModal(null)}
        title="Kostnad"
        options={[
          { value: 'gratis', label: 'GRATIS' },
          { value: 'gratis_med_kjop', label: 'GRATIS M. KJØP' },
          { value: 'betalt', label: 'BETALT' }
        ]}
        selectedValues={selectedCostTypes}
        onToggle={handleToggleCost}
      />

      {/* Registration Modal */}
      <FilterModal
        isOpen={openModal === 'registration'}
        onClose={() => setOpenModal(null)}
        title="Registrering"
        options={[
          { value: 'Nei', label: 'Nei', icon: 'no_accounts' },
          { value: 'Delvis', label: 'Delvis', icon: 'account_circle' },
          { value: 'Ja', label: 'Ja', icon: 'account_circle' }
        ]}
        selectedValues={selectedRegistrationRequirements}
        onToggle={handleToggleRegistration}
      />

      {/* Design Quality Modal */}
      <FilterModal
        isOpen={openModal === 'design'}
        onClose={() => setOpenModal(null)}
        title="Designkvalitet"
        options={[
          { value: '3', label: 'God', icon: 'circle' },
          { value: '2', label: 'Middels', icon: 'circle' },
          { value: '1', label: 'Dårlig', icon: 'circle' }
        ]}
        selectedValues={selectedDesignQualities.map(String)}
        onToggle={handleToggleDesignQuality}
      />
    </>
  );
}
