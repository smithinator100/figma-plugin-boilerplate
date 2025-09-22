## Figma Plugin Boilerplate

A simple Figma plugin starter with TypeScript and basic UI components. **Simplified build process with TypeScript only - no Vite complexity.**

### Features
- ⚡ **TypeScript Only** - Simple, fast build process
- 🎯 **Figma Plugin API** - Ready-to-use plugin structure following official documentation
- 🔧 **Clean Build** - No duplicate folders or complex bundling
- 🚀 **Quick Development** - Simple npm scripts
- 📦 **Zero Configuration** - Everything works out of the box

### Quick Start

#### 1) Install (one command)
```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/smithinator100/figma-plugin-boilerplate/main/install.sh)"
```

The installer will:
- ✅ Prompt for your plugin name
- ✅ Generate a complete plugin project
- ✅ Install all dependencies and build
- ✅ **Automatically start the development server** 🚀

#### 2) Import to Figma
While the dev server is running:
1. **Open Figma Desktop App**
2. **Plugins → Development → Import plugin from manifest**
3. **Select your `manifest.json` file** (path shown in terminal)
4. **Run your plugin** from the Plugins menu

That's it! Your plugin is ready to develop! 🎉

#### 3) Cursor IDE Integration
The project includes `.cursorrules` with expert Figma plugin development guidance:
- 🎯 Figma Plugin API patterns and best practices
- ⚡ TypeScript + React development guidelines  
- 🎨 shadcn/ui component usage patterns
- 🔧 Plugin architecture and security guidelines

Just open the project in Cursor and you'll have intelligent assistance!

### What's Included
- **TypeScript** setup with proper configurations
- **Simple UI** with inline styling (no complex bundling)
- **Figma Plugin API** typings and boilerplate code
- **Development scripts** for building and watching
- **Clean build output** - just `code.js` and `ui.html`

### Project Structure
```
figma-plugin-boilerplate/
├── src/
│   ├── code.ts              # Main plugin code (Figma API)
│   ├── ui.html              # UI entry point  
│   ├── ui.css               # Basic styles
│   └── types/figma.d.ts     # Type definitions
├── dist/                    # Built files (generated)
│   ├── code.js              # Compiled plugin code
│   └── ui.html              # Final UI with inline JS/CSS
├── manifest.json            # Plugin manifest
├── build-ui.js              # Simple UI build script
└── package.json            # Dependencies and scripts
```

### Development Commands
```bash
npm run build        # Build plugin (code.js + ui.html)
npm run dev          # Build and watch for changes
npm run clean        # Clean dist folder
```

Happy plugin development! 🎨✨
