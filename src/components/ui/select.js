/**
 * Select component - Vanilla JavaScript version of shadcn/ui Select
 * Provides dropdown selection with keyboard navigation and accessibility
 */

// Import utilities (adjust path as needed)
const { cn } = window.shadcnUtils || require('../../lib/utils.js');

/**
 * Creates a select container element
 * @param {Object} options - Select configuration options
 * @param {string} [options.value] - Default selected value
 * @param {string} [options.placeholder='Select an option...'] - Placeholder text
 * @param {boolean} [options.disabled=false] - Whether select is disabled
 * @param {boolean} [options.required=false] - Whether select is required
 * @param {string} [options.name] - Input name attribute
 * @param {string} [options.className] - Additional CSS classes
 * @param {function} [options.onValueChange] - Value change event handler
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created select container element
 */
function createSelect(options = {}) {
  const {
    value = '',
    placeholder = 'Select an option...',
    disabled = false,
    required = false,
    name = '',
    className = '',
    onValueChange = null,
    attributes = {}
  } = options;

  const select = document.createElement('div');
  select.className = cn('select-root relative', className);
  
  // Store select state
  select._selectState = {
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    required: required,
    name: name,
    isOpen: false,
    options: new Map(),
    onValueChange: onValueChange,
    searchTerm: '',
    searchTimeout: null
  };
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    select.setAttribute(key, value);
  });
  
  return select;
}

/**
 * Creates a select trigger (the clickable button that shows current value)
 * @param {Object} options - Select trigger configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLButtonElement} The created select trigger element
 */
function createSelectTrigger(options = {}) {
  const {
    className = '',
    attributes = {}
  } = options;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = cn(
    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    className
  );
  
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', 'listbox');
  
  // Create trigger content
  const triggerContent = document.createElement('span');
  triggerContent.className = 'select-trigger-content';
  
  // Create chevron icon
  const chevron = document.createElement('svg');
  chevron.className = 'h-4 w-4 opacity-50';
  chevron.setAttribute('fill', 'none');
  chevron.setAttribute('stroke', 'currentColor');
  chevron.setAttribute('viewBox', '0 0 24 24');
  chevron.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"/>';
  
  trigger.appendChild(triggerContent);
  trigger.appendChild(chevron);
  
  // Add click handler
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    const selectRoot = trigger.closest('.select-root');
    if (selectRoot && !selectRoot._selectState.disabled) {
      toggleSelect(selectRoot);
    }
  });
  
  // Add keyboard handler
  trigger.addEventListener('keydown', handleTriggerKeydown);
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    trigger.setAttribute(key, value);
  });
  
  return trigger;
}

/**
 * Creates a select content container (dropdown list)
 * @param {Object} options - Select content configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @param {number} [options.maxHeight=200] - Maximum height in pixels
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created select content element
 */
function createSelectContent(options = {}) {
  const {
    className = '',
    maxHeight = 200,
    attributes = {}
  } = options;

  const content = document.createElement('div');
  content.className = cn(
    "absolute top-full left-0 z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
    className
  );
  
  content.setAttribute('role', 'listbox');
  content.setAttribute('data-state', 'closed');
  content.style.display = 'none';
  content.style.maxHeight = `${maxHeight}px`;
  content.style.overflowY = 'auto';
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    content.setAttribute(key, value);
  });
  
  return content;
}

/**
 * Creates a select item (option in the dropdown)
 * @param {Object} options - Select item configuration options
 * @param {string} options.value - Item value
 * @param {string} [options.text] - Item text content
 * @param {HTMLElement|string} [options.content] - Item content
 * @param {boolean} [options.disabled=false] - Whether item is disabled
 * @param {string} [options.className] - Additional CSS classes
 * @param {function} [options.onClick] - Click event handler
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created select item element
 */
