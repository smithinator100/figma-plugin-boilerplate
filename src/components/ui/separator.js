/**
 * Separator component - Vanilla JavaScript version of shadcn/ui Separator
 * Provides styled separators with Tailwind CSS styling
 */

// Import utilities (adjust path as needed)
const { cn } = window.shadcnUtils || require('../../lib/utils.js');

/**
 * Creates a separator element with shadcn/ui styling
 * @param {Object} options - Separator configuration options
 * @param {string} [options.orientation='horizontal'] - Separator orientation (horizontal, vertical)
 * @param {boolean} [options.decorative=true] - Whether the separator is decorative
 * @param {string} [options.className] - Additional CSS classes
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created separator element
 */
function createSeparator(options = {}) {
  const {
    orientation = 'horizontal',
    decorative = true,
    className = '',
    attributes = {}
  } = options;

  const separator = document.createElement('div');
  
  // Set ARIA attributes
  if (decorative) {
    separator.setAttribute('aria-hidden', 'true');
  } else {
    separator.setAttribute('role', 'separator');
    if (orientation === 'vertical') {
      separator.setAttribute('aria-orientation', 'vertical');
    }
  }
  
  // Apply styling based on orientation
  separator.className = cn(
    "shrink-0 bg-border",
    orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
    className
  );
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    separator.setAttribute(key, value);
  });
  
  return separator;
}

/**
 * Separator class for more advanced usage
 */
class Separator {
  constructor(options = {}) {
    this.element = createSeparator(options);
    this.options = options;
  }
  
  /**
   * Change separator orientation
   * @param {string} orientation - New orientation (horizontal, vertical)
   */
  setOrientation(orientation) {
    this.options.orientation = orientation;
    
    // Remove existing orientation classes
    this.element.classList.remove('h-[1px]', 'w-full', 'h-full', 'w-[1px]');
    
    // Add new orientation classes
    if (orientation === 'horizontal') {
      this.element.classList.add('h-[1px]', 'w-full');
      this.element.removeAttribute('aria-orientation');
    } else {
      this.element.classList.add('h-full', 'w-[1px]');
      if (!this.options.decorative) {
        this.element.setAttribute('aria-orientation', 'vertical');
      }
    }
  }
  
  /**
   * Set decorative state
   * @param {boolean} decorative - Whether separator is decorative
   */
  setDecorative(decorative) {
    this.options.decorative = decorative;
    
    if (decorative) {
      this.element.setAttribute('aria-hidden', 'true');
      this.element.removeAttribute('role');
      this.element.removeAttribute('aria-orientation');
    } else {
      this.element.removeAttribute('aria-hidden');
      this.element.setAttribute('role', 'separator');
      if (this.options.orientation === 'vertical') {
        this.element.setAttribute('aria-orientation', 'vertical');
      }
    }
  }
  
  /**
   * Show the separator
   */
  show() {
    this.element.style.display = '';
  }
  
  /**
   * Hide the separator
   */
  hide() {
    this.element.style.display = 'none';
  }
  
