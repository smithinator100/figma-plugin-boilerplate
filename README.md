## Figma Plugin Boilerplate

A complete Figma plugin starter with React, TypeScript, and shadcn/ui components pre-configured.

### Features
- ⚡ **React + TypeScript** - Modern development stack
- 🎨 **shadcn/ui Components** - Pre-installed and configured
- 🎯 **Figma Plugin API** - Ready-to-use plugin structure
- 🔧 **Development Tools** - ESLint, hot reload, and build scripts
- 🤖 **Cursor IDE Ready** - Pre-configured with Figma plugin development rules
- 🚀 **Auto-Start Server** - Development server starts automatically after installation
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
- **React + TypeScript** setup with proper configurations
- **shadcn/ui components** (Button, Card, Badge, Separator) pre-installed
- **Tailwind CSS** with shadcn/ui design tokens
- **Figma Plugin API** typings and boilerplate code
- **Development scripts** for building and hot reload
- **ESLint** configuration for code quality
- **Path aliases** (`@/`) for clean imports
- **Cursor IDE rules** (`.cursorrules`) for intelligent development assistance

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
- ✅ Development server starts automatically after installation
- ✅ shadcn/ui components pre-configured and ready to use
- ✅ Cursor IDE rules included for intelligent development assistance
- ✅ No git repository initialized (user controls version control)
- ✅ Clean project without boilerplate artifacts

---

Happy plugin development! 🎨✨
