/**
 * Figma Plugin UI - Tabbed Interface
 * Contains Plugin and UI tabs with respective functionality
 */

// Utility function for class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Simple utility functions for creating UI components
function createButton(options = {}) {
  const {
    variant = 'default',
    size = 'default',
    content = '',
    className = '',
    onClick = null,
    disabled = false
  } = options;

  const button = document.createElement('button');
  button.type = 'button';
  button.disabled = disabled;
  
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline'
  };
  
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };
  
  button.className = cn(baseClasses, variantClasses[variant] || variantClasses.default, sizeClasses[size] || sizeClasses.default, className);
  
  if (typeof content === 'string') {
    button.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    button.appendChild(content);
  }
  
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

function createCard(options = {}) {
  const { className = '' } = options;
  const card = document.createElement('div');
  card.className = cn('rounded-lg border bg-card text-card-foreground shadow-sm', className);
  return card;
}

function createCardHeader(options = {}) {
  const { className = '' } = options;
  const header = document.createElement('div');
  header.className = cn('flex flex-col space-y-1.5 p-6', className);
  return header;
}

function createCardTitle(options = {}) {
  const { content = '', className = '' } = options;
  const title = document.createElement('h3');
  title.className = cn('text-2xl font-semibold leading-none tracking-tight', className);
  if (typeof content === 'string') {
    title.textContent = content;
  } else if (content instanceof HTMLElement) {
    title.appendChild(content);
  }
  return title;
}

function createCardContent(options = {}) {
  const { className = '' } = options;
  const content = document.createElement('div');
  content.className = cn('p-6 pt-0', className);
  return content;
}

function createBadge(options = {}) {
  const { variant = 'default', content = '', className = '' } = options;
  const badge = document.createElement('span');
  
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variantClasses = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground'
  };
  
  badge.className = cn(baseClasses, variantClasses[variant] || variantClasses.default, className);
  
  if (typeof content === 'string') {
    badge.textContent = content;
  } else if (content instanceof HTMLElement) {
    badge.appendChild(content);
  }
  
  return badge;
}

function createSeparator(options = {}) {
  const { className = '' } = options;
  const separator = document.createElement('div');
  separator.className = cn('shrink-0 bg-border h-[1px] w-full', className);
  return separator;
}

// Simple tabs implementation
class Tabs {
  constructor(options = {}) {
    const { defaultValue = '', className = '' } = options;
    this.element = document.createElement('div');
    this.element.className = cn('w-full', className);
    this.activeTab = defaultValue;
    this.tabsList = null;
    this.triggers = [];
    this.contents = [];
  }
  
  addTabsList(options = {}) {
    const { className = '' } = options;
    this.tabsList = document.createElement('div');
    this.tabsList.className = cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full', className);
    this.element.appendChild(this.tabsList);
    return this;
  }
  
  addTab(options = {}) {
    const { value, label, content } = options;
    
    // Create trigger
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = cn('inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm');
    trigger.textContent = label;
    trigger.setAttribute('data-value', value);
    
    trigger.addEventListener('click', () => {
      this.setActiveTab(value);
    });
    
    this.tabsList.appendChild(trigger);
    this.triggers.push(trigger);
    
    // Create content
    const contentDiv = document.createElement('div');
    contentDiv.className = cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2');
    contentDiv.setAttribute('data-value', value);
    contentDiv.style.display = value === this.activeTab ? 'block' : 'none';
    
    if (typeof content === 'string') {
      contentDiv.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      contentDiv.appendChild(content);
    }
    
    this.element.appendChild(contentDiv);
    this.contents.push(contentDiv);
    
    // Set first tab as active if no default
    if (this.triggers.length === 1 && !this.activeTab) {
      this.setActiveTab(value);
    }
    
    return this;
  }
  
  setActiveTab(value) {
    this.activeTab = value;
    
    // Update triggers
    this.triggers.forEach(trigger => {
      const isActive = trigger.getAttribute('data-value') === value;
      trigger.setAttribute('data-state', isActive ? 'active' : 'inactive');
    });
    
    // Update contents
    this.contents.forEach(content => {
      const isActive = content.getAttribute('data-value') === value;
      content.style.display = isActive ? 'block' : 'none';
    });
  }
  
  appendTo(parent) {
    parent.appendChild(this.element);
  }
  
  onTabChange(handler) {
    // Simple implementation for tab change events
    this.element.addEventListener('tabchange', handler);
  }
}

