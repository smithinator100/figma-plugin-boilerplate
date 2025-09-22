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
  
    // Read the UI JavaScript file
    const uiJsPath = path.join(__dirname, 'src', 'ui.js');
    let uiJsContent = '';
    
    if (fs.existsSync(uiJsPath)) {
      uiJsContent = fs.readFileSync(uiJsPath, 'utf8');
    }

    // Create a beautiful shadcn/ui HTML with vanilla JavaScript
    let htmlContent = htmlTemplate.replace(
      '<!-- Load main UI script -->',
      `<style>${cssContent}</style>
      <script>
        ${uiJsContent || '// No UI JavaScript found'}
      </script>`
    );
    
    // Write the final HTML file
    const outputPath = path.join(distDir, 'ui.html');
    fs.writeFileSync(outputPath, htmlContent);
    
    // Clean up temporary CSS file
    fs.unlinkSync(path.join(distDir, 'ui.css'));
    
    // Copy vanilla JS components to dist
    console.log('Copying vanilla JS components...');
    const componentsDir = path.join(__dirname, 'src', 'components', 'ui');
    const distComponentsDir = path.join(distDir, 'components', 'ui');
    
    // Ensure components directory exists in dist
    if (!fs.existsSync(distComponentsDir)) {
      fs.mkdirSync(distComponentsDir, { recursive: true });
    }
    
    // Copy all JS component files
    const jsFiles = fs.readdirSync(componentsDir).filter(file => file.endsWith('.js'));
    jsFiles.forEach(file => {
      const srcPath = path.join(componentsDir, file);
      const destPath = path.join(distComponentsDir, file);
      fs.copyFileSync(srcPath, destPath);
    });
    
    // Copy utils.js
    const utilsSrcPath = path.join(__dirname, 'src', 'lib', 'utils.js');
    const distLibDir = path.join(distDir, 'lib');
    if (!fs.existsSync(distLibDir)) {
      fs.mkdirSync(distLibDir, { recursive: true });
    }
    fs.copyFileSync(utilsSrcPath, path.join(distLibDir, 'utils.js'));
    
    console.log('UI built successfully with shadcn/ui styling and vanilla JS components!');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildUI();