  /**
   * Toggle separator visibility
   */
  toggle() {
    if (this.element.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  }
  
  /**
   * Get the DOM element
   * @returns {HTMLDivElement} The separator element
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
 * Creates a text separator with content in the middle
 * @param {Object} options - Text separator configuration
 * @param {string} options.text - Text to display in the middle
 * @param {string} [options.orientation='horizontal'] - Separator orientation
 * @param {string} [options.className] - Additional CSS classes for container
 * @param {string} [options.textClassName] - Additional CSS classes for text
 * @param {string} [options.separatorClassName] - Additional CSS classes for separator lines
 * @returns {HTMLDivElement} The created text separator element
 */
function createTextSeparator(options = {}) {
  const {
    text,
    orientation = 'horizontal',
    className = '',
    textClassName = '',
    separatorClassName = ''
  } = options;
  
  const container = document.createElement('div');
  
  if (orientation === 'horizontal') {
    container.className = cn('flex items-center', className);
    
    // Left separator
    const leftSep = createSeparator({
      orientation: 'horizontal',
      className: cn('flex-1', separatorClassName)
    });
    
    // Text content
    const textElement = document.createElement('span');
    textElement.className = cn('px-3 text-sm text-muted-foreground', textClassName);
    textElement.textContent = text;
    
    // Right separator
    const rightSep = createSeparator({
      orientation: 'horizontal',
      className: cn('flex-1', separatorClassName)
    });
    
    container.appendChild(leftSep);
    container.appendChild(textElement);
    container.appendChild(rightSep);
  } else {
    container.className = cn('flex flex-col items-center', className);
    
    // Top separator
    const topSep = createSeparator({
      orientation: 'vertical',
      className: cn('flex-1', separatorClassName)
    });
    
    // Text content
    const textElement = document.createElement('span');
    textElement.className = cn('py-3 text-sm text-muted-foreground', textClassName);
    textElement.textContent = text;
    
    // Bottom separator
    const bottomSep = createSeparator({
      orientation: 'vertical',
      className: cn('flex-1', separatorClassName)
    });
    
    container.appendChild(topSep);
    container.appendChild(textElement);
    container.appendChild(bottomSep);
  }
  
  return container;
}

/**
 * Creates a separator with custom content (like icons or buttons)
 * @param {Object} options - Custom separator configuration
 * @param {HTMLElement|string} options.content - Content to display in the middle
 * @param {string} [options.orientation='horizontal'] - Separator orientation
 * @param {string} [options.className] - Additional CSS classes for container
 * @param {string} [options.contentClassName] - Additional CSS classes for content
 * @param {string} [options.separatorClassName] - Additional CSS classes for separator lines
 * @returns {HTMLDivElement} The created custom separator element
 */
function createCustomSeparator(options = {}) {
  const {
    content,
    orientation = 'horizontal',
    className = '',
    contentClassName = '',
    separatorClassName = ''
  } = options;
  
  const container = document.createElement('div');
  
  if (orientation === 'horizontal') {
    container.className = cn('flex items-center', className);
    
    // Left separator
    const leftSep = createSeparator({
      orientation: 'horizontal',
      className: cn('flex-1', separatorClassName)
    });
    
    // Content container
    const contentElement = document.createElement('div');
    contentElement.className = cn('px-3', contentClassName);
    
    if (typeof content === 'string') {
      contentElement.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      contentElement.appendChild(content);
    }
    
    // Right separator
    const rightSep = createSeparator({
      orientation: 'horizontal',
      className: cn('flex-1', separatorClassName)
    });
    
    container.appendChild(leftSep);
    container.appendChild(contentElement);
    container.appendChild(rightSep);
  } else {
    container.className = cn('flex flex-col items-center', className);
    
    // Top separator
    const topSep = createSeparator({
      orientation: 'vertical',
      className: cn('flex-1', separatorClassName)
    });
    
    // Content container
    const contentElement = document.createElement('div');
    contentElement.className = cn('py-3', contentClassName);
    
    if (typeof content === 'string') {
      contentElement.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      contentElement.appendChild(content);
    }
    
    // Bottom separator
    const bottomSep = createSeparator({
      orientation: 'vertical',
      className: cn('flex-1', separatorClassName)
    });
    
    container.appendChild(topSep);
    container.appendChild(contentElement);
    container.appendChild(bottomSep);
  }
  
  return container;
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createSeparator,
    Separator,
    createTextSeparator,
    createCustomSeparator
  };
} else if (typeof window !== 'undefined') {
  window.shadcnSeparator = {
    createSeparator,
    Separator,
    createTextSeparator,
    createCustomSeparator
  };
}

// Usage examples:
/*
// Simple horizontal separator
const separator1 = createSeparator();

// Vertical separator
const separator2 = createSeparator({
  orientation: 'vertical',
  className: 'h-20'  // Set height for vertical separator
});

// Using Separator class
const separator3 = new Separator({
  orientation: 'horizontal'
});

// Change orientation dynamically
setTimeout(() => {
  separator3.setOrientation('vertical');
}, 2000);

// Text separator (like "OR" between sections)
const textSeparator = createTextSeparator({
  text: 'OR',
  className: 'my-4'
});

// Custom separator with icon
const iconSeparator = createCustomSeparator({
  content: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>',
  contentClassName: 'text-muted-foreground'
});

// Separator in a flex container (vertical)
const verticalContainer = document.createElement('div');
verticalContainer.className = 'flex h-32';
verticalContainer.innerHTML = '<div class="flex-1 bg-gray-100 p-4">Left</div>';

const verticalSep = createSeparator({ orientation: 'vertical' });
verticalContainer.appendChild(verticalSep);

const rightDiv = document.createElement('div');
rightDiv.className = 'flex-1 bg-gray-200 p-4';
rightDiv.textContent = 'Right';
verticalContainer.appendChild(rightDiv);

// Append to DOM
document.body.appendChild(separator1);
document.body.appendChild(separator2);
separator3.appendTo(document.body);
document.body.appendChild(textSeparator);
document.body.appendChild(iconSeparator);
document.body.appendChild(verticalContainer);
*/
