#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple bundler that combines all JS files into a single ui.js file
function buildUI() {
  console.log('Building UI...');
  
  const distDir = path.join(__dirname, 'dist');
  const uiTempDir = path.join(distDir, 'ui-temp');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Read the HTML template
  const htmlTemplate = fs.readFileSync(path.join(__dirname, 'src', 'ui.html'), 'utf8');
  
  // Read the CSS
  const cssPath = path.join(__dirname, 'src', 'ui.css');
  let cssContent = '';
  if (fs.existsSync(cssPath)) {
    cssContent = fs.readFileSync(cssPath, 'utf8');
  }
  
  // Create a simple inline HTML with styles and script
  let htmlContent = htmlTemplate.replace(
    '<script src="./ui.js"></script>',
    `<style>${cssContent}</style>
    <script>
      // Simple React and ReactDOM polyfills for Figma plugin environment
      // This is a minimal setup - in a real project you'd want proper bundling
      console.log('UI script loaded');
      
      // Basic message handling setup
      window.addEventListener('message', (event) => {
        console.log('Received message:', event.data);
      });
      
      // Basic app initialization
      document.addEventListener('DOMContentLoaded', () => {
        const root = document.getElementById('root');
        if (root) {
          root.innerHTML = \`
            <div style="padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <h2>Figma Plugin Boilerplate</h2>
              <p>Simple TypeScript-only build working!</p>
              <button onclick="createRectangle()" style="padding: 8px 16px; margin: 4px; background: #0066ff; color: white; border: none; border-radius: 4px; cursor: pointer;">Create Rectangle</button>
              <button onclick="getSelection()" style="padding: 8px 16px; margin: 4px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">Get Selection</button>
              <button onclick="closePlugin()" style="padding: 8px 16px; margin: 4px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
              <div id="selection-info" style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
                <strong>Selection:</strong> <span id="selection-text">Click "Get Selection" to see current selection</span>
              </div>
            </div>
          \`;
        }
      });
      
      function createRectangle() {
        parent.postMessage({ pluginMessage: { type: 'create-rectangle' } }, '*');
      }
      
      function getSelection() {
        parent.postMessage({ pluginMessage: { type: 'get-selection' } }, '*');
      }
      
      function closePlugin() {
        parent.postMessage({ pluginMessage: { type: 'close-plugin' } }, '*');
      }
      
      // Handle messages from plugin
      window.addEventListener('message', (event) => {
        const { type, data } = event.data.pluginMessage || {};
        const selectionText = document.getElementById('selection-text');
        
        switch (type) {
          case 'rectangle-created':
            if (selectionText) {
              selectionText.textContent = \`Rectangle created: \${data.name}\`;
            }
            break;
          case 'selection-data':
            if (selectionText) {
              if (data.length === 0) {
                selectionText.textContent = 'No objects selected';
              } else {
                selectionText.textContent = \`\${data.length} object(s) selected: \${data.map(item => \`\${item.name} (\${item.type})\`).join(', ')}\`;
              }
            }
            break;
        }
      });
    </script>`
  );
  
  // Write the final HTML file
  const outputPath = path.join(distDir, 'ui.html');
  fs.writeFileSync(outputPath, htmlContent);
  
  // Clean up temp directory if it exists
  if (fs.existsSync(uiTempDir)) {
    fs.rmSync(uiTempDir, { recursive: true, force: true });
  }
  
  console.log('UI built successfully!');
}

buildUI();