function createSelectItem(options = {}) {
  const {
    value,
    text = '',
    content = null,
    disabled = false,
    className = '',
    onClick = null,
    attributes = {}
  } = options;

  if (value === undefined) {
    throw new Error('Select item must have a value');
  }

  const item = document.createElement('div');
  item.className = cn(
    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  );
  
  item.setAttribute('role', 'option');
  item.setAttribute('data-value', value);
  item.setAttribute('aria-selected', 'false');
  item.setAttribute('tabindex', '-1');
  
  if (disabled) {
    item.setAttribute('data-disabled', 'true');
  }
  
  // Create check icon (hidden by default)
  const checkIcon = document.createElement('span');
  checkIcon.className = 'absolute left-2 flex h-3.5 w-3.5 items-center justify-center opacity-0';
  checkIcon.innerHTML = `
    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12 5 5L20 7"/>
    </svg>
  `;
  
  // Create item content
  const itemContent = document.createElement('span');
  itemContent.className = 'select-item-content';
  
  if (content) {
    if (typeof content === 'string') {
      itemContent.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      itemContent.appendChild(content);
    }
  } else if (text) {
    itemContent.textContent = text;
  }
  
  item.appendChild(checkIcon);
  item.appendChild(itemContent);
  
  // Add click handler
  item.addEventListener('click', (e) => {
    if (!disabled) {
      const selectRoot = item.closest('.select-root');
      if (selectRoot) {
        selectValue(selectRoot, value);
        closeSelect(selectRoot);
      }
      if (onClick && typeof onClick === 'function') {
        onClick(e);
      }
    }
  });
  
  // Add hover handler
  item.addEventListener('mouseenter', () => {
    if (!disabled) {
      // Remove focus from other items
      const selectContent = item.parentElement;
      if (selectContent) {
        selectContent.querySelectorAll('[role="option"]').forEach(opt => {
          opt.classList.remove('focus:bg-accent', 'focus:text-accent-foreground');
        });
      }
      item.classList.add('bg-accent', 'text-accent-foreground');
    }
  });
  
  item.addEventListener('mouseleave', () => {
    item.classList.remove('bg-accent', 'text-accent-foreground');
  });
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    item.setAttribute(key, value);
  });
  
  return item;
}

/**
 * Toggle select dropdown open/closed
 * @param {HTMLElement} selectRoot - The select root element
 */
function toggleSelect(selectRoot) {
  if (!selectRoot || !selectRoot._selectState) return;
  
  const state = selectRoot._selectState;
  
  if (state.isOpen) {
    closeSelect(selectRoot);
  } else {
    openSelect(selectRoot);
  }
}

/**
 * Open select dropdown
 * @param {HTMLElement} selectRoot - The select root element
 */
function openSelect(selectRoot) {
  if (!selectRoot || !selectRoot._selectState) return;
  
  const state = selectRoot._selectState;
  if (state.disabled || state.isOpen) return;
  
  state.isOpen = true;
  
  const trigger = selectRoot.querySelector('[role="combobox"]');
  const content = selectRoot.querySelector('[role="listbox"]');
  
  if (trigger && content) {
    trigger.setAttribute('aria-expanded', 'true');
    content.setAttribute('data-state', 'open');
    content.style.display = 'block';
    
    // Focus first non-disabled item
    const firstItem = content.querySelector('[role="option"]:not([data-disabled])');
    if (firstItem) {
      firstItem.focus();
    }
    
    // Add outside click handler
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('keydown', handleSelectKeydown);
    }, 0);
  }
}

/**
 * Close select dropdown
 * @param {HTMLElement} selectRoot - The select root element
 */
function closeSelect(selectRoot) {
  if (!selectRoot || !selectRoot._selectState) return;
  
  const state = selectRoot._selectState;
  if (!state.isOpen) return;
  
  state.isOpen = false;
  state.searchTerm = '';
  
  const trigger = selectRoot.querySelector('[role="combobox"]');
  const content = selectRoot.querySelector('[role="listbox"]');
  
  if (trigger && content) {
    trigger.setAttribute('aria-expanded', 'false');
    content.setAttribute('data-state', 'closed');
    content.style.display = 'none';
    
    // Focus trigger
    trigger.focus();
    
    // Remove event listeners
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleSelectKeydown);
  }
}

/**
 * Select a value
 * @param {HTMLElement} selectRoot - The select root element
 * @param {string} value - Value to select
 */
function selectValue(selectRoot, value) {
  if (!selectRoot || !selectRoot._selectState) return;
  
  const state = selectRoot._selectState;
  const previousValue = state.value;
  state.value = value;
  
  // Update trigger content
  const trigger = selectRoot.querySelector('[role="combobox"]');
  const triggerContent = trigger?.querySelector('.select-trigger-content');
  
  if (triggerContent) {
    const selectedItem = selectRoot.querySelector(`[role="option"][data-value="${value}"]`);
    if (selectedItem) {
      const itemContent = selectedItem.querySelector('.select-item-content');
      triggerContent.textContent = itemContent?.textContent || value;
      triggerContent.classList.remove('text-muted-foreground');
    }
  }
  
  // Update option states
  const options = selectRoot.querySelectorAll('[role="option"]');
  options.forEach(option => {
    const optionValue = option.getAttribute('data-value');
    const isSelected = optionValue === value;
    
    option.setAttribute('aria-selected', isSelected.toString());
    const checkIcon = option.querySelector('span');
    if (checkIcon) {
      checkIcon.style.opacity = isSelected ? '1' : '0';
    }
  });
  
  // Create hidden input for form submission
  let hiddenInput = selectRoot.querySelector('input[type="hidden"]');
  if (!hiddenInput && state.name) {
    hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = state.name;
    selectRoot.appendChild(hiddenInput);
  }
  
  if (hiddenInput) {
    hiddenInput.value = value;
  }
  
  // Dispatch change event
  if (state.onValueChange && typeof state.onValueChange === 'function') {
    state.onValueChange(value, previousValue);
  }
  
  const changeEvent = new CustomEvent('valuechange', {
    detail: { value, previousValue },
    bubbles: true
  });
  selectRoot.dispatchEvent(changeEvent);
}

