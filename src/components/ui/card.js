/**
 * Card components - Vanilla JavaScript version of shadcn/ui Card
 * Provides card container and content sections with Tailwind CSS styling
 */

// Import utilities (adjust path as needed)
const { cn } = window.shadcnUtils || require('../../lib/utils.js');

/**
 * Creates a card container element
 * @param {Object} options - Card configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @param {HTMLElement|string} [options.content] - Card content
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created card element
 */
function createCard(options = {}) {
  const {
    className = '',
    content = null,
    attributes = {}
  } = options;

  const card = document.createElement('div');
  card.className = cn(
    "rounded-lg border bg-card text-card-foreground shadow-sm",
    className
  );
  
  // Set content
  if (content) {
    if (typeof content === 'string') {
      card.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      card.appendChild(content);
    }
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    card.setAttribute(key, value);
  });
  
  return card;
}

/**
 * Creates a card header element
 * @param {Object} options - Card header configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @param {HTMLElement|string} [options.content] - Header content
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created card header element
 */
function createCardHeader(options = {}) {
  const {
    className = '',
    content = null,
    attributes = {}
  } = options;

  const header = document.createElement('div');
  header.className = cn("flex flex-col space-y-1.5 p-6", className);
  
  // Set content
  if (content) {
    if (typeof content === 'string') {
      header.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      header.appendChild(content);
    }
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    header.setAttribute(key, value);
  });
  
  return header;
}

/**
 * Creates a card title element
 * @param {Object} options - Card title configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @param {string} [options.text] - Title text content
 * @param {HTMLElement|string} [options.content] - Title content
 * @param {string} [options.tag='h3'] - HTML tag to use (h1-h6)
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLHeadingElement} The created card title element
 */
function createCardTitle(options = {}) {
  const {
    className = '',
    text = '',
    content = null,
    tag = 'h3',
    attributes = {}
  } = options;

  const title = document.createElement(tag);
  title.className = cn(
    "text-2xl font-semibold leading-none tracking-tight",
    className
  );
  
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
 * Creates a card description element
 * @param {Object} options - Card description configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @param {string} [options.text] - Description text content
 * @param {HTMLElement|string} [options.content] - Description content
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLParagraphElement} The created card description element
 */
function createCardDescription(options = {}) {
  const {
    className = '',
    text = '',
    content = null,
    attributes = {}
  } = options;

  const description = document.createElement('p');
  description.className = cn("text-sm text-muted-foreground", className);
  
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
 * Creates a card content element
 * @param {Object} options - Card content configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @param {HTMLElement|string} [options.content] - Content
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created card content element
 */
function createCardContent(options = {}) {
  const {
    className = '',
    content = null,
    attributes = {}
  } = options;

  const cardContent = document.createElement('div');
  cardContent.className = cn("p-6 pt-0", className);
  
  // Set content
  if (content) {
    if (typeof content === 'string') {
      cardContent.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      cardContent.appendChild(content);
    }
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    cardContent.setAttribute(key, value);
  });
  
  return cardContent;
}

/**
 * Creates a card footer element
 * @param {Object} options - Card footer configuration options
 * @param {string} [options.className] - Additional CSS classes
 * @param {HTMLElement|string} [options.content] - Footer content
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLDivElement} The created card footer element
 */
function createCardFooter(options = {}) {
  const {
    className = '',
    content = null,
    attributes = {}
  } = options;

  const footer = document.createElement('div');
  footer.className = cn("flex items-center p-6 pt-0", className);
  
  // Set content
  if (content) {
    if (typeof content === 'string') {
      footer.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      footer.appendChild(content);
    }
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    footer.setAttribute(key, value);
  });
  
  return footer;
}

/**
 * Card class for more advanced usage
 */
class Card {
  constructor(options = {}) {
    this.element = createCard(options);
    this.header = null;
    this.title = null;
    this.description = null;
    this.content = null;
    this.footer = null;
  }
  
  /**
   * Add a header to the card
   * @param {Object} options - Header options
   * @returns {Card} This card instance for chaining
   */
  addHeader(options = {}) {
    this.header = createCardHeader(options);
    this.element.appendChild(this.header);
    return this;
  }
  
  /**
   * Add a title to the card (will be added to header if exists)
   * @param {Object} options - Title options
   * @returns {Card} This card instance for chaining
   */
  addTitle(options = {}) {
    this.title = createCardTitle(options);
    if (this.header) {
      this.header.appendChild(this.title);
    } else {
      // Create header if it doesn't exist
      this.addHeader();
      this.header.appendChild(this.title);
    }
    return this;
  }
  
  /**
   * Add a description to the card (will be added to header if exists)
   * @param {Object} options - Description options
   * @returns {Card} This card instance for chaining
   */
  addDescription(options = {}) {
    this.description = createCardDescription(options);
    if (this.header) {
      this.header.appendChild(this.description);
    } else {
      // Create header if it doesn't exist
      this.addHeader();
      this.header.appendChild(this.description);
    }
    return this;
  }
  
  /**
   * Add content to the card
   * @param {Object} options - Content options
   * @returns {Card} This card instance for chaining
   */
  addContent(options = {}) {
    this.content = createCardContent(options);
    this.element.appendChild(this.content);
    return this;
  }
  
  /**
   * Add a footer to the card
   * @param {Object} options - Footer options
   * @returns {Card} This card instance for chaining
   */
  addFooter(options = {}) {
    this.footer = createCardFooter(options);
    this.element.appendChild(this.footer);
    return this;
  }
  
  /**
   * Get the DOM element
   * @returns {HTMLDivElement} The card element
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
    createCard,
    createCardHeader,
    createCardTitle,
    createCardDescription,
    createCardContent,
    createCardFooter,
    Card
  };
} else if (typeof window !== 'undefined') {
  window.shadcnCard = {
    createCard,
    createCardHeader,
    createCardTitle,
    createCardDescription,
    createCardContent,
    createCardFooter,
    Card
  };
}

// Usage examples:
/*
// Simple card creation
const card1 = createCard({
  content: '<p>Simple card content</p>'
});

// Using Card class with method chaining
const card2 = new Card()
  .addTitle({ text: 'Card Title' })
  .addDescription({ text: 'This is a card description' })
  .addContent({ content: '<p>Main card content goes here</p>' })
  .addFooter({ content: '<button>Action</button>' });

// Manual assembly
const card3 = createCard();
const header = createCardHeader();
const title = createCardTitle({ text: 'Manual Assembly' });
const description = createCardDescription({ text: 'Built step by step' });
const content = createCardContent({ text: 'Card content' });

header.appendChild(title);
header.appendChild(description);
card3.appendChild(header);
card3.appendChild(content);

// Append to DOM
document.body.appendChild(card1);
card2.appendTo(document.body);
document.body.appendChild(card3);
*/
