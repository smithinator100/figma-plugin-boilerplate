/**
 * Label component - Vanilla JavaScript version of shadcn/ui Label
 * Provides styled labels with Tailwind CSS styling
 */

// Import utilities (adjust path as needed)
const { cn, cva } = window.shadcnUtils || require('../../lib/utils.js');

/**
 * Label variant styles using Class Variance Authority pattern
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

/**
 * Creates a label element with shadcn/ui styling
 * @param {Object} options - Label configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @param {string} [options.text] - Label text content
 * @param {HTMLElement|string} [options.content] - Label content
 * @param {string} [options.htmlFor] - ID of the form element this label is for
 * @param {boolean} [options.required=false] - Whether to show required indicator
 * @param {string} [options.requiredIndicator='*'] - Text to show for required fields
 * @param {function} [options.onClick] - Click event handler
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLLabelElement} The created label element
 */
function createLabel(options = {}) {
  const {
    className = '',
    text = '',
    content = null,
    htmlFor = '',
    required = false,
    requiredIndicator = '*',
    onClick = null,
    attributes = {}
  } = options;

  const label = document.createElement('label');
  
  // Apply styling
  label.className = cn(labelVariants(), className);
  
  // Set for attribute
  if (htmlFor) {
    label.setAttribute('for', htmlFor);
  }
  
  // Set content
  if (content) {
    if (typeof content === 'string') {
      label.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      label.appendChild(content);
    }
  } else if (text) {
    label.textContent = text;
  }
  
  // Add required indicator
  if (required) {
    const requiredSpan = document.createElement('span');
    requiredSpan.textContent = requiredIndicator;
    requiredSpan.className = 'text-destructive ml-1';
    requiredSpan.setAttribute('aria-label', 'required');
    label.appendChild(requiredSpan);
  }
  
  // Add click handler
  if (onClick && typeof onClick === 'function') {
    label.addEventListener('click', onClick);
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    label.setAttribute(key, value);
  });
  
  return label;
}

/**
 * Label class for more advanced usage
 */
class Label {
  constructor(options = {}) {
    this.element = createLabel(options);
    this.options = options;
    this.associatedInput = null;
  }
  
  /**
   * Set label text content
   * @param {string} text - New text content
   */
  setText(text) {
    // Clear existing content but preserve required indicator
    const requiredSpan = this.element.querySelector('span[aria-label="required"]');
    this.element.textContent = text;
    if (requiredSpan) {
      this.element.appendChild(requiredSpan);
    }
  }
  
  /**
   * Set label HTML content
   * @param {string} html - New HTML content
   */
  setHTML(html) {
    this.element.innerHTML = html;
    // Re-add required indicator if needed
    if (this.options.required) {
      const requiredSpan = document.createElement('span');
      requiredSpan.textContent = this.options.requiredIndicator || '*';
      requiredSpan.className = 'text-destructive ml-1';
      requiredSpan.setAttribute('aria-label', 'required');
      this.element.appendChild(requiredSpan);
    }
  }
  
  /**
   * Associate this label with an input element
   * @param {HTMLElement} input - Input element to associate with
   */
  associateWith(input) {
    this.associatedInput = input;
    
    // Set for attribute if input has an ID
    if (input.id) {
      this.element.setAttribute('for', input.id);
    } else {
      // Generate an ID for the input
      const id = 'input-' + Math.random().toString(36).substr(2, 9);
      input.id = id;
      this.element.setAttribute('for', id);
    }
  }
  
  /**
   * Set required state
   * @param {boolean} required - Whether field is required
   */
  setRequired(required) {
    this.options.required = required;
    
    const existingRequiredSpan = this.element.querySelector('span[aria-label="required"]');
    
    if (required && !existingRequiredSpan) {
      const requiredSpan = document.createElement('span');
      requiredSpan.textContent = this.options.requiredIndicator || '*';
      requiredSpan.className = 'text-destructive ml-1';
      requiredSpan.setAttribute('aria-label', 'required');
      this.element.appendChild(requiredSpan);
    } else if (!required && existingRequiredSpan) {
      existingRequiredSpan.remove();
    }
    
    // Update associated input if exists
    if (this.associatedInput) {
      this.associatedInput.required = required;
    }
  }
  
  /**
   * Set error state
   * @param {boolean} hasError - Whether there's an error
   */
  setError(hasError) {
    if (hasError) {
      this.element.classList.add('text-destructive');
    } else {
      this.element.classList.remove('text-destructive');
    }
  }
  
