/**
 * Utility functions for array manipulation
 */

/**
 * Toggle an item in an array
 *
 * If the item exists in the array, it removes it.
 * If the item doesn't exist, it adds it.
 *
 * @param array - The source array
 * @param item - The item to toggle
 * @returns New array with the item toggled
 *
 * @example
 * ```ts
 * toggleArrayItem(['a', 'b'], 'c')  // ['a', 'b', 'c']
 * toggleArrayItem(['a', 'b'], 'b')  // ['a']
 * toggleArrayItem([1, 2, 3], 2)     // [1, 3]
 * toggleArrayItem([], 'first')      // ['first']
 * ```
 */
export function toggleArrayItem<T>(array: T[], item: T): T[] {
  return array.includes(item)
    ? array.filter(i => i !== item)
    : [...array, item];
}

/**
 * Remove duplicates from an array
 *
 * @param array - The source array
 * @returns New array with unique items only
 *
 * @example
 * ```ts
 * unique([1, 2, 2, 3, 3, 3])  // [1, 2, 3]
 * unique(['a', 'b', 'a'])     // ['a', 'b']
 * ```
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Check if arrays have any common elements
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns True if arrays share at least one element
 *
 * @example
 * ```ts
 * hasCommonElements([1, 2, 3], [3, 4, 5])  // true
 * hasCommonElements([1, 2], [3, 4])        // false
 * ```
 */
export function hasCommonElements<T>(arr1: T[], arr2: T[]): boolean {
  return arr1.some(item => arr2.includes(item));
}
