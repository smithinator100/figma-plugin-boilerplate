/**
 * Tabs component - Vanilla JavaScript version of shadcn/ui Tabs
 * Provides tabbed interface with keyboard navigation and accessibility
 */

// Import utilities (adjust path as needed)
const { cn } = window.shadcnUtils || require('../../lib/utils.js');

/**
 * Creates a tabs container element
 * @param {Object} options - Tabs configuration options
 * @param {string} [options.defaultValue] - Default active tab value
 * @param {string} [options.orientation='horizontal'] - Tabs orientation (horizontal, vertical)
 * @param {string} [options.className] - Additional CSS classes
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created tabs container element
 */
function createTabs(options = {}) {
  const {
    defaultValue = '',
    orientation = 'horizontal',
    className = '',
    attributes = {}
  } = options;

  const tabs = document.createElement('div');
  tabs.className = cn('tabs-root', className);
  tabs.setAttribute('data-orientation', orientation);
  
  // Store tab state
  tabs._tabsState = {
    activeTab: defaultValue,
    orientation: orientation,
    tabTriggers: new Map(),
    tabContents: new Map()
  };
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    tabs.setAttribute(key, value);
  });
  
  return tabs;
}

/**
 * Creates a tabs list (container for tab triggers)
 * @param {Object} options - Tabs list configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created tabs list element
 */
function createTabsList(options = {}) {
  const {
    className = '',
    attributes = {}
  } = options;

  const tabsList = document.createElement('div');
  tabsList.className = cn(
    "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
    className
  );
  tabsList.setAttribute('role', 'tablist');
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    tabsList.setAttribute(key, value);
  });
  
  return tabsList;
}

/**
 * Creates a tab trigger (clickable tab header)
 * @param {Object} options - Tab trigger configuration options
 * @param {string} options.value - Tab value (must be unique)
 * @param {string} [options.text] - Tab text content
 * @param {HTMLElement|string} [options.content] - Tab content
 * @param {string} [options.className] - Additional CSS classes
 * @param {boolean} [options.disabled=false] - Whether tab is disabled
 * @param {function} [options.onClick] - Click event handler
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLButtonElement} The created tab trigger element
 */
function createTabsTrigger(options = {}) {
  const {
    value,
    text = '',
    content = null,
    className = '',
    disabled = false,
    onClick = null,
    attributes = {}
  } = options;

  if (!value) {
    throw new Error('Tab trigger must have a value');
  }

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
  
  // Set content
  if (content) {
    if (typeof content === 'string') {
      trigger.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      trigger.appendChild(content);
    }
  } else if (text) {
    trigger.textContent = text;
  }
  
  // Add click handler
  trigger.addEventListener('click', (e) => {
    if (!disabled) {
      const tabsRoot = trigger.closest('.tabs-root');
      if (tabsRoot) {
        setActiveTab(tabsRoot, value);
      }
      if (onClick && typeof onClick === 'function') {
        onClick(e);
      }
    }
  });
  
  // Add keyboard navigation
  trigger.addEventListener('keydown', handleTabKeydown);
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    trigger.setAttribute(key, value);
  });
  
  return trigger;
}

/**
 * Creates a tab content panel
 * @param {Object} options - Tab content configuration options
 * @param {string} options.value - Tab value (must match trigger value)
 * @param {HTMLElement|string} [options.content] - Panel content
 * @param {string} [options.className] - Additional CSS classes
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created tab content element
 */
function createTabsContent(options = {}) {
  const {
    value,
    content = null,
    className = '',
    attributes = {}
  } = options;

  if (!value) {
    throw new Error('Tab content must have a value');
  }

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
  
  // Set content
  if (content) {
    if (typeof content === 'string') {
      tabContent.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      tabContent.appendChild(content);
    }
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    tabContent.setAttribute(key, value);
  });
  
  return tabContent;
}

/**
 * Sets the active tab
 * @param {HTMLElement} tabsRoot - The tabs root element
 * @param {string} value - The tab value to activate
 */
