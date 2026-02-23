import { TailwindCategory } from '../types/categories';
import { TAXONOMY_RULES } from './taxonomyMap';
import { stripVariants } from './variantStripper';

/**
 * Categorizes a single Tailwind class into its category.
 * Handles variant prefixes (hover:, md:, etc.) by stripping them first.
 */
export function categorizeClass(rawClass: string): TailwindCategory {
  const baseClass = stripVariants(rawClass);

  for (const rule of TAXONOMY_RULES) {
    if (rule.pattern.test(baseClass)) {
      return rule.category;
    }
  }

  return TailwindCategory.Unknown;
}