/**
 * Handle trigger keyboard events
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleTriggerKeydown(e) {
  const trigger = e.currentTarget;
  const selectRoot = trigger.closest('.select-root');
  
  if (!selectRoot) return;
  
  switch (e.key) {
    case 'Enter':
    case ' ':
    case 'ArrowDown':
    case 'ArrowUp':
      e.preventDefault();
      openSelect(selectRoot);
      break;
    case 'Escape':
      closeSelect(selectRoot);
      break;
  }
}

/**
 * Handle select keyboard navigation
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleSelectKeydown(e) {
  const selectRoot = document.querySelector('.select-root[aria-expanded="true"]');
  if (!selectRoot) return;
  
  const content = selectRoot.querySelector('[role="listbox"]');
  const items = Array.from(content.querySelectorAll('[role="option"]:not([data-disabled])'));
  const currentItem = content.querySelector('[role="option"].bg-accent');
  const currentIndex = currentItem ? items.indexOf(currentItem) : -1;
  
  let nextIndex = currentIndex;
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      break;
    case 'ArrowUp':
      e.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      break;
    case 'Home':
      e.preventDefault();
      nextIndex = 0;
      break;
    case 'End':
      e.preventDefault();
      nextIndex = items.length - 1;
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      if (currentItem) {
        const value = currentItem.getAttribute('data-value');
        selectValue(selectRoot, value);
        closeSelect(selectRoot);
      }
      return;
    case 'Escape':
      e.preventDefault();
      closeSelect(selectRoot);
      return;
    default:
      // Type-ahead search
      if (e.key.length === 1) {
        handleTypeAhead(selectRoot, e.key);
      }
      return;
  }
  
  // Update focus
  if (items[nextIndex]) {
    items.forEach(item => item.classList.remove('bg-accent', 'text-accent-foreground'));
    items[nextIndex].classList.add('bg-accent', 'text-accent-foreground');
    items[nextIndex].scrollIntoView({ block: 'nearest' });
  }
}

/**
 * Handle type-ahead search
 * @param {HTMLElement} selectRoot - Select root element
 * @param {string} key - Typed key
 */
function handleTypeAhead(selectRoot, key) {
  const state = selectRoot._selectState;
  
  // Clear previous timeout
  if (state.searchTimeout) {
    clearTimeout(state.searchTimeout);
  }
  
  // Add to search term
  state.searchTerm += key.toLowerCase();
  
  // Find matching item
  const content = selectRoot.querySelector('[role="listbox"]');
  const items = Array.from(content.querySelectorAll('[role="option"]:not([data-disabled])'));
  
  const matchingItem = items.find(item => {
    const text = item.querySelector('.select-item-content')?.textContent?.toLowerCase();
    return text?.startsWith(state.searchTerm);
  });
  
  if (matchingItem) {
    items.forEach(item => item.classList.remove('bg-accent', 'text-accent-foreground'));
    matchingItem.classList.add('bg-accent', 'text-accent-foreground');
    matchingItem.scrollIntoView({ block: 'nearest' });
  }
  
  // Clear search term after delay
  state.searchTimeout = setTimeout(() => {
    state.searchTerm = '';
  }, 1000);
}

/**
 * Handle outside click to close select
 * @param {MouseEvent} e - Click event
 */
function handleOutsideClick(e) {
  const selectRoot = e.target.closest('.select-root');
  if (!selectRoot) {
    // Close all open selects
    document.querySelectorAll('.select-root').forEach(select => {
      if (select._selectState?.isOpen) {
        closeSelect(select);
      }
    });
  }
}

/**
 * Select class for more advanced usage
 */
class Select {
  constructor(options = {}) {
    this.element = createSelect(options);
    this.options = options;
    this.trigger = null;
    this.content = null;
    this.items = [];
  }
  
  /**
   * Add trigger to the select
   * @param {Object} options - Trigger options
   * @returns {Select} This select instance for chaining
   */
  addTrigger(options = {}) {
    this.trigger = createSelectTrigger(options);
    this.element.appendChild(this.trigger);
    this.updateTriggerContent();
    return this;
  }
  
