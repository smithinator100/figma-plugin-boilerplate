/**
 * Vanilla JavaScript utilities for shadcn/ui components
 * Provides class name merging functionality similar to clsx and tailwind-merge
 */

/**
 * Simple clsx implementation for combining class names
 * @param {...any} inputs - Class name inputs (strings, objects, arrays)
 * @returns {string} Combined class names
 */
function clsx(...inputs) {
  const classes = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const inner = clsx(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) classes.push(key);
      }
    }
  }
  
  return classes.join(' ');
}

/**
 * Simple Tailwind class merging - removes duplicate classes
 * This is a simplified version that handles basic Tailwind class conflicts
 * @param {string} classNames - Space-separated class names
 * @returns {string} Deduplicated class names
 */
function twMerge(classNames) {
  if (!classNames) return '';
  
  const classes = classNames.split(' ').filter(Boolean);
  const classMap = new Map();
  
  // Simple conflict resolution for common Tailwind patterns
  const conflictGroups = {
    // Spacing
    'p-': ['p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-'],
    'px-': ['p-', 'px-', 'pl-', 'pr-'],
    'py-': ['p-', 'py-', 'pt-', 'pb-'],
    'pt-': ['p-', 'py-', 'pt-'],
    'pr-': ['p-', 'px-', 'pr-'],
    'pb-': ['p-', 'py-', 'pb-'],
    'pl-': ['p-', 'px-', 'pl-'],
    'm-': ['m-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-'],
    'mx-': ['m-', 'mx-', 'ml-', 'mr-'],
    'my-': ['m-', 'my-', 'mt-', 'mb-'],
    'mt-': ['m-', 'my-', 'mt-'],
    'mr-': ['m-', 'mx-', 'mr-'],
    'mb-': ['m-', 'my-', 'mb-'],
    'ml-': ['m-', 'mx-', 'ml-'],
    
    // Sizing
    'w-': ['w-'],
    'h-': ['h-'],
    
    // Colors
    'bg-': ['bg-'],
    'text-': ['text-'],
    'border-': ['border-'],
    
    // Display
    'block': ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'hidden'],
    'inline': ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'hidden'],
    'flex': ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'hidden'],
    'grid': ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'hidden'],
    'hidden': ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'hidden'],
  };
  
  // Process classes in order, handling conflicts
  for (const className of classes) {
    let conflictKey = className;
    
    // Find the conflict group for this class
    for (const [key, group] of Object.entries(conflictGroups)) {
      if (className.startsWith(key) || group.includes(className)) {
        conflictKey = key;
        break;
      }
    }
    
    classMap.set(conflictKey, className);
  }
  
  return Array.from(classMap.values()).join(' ');
}

/**
 * Combines clsx and twMerge functionality
 * @param {...any} inputs - Class name inputs
 * @returns {string} Combined and merged class names
 */
function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

/**
 * Class Variance Authority (CVA) implementation
 * Creates a function that generates class names based on variants
 * @param {string} base - Base class names
 * @param {object} config - Configuration object with variants and defaults
 * @returns {function} Function that generates class names based on props
 */
function cva(base, config = {}) {
  const { variants = {}, defaultVariants = {} } = config;
  
  return function(props = {}) {
    let classes = [base];
    
    // Apply default variants
    const mergedProps = { ...defaultVariants, ...props };
    
    // Apply variant classes
    for (const [variantKey, variantValue] of Object.entries(mergedProps)) {
      if (variants[variantKey] && variants[variantKey][variantValue]) {
        classes.push(variants[variantKey][variantValue]);
      }
    }
    
    // Add custom className if provided
    if (props.className) {
      classes.push(props.className);
    }
    
    return cn(...classes);
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { clsx, twMerge, cn, cva };
} else if (typeof window !== 'undefined') {
  window.shadcnUtils = { clsx, twMerge, cn, cva };
}
