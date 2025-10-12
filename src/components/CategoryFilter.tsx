import { useState } from 'react';
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
  toolCount: number;
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
  toolCount
}: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const getSelectedCategoryLabel = () => {
    if (selectedCategories.length === 0) return 'Alle';
    if (selectedCategories.length === 1) return selectedCategories[0];
    return `${selectedCategories.length} valgt`;
  };

  return (
    <>
      <div className="category-filter">
        <button
          className="filter-toggle-mobile"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <span className="material-symbols-outlined">
            {isExpanded ? 'expand_less' : 'expand_more'}
          </span>
          <span>Filtrer</span>
          <span className="tool-count-badge">{toolCount} verktøy</span>
        </button>

        <div className={`filter-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="filter-section">
            <label className="filter-label">Kategori:</label>
            <button
              className="filter-button"
              onClick={() => setIsCategoryModalOpen(true)}
            >
              <span>{getSelectedCategoryLabel()}</span>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          <div className="difficulty-filter-section">
            <span className="filter-label">Vanskelighetsgrad:</span>
            <div className="difficulty-buttons">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  className={`difficulty-filter-btn ${selectedDifficulties.includes(level) ? 'active' : ''}`}
                  onClick={() => {
                    if (selectedDifficulties.includes(level)) {
                      onDifficultiesChange(selectedDifficulties.filter(d => d !== level));
                    } else {
                      onDifficultiesChange([...selectedDifficulties, level]);
                    }
                  }}
                  title={`Vanskelighetsgrad ${level}`}
                >
                  {[...Array(level)].map((_, i) => (
                    <svg
                      key={i}
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ display: 'inline-block' }}
                    >
                      <path
                        d="M8 1.5l1.545 4.757h5.005l-4.045 2.986 1.545 4.757L8 11.014 3.95 14l1.545-4.757L1.45 6.257h5.005z"
                        fill="currentColor"
                      />
                    </svg>
                  ))}
                </button>
              ))}
            </div>
          </div>

          <div className="cost-filter-section">
            <span className="filter-label">Kostnad:</span>
            <div className="cost-buttons">
              {[
                { value: 'gratis', label: 'Gratis', class: 'cost-free' },
                { value: 'gratis_med_kjop', label: 'Gratis m. kjøp', class: 'cost-partial' },
                { value: 'betalt', label: 'Betalt', class: 'cost-paid' }
              ].map(({ value, label, class: costClass }) => (
                <button
                  key={value}
                  className={`cost-filter-btn ${costClass} ${selectedCostTypes.includes(value) ? 'active' : ''}`}
                  onClick={() => {
                    if (selectedCostTypes.includes(value)) {
                      onCostTypesChange(selectedCostTypes.filter(c => c !== value));
                    } else {
                      onCostTypesChange([...selectedCostTypes, value]);
                    }
                  }}
                  title={label}
                >
                  <span className="cost-label">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="registration-filter-section">
            <span className="filter-label">Registrering:</span>
            <div className="registration-buttons">
              {[
                { value: 'Nei', label: 'Nei', class: 'reg-none', icon: 'no_accounts' },
                { value: 'Delvis', label: 'Delvis', class: 'reg-partial', icon: 'account_circle' },
                { value: 'Ja', label: 'Ja', class: 'reg-required', icon: 'account_circle' }
              ].map(({ value, label, class: regClass, icon }) => (
                <button
                  key={value}
                  className={`registration-filter-btn ${regClass} ${selectedRegistrationRequirements.includes(value) ? 'active' : ''}`}
                  onClick={() => {
                    if (selectedRegistrationRequirements.includes(value)) {
                      onRegistrationRequirementsChange(selectedRegistrationRequirements.filter(r => r !== value));
                    } else {
                      onRegistrationRequirementsChange([...selectedRegistrationRequirements, value]);
                    }
                  }}
                  title={`${label} registrering`}
                >
                  <span className="material-symbols-outlined reg-icon">{icon}</span>
                  <span className="reg-label">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="design-quality-filter-section">
            <span className="filter-label">Design:</span>
            <div className="design-quality-buttons">
              {[
                { value: 3, label: 'Godt', class: 'quality-good' },
                { value: 2, label: 'Middels', class: 'quality-medium' },
                { value: 1, label: 'Dårlig', class: 'quality-poor' }
              ].map(({ value, label, class: qualityClass }) => (
                <button
                  key={value}
                  className={`design-quality-filter-btn ${qualityClass} ${selectedDesignQualities.includes(value) ? 'active' : ''}`}
                  onClick={() => {
                    if (selectedDesignQualities.includes(value)) {
                      onDesignQualitiesChange(selectedDesignQualities.filter(q => q !== value));
                    } else {
                      onDesignQualitiesChange([...selectedDesignQualities, value]);
                    }
                  }}
                  title={`${label} grensesnitt`}
                >
                  <span className="material-symbols-outlined quality-icon">circle</span>
                  <span className="quality-label">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FilterModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Velg kategori"
        options={categoryOptions}
        selectedValues={selectedCategories}
        onToggle={handleCategoryToggle}
      />
    </>
  );
}