// Global state
let isGeneratingRectangle = false;

/**
 * Initialize the plugin UI
 */
function initializeUI() {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found');
    return;
  }

  // Create the main tabs interface
  const tabs = new Tabs({ defaultValue: 'plugin' });
  
  // Add tabs list
  tabs.addTabsList({ className: 'w-full' });
  
  // Add Plugin tab
  tabs.addTab({
    value: 'plugin',
    label: 'Plugin',
    content: createPluginTabContent()
  });
  
  // Add UI tab
  tabs.addTab({
    value: 'ui',
    label: 'UI',
    content: createUITabContent()
  });
  
  // Listen for tab changes
  tabs.onTabChange((e) => {
    console.log('Tab changed to:', e.detail.value);
  });
  
  // Add to DOM
  tabs.appendTo(root);
  
  // Setup message handling
  setupMessageHandling();
  
  console.log('Plugin UI initialized');
}

/**
 * Create content for the Plugin tab
 */
function createPluginTabContent() {
  const container = document.createElement('div');
  container.className = 'p-6 space-y-6';
  
  // Plugin description card
  const descriptionCard = createCard({ className: 'w-full' });
  const cardHeader = createCardHeader();
  const cardTitle = createCardTitle({ content: 'Figma Plugin Boilerplate' });
  const cardContent = createCardContent();
  
  cardContent.innerHTML = `
    <div class="space-y-4">
      <p class="text-sm text-muted-foreground">
        This is a boilerplate Figma plugin built with vanilla JavaScript and shadcn/ui components. 
        It demonstrates basic plugin functionality including node creation, selection handling, and UI communication.
      </p>
      <div class="space-y-2">
        <h4 class="text-sm font-medium">Features:</h4>
        <ul class="text-sm text-muted-foreground space-y-1">
          <li>• Create rectangles with custom properties</li>
          <li>• Handle selection changes</li>
          <li>• Plugin ↔ UI communication</li>
          <li>• Modern UI with shadcn/ui components</li>
          <li>• TypeScript support</li>
        </ul>
      </div>
    </div>
  `;
  
  cardHeader.appendChild(cardTitle);
  descriptionCard.appendChild(cardHeader);
  descriptionCard.appendChild(cardContent);
  
  // Action section
  const actionSection = document.createElement('div');
  actionSection.className = 'space-y-4';
  
  const actionTitle = document.createElement('h3');
  actionTitle.className = 'text-lg font-semibold';
  actionTitle.textContent = 'Actions';
  
  // Rectangle generation button
  const generateButton = createButton({
    variant: 'default',
    size: 'default',
    content: 'Generate Rectangle',
    className: 'w-full',
    onClick: handleGenerateRectangle
  });
  generateButton.id = 'generate-rectangle-btn';
  
  // Status display
  const statusDiv = document.createElement('div');
  statusDiv.id = 'status-display';
  statusDiv.className = 'text-sm text-muted-foreground';
  
  actionSection.appendChild(actionTitle);
  actionSection.appendChild(generateButton);
  actionSection.appendChild(statusDiv);
  
  container.appendChild(descriptionCard);
  container.appendChild(createSeparator());
  container.appendChild(actionSection);
  
  return container;
}

/**
 * Create content for the UI tab
 */
