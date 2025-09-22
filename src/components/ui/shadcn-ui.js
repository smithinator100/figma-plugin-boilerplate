/**
 * shadcn/ui Vanilla JavaScript Components - Standalone Browser Version
 * All components bundled in a single file for easy browser usage
 * 
 * Usage:
 * <script src="shadcn-ui.js"></script>
 * <script>
 *   const button = ShadcnUI.createButton({ text: 'Click me' });
 *   document.body.appendChild(button);
 * </script>
 */

(function(global) {
  'use strict';

  // === UTILITIES ===
  
  /**
   * Simple clsx implementation for combining class names
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
   * Simple Tailwind class merging
   */
  function twMerge(classNames) {
    if (!classNames) return '';
    
    const classes = classNames.split(' ').filter(Boolean);
    const classMap = new Map();
    
    const conflictGroups = {
      'p-': ['p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-'],
      'px-': ['p-', 'px-', 'pl-', 'pr-'],
      'py-': ['p-', 'py-', 'pt-', 'pb-'],
      'm-': ['m-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-'],
      'w-': ['w-'],
      'h-': ['h-'],
      'bg-': ['bg-'],
      'text-': ['text-'],
      'border-': ['border-'],
    };
    
    for (const className of classes) {
      let conflictKey = className;
      
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
   */
  function cn(...inputs) {
    return twMerge(clsx(...inputs));
  }

  /**
   * Class Variance Authority (CVA) implementation
   */
  function cva(base, config = {}) {
    const { variants = {}, defaultVariants = {} } = config;
    
    return function(props = {}) {
      let classes = [base];
      
      const mergedProps = { ...defaultVariants, ...props };
      
      for (const [variantKey, variantValue] of Object.entries(mergedProps)) {
        if (variants[variantKey] && variants[variantKey][variantValue]) {
          classes.push(variants[variantKey][variantValue]);
        }
      }
      
      if (props.className) {
        classes.push(props.className);
      }
      
      return cn(...classes);
    };
  }

  // === BUTTON COMPONENT ===
  
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
    button.className = buttonVariants({ variant, size, className });
    
    if (content) {
      if (typeof content === 'string') {
        button.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        button.appendChild(content);
      }
    } else if (text) {
      button.textContent = text;
    }
    
    if (onClick && typeof onClick === 'function') {
      button.addEventListener('click', onClick);
    }
    
    Object.entries(attributes).forEach(([key, value]) => {
      button.setAttribute(key, value);
    });
    
    return button;
  }

  class Button {
    constructor(options = {}) {
      this.element = createButton(options);
      this.options = options;
    }
    
    setVariant(variant) {
      this.options.variant = variant;
      this.element.className = buttonVariants({
        variant,
        size: this.options.size,
        className: this.options.className
      });
    }
    
    setText(text) {
      this.element.textContent = text;
    }
    
    getElement() {
      return this.element;
    }
    
    appendTo(parent) {
      parent.appendChild(this.element);
    }
  }

  // === CARD COMPONENT ===
  
  function createCard(options = {}) {
    const { className = '', content = null, attributes = {} } = options;
    const card = document.createElement('div');
    card.className = cn("rounded-lg border bg-card text-card-foreground shadow-sm", className);
    
    if (content) {
      if (typeof content === 'string') {
        card.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        card.appendChild(content);
      }
    }
    
    Object.entries(attributes).forEach(([key, value]) => {
      card.setAttribute(key, value);
    });
    
    return card;
  }

  function createCardHeader(options = {}) {
    const { className = '', content = null } = options;
    const header = document.createElement('div');
    header.className = cn("flex flex-col space-y-1.5 p-6", className);
    
    if (content) {
      if (typeof content === 'string') {
        header.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        header.appendChild(content);
      }
    }
    
    return header;
  }

  function createCardTitle(options = {}) {
    const { className = '', text = '', content = null, tag = 'h3' } = options;
    const title = document.createElement(tag);
    title.className = cn("text-2xl font-semibold leading-none tracking-tight", className);
    
    if (content) {
      if (typeof content === 'string') {
        title.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        title.appendChild(content);
      }
    } else if (text) {
      title.textContent = text;
    }
    
    return title;
  }

  function createCardContent(options = {}) {
    const { className = '', content = null } = options;
    const cardContent = document.createElement('div');
    cardContent.className = cn("p-6 pt-0", className);
    
    if (content) {
      if (typeof content === 'string') {
        cardContent.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        cardContent.appendChild(content);
      }
    }
    
    return cardContent;
  }

  // === INPUT COMPONENT ===
  
  function createInput(options = {}) {
    const {
      type = 'text',
      className = '',
      placeholder = '',
      value = '',
      disabled = false,
      onChange = null
    } = options;

    const input = document.createElement('input');
    input.type = type;
    input.disabled = disabled;
    
    if (placeholder) input.placeholder = placeholder;
    if (value) input.value = value;
    
    input.className = cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    );
    
    if (onChange && typeof onChange === 'function') {
      input.addEventListener('input', onChange);
    }
    
    return input;
  }

  // === BADGE COMPONENT ===
  
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

  function createBadge(options = {}) {
    const { variant = 'default', className = '', text = '', onClick = null } = options;
    const badge = document.createElement('div');
    badge.className = badgeVariants({ variant, className });
    
    if (text) badge.textContent = text;
    
    if (onClick && typeof onClick === 'function') {
      badge.style.cursor = 'pointer';
      badge.addEventListener('click', onClick);
    }
    
    return badge;
  }

  // === SEPARATOR COMPONENT ===
  
  function createSeparator(options = {}) {
    const { orientation = 'horizontal', className = '' } = options;
    const separator = document.createElement('div');
    separator.setAttribute('aria-hidden', 'true');
    separator.className = cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    );
    return separator;
  }

  // === ALERT COMPONENT ===
  
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

  function createAlert(options = {}) {
    const { variant = 'default', className = '', content = null } = options;
    const alert = document.createElement('div');
    alert.setAttribute('role', 'alert');
    alert.className = alertVariants({ variant, className });
    
    if (content) {
      if (typeof content === 'string') {
        alert.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        alert.appendChild(content);
      }
    }
    
    return alert;
  }

  // === LABEL COMPONENT ===
  
  function createLabel(options = {}) {
    const { className = '', text = '', htmlFor = '' } = options;
    const label = document.createElement('label');
    label.className = cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className);
    
    if (htmlFor) label.setAttribute('for', htmlFor);
    if (text) label.textContent = text;
    
    return label;
  }

  // === TABS COMPONENT ===
  
  function createTabs(options = {}) {
    const { defaultValue = '', orientation = 'horizontal', className = '' } = options;
    const tabs = document.createElement('div');
    tabs.className = cn('tabs-root', className);
    tabs.setAttribute('data-orientation', orientation);
    
    tabs._tabsState = {
      activeTab: defaultValue,
      orientation: orientation,
      tabTriggers: new Map(),
      tabContents: new Map()
    };
    
    return tabs;
  }

  function createTabsList(options = {}) {
    const { className = '' } = options;
    const tabsList = document.createElement('div');
    tabsList.className = cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    );
    tabsList.setAttribute('role', 'tablist');
    return tabsList;
  }

  function createTabsTrigger(options = {}) {
    const { value, text = '', className = '', disabled = false } = options;
    if (!value) throw new Error('Tab trigger must have a value');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.disabled = disabled;
    trigger.setAttribute('role', 'tab');
    trigger.setAttribute('data-value', value);
    trigger.setAttribute('aria-selected', 'false');
    trigger.setAttribute('tabindex', '-1');
    
    trigger.className = cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    );
    
    if (text) trigger.textContent = text;
    
    trigger.addEventListener('click', (e) => {
      if (!disabled) {
        const tabsRoot = trigger.closest('.tabs-root');
        if (tabsRoot) setActiveTab(tabsRoot, value);
      }
    });
    
    return trigger;
  }

  function createTabsContent(options = {}) {
    const { value, content = null, className = '' } = options;
    if (!value) throw new Error('Tab content must have a value');

    const tabContent = document.createElement('div');
    tabContent.setAttribute('role', 'tabpanel');
    tabContent.setAttribute('data-value', value);
    tabContent.setAttribute('aria-hidden', 'true');
    tabContent.setAttribute('tabindex', '0');
    tabContent.style.display = 'none';
    
    tabContent.className = cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    );
    
    if (content) {
      if (typeof content === 'string') {
        tabContent.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        tabContent.appendChild(content);
      }
    }
    
    return tabContent;
  }

  function setActiveTab(tabsRoot, value) {
    if (!tabsRoot || !tabsRoot._tabsState) return;
    
    const state = tabsRoot._tabsState;
    state.activeTab = value;
    
    // Update triggers
    const triggers = tabsRoot.querySelectorAll('[role="tab"]');
    triggers.forEach(trigger => {
      const triggerValue = trigger.getAttribute('data-value');
      const isActive = triggerValue === value;
      
      trigger.setAttribute('aria-selected', isActive.toString());
      trigger.setAttribute('tabindex', isActive ? '0' : '-1');
      trigger.setAttribute('data-state', isActive ? 'active' : 'inactive');
    });
    
    // Update content panels
    const contents = tabsRoot.querySelectorAll('[role="tabpanel"]');
    contents.forEach(content => {
      const contentValue = content.getAttribute('data-value');
      const isActive = contentValue === value;
      
      content.setAttribute('aria-hidden', (!isActive).toString());
      content.style.display = isActive ? '' : 'none';
      content.setAttribute('data-state', isActive ? 'active' : 'inactive');
    });
  }

  class Tabs {
    constructor(options = {}) {
      this.element = createTabs(options);
      this.tabsList = null;
      this.triggers = [];
      this.contents = [];
    }
    
    addTabsList(options = {}) {
      this.tabsList = createTabsList(options);
      this.element.appendChild(this.tabsList);
      return this;
    }
    
    addTrigger(options = {}) {
      if (!this.tabsList) this.addTabsList();
      const trigger = createTabsTrigger(options);
      this.tabsList.appendChild(trigger);
      this.triggers.push(trigger);
      
      if (this.triggers.length === 1 && !this.element._tabsState.activeTab) {
        this.setActiveTab(options.value);
      }
      return this;
    }
    
    addContent(options = {}) {
      const content = createTabsContent(options);
      this.element.appendChild(content);
      this.contents.push(content);
      return this;
    }
    
    addTab(options = {}) {
      const { value, label, content, triggerOptions = {}, contentOptions = {} } = options;
      this.addTrigger({ value, text: label, ...triggerOptions });
      this.addContent({ value, content, ...contentOptions });
      return this;
    }
    
    setActiveTab(value) {
      setActiveTab(this.element, value);
    }
    
    getElement() {
      return this.element;
    }
    
    appendTo(parent) {
      parent.appendChild(this.element);
    }
  }

  // === SELECT COMPONENT ===
  
  function createSelect(options = {}) {
    const { value = '', placeholder = 'Select an option...', disabled = false, className = '' } = options;
    const select = document.createElement('div');
    select.className = cn('select-root relative', className);
    
    select._selectState = {
      value: value,
      placeholder: placeholder,
      disabled: disabled,
      isOpen: false,
      options: new Map()
    };
    
    return select;
  }

  function createSelectTrigger(options = {}) {
    const { className = '' } = options;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    );
    
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'listbox');
    
    const triggerContent = document.createElement('span');
    triggerContent.className = 'select-trigger-content text-muted-foreground';
    
    const chevron = document.createElement('svg');
    chevron.className = 'h-4 w-4 opacity-50';
    chevron.setAttribute('fill', 'none');
    chevron.setAttribute('stroke', 'currentColor');
    chevron.setAttribute('viewBox', '0 0 24 24');
    chevron.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"/>';
    
    trigger.appendChild(triggerContent);
    trigger.appendChild(chevron);
    
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const selectRoot = trigger.closest('.select-root');
      if (selectRoot && !selectRoot._selectState.disabled) {
        toggleSelect(selectRoot);
      }
    });
    
    return trigger;
  }

  function createSelectContent(options = {}) {
    const { className = '', maxHeight = 200 } = options;
    const content = document.createElement('div');
    content.className = cn(
      "absolute top-full left-0 z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
      className
    );
    
    content.setAttribute('role', 'listbox');
    content.setAttribute('data-state', 'closed');
    content.style.display = 'none';
    content.style.maxHeight = `${maxHeight}px`;
    content.style.overflowY = 'auto';
    
    return content;
  }

  function createSelectItem(options = {}) {
    const { value, text = '', disabled = false, className = '' } = options;
    if (value === undefined) throw new Error('Select item must have a value');

    const item = document.createElement('div');
    item.className = cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    );
    
    item.setAttribute('role', 'option');
    item.setAttribute('data-value', value);
    item.setAttribute('aria-selected', 'false');
    
    if (disabled) item.setAttribute('data-disabled', 'true');
    
    const checkIcon = document.createElement('span');
    checkIcon.className = 'absolute left-2 flex h-3.5 w-3.5 items-center justify-center opacity-0';
    checkIcon.innerHTML = '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12 5 5L20 7"/></svg>';
    
    const itemContent = document.createElement('span');
    itemContent.className = 'select-item-content';
    if (text) itemContent.textContent = text;
    
    item.appendChild(checkIcon);
    item.appendChild(itemContent);
    
    item.addEventListener('click', (e) => {
      if (!disabled) {
        const selectRoot = item.closest('.select-root');
        if (selectRoot) {
          selectValue(selectRoot, value);
          closeSelect(selectRoot);
        }
      }
    });
    
    return item;
  }

  function toggleSelect(selectRoot) {
    if (!selectRoot || !selectRoot._selectState) return;
    const state = selectRoot._selectState;
    if (state.isOpen) closeSelect(selectRoot);
    else openSelect(selectRoot);
  }

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
    }
  }

  function closeSelect(selectRoot) {
    if (!selectRoot || !selectRoot._selectState) return;
    const state = selectRoot._selectState;
    if (!state.isOpen) return;
    
    state.isOpen = false;
    const trigger = selectRoot.querySelector('[role="combobox"]');
    const content = selectRoot.querySelector('[role="listbox"]');
    
    if (trigger && content) {
      trigger.setAttribute('aria-expanded', 'false');
      content.setAttribute('data-state', 'closed');
      content.style.display = 'none';
    }
  }

  function selectValue(selectRoot, value) {
    if (!selectRoot || !selectRoot._selectState) return;
    
    const state = selectRoot._selectState;
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
      if (checkIcon) checkIcon.style.opacity = isSelected ? '1' : '0';
    });
  }

  class Select {
    constructor(options = {}) {
      this.element = createSelect(options);
      this.trigger = null;
      this.content = null;
      this.items = [];
    }
    
    addTrigger(options = {}) {
      this.trigger = createSelectTrigger(options);
      this.element.appendChild(this.trigger);
      this.updateTriggerContent();
      return this;
    }
    
    addContent(options = {}) {
      this.content = createSelectContent(options);
      this.element.appendChild(this.content);
      return this;
    }
    
    addItem(options = {}) {
      if (!this.content) this.addContent();
      const item = createSelectItem(options);
      this.content.appendChild(item);
      this.items.push(item);
      
      if (options.value === this.element._selectState.value) {
        selectValue(this.element, options.value);
      }
      return this;
    }
    
    setValue(value) {
      selectValue(this.element, value);
    }
    
    getValue() {
      return this.element._selectState?.value || '';
    }
    
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
    
    getElement() {
      return this.element;
    }
    
    appendTo(parent) {
      parent.appendChild(this.element);
    }
  }

  // === MAIN EXPORT ===
  
  const ShadcnUI = {
    // Utilities
    cn,
    clsx,
    twMerge,
    cva,
    
    // Components
    createButton,
    Button,
    buttonVariants,
    
    createCard,
    createCardHeader,
    createCardTitle,
    createCardContent,
    
    createInput,
    
    createBadge,
    badgeVariants,
    
    createSeparator,
    
    createAlert,
    alertVariants,
    
    createLabel,
    
    // Tabs
    createTabs,
    createTabsList,
    createTabsTrigger,
    createTabsContent,
    setActiveTab,
    Tabs,
    
    // Select
    createSelect,
    createSelectTrigger,
    createSelectContent,
    createSelectItem,
    selectValue,
    openSelect,
    closeSelect,
    toggleSelect,
    Select,
  };

  // Export to global scope
  if (typeof global !== 'undefined') {
    global.ShadcnUI = ShadcnUI;
  }
  
  if (typeof window !== 'undefined') {
    window.ShadcnUI = ShadcnUI;
  }

})(typeof window !== 'undefined' ? window : this);
