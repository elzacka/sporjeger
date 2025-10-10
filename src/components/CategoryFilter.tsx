import { useState } from 'react';
import { FilterModal } from './FilterModal';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedCostTypes: string[];
  onCostTypesChange: (costTypes: string[]) => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onCategoriesChange,
  selectedCostTypes,
  onCostTypesChange
}: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);

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
    </>
  );
}