  /**
   * Add content container to the select
   * @param {Object} options - Content options
   * @returns {Select} This select instance for chaining
   */
  addContent(options = {}) {
    this.content = createSelectContent(options);
    this.element.appendChild(this.content);
    return this;
  }
  
  /**
   * Add an item to the select
   * @param {Object} options - Item options
   * @returns {Select} This select instance for chaining
   */
  addItem(options = {}) {
    if (!this.content) {
      this.addContent();
    }
    
    const item = createSelectItem(options);
    this.content.appendChild(item);
    this.items.push(item);
    
    // Set as selected if it matches current value
    if (options.value === this.element._selectState.value) {
      selectValue(this.element, options.value);
    }
    
    return this;
  }
  
  /**
   * Set the selected value
   * @param {string} value - Value to select
   */
  setValue(value) {
    selectValue(this.element, value);
  }
  
  /**
   * Get the current selected value
   * @returns {string} Current selected value
   */
  getValue() {
    return this.element._selectState?.value || '';
  }
  
  /**
   * Set placeholder text
   * @param {string} placeholder - Placeholder text
   */
  setPlaceholder(placeholder) {
    this.element._selectState.placeholder = placeholder;
    this.updateTriggerContent();
  }
  
  /**
   * Enable/disable the select
   * @param {boolean} disabled - Whether to disable the select
   */
  setDisabled(disabled) {
    this.element._selectState.disabled = disabled;
    if (this.trigger) {
      this.trigger.disabled = disabled;
    }
  }
  
  /**
   * Update trigger content based on current value
   */
  updateTriggerContent() {
    if (!this.trigger) return;
    
    const triggerContent = this.trigger.querySelector('.select-trigger-content');
    if (!triggerContent) return;
    
    const state = this.element._selectState;
    if (state.value) {
      const selectedItem = this.element.querySelector(`[role="option"][data-value="${state.value}"]`);
      if (selectedItem) {
        const itemContent = selectedItem.querySelector('.select-item-content');
        triggerContent.textContent = itemContent?.textContent || state.value;
        triggerContent.classList.remove('text-muted-foreground');
      }
    } else {
      triggerContent.textContent = state.placeholder;
      triggerContent.classList.add('text-muted-foreground');
    }
  }
  
  /**
   * Add event listener for value changes
   * @param {function} handler - Event handler
   */
  onValueChange(handler) {
    this.element.addEventListener('valuechange', handler);
  }
  
  /**
   * Remove event listener for value changes
   * @param {function} handler - Event handler
   */
  offValueChange(handler) {
    this.element.removeEventListener('valuechange', handler);
  }
  
  /**
   * Open the select dropdown
   */
  open() {
    openSelect(this.element);
  }
  
  /**
   * Close the select dropdown
   */
  close() {
    closeSelect(this.element);
  }
  
  /**
   * Get the DOM element
   * @returns {HTMLDivElement} The select element
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
  module.exports = {
    createSelect,
    createSelectTrigger,
    createSelectContent,
    createSelectItem,
    selectValue,
    openSelect,
    closeSelect,
    Select
  };
} else if (typeof window !== 'undefined') {
  window.shadcnSelect = {
    createSelect,
    createSelectTrigger,
    createSelectContent,
    createSelectItem,
    selectValue,
    openSelect,
    closeSelect,
    Select
  };
}

// Usage examples:
/*
// Simple select creation
const select = new Select({
  placeholder: 'Select a framework...',
  name: 'framework'
})
  .addTrigger()
  .addContent()
  .addItem({ value: 'react', text: 'React' })
  .addItem({ value: 'vue', text: 'Vue' })
  .addItem({ value: 'angular', text: 'Angular' })
  .addItem({ value: 'svelte', text: 'Svelte' });

// Listen for value changes
select.onValueChange((e) => {
  console.log('Selected:', e.detail.value);
});

// Manual assembly
const selectContainer = createSelect({ placeholder: 'Choose option...' });
const trigger = createSelectTrigger();
const content = createSelectContent();

const option1 = createSelectItem({
  value: 'option1',
  text: 'Option 1'
});

const option2 = createSelectItem({
  value: 'option2',
  text: 'Option 2'
});

content.appendChild(option1);
content.appendChild(option2);
selectContainer.appendChild(trigger);
selectContainer.appendChild(content);

// Set initial placeholder
const triggerContent = trigger.querySelector('.select-trigger-content');
triggerContent.textContent = 'Choose option...';
triggerContent.classList.add('text-muted-foreground');

// Append to DOM
select.appendTo(document.body);
document.body.appendChild(selectContainer);
*/
