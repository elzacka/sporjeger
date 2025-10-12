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
  onRegistrationRequirementsChange
}: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));

  const costOptions = [
    { value: 'gratis', label: 'Gratis' },
    { value: 'betalt', label: 'Betalt' },
    { value: 'gratis_med_kjop', label: 'Gratis med kjøp' }
  ];

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const handleCostTypeToggle = (costType: string) => {
    if (selectedCostTypes.includes(costType)) {
      onCostTypesChange(selectedCostTypes.filter(c => c !== costType));
    } else {
      onCostTypesChange([...selectedCostTypes, costType]);
    }
  };

  const handleRegistrationRequirementToggle = (requirement: string) => {
    if (selectedRegistrationRequirements.includes(requirement)) {
      onRegistrationRequirementsChange(selectedRegistrationRequirements.filter(r => r !== requirement));
    } else {
      onRegistrationRequirementsChange([...selectedRegistrationRequirements, requirement]);
    }
  };

  const getSelectedCategoryLabel = () => {
    if (selectedCategories.length === 0) return 'Alle';
    if (selectedCategories.length === 1) return selectedCategories[0];
    return `${selectedCategories.length} valgt`;
  };

  const getSelectedCostLabel = () => {
    if (selectedCostTypes.length === 0) return 'Alle';
    if (selectedCostTypes.length === 1) {
      const option = costOptions.find(opt => opt.value === selectedCostTypes[0]);
      return option?.label || 'Alle';
    }
    return `${selectedCostTypes.length} valgt`;
  };

  const registrationOptions = [
    { value: 'Ja', label: 'Krever bruker' },
    { value: 'Delvis', label: 'Delvis tilgjengelig' },
    { value: 'Nei', label: 'Ingen registrering' }
  ];

  const getSelectedRegistrationLabel = () => {
    if (selectedRegistrationRequirements.length === 0) return 'Alle';
    if (selectedRegistrationRequirements.length === 1) {
      const option = registrationOptions.find(opt => opt.value === selectedRegistrationRequirements[0]);
      return option?.label || 'Alle';
    }
    return `${selectedRegistrationRequirements.length} valgt`;
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

          <div className="filter-section">
            <label className="filter-label">Kostnad:</label>
            <button
              className="filter-button"
              onClick={() => setIsCostModalOpen(true)}
            >
              <span>{getSelectedCostLabel()}</span>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>

          <div className="filter-section">
            <label className="filter-label">Registrering:</label>
            <button
              className="filter-button"
              onClick={() => setIsRegistrationModalOpen(true)}
            >
              <span>{getSelectedRegistrationLabel()}</span>
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

          <div className="design-quality-filter-section">
            <span className="filter-label">Designkvalitet:</span>
            <div className="design-quality-buttons">
              {[
                { value: 1, label: 'Dårlig', icon: '🔴' },
                { value: 2, label: 'Middels', icon: '🟡' },
                { value: 3, label: 'God', icon: '🟢' }
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  className={`design-quality-filter-btn quality-${value} ${selectedDesignQualities.includes(value) ? 'active' : ''}`}
                  onClick={() => {
                    if (selectedDesignQualities.includes(value)) {
                      onDesignQualitiesChange(selectedDesignQualities.filter(q => q !== value));
                    } else {
                      onDesignQualitiesChange([...selectedDesignQualities, value]);
                    }
                  }}
                  title={`${label} grensesnitt`}
                >
                  <span className="quality-icon">{icon}</span>
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

      <FilterModal
        isOpen={isCostModalOpen}
        onClose={() => setIsCostModalOpen(false)}
        title="Velg kostnad"
        options={costOptions}
        selectedValues={selectedCostTypes}
        onToggle={handleCostTypeToggle}
      />

      <FilterModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        title="Velg registreringskrav"
        options={registrationOptions}
        selectedValues={selectedRegistrationRequirements}
        onToggle={handleRegistrationRequirementToggle}
      />
    </>
  );
}