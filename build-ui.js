#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Build UI with Tailwind CSS and shadcn/ui styling
function buildUI() {
  console.log('Building UI with Tailwind CSS and shadcn/ui...');
  
  const distDir = path.join(__dirname, 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  try {
    // Build Tailwind CSS
    console.log('Compiling Tailwind CSS...');
    execSync('npx tailwindcss -i ./src/ui.css -o ./dist/ui.css --minify', { 
      stdio: 'inherit',
      cwd: __dirname 
    });

    // Read the HTML template
    const htmlTemplate = fs.readFileSync(path.join(__dirname, 'src', 'ui.html'), 'utf8');
    
    // Read the compiled CSS
    const cssContent = fs.readFileSync(path.join(distDir, 'ui.css'), 'utf8');
  
    // Create a beautiful shadcn/ui HTML with vanilla JavaScript
    let htmlContent = htmlTemplate.replace(
      '<script src="./ui.js"></script>',
      `<style>${cssContent}</style>
      <script>
        console.log('shadcn/ui Vanilla JS loaded');
        
        let isLoading = false;
        
        // Initialize the beautiful shadcn/ui interface
        document.addEventListener('DOMContentLoaded', () => {
          const root = document.getElementById('root');
          if (root) {
            root.innerHTML = \`
              <div class="p-4 w-full min-h-screen bg-background">
                <!-- Main Card -->
                <div class="w-full max-w-md mx-auto rounded-lg border bg-card text-card-foreground shadow-sm">
                  <!-- Card Header -->
                  <div class="flex flex-col space-y-1.5 p-6">
                    <h3 class="text-xl font-semibold leading-none tracking-tight flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Figma Plugin Boilerplate
                    </h3>
                    <p class="text-sm text-muted-foreground">
                      A beautiful Figma plugin built with vanilla JavaScript and shadcn/ui styling.
                    </p>
                    <div class="flex gap-2">
                      <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
                        </svg>
                        shadcn/ui
                      </span>
                      <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors text-foreground">Vanilla JS</span>
                      <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors text-foreground">TypeScript</span>
                    </div>
                  </div>
                  
                  <!-- Card Content -->
                  <div class="p-6 pt-0 space-y-4">
                    <!-- Form Section -->
                    <div class="space-y-3">
                      <div class="space-y-2">
                        <label for="rectangle-name" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Rectangle Name</label>
                        <input
                          id="rectangle-name"
                          type="text"
                          value="My Rectangle"
                          placeholder="Enter rectangle name"
                          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      
                      <div class="space-y-2">
                        <label for="rectangle-color" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Rectangle Color</label>
                        <div class="flex gap-2">
                          <input
                            id="rectangle-color"
                            type="color"
                            value="#3b82f6"
                            class="w-16 h-10 p-1 cursor-pointer flex rounded-md border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                          <input
                            id="rectangle-color-text"
                            type="text"
                            value="#3b82f6"
                            placeholder="#3b82f6"
                            class="flex-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <!-- Separator -->
                    <div class="shrink-0 bg-border h-[1px] w-full"></div>
                    
                    <!-- Buttons -->
                    <div class="flex flex-col gap-2">
                      <button 
                        id="create-btn"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                      >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        </svg>
                        Create Rectangle
                      </button>
                      
                      <button 
                        id="selection-btn"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                      >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                        </svg>
                        Get Selection
                      </button>
                      
                      <button 
                        id="close-btn"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 w-full"
                      >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Close Plugin
                      </button>
                    </div>
                    
                    <!-- Separator -->
                    <div class="shrink-0 bg-border h-[1px] w-full"></div>
                    
                    <!-- Selection Info Card -->
                    <div class="rounded-lg border bg-card text-card-foreground shadow-sm bg-muted/50">
                      <div class="p-4">
                        <div class="text-sm">
                          <strong class="text-foreground">Selection Info:</strong>
                          <div id="selection-info" class="mt-1 text-muted-foreground">
                            Click "Get Selection" to see current selection
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            \`;
            
            // Initialize event handlers
            setupEventHandlers();
          }
        });
        
        function setupEventHandlers() {
          // Get DOM elements
          const createBtn = document.getElementById('create-btn');
          const selectionBtn = document.getElementById('selection-btn');
          const closeBtn = document.getElementById('close-btn');
          const rectangleName = document.getElementById('rectangle-name');
          const rectangleColor = document.getElementById('rectangle-color');
          const rectangleColorText = document.getElementById('rectangle-color-text');
          const selectionInfo = document.getElementById('selection-info');
          
          // Sync color inputs
          if (rectangleColor && rectangleColorText) {
            rectangleColor.addEventListener('input', function() {
              rectangleColorText.value = rectangleColor.value;
            });
            
            rectangleColorText.addEventListener('input', function() {
              rectangleColor.value = rectangleColorText.value;
            });
          }
          
          // Button click handlers
          if (createBtn) {
            createBtn.addEventListener('click', function() {
              if (isLoading) return;
              
              const name = rectangleName ? rectangleName.value : 'My Rectangle';
              const color = rectangleColor ? rectangleColor.value : '#3b82f6';
              
              if (!name.trim()) {
                // Could add a toast notification here
                return;
              }
              
              setLoading(true);
              parent.postMessage({ 
                pluginMessage: { 
                  type: 'create-rectangle',
                  data: { name: name, color: color }
                } 
              }, '*');
            });
          }
          
          if (selectionBtn) {
            selectionBtn.addEventListener('click', function() {
              if (isLoading) return;
              
              setLoading(true);
              parent.postMessage({ 
                pluginMessage: { type: 'get-selection' } 
              }, '*');
            });
          }
          
          if (closeBtn) {
            closeBtn.addEventListener('click', function() {
              parent.postMessage({ 
                pluginMessage: { type: 'close-plugin' } 
              }, '*');
            });
          }
        }
        
        // Handle messages from plugin
        window.addEventListener('message', function(event) {
          const pluginMessage = event.data.pluginMessage;
          if (!pluginMessage) return;
          
          const type = pluginMessage.type;
          const data = pluginMessage.data;
          const selectionInfo = document.getElementById('selection-info');
          
          switch (type) {
            case 'rectangle-created':
              if (selectionInfo) {
                selectionInfo.textContent = 'Rectangle created: ' + data.name;
              }
              setLoading(false);
              break;
              
            case 'selection-data':
              if (selectionInfo) {
                if (data.length === 0) {
                  selectionInfo.textContent = 'No objects selected';
                } else {
                  const items = data.map(function(item) {
                    return item.name + ' (' + item.type + ')';
                  }).join(', ');
                  selectionInfo.textContent = data.length + ' object(s) selected: ' + items;
                }
              }
              setLoading(false);
              break;
          }
        });
        
        function setLoading(loading) {
          isLoading = loading;
          
          const buttons = [
            document.getElementById('create-btn'),
            document.getElementById('selection-btn'),
            document.getElementById('close-btn')
          ];
          
          const inputs = [
            document.getElementById('rectangle-name'),
            document.getElementById('rectangle-color'),
            document.getElementById('rectangle-color-text')
          ];
          
          buttons.forEach(function(btn) {
            if (btn) {
              btn.disabled = loading;
            }
          });
          
          inputs.forEach(function(input) {
            if (input) {
              input.disabled = loading;
            }
          });
          
          const selectionInfo = document.getElementById('selection-info');
          if (selectionInfo && loading) {
            selectionInfo.textContent = 'Loading...';
          }
        }
        
        console.log('shadcn/ui Vanilla JS initialized successfully');
      </script>`
    );
    
    // Write the final HTML file
    const outputPath = path.join(distDir, 'ui.html');
    fs.writeFileSync(outputPath, htmlContent);
    
    // Clean up temporary CSS file
    fs.unlinkSync(path.join(distDir, 'ui.css'));
    
    console.log('UI built successfully with shadcn/ui styling!');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildUI();