function setActiveTab(tabsRoot, value) {
  if (!tabsRoot || !tabsRoot._tabsState) return;
  
  const state = tabsRoot._tabsState;
  const previousValue = state.activeTab;
  
  // Update state
  state.activeTab = value;
  
  // Update all triggers
  const triggers = tabsRoot.querySelectorAll('[role="tab"]');
  triggers.forEach(trigger => {
    const triggerValue = trigger.getAttribute('data-value');
    const isActive = triggerValue === value;
    
    trigger.setAttribute('aria-selected', isActive.toString());
    trigger.setAttribute('tabindex', isActive ? '0' : '-1');
    trigger.setAttribute('data-state', isActive ? 'active' : 'inactive');
    
    if (isActive) {
      trigger.focus();
    }
  });
  
  // Update all content panels
  const contents = tabsRoot.querySelectorAll('[role="tabpanel"]');
  contents.forEach(content => {
    const contentValue = content.getAttribute('data-value');
    const isActive = contentValue === value;
    
    content.setAttribute('aria-hidden', (!isActive).toString());
    content.style.display = isActive ? '' : 'none';
    content.setAttribute('data-state', isActive ? 'active' : 'inactive');
  });
  
  // Dispatch change event
  const changeEvent = new CustomEvent('tabchange', {
    detail: { value, previousValue },
    bubbles: true
  });
  tabsRoot.dispatchEvent(changeEvent);
}

/**
 * Handle keyboard navigation for tabs
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleTabKeydown(e) {
  const trigger = e.currentTarget;
  const tabsList = trigger.parentElement;
  const tabsRoot = trigger.closest('.tabs-root');
  
  if (!tabsList || !tabsRoot) return;
  
  const triggers = Array.from(tabsList.querySelectorAll('[role="tab"]:not([disabled])'));
  const currentIndex = triggers.indexOf(trigger);
  
  let nextIndex = currentIndex;
  
  switch (e.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : triggers.length - 1;
      break;
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault();
      nextIndex = currentIndex < triggers.length - 1 ? currentIndex + 1 : 0;
      break;
    case 'Home':
      e.preventDefault();
      nextIndex = 0;
      break;
    case 'End':
      e.preventDefault();
      nextIndex = triggers.length - 1;
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      const value = trigger.getAttribute('data-value');
      setActiveTab(tabsRoot, value);
      return;
    default:
      return;
  }
  
  if (triggers[nextIndex]) {
    const nextValue = triggers[nextIndex].getAttribute('data-value');
    setActiveTab(tabsRoot, nextValue);
  }
}

/**
 * Tabs class for more advanced usage
 */
class Tabs {
  constructor(options = {}) {
    this.element = createTabs(options);
    this.options = options;
    this.tabsList = null;
    this.triggers = [];
    this.contents = [];
  }
  
  /**
   * Add a tabs list to the tabs
   * @param {Object} options - Tabs list options
   * @returns {Tabs} This tabs instance for chaining
   */
  addTabsList(options = {}) {
    this.tabsList = createTabsList(options);
    this.element.appendChild(this.tabsList);
    return this;
  }
  
  /**
   * Add a tab trigger
   * @param {Object} options - Tab trigger options
   * @returns {Tabs} This tabs instance for chaining
   */
  addTrigger(options = {}) {
    if (!this.tabsList) {
      this.addTabsList();
    }
    
    const trigger = createTabsTrigger(options);
    this.tabsList.appendChild(trigger);
    this.triggers.push(trigger);
    
    // Set first tab as active if no default value
    if (this.triggers.length === 1 && !this.element._tabsState.activeTab) {
      this.setActiveTab(options.value);
    }
    
    return this;
  }
  
  /**
   * Add a tab content panel
   * @param {Object} options - Tab content options
   * @returns {Tabs} This tabs instance for chaining
   */
  addContent(options = {}) {
    const content = createTabsContent(options);
    this.element.appendChild(content);
    this.contents.push(content);
    return this;
  }
  
