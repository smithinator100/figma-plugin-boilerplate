// This file runs in the Figma plugin sandbox
// It has access to the Figma API but no access to the DOM or external APIs
/// <reference types="@figma/plugin-typings" />
/// <reference path="./types/figma.d.ts" />

console.log('Figma Plugin Boilerplate loaded');

// Show the plugin UI
figma.showUI(__html__, {
  width: 400,
  height: 600,
  title: 'Figma Plugin Boilerplate'
});

// Handle messages from the UI
figma.ui.onmessage = (msg: any) => {
  console.log('Received message from UI:', msg);

  switch (msg.type) {
    case 'create-rectangle':
      createRectangle(msg.data);
      break;

    case 'get-selection':
      getSelection();
      break;

    case 'close-plugin':
      figma.closePlugin();
      break;

    default:
      console.log('Unknown message type:', msg.type);
  }
};

// Example function: Create a rectangle with custom properties
function createRectangle(data: any) {
  const rect = figma.createRectangle();
  rect.resize(100, 100);
  
  // Set custom name if provided
  if (data && data.name) {
    rect.name = data.name;
  }
  
  // Convert hex color to RGB if provided
  if (data && data.color) {
    const color = hexToRgb(data.color);
    if (color) {
      rect.fills = [{ type: 'SOLID', color }];
    } else {
      // Fallback to default color if hex conversion fails
      rect.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.6, b: 1 } }];
    }
  } else {
    rect.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.6, b: 1 } }];
  }
  
  // Position the rectangle in the center of the viewport
  rect.x = figma.viewport.center.x - 50;
  rect.y = figma.viewport.center.y - 50;
  
  // Add to current page
  figma.currentPage.appendChild(rect);
  
  // Select the new rectangle
  figma.currentPage.selection = [rect];
  
  // Zoom into view
  figma.viewport.scrollAndZoomIntoView([rect]);
  
  // Send success message to UI
  figma.ui.postMessage({
    type: 'rectangle-created',
    data: { id: rect.id, name: rect.name }
  });
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    };
  }
  return null;
}

// Example function: Get current selection
function getSelection() {
  const selection = figma.currentPage.selection;
  
  const selectionData = selection.map((node: any) => ({
    id: node.id,
    name: node.name,
    type: node.type,
    width: 'width' in node ? node.width : null,
    height: 'height' in node ? node.height : null
  }));

  figma.ui.postMessage({
    type: 'selection-data',
    data: selectionData
  });
}

// Handle plugin close
figma.on('close', () => {
  console.log('Plugin closed');
});
