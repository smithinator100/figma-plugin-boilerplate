## Figma Plugin Boilerplate

A complete Figma plugin starter with React, TypeScript, and shadcn/ui components pre-configured.

### Features
- ⚡ **React + TypeScript** - Modern development stack
- 🎨 **shadcn/ui Components** - Pre-installed and configured
- 🎯 **Figma Plugin API** - Ready-to-use plugin structure
- 🔧 **Development Tools** - ESLint, hot reload, and build scripts
- 📦 **Zero Configuration** - Everything works out of the box

### Quick Start

#### 1) Install (one command)
```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/smithinator100/figma-plugin-boilerplate/main/install.sh)"
```

#### 2) Add to workspace (if needed)
If you want to add the plugin to your current workspace:
- **File → Add Folder to Workspace** → Select your plugin folder

#### 3) Start developing
```bash
npm run dev          # Start development mode
```

Then in Figma:
1. **Plugins → Development → Import plugin from manifest**
2. Select your `manifest.json` file
3. Run your plugin from the Plugins menu

That's it! 🎉

### What's Included
- **React + TypeScript** setup with proper configurations
- **shadcn/ui components** (Button, Card, Badge, Separator) pre-installed
- **Tailwind CSS** with shadcn/ui design tokens
- **Figma Plugin API** typings and boilerplate code
- **Development scripts** for building and hot reload
- **ESLint** configuration for code quality
- **Path aliases** (`@/`) for clean imports

### Project Structure
```
your-plugin-name/
├── src/
│   ├── code.ts              # Main plugin code (Figma API)
│   ├── ui.tsx               # React UI components
│   ├── ui.html              # UI entry point
│   ├── components/ui/       # shadcn/ui components
│   └── lib/utils.ts         # Utility functions
├── manifest.json            # Plugin manifest
├── components.json          # shadcn/ui configuration
└── package.json            # Dependencies and scripts
```

### Development Commands
```bash
npm run dev          # Start development with hot reload
npm run build        # Build for production
npm run type-check   # Check TypeScript types
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Adding More shadcn/ui Components
The project is pre-configured with `components.json`, so you can easily add more components:
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
```

### Success Criteria
- ✅ Plugin name prompt works even with piped installation
- ✅ New folder created with correct plugin name and ID
- ✅ All dependencies installed and build completes successfully
- ✅ shadcn/ui components pre-configured and ready to use
- ✅ No git repository initialized (user controls version control)
- ✅ Clean project without boilerplate artifacts

---

Happy plugin development! 🎨✨