function createUITabContent() {
  const container = document.createElement('div');
  container.className = 'p-6 space-y-6';
  
  // UI Components overview
  const overviewCard = createCard({ className: 'w-full' });
  const cardHeader = createCardHeader();
  const cardTitle = createCardTitle({ content: 'Available UI Components' });
  const cardContent = createCardContent();
  
  cardContent.innerHTML = `
    <p class="text-sm text-muted-foreground mb-4">
      This plugin includes a comprehensive set of shadcn/ui components adapted for vanilla JavaScript:
    </p>
  `;
  
  cardHeader.appendChild(cardTitle);
  overviewCard.appendChild(cardHeader);
  overviewCard.appendChild(cardContent);
  
  // Components list
  const componentsList = document.createElement('div');
  componentsList.className = 'space-y-4';
  
  const components = [
    {
      name: 'Button',
      description: 'Clickable button with multiple variants and sizes',
      variants: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      sizes: ['default', 'sm', 'lg', 'icon']
    },
    {
      name: 'Card',
      description: 'Container component with header, content, and footer sections',
      variants: ['default'],
      sizes: ['default']
    },
    {
      name: 'Badge',
      description: 'Small status or label indicator',
      variants: ['default', 'secondary', 'destructive', 'outline'],
      sizes: ['default']
    },
    {
      name: 'Input',
      description: 'Text input field with validation support',
      variants: ['default'],
      sizes: ['default', 'sm', 'lg']
    },
    {
      name: 'Label',
      description: 'Form label with accessibility support',
      variants: ['default'],
      sizes: ['default']
    },
    {
      name: 'Select',
      description: 'Dropdown selection component',
      variants: ['default'],
      sizes: ['default', 'sm', 'lg']
    },
    {
      name: 'Separator',
      description: 'Visual divider between content sections',
      variants: ['default'],
      sizes: ['default']
    },
    {
      name: 'Tabs',
      description: 'Tabbed interface with keyboard navigation',
      variants: ['default'],
      sizes: ['default']
    },
    {
      name: 'Alert',
      description: 'Important message or notification display',
      variants: ['default', 'destructive'],
      sizes: ['default']
    }
  ];
  
  components.forEach(component => {
    const componentCard = createCard({ className: 'w-full' });
    const componentHeader = createCardHeader();
    const componentTitle = createCardTitle({ content: component.name });
    const componentContent = createCardContent();
    
    // Create description
    const description = document.createElement('p');
    description.className = 'text-sm text-muted-foreground mb-3';
    description.textContent = component.description;
    
    // Create variants section
    const variantsSection = document.createElement('div');
    variantsSection.className = 'space-y-2';
    
    const variantsDiv = document.createElement('div');
    const variantsLabel = document.createElement('span');
    variantsLabel.className = 'text-xs font-medium text-muted-foreground mr-2';
    variantsLabel.textContent = 'Variants:';
    
    const variantsBadgeContainer = document.createElement('div');
    variantsBadgeContainer.className = 'inline-flex gap-1 flex-wrap';
    
    component.variants.forEach(variant => {
      const badge = createBadge({ 
        variant: variant === 'default' ? 'secondary' : 'outline',
        content: variant 
      });
      variantsBadgeContainer.appendChild(badge);
    });
    
    variantsDiv.appendChild(variantsLabel);
    variantsDiv.appendChild(variantsBadgeContainer);
    
    // Create sizes section
    const sizesDiv = document.createElement('div');
    const sizesLabel = document.createElement('span');
    sizesLabel.className = 'text-xs font-medium text-muted-foreground mr-2';
    sizesLabel.textContent = 'Sizes:';
    
    const sizesBadgeContainer = document.createElement('div');
    sizesBadgeContainer.className = 'inline-flex gap-1 flex-wrap';
    
    component.sizes.forEach(size => {
      const badge = createBadge({ 
        variant: 'outline',
        content: size 
      });
      sizesBadgeContainer.appendChild(badge);
    });
    
    sizesDiv.appendChild(sizesLabel);
    sizesDiv.appendChild(sizesBadgeContainer);
    
    variantsSection.appendChild(variantsDiv);
    variantsSection.appendChild(sizesDiv);
    
    // Add example section for each component
    const exampleSection = document.createElement('div');
    exampleSection.className = 'mt-4 p-3 rounded-md bg-muted/30 border';
    
    const exampleLabel = document.createElement('span');
    exampleLabel.className = 'text-xs font-medium text-muted-foreground mb-2 block';
    exampleLabel.textContent = 'Example:';
    
    const exampleContainer = document.createElement('div');
    exampleContainer.className = 'flex gap-2 flex-wrap items-center';
    
    // Create actual component examples
    switch(component.name) {
      case 'Button':
        component.variants.slice(0, 3).forEach(variant => {
          const btn = createButton({ 
            variant: variant, 
            content: `${variant} button`,
            size: 'sm'
          });
          exampleContainer.appendChild(btn);
        });
        break;
        
      case 'Badge':
        component.variants.forEach(variant => {
          const badge = createBadge({ 
            variant: variant, 
            content: `${variant} badge` 
          });
          exampleContainer.appendChild(badge);
        });
        break;
        
      case 'Card':
        const exampleCard = createCard({ className: 'w-48' });
        const cardHeader = createCardHeader();
        const cardTitle = createCardTitle({ content: 'Card Title' });
        const cardContent = createCardContent();
        cardContent.innerHTML = '<p class="text-sm text-muted-foreground">This is card content.</p>';
        cardHeader.appendChild(cardTitle);
        exampleCard.appendChild(cardHeader);
        exampleCard.appendChild(cardContent);
        exampleContainer.appendChild(exampleCard);
        break;
        
      case 'Separator':
        const sep = createSeparator();
        exampleContainer.appendChild(sep);
        break;
        
      case 'Input':
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Example input';
        input.className = 'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
        exampleContainer.appendChild(input);
        break;
        
      case 'Label':
        const label = document.createElement('label');
        label.className = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
        label.textContent = 'Example Label';
        exampleContainer.appendChild(label);
        break;
        
      case 'Select':
        const select = document.createElement('select');
        select.className = 'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
        const option1 = document.createElement('option');
        option1.textContent = 'Option 1';
        const option2 = document.createElement('option');
        option2.textContent = 'Option 2';
        select.appendChild(option1);
        select.appendChild(option2);
        exampleContainer.appendChild(select);
        break;
        
      case 'Tabs':
        const exampleTabs = document.createElement('div');
        exampleTabs.className = 'text-sm text-muted-foreground';
        exampleTabs.textContent = 'You are currently using tabs! 🎉';
        exampleContainer.appendChild(exampleTabs);
        break;
        
      case 'Alert':
        const alert = document.createElement('div');
        alert.className = 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground';
        alert.innerHTML = '<div><h5 class="mb-1 font-medium leading-none tracking-tight">Alert</h5><div class="text-sm [&_p]:leading-relaxed text-muted-foreground">This is an example alert message.</div></div>';
        exampleContainer.appendChild(alert);
        break;
        
      default:
        const defaultExample = document.createElement('span');
        defaultExample.className = 'text-sm text-muted-foreground';
        defaultExample.textContent = `${component.name} component example`;
        exampleContainer.appendChild(defaultExample);
    }
    
    exampleSection.appendChild(exampleLabel);
    exampleSection.appendChild(exampleContainer);
    
    // Assemble the component content
    componentContent.appendChild(description);
    componentContent.appendChild(variantsSection);
    componentContent.appendChild(exampleSection);
    
    componentHeader.appendChild(componentTitle);
    componentCard.appendChild(componentHeader);
    componentCard.appendChild(componentContent);
    componentsList.appendChild(componentCard);
  });
  
  container.appendChild(overviewCard);
  container.appendChild(createSeparator());
  container.appendChild(componentsList);
  
  return container;
}

