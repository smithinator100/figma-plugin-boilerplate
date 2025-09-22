/**
 * Alert component - Vanilla JavaScript version of shadcn/ui Alert
 * Provides styled alert messages with different variants using Tailwind CSS
 */

// Import utilities (adjust path as needed)
const { cn, cva } = window.shadcnUtils || require('../../lib/utils.js');

/**
 * Alert variant styles using Class Variance Authority pattern
 */
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Creates an alert container element
 * @param {Object} options - Alert configuration options
 * @param {string} [options.variant='default'] - Alert variant (default, destructive)
 * @param {string} [options.className] - Additional CSS classes
 * @param {HTMLElement|string} [options.content] - Alert content
 * @param {string} [options.icon] - SVG icon string or icon name
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created alert element
 */
function createAlert(options = {}) {
  const {
    variant = 'default',
    className = '',
    content = null,
    icon = null,
    attributes = {}
  } = options;

  const alert = document.createElement('div');
  alert.setAttribute('role', 'alert');
  
  // Apply variant styles
  alert.className = alertVariants({ variant, className });
  
  // Add icon if provided
  if (icon) {
    const iconElement = createAlertIcon(icon);
    alert.appendChild(iconElement);
  }
  
  // Set content
  if (content) {
    if (typeof content === 'string') {
      alert.innerHTML = (icon ? alert.innerHTML : '') + content;
    } else if (content instanceof HTMLElement) {
      alert.appendChild(content);
    }
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    alert.setAttribute(key, value);
  });
  
  return alert;
}

/**
 * Creates an alert title element
 * @param {Object} options - Alert title configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @param {string} [options.text] - Title text content
 * @param {HTMLElement|string} [options.content] - Title content
 * @param {string} [options.tag='h5'] - HTML tag to use
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLHeadingElement} The created alert title element
 */
function createAlertTitle(options = {}) {
  const {
    className = '',
    text = '',
    content = null,
    tag = 'h5',
    attributes = {}
  } = options;

  const title = document.createElement(tag);
  title.className = cn("mb-1 font-medium leading-none tracking-tight", className);
  
  // Set content
  if (content) {
    if (typeof content === 'string') {
      title.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      title.appendChild(content);
    }
  } else if (text) {
    title.textContent = text;
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    title.setAttribute(key, value);
  });
  
  return title;
}

/**
 * Creates an alert description element
 * @param {Object} options - Alert description configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @param {string} [options.text] - Description text content
 * @param {HTMLElement|string} [options.content] - Description content
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created alert description element
 */
function createAlertDescription(options = {}) {
  const {
    className = '',
    text = '',
    content = null,
    attributes = {}
  } = options;

  const description = document.createElement('div');
  description.className = cn("text-sm [&_p]:leading-relaxed", className);
  
  // Set content
  if (content) {
    if (typeof content === 'string') {
      description.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      description.appendChild(content);
    }
  } else if (text) {
    description.textContent = text;
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    description.setAttribute(key, value);
  });
  
  return description;
}

/**
 * Creates an alert icon element
 * @param {string} icon - Icon name or SVG string
 * @returns {HTMLElement} The created icon element
 */
function createAlertIcon(icon) {
  const iconElement = document.createElement('svg');
  iconElement.setAttribute('width', '16');
  iconElement.setAttribute('height', '16');
  iconElement.setAttribute('viewBox', '0 0 24 24');
  iconElement.setAttribute('fill', 'none');
  iconElement.setAttribute('stroke', 'currentColor');
  iconElement.setAttribute('stroke-width', '2');
  iconElement.setAttribute('stroke-linecap', 'round');
  iconElement.setAttribute('stroke-linejoin', 'round');
  
  // Common icon paths
  const icons = {
    info: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    warning: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="m12 17 .01 0"/>',
    error: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  };
  
  if (icons[icon]) {
    iconElement.innerHTML = icons[icon];
  } else if (icon.includes('<')) {
    // Assume it's an SVG string
    iconElement.innerHTML = icon;
  } else {
    // Default to info icon
    iconElement.innerHTML = icons.info;
  }
  
  return iconElement;
}

/**
 * Alert class for more advanced usage
 */
class Alert {
  constructor(options = {}) {
    this.element = createAlert(options);
    this.options = options;
    this.title = null;
    this.description = null;
    this.icon = null;
  }
  
