/**
 * Strips Tailwind variant prefixes (hover:, md:, dark:, etc.)
 * from a class name, returning just the base utility class.
 */
export function stripVariants(className: string): string {
  const parts = className.split(':');
  return parts[parts.length - 1];
}

export function extractVariants(className: string): { variants: string[]; base: string } {
  const parts = className.split(':');
  const base = parts[parts.length - 1];
  const variants = parts.slice(0, -1);
  return { variants, base };
}