  /**
   * Set disabled state
   * @param {boolean} disabled - Whether label is disabled
   */
  setDisabled(disabled) {
    if (disabled) {
      this.element.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      this.element.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    // Update associated input if exists
    if (this.associatedInput) {
      this.associatedInput.disabled = disabled;
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
   * @returns {HTMLLabelElement} The label element
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
 * Creates a form field with label and input
 * @param {Object} options - Form field configuration
 * @param {string} options.label - Label text
 * @param {string} [options.inputType='text'] - Input type
 * @param {Object} [options.labelOptions] - Additional label options
 * @param {Object} [options.inputOptions] - Additional input options
 * @param {string} [options.className] - Additional CSS classes for container
 * @param {string} [options.helpText] - Help text to display below input
 * @param {string} [options.errorText] - Error text to display
 * @returns {Object} Object containing container, label, input, and helper elements
 */
function createFormField(options = {}) {
  const {
    label: labelText,
    inputType = 'text',
    labelOptions = {},
    inputOptions = {},
    className = '',
    helpText = '',
    errorText = ''
  } = options;
  
  const container = document.createElement('div');
  container.className = cn('space-y-2', className);
  
  // Generate unique ID for input
  const inputId = 'field-' + Math.random().toString(36).substr(2, 9);
  
  // Create label
  const label = new Label({
    text: labelText,
    htmlFor: inputId,
    ...labelOptions
  });
  
  // Create input
  const input = document.createElement('input');
  input.type = inputType;
  input.id = inputId;
  input.className = cn(
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    inputOptions.className || ''
  );
  
  // Apply input options
  Object.entries(inputOptions).forEach(([key, value]) => {
    if (key !== 'className') {
      input.setAttribute(key, value);
    }
  });
  
  // Associate label with input
  label.associateWith(input);
  
  // Create help text element
  let helpElement = null;
  if (helpText) {
    helpElement = document.createElement('p');
    helpElement.className = 'text-sm text-muted-foreground';
    helpElement.textContent = helpText;
  }
  
  // Create error text element
  let errorElement = null;
  if (errorText) {
    errorElement = document.createElement('p');
    errorElement.className = 'text-sm text-destructive';
    errorElement.textContent = errorText;
    label.setError(true);
  }
  
  // Assemble the field
  container.appendChild(label.getElement());
  container.appendChild(input);
  if (helpElement) container.appendChild(helpElement);
  if (errorElement) container.appendChild(errorElement);
  
  return {
    container,
    label,
    input,
    helpElement,
    errorElement,
    setError: (message) => {
      if (message) {
        if (!errorElement) {
          errorElement = document.createElement('p');
          errorElement.className = 'text-sm text-destructive';
          container.appendChild(errorElement);
        }
        errorElement.textContent = message;
        label.setError(true);
        input.classList.add('border-destructive');
      } else {
        if (errorElement) {
          errorElement.remove();
          errorElement = null;
        }
        label.setError(false);
        input.classList.remove('border-destructive');
      }
    }
  };
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createLabel,
    Label,
    labelVariants,
    createFormField
  };
} else if (typeof window !== 'undefined') {
  window.shadcnLabel = {
    createLabel,
    Label,
    labelVariants,
    createFormField
  };
}

// Usage examples:
/*
// Simple label creation
const label1 = createLabel({
  text: 'Username',
  htmlFor: 'username-input'
});

// Label with required indicator
const label2 = createLabel({
  text: 'Email Address',
  htmlFor: 'email-input',
  required: true
});

// Using Label class
const label3 = new Label({
  text: 'Password'
});

// Create an input and associate it
const passwordInput = document.createElement('input');
passwordInput.type = 'password';
label3.associateWith(passwordInput);

// Complete form field
const { container, label, input, setError } = createFormField({
  label: 'Full Name',
  inputType: 'text',
  labelOptions: { required: true },
  inputOptions: { placeholder: 'Enter your full name' },
  helpText: 'Enter your first and last name'
});

// Add validation
input.addEventListener('blur', () => {
  if (!input.value.trim()) {
    setError('Full name is required');
  } else if (input.value.trim().split(' ').length < 2) {
    setError('Please enter both first and last name');
  } else {
    setError(null);
  }
});

// Append to DOM
document.body.appendChild(label1);
document.body.appendChild(label2);
label3.appendTo(document.body);
document.body.appendChild(passwordInput);
document.body.appendChild(container);
*/
