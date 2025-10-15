import { useState } from 'react';
import { FilterModal } from './FilterModal';
import { toggleArrayItem } from '../utils/arrayHelpers';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  toolCount: number;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onCategoriesChange,
  toolCount
}: CategoryFilterProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));

  const handleCategoryToggle = (category: string) => {
    onCategoriesChange(toggleArrayItem(selectedCategories, category));
  };

  const getSelectedCategoryLabel = () => {
    if (selectedCategories.length === 0) return 'Alle';
    if (selectedCategories.length === 1) return selectedCategories[0];
    return `${selectedCategories.length} valgt`;
  };

  return (
    <>
      <div className="category-filter">
        <div className="filter-section">
          <label className="filter-label">Kategori:</label>
          <button
            className="filter-button"
            onClick={() => setIsCategoryModalOpen(true)}
            aria-label={`Velg kategori. ${getSelectedCategoryLabel()} valgt`}
          >
            <span>{getSelectedCategoryLabel()}</span>
            <span className="material-symbols-outlined">expand_more</span>
          </button>
          <span className="tool-count-badge">{toolCount} verktøy</span>
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
