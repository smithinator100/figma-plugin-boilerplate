/**
 * Badge component - Vanilla JavaScript version of shadcn/ui Badge
 * Provides styled badges with different variants using Tailwind CSS
 */

// Import utilities (adjust path as needed)
const { cn, cva } = window.shadcnUtils || require('../../lib/utils.js');

/**
 * Badge variant styles using Class Variance Authority pattern
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Creates a badge element with shadcn/ui styling
 * @param {Object} options - Badge configuration options
 * @param {string} [options.variant='default'] - Badge variant (default, secondary, destructive, outline)
 * @param {string} [options.className] - Additional CSS classes
 * @param {string} [options.text] - Badge text content
 * @param {HTMLElement|string} [options.content] - Badge content (HTML element or string)
 * @param {function} [options.onClick] - Click event handler
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created badge element
 */
function createBadge(options = {}) {
  const {
    variant = 'default',
    className = '',
    text = '',
    content = null,
    onClick = null,
    attributes = {}
  } = options;

  const badge = document.createElement('div');
  
  // Apply variant styles
  badge.className = badgeVariants({ variant, className });
  
  // Set content
  if (content) {
    if (typeof content === 'string') {
      badge.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      badge.appendChild(content);
    }
  } else if (text) {
    badge.textContent = text;
  }
  
  // Add click handler if provided
  if (onClick && typeof onClick === 'function') {
    badge.style.cursor = 'pointer';
    badge.addEventListener('click', onClick);
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    badge.setAttribute(key, value);
  });
  
  return badge;
}

/**
 * Badge class for more advanced usage
 */
class Badge {
  constructor(options = {}) {
    this.element = createBadge(options);
    this.options = options;
  }
  
  /**
   * Update badge variant
   * @param {string} variant - New variant
   */
  setVariant(variant) {
    this.options.variant = variant;
    this.element.className = badgeVariants({
      variant,
      className: this.options.className
    });
  }
  
  /**
   * Set badge text content
   * @param {string} text - New text content
   */
  setText(text) {
    this.element.textContent = text;
  }
  
  /**
   * Set badge HTML content
   * @param {string} html - New HTML content
   */
  setHTML(html) {
    this.element.innerHTML = html;
  }
  
  /**
   * Add content to the badge
   * @param {HTMLElement} element - Element to append
   */
  appendChild(element) {
    this.element.appendChild(element);
  }
  
  /**
   * Clear badge content
   */
  clear() {
    this.element.innerHTML = '';
  }
  
  /**
   * Show the badge
   */
  show() {
    this.element.style.display = '';
  }
  
  /**
   * Hide the badge
   */
  hide() {
    this.element.style.display = 'none';
  }
  
  /**
   * Toggle badge visibility
   */
  toggle() {
    if (this.element.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  }
  
  /**
   * Add event listener
   * @param {string} event - Event type
   * @param {function} handler - Event handler
   */
  on(event, handler) {
    this.element.addEventListener(event, handler);
  }
  
  /**
   * Remove event listener
   * @param {string} event - Event type
   * @param {function} handler - Event handler
   */
  off(event, handler) {
    this.element.removeEventListener(event, handler);
  }
  
  /**
   * Get the DOM element
   * @returns {HTMLDivElement} The badge element
   */
  getElement() {
    return this.element;
  }
  
  /**
   * Append to a parent element
   * @param {HTMLElement} parent - Parent element
   */
  appendTo(parent) {
    parent.appendChild(this.element);
  }
}

/**
 * Creates a removable badge with a close button
 * @param {Object} options - Badge configuration options
 * @param {function} [options.onRemove] - Callback when badge is removed
 * @param {string} [options.closeButtonText='×'] - Text for close button
 * @returns {Badge} Badge instance with remove functionality
 */
function createRemovableBadge(options = {}) {
  const { onRemove = null, closeButtonText = '×', ...badgeOptions } = options;
  
  const badge = new Badge(badgeOptions);
  
  // Create close button
  const closeButton = document.createElement('span');
  closeButton.textContent = closeButtonText;
  closeButton.className = 'ml-1 cursor-pointer hover:bg-black/20 rounded-full w-4 h-4 flex items-center justify-center';
  closeButton.style.fontSize = '12px';
  
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (onRemove && typeof onRemove === 'function') {
      onRemove(badge);
    } else {
      badge.element.remove();
    }
  });
  
  badge.appendChild(closeButton);
  
  return badge;
}

/**
 * Creates a notification badge (typically used for counts)
 * @param {Object} options - Badge configuration options
 * @param {number|string} [options.count=0] - Count to display
 * @param {number} [options.maxCount=99] - Maximum count to display before showing "99+"
 * @param {boolean} [options.showZero=false] - Whether to show badge when count is 0
 * @returns {Badge} Badge instance with count functionality
 */
function createNotificationBadge(options = {}) {
  const {
    count = 0,
    maxCount = 99,
    showZero = false,
    ...badgeOptions
  } = options;
  
  const badge = new Badge({
    variant: 'destructive',
    className: 'min-w-5 h-5 text-xs justify-center',
    ...badgeOptions
  });
  
  /**
   * Update the count display
   * @param {number} newCount - New count value
   */
  badge.setCount = function(newCount) {
    if (newCount === 0 && !showZero) {
      this.hide();
      return;
    }
    
    this.show();
    const displayCount = newCount > maxCount ? `${maxCount}+` : newCount.toString();
    this.setText(displayCount);
  };
  
  // Set initial count
  badge.setCount(count);
  
  return badge;
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createBadge,
    Badge,
    badgeVariants,
    createRemovableBadge,
    createNotificationBadge
  };
} else if (typeof window !== 'undefined') {
  window.shadcnBadge = {
    createBadge,
    Badge,
    badgeVariants,
    createRemovableBadge,
    createNotificationBadge
  };
}

// Usage examples:
/*
// Simple badge creation
const badge1 = createBadge({
  text: 'New',
  variant: 'default'
});

// Badge with click handler
const badge2 = createBadge({
  text: 'Clickable',
  variant: 'secondary',
  onClick: () => console.log('Badge clicked!')
});

// Using Badge class
const badge3 = new Badge({
  text: 'Dynamic',
  variant: 'outline'
});

// Change variant dynamically
setTimeout(() => {
  badge3.setVariant('destructive');
  badge3.setText('Updated!');
}, 2000);

// Removable badge
const removableBadge = createRemovableBadge({
  text: 'Remove me',
  variant: 'secondary',
  onRemove: (badge) => {
    console.log('Badge removed');
    badge.element.remove();
  }
});

// Notification badge
const notificationBadge = createNotificationBadge({
  count: 5,
  maxCount: 99
});

// Update notification count
setTimeout(() => {
  notificationBadge.setCount(150); // Will show "99+"
}, 3000);

// Append to DOM
document.body.appendChild(badge1);
document.body.appendChild(badge2);
badge3.appendTo(document.body);
removableBadge.appendTo(document.body);
notificationBadge.appendTo(document.body);
*/