  /**
   * Update alert variant
   * @param {string} variant - New variant
   */
  setVariant(variant) {
    this.options.variant = variant;
    this.element.className = alertVariants({
      variant,
      className: this.options.className
    });
  }
  
  /**
   * Add a title to the alert
   * @param {Object} options - Title options
   * @returns {Alert} This alert instance for chaining
   */
  addTitle(options = {}) {
    this.title = createAlertTitle(options);
    this.element.appendChild(this.title);
    return this;
  }
  
  /**
   * Add a description to the alert
   * @param {Object} options - Description options
   * @returns {Alert} This alert instance for chaining
   */
  addDescription(options = {}) {
    this.description = createAlertDescription(options);
    this.element.appendChild(this.description);
    return this;
  }
  
  /**
   * Add an icon to the alert
   * @param {string} icon - Icon name or SVG string
   * @returns {Alert} This alert instance for chaining
   */
  addIcon(icon) {
    this.icon = createAlertIcon(icon);
    this.element.insertBefore(this.icon, this.element.firstChild);
    return this;
  }
  
  /**
   * Set alert content
   * @param {string|HTMLElement} content - New content
   */
  setContent(content) {
    // Clear existing content but keep icon
    const icon = this.element.querySelector('svg');
    this.element.innerHTML = '';
    if (icon) {
      this.element.appendChild(icon);
    }
    
    if (typeof content === 'string') {
      this.element.innerHTML += content;
    } else if (content instanceof HTMLElement) {
      this.element.appendChild(content);
    }
  }
  
  /**
   * Show the alert
   */
  show() {
    this.element.style.display = '';
  }
  
  /**
   * Hide the alert
   */
  hide() {
    this.element.style.display = 'none';
  }
  
  /**
   * Remove the alert from DOM
   */
  remove() {
    this.element.remove();
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
   * @returns {HTMLDivElement} The alert element
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
 * Creates a dismissible alert with a close button
 * @param {Object} options - Alert configuration options
 * @param {function} [options.onDismiss] - Callback when alert is dismissed
 * @param {string} [options.closeButtonText='×'] - Text for close button
 * @returns {Alert} Alert instance with dismiss functionality
 */
function createDismissibleAlert(options = {}) {
  const { onDismiss = null, closeButtonText = '×', ...alertOptions } = options;
  
  const alert = new Alert(alertOptions);
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = closeButtonText;
  closeButton.className = 'absolute top-4 right-4 text-foreground/50 hover:text-foreground transition-colors';
  closeButton.setAttribute('type', 'button');
  closeButton.setAttribute('aria-label', 'Close alert');
  
  closeButton.addEventListener('click', () => {
    if (onDismiss && typeof onDismiss === 'function') {
      onDismiss(alert);
    } else {
      alert.remove();
    }
  });
  
  alert.element.appendChild(closeButton);
  
  return alert;
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createAlert,
    createAlertTitle,
    createAlertDescription,
    createAlertIcon,
    Alert,
    alertVariants,
    createDismissibleAlert
  };
} else if (typeof window !== 'undefined') {
  window.shadcnAlert = {
    createAlert,
    createAlertTitle,
    createAlertDescription,
    createAlertIcon,
    Alert,
    alertVariants,
    createDismissibleAlert
  };
}

// Usage examples:
/*
// Simple alert creation
const alert1 = createAlert({
  content: '<strong>Info:</strong> This is an informational alert.'
});

// Alert with icon and title
const alert2 = new Alert({ variant: 'destructive' })
  .addIcon('error')
  .addTitle({ text: 'Error' })
  .addDescription({ text: 'Something went wrong. Please try again.' });

// Dismissible alert
const dismissibleAlert = createDismissibleAlert({
  variant: 'default',
  onDismiss: (alert) => {
    console.log('Alert dismissed');
    alert.remove();
  }
});

dismissibleAlert.addIcon('warning')
  .addTitle({ text: 'Warning' })
  .addDescription({ text: 'This alert can be dismissed by clicking the X button.' });

// Success alert with timeout
const successAlert = new Alert({ variant: 'default' })
  .addIcon('success')
  .addTitle({ text: 'Success!' })
  .addDescription({ text: 'Your action was completed successfully.' });

// Auto-hide after 3 seconds
setTimeout(() => {
  successAlert.hide();
}, 3000);

// Append to DOM
document.body.appendChild(alert1);
alert2.appendTo(document.body);
dismissibleAlert.appendTo(document.body);
successAlert.appendTo(document.body);
*/