  /**
   * Add a complete tab (trigger + content)
   * @param {Object} options - Tab options
   * @param {string} options.value - Tab value
   * @param {string} options.label - Tab label
   * @param {HTMLElement|string} options.content - Tab content
   * @param {Object} [options.triggerOptions] - Additional trigger options
   * @param {Object} [options.contentOptions] - Additional content options
   * @returns {Tabs} This tabs instance for chaining
   */
  addTab(options = {}) {
    const { value, label, content, triggerOptions = {}, contentOptions = {} } = options;
    
    this.addTrigger({
      value,
      text: label,
      ...triggerOptions
    });
    
    this.addContent({
      value,
      content,
      ...contentOptions
    });
    
    return this;
  }
  
  /**
   * Set the active tab
   * @param {string} value - Tab value to activate
   */
  setActiveTab(value) {
    setActiveTab(this.element, value);
  }
  
  /**
   * Get the current active tab value
   * @returns {string} Current active tab value
   */
  getActiveTab() {
    return this.element._tabsState?.activeTab || '';
  }
  
  /**
   * Enable/disable a tab
   * @param {string} value - Tab value
   * @param {boolean} disabled - Whether to disable the tab
   */
  setTabDisabled(value, disabled) {
    const trigger = this.element.querySelector(`[role="tab"][data-value="${value}"]`);
    if (trigger) {
      trigger.disabled = disabled;
    }
  }
  
  /**
   * Add event listener for tab changes
   * @param {function} handler - Event handler
   */
  onTabChange(handler) {
    this.element.addEventListener('tabchange', handler);
  }
  
  /**
   * Remove event listener for tab changes
   * @param {function} handler - Event handler
   */
  offTabChange(handler) {
    this.element.removeEventListener('tabchange', handler);
  }
  
  /**
   * Get the DOM element
   * @returns {HTMLDivElement} The tabs element
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
    createTabs,
    createTabsList,
    createTabsTrigger,
    createTabsContent,
    setActiveTab,
    Tabs
  };
} else if (typeof window !== 'undefined') {
  window.shadcnTabs = {
    createTabs,
    createTabsList,
    createTabsTrigger,
    createTabsContent,
    setActiveTab,
    Tabs
  };
}

// Usage examples:
/*
// Simple tabs creation
const tabs = new Tabs({ defaultValue: 'tab1' })
  .addTabsList()
  .addTab({
    value: 'tab1',
    label: 'Account',
    content: '<div class="space-y-4"><h3>Account Settings</h3><p>Manage your account settings here.</p></div>'
  })
  .addTab({
    value: 'tab2',
    label: 'Password',
    content: '<div class="space-y-4"><h3>Password</h3><p>Change your password here.</p></div>'
  })
  .addTab({
    value: 'tab3',
    label: 'Notifications',
    content: '<div class="space-y-4"><h3>Notifications</h3><p>Manage your notification preferences.</p></div>'
  });

// Listen for tab changes
tabs.onTabChange((e) => {
  console.log('Tab changed:', e.detail.value);
});

// Manual assembly
const tabsContainer = createTabs({ defaultValue: 'overview' });
const tabsList = createTabsList();

const overviewTrigger = createTabsTrigger({
  value: 'overview',
  text: 'Overview'
});

const analyticsTrigger = createTabsTrigger({
  value: 'analytics',
  text: 'Analytics'
});

const overviewContent = createTabsContent({
  value: 'overview',
  content: '<div>Overview content here</div>'
});

const analyticsContent = createTabsContent({
  value: 'analytics',
  content: '<div>Analytics content here</div>'
});

tabsList.appendChild(overviewTrigger);
tabsList.appendChild(analyticsTrigger);
tabsContainer.appendChild(tabsList);
tabsContainer.appendChild(overviewContent);
tabsContainer.appendChild(analyticsContent);

// Set initial active tab
setActiveTab(tabsContainer, 'overview');

// Append to DOM
tabs.appendTo(document.body);
document.body.appendChild(tabsContainer);
*/