/**
 * Handle rectangle generation
 */
function handleGenerateRectangle() {
  if (isGeneratingRectangle) return;
  
  isGeneratingRectangle = true;
  updateGenerateButtonState(true);
  updateStatus('Generating rectangle...', 'info');
  
  // Send message to plugin code
  parent.postMessage({
    pluginMessage: {
      type: 'create-rectangle',
      data: {
        name: 'Generated Rectangle',
        color: '#3b82f6' // Blue color
      }
    }
  }, '*');
}

/**
 * Update the generate button state
 */
function updateGenerateButtonState(loading) {
  const button = document.getElementById('generate-rectangle-btn');
  if (!button) return;
  
  if (loading) {
    button.disabled = true;
    button.textContent = 'Generating...';
    button.classList.add('opacity-50');
  } else {
    button.disabled = false;
    button.textContent = 'Generate Rectangle';
    button.classList.remove('opacity-50');
  }
}

/**
 * Update status display
 */
function updateStatus(message, type = 'info') {
  const statusDiv = document.getElementById('status-display');
  if (!statusDiv) return;
  
  statusDiv.textContent = message;
  statusDiv.className = 'text-sm';
  
  switch (type) {
    case 'success':
      statusDiv.className += ' text-green-600';
      break;
    case 'error':
      statusDiv.className += ' text-red-600';
      break;
    case 'info':
    default:
      statusDiv.className += ' text-muted-foreground';
      break;
  }
}

/**
 * Setup message handling between UI and plugin
 */
function setupMessageHandling() {
  window.addEventListener('message', (event) => {
    const { type, data } = event.data.pluginMessage || {};
    
    console.log('Received message from plugin:', { type, data });
    
    switch (type) {
      case 'rectangle-created':
        isGeneratingRectangle = false;
        updateGenerateButtonState(false);
        updateStatus(`Rectangle created: ${data.name}`, 'success');
        break;
        
      case 'selection-data':
        console.log('Selection data:', data);
        break;
        
      default:
        console.log('Unknown message type:', type);
    }
  });
}

// Initialize UI when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUI);
} else {
  initializeUI();
}
