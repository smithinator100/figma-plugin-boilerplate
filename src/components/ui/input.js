/**
 * Input component - Vanilla JavaScript version of shadcn/ui Input
 * Provides styled input fields with Tailwind CSS styling
 */

// Import utilities (adjust path as needed)
const { cn } = window.shadcnUtils || require('../../lib/utils.js');

/**
 * Creates an input element with shadcn/ui styling
 * @param {Object} options - Input configuration options
 * @param {string} [options.type='text'] - Input type
 * @param {string} [options.className] - Additional CSS classes
 * @param {string} [options.placeholder] - Placeholder text
 * @param {string} [options.value] - Initial value
 * @param {boolean} [options.disabled=false] - Whether input is disabled
 * @param {boolean} [options.required=false] - Whether input is required
 * @param {string} [options.name] - Input name attribute
 * @param {string} [options.id] - Input id attribute
 * @param {function} [options.onChange] - Change event handler
 * @param {function} [options.onInput] - Input event handler
 * @param {function} [options.onFocus] - Focus event handler
 * @param {function} [options.onBlur] - Blur event handler
 * @param {function} [options.onKeyPress] - Key press event handler
 * @param {function} [options.onKeyDown] - Key down event handler
 * @param {function} [options.onKeyUp] - Key up event handler
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLInputElement} The created input element
 */
function createInput(options = {}) {
  const {
    type = 'text',
    className = '',
    placeholder = '',
    value = '',
    disabled = false,
    required = false,
    name = '',
    id = '',
    onChange = null,
    onInput = null,
    onFocus = null,
    onBlur = null,
    onKeyPress = null,
    onKeyDown = null,
    onKeyUp = null,
    attributes = {}
  } = options;

  const input = document.createElement('input');
  input.type = type;
  input.disabled = disabled;
  input.required = required;
  
  if (placeholder) input.placeholder = placeholder;
  if (value) input.value = value;
  if (name) input.name = name;
  if (id) input.id = id;
  
  // Apply styling
  input.className = cn(
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    className
  );
  
  // Add event handlers
  if (onChange && typeof onChange === 'function') {
    input.addEventListener('change', onChange);
  }
  
  if (onInput && typeof onInput === 'function') {
    input.addEventListener('input', onInput);
  }
  
  if (onFocus && typeof onFocus === 'function') {
    input.addEventListener('focus', onFocus);
  }
  
  if (onBlur && typeof onBlur === 'function') {
    input.addEventListener('blur', onBlur);
  }
  
  if (onKeyPress && typeof onKeyPress === 'function') {
    input.addEventListener('keypress', onKeyPress);
  }
  
  if (onKeyDown && typeof onKeyDown === 'function') {
    input.addEventListener('keydown', onKeyDown);
  }
  
  if (onKeyUp && typeof onKeyUp === 'function') {
    input.addEventListener('keyup', onKeyUp);
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    input.setAttribute(key, value);
  });
  
  return input;
}

/**
 * Input class for more advanced usage
 */
class Input {
  constructor(options = {}) {
    this.element = createInput(options);
    this.options = options;
    this.validators = [];
    this.errorMessage = null;
  }
  
  /**
   * Get the current value
   * @returns {string} Current input value
   */
  getValue() {
    return this.element.value;
  }
  
  /**
   * Set the input value
   * @param {string} value - New value
   */
  setValue(value) {
    this.element.value = value;
    // Trigger input event
    this.element.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  /**
   * Clear the input value
   */
  clear() {
    this.setValue('');
  }
  
  /**
   * Focus the input
   */
  focus() {
    this.element.focus();
  }
  
  /**
   * Blur the input
   */
  blur() {
    this.element.blur();
  }
  
  /**
   * Enable/disable the input
   * @param {boolean} disabled - Whether to disable the input
   */
  setDisabled(disabled) {
    this.element.disabled = disabled;
  }
  
  /**
   * Set placeholder text
   * @param {string} placeholder - New placeholder text
   */
  setPlaceholder(placeholder) {
    this.element.placeholder = placeholder;
  }
  
  /**
   * Add a validator function
   * @param {function} validator - Function that returns true if valid, or error message if invalid
   */
  addValidator(validator) {
    this.validators.push(validator);
  }
  
  /**
   * Validate the current value
   * @returns {boolean} True if valid, false otherwise
   */
  validate() {
    const value = this.getValue();
    
    for (const validator of this.validators) {
      const result = validator(value);
      if (result !== true) {
        this.setError(typeof result === 'string' ? result : 'Invalid input');
        return false;
      }
    }
    
    this.clearError();
    return true;
  }
  
  /**
   * Set error state and message
   * @param {string} message - Error message
   */
  setError(message) {
    this.errorMessage = message;
    this.element.classList.add('border-destructive');
    this.element.classList.remove('border-input');
    
    // Create or update error message element
    let errorElement = this.element.parentNode.querySelector('.input-error');
    if (!errorElement) {
      errorElement = document.createElement('p');
      errorElement.className = 'input-error text-sm text-destructive mt-1';
      this.element.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }
  
  /**
   * Clear error state
   */
  clearError() {
    this.errorMessage = null;
    this.element.classList.remove('border-destructive');
    this.element.classList.add('border-input');
    
    // Remove error message element
    const errorElement = this.element.parentNode.querySelector('.input-error');
    if (errorElement) {
      errorElement.remove();
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
   * @returns {HTMLInputElement} The input element
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
 * Creates a labeled input group
 * @param {Object} options - Input group configuration
 * @param {string} options.label - Label text
 * @param {Object} [options.inputOptions] - Input configuration options
 * @param {string} [options.className] - Additional CSS classes for container
 * @param {string} [options.labelClassName] - Additional CSS classes for label
 * @returns {Object} Object containing container element and input instance
 */
function createInputGroup(options = {}) {
  const {
    label,
    inputOptions = {},
    className = '',
    labelClassName = ''
  } = options;
  
  const container = document.createElement('div');
  container.className = cn('space-y-2', className);
  
  // Create label
  const labelElement = document.createElement('label');
  labelElement.className = cn(
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    labelClassName
  );
  labelElement.textContent = label;
  
  // Create input
  const input = new Input(inputOptions);
  
  // Link label to input
  if (inputOptions.id) {
    labelElement.setAttribute('for', inputOptions.id);
  }
  
  container.appendChild(labelElement);
  container.appendChild(input.getElement());
  
  return {
    container,
    input,
    label: labelElement
  };
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createInput, Input, createInputGroup };
} else if (typeof window !== 'undefined') {
  window.shadcnInput = { createInput, Input, createInputGroup };
}

// Usage examples:
/*
// Simple input creation
const input1 = createInput({
  placeholder: 'Enter your name',
  onChange: (e) => console.log('Changed:', e.target.value)
});

// Using Input class with validation
const input2 = new Input({
  type: 'email',
  placeholder: 'Enter your email'
});

input2.addValidator((value) => {
  if (!value) return 'Email is required';
  if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email';
  return true;
});

input2.on('blur', () => {
  input2.validate();
});

// Input group with label
const { container, input } = createInputGroup({
  label: 'Username',
  inputOptions: {
    placeholder: 'Enter username',
    id: 'username'
  }
});

// Append to DOM
document.body.appendChild(input1);
input2.appendTo(document.body);
document.body.appendChild(container);
*/
