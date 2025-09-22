/**
 * shadcn/ui Vanilla JavaScript Components
 * Main entry point for all vanilla JS components
 */

// Import all component modules
const buttonModule = require('./button.js');
const cardModule = require('./card.js');
const inputModule = require('./input.js');
const badgeModule = require('./badge.js');
const alertModule = require('./alert.js');
const labelModule = require('./label.js');
const separatorModule = require('./separator.js');
const tabsModule = require('./tabs.js');
const selectModule = require('./select.js');
const utilsModule = require('../../lib/utils.js');

// Export all components and utilities
const ShadcnUI = {
  // Utilities
  ...utilsModule,
  
  // Button
  ...buttonModule,
  
  // Card
  ...cardModule,
  
  // Input
  ...inputModule,
  
  // Badge
  ...badgeModule,
  
  // Alert
  ...alertModule,
  
  // Label
  ...labelModule,
  
  // Separator
  ...separatorModule,
  
  // Tabs
  ...tabsModule,
  
  // Select
  ...selectModule,
};

// For browser environments, attach to window
if (typeof window !== 'undefined') {
  window.ShadcnUI = ShadcnUI;
}

// For Node.js/module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShadcnUI;
}

// Export individual components for convenience
module.exports.Button = buttonModule.Button;
module.exports.Card = cardModule.Card;
module.exports.Input = inputModule.Input;
module.exports.Badge = badgeModule.Badge;
module.exports.Alert = alertModule.Alert;
module.exports.Label = labelModule.Label;
module.exports.Separator = separatorModule.Separator;
module.exports.Tabs = tabsModule.Tabs;
module.exports.Select = selectModule.Select;
