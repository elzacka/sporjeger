interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCostType: 'all' | 'gratis' | 'betalt' | 'gratis_med_kjop';
  onCostTypeChange: (costType: 'all' | 'gratis' | 'betalt' | 'gratis_med_kjop') => void;
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  selectedCostType,
  onCostTypeChange 
}: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <div className="filter-section">
        <label className="filter-label">Kategori:</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Alle kategorier</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="filter-section">
        <label className="filter-label">Kostnad:</label>
        <select 
          value={selectedCostType} 
          onChange={(e) => onCostTypeChange(e.target.value as 'all' | 'gratis' | 'betalt' | 'gratis_med_kjop')}
          className="filter-select"
        >
          <option value="all">Alle</option>
          <option value="gratis">Gratis</option>
          <option value="betalt">Betalt</option>
          <option value="gratis_med_kjop">Gratis med kjøp</option>
        </select>
      </div>
    </div>
  );
}