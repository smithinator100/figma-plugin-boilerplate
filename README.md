## Figma Plugin Boilerplate

A beautiful Figma plugin starter with TypeScript, shadcn/ui styling, and vanilla JavaScript. **Clean build process with Tailwind CSS - no React complexity.**

### Features
- ⚡ **Vanilla JavaScript** - Simple, fast, and compatible with Figma's environment
- 🎨 **shadcn/ui Styling** - Beautiful, professional design system
- 🎨 **Tailwind CSS** - Utility-first CSS framework with design tokens
- 🎯 **Figma Plugin API** - Ready-to-use plugin structure following official documentation
- 🔧 **Clean Build** - Single HTML file with inlined styles and scripts
- 🚀 **Quick Development** - Simple npm scripts with CSS compilation
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
- **shadcn/ui Design System** - Beautiful, accessible components using utility classes
- **Tailwind CSS** with shadcn/ui design tokens and CSS variables
- **Vanilla JavaScript** - No React complexity, just clean DOM manipulation
- **Figma Plugin API** typings and boilerplate code
- **Development scripts** for building and watching
- **Clean build output** - single `ui.html` with inlined styles and scripts

### Project Structure
```
figma-plugin-boilerplate/
├── src/
│   ├── code.ts              # Main plugin code (Figma API)
│   ├── ui.html              # UI template
│   ├── ui.css               # Tailwind CSS with shadcn/ui variables
│   └── types/figma.d.ts     # Type definitions
├── dist/                    # Built files (generated)
│   ├── code.js              # Compiled plugin code
│   └── ui.html              # Final UI with inline CSS/JS
├── manifest.json            # Plugin manifest
├── build-ui.js              # Tailwind + UI build script
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── package.json            # Dependencies and scripts
```

### Development Commands
```bash
npm run build        # Build plugin (code.js + ui.html)
npm run dev          # Build and watch for changes
npm run build:main   # Build only plugin code (TypeScript)
npm run build:ui     # Build only UI (Tailwind CSS + vanilla JS)
npm run clean        # Clean dist folder
```

### shadcn/ui Components Available

The plugin uses shadcn/ui design system with these beautiful components:

- **Card** - Clean card layout with header, content, and proper spacing
- **Button** - Multiple variants (primary, secondary, destructive, outline)
- **Input** - Form inputs with proper focus states and validation styling
- **Label** - Accessible form labels with proper typography
- **Separator** - Clean horizontal dividers
- **Badge** - Status indicators with different variants

### Example UI Structure

The vanilla JavaScript implementation creates a beautiful interface using shadcn/ui classes:

```html
<!-- shadcn/ui Card -->
<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
  <!-- Card Header -->
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-xl font-semibold leading-none tracking-tight">
      Plugin Title
    </h3>
  </div>
  
  <!-- Card Content -->
  <div class="p-6 pt-0 space-y-4">
    <!-- shadcn/ui Input -->
    <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
    
    <!-- shadcn/ui Button -->
    <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
      Action Button
    </button>
  </div>
</div>
```

### Key Benefits

- **🎨 Beautiful Design** - Professional shadcn/ui styling out of the box
- **⚡ Fast Performance** - No React overhead, just vanilla JavaScript
- **🔧 Easy Customization** - Modify Tailwind classes directly in the build script
- **🎯 Figma Compatible** - Tested to work perfectly in Figma's plugin environment
- **📦 Single File Output** - Everything bundled into one HTML file

Happy plugin development! 🎨✨
