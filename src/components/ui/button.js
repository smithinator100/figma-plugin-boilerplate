/**
 * Button component - Vanilla JavaScript version of shadcn/ui Button
 * Provides various button variants and sizes with Tailwind CSS styling
 */

// Import utilities (adjust path as needed)
const { cn, cva } = window.shadcnUtils || require('../../lib/utils.js');

/**
 * Button variant styles using Class Variance Authority pattern
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Creates a button element with shadcn/ui styling
 * @param {Object} options - Button configuration options
 * @param {string} [options.variant='default'] - Button variant (default, destructive, outline, secondary, ghost, link)
 * @param {string} [options.size='default'] - Button size (default, sm, lg, icon)
 * @param {string} [options.className] - Additional CSS classes
 * @param {string} [options.text] - Button text content
 * @param {HTMLElement|string} [options.content] - Button content (HTML element or string)
 * @param {boolean} [options.disabled=false] - Whether button is disabled
 * @param {string} [options.type='button'] - Button type attribute
 * @param {function} [options.onClick] - Click event handler
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLButtonElement} The created button element
 */
function createButton(options = {}) {
  const {
    variant = 'default',
    size = 'default',
    className = '',
    text = '',
    content = null,
    disabled = false,
    type = 'button',
    onClick = null,
    attributes = {}
  } = options;

  const button = document.createElement('button');
  button.type = type;
  button.disabled = disabled;
  
  // Apply variant styles
  button.className = buttonVariants({ variant, size, className });
  
  // Set content
  if (content) {
    if (typeof content === 'string') {
      button.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      button.appendChild(content);
    }
  } else if (text) {
    button.textContent = text;
  }
  
  // Add click handler
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    button.setAttribute(key, value);
  });
  
  return button;
}

/**
 * Button class for more advanced usage
 */
class Button {
  constructor(options = {}) {
    this.element = createButton(options);
    this.options = options;
  }
  
  /**
   * Update button variant
   * @param {string} variant - New variant
   */
  setVariant(variant) {
    this.options.variant = variant;
    this.element.className = buttonVariants({
      variant,
      size: this.options.size,
      className: this.options.className
    });
  }
  
  /**
   * Update button size
   * @param {string} size - New size
   */
  setSize(size) {
    this.options.size = size;
    this.element.className = buttonVariants({
      variant: this.options.variant,
      size,
      className: this.options.className
    });
  }
  
  /**
   * Set button text content
   * @param {string} text - New text content
   */
  setText(text) {
    this.element.textContent = text;
  }
  
  /**
   * Set button HTML content
   * @param {string} html - New HTML content
   */
  setHTML(html) {
    this.element.innerHTML = html;
  }
  
  /**
   * Enable/disable the button
   * @param {boolean} disabled - Whether to disable the button
   */
  setDisabled(disabled) {
    this.element.disabled = disabled;
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
   * @returns {HTMLButtonElement} The button element
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

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createButton, Button, buttonVariants };
} else if (typeof window !== 'undefined') {
  window.shadcnButton = { createButton, Button, buttonVariants };
}

// Usage examples:
/*
// Simple button creation
const button1 = createButton({
  text: 'Click me',
  variant: 'default',
  onClick: () => console.log('Button clicked!')
});

// Button with custom styling
const button2 = createButton({
  text: 'Secondary',
  variant: 'secondary',
  size: 'lg',
  className: 'custom-class'
});

// Using Button class
const button3 = new Button({
  text: 'Advanced Button',
  variant: 'outline'
});

button3.on('click', () => {
  button3.setText('Clicked!');
  button3.setVariant('destructive');
});

// Append to DOM
document.body.appendChild(button1);
document.body.appendChild(button2);
button3.appendTo(document.body);
*/
