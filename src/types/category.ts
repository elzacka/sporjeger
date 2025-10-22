/**
 * Hierarchical category structure for organizing OSINT tools
 */
export interface CategoryNode {
  /** Category name */
  name: string;
  /** Number of tools in this category */
  count: number;
  /** Nested subcategories */
  children: Map<string, CategoryNode>;
}
