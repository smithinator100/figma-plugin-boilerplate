# Plugin Ideas & Examples

This file contains example plugin ideas and code snippets to help you get started building your Figma plugin.

## 🚀 New Tabbed Interface Feature

### Feature: Tabbed Plugin Interface
The plugin now includes a modern tabbed interface with two main sections:

#### Success Criteria:
- ✅ Plugin tab displays description and rectangle generation functionality
- ✅ UI tab shows comprehensive list of available shadcn/ui components
- ✅ Tabs are fully functional with proper state management
- ✅ Rectangle generation works from Plugin tab
- ✅ UI components are properly documented in UI tab

#### Test Steps:
1. Load the plugin in Figma
2. Verify "Plugin" tab is selected by default
3. Click "Generate Rectangle" button - should create a blue rectangle
4. Switch to "UI" tab - should show list of available components
5. Switch back to "Plugin" tab - state should be preserved
6. Verify all UI components are properly styled with shadcn/ui

**Expected Result:** A fully functional tabbed interface that provides both plugin functionality and component documentation.

## 🎨 Design Tools

### Color Palette Generator
Generate color palettes and apply them to selected objects.

```typescript
// Generate complementary colors
function generatePalette(baseColor: RGB): RGB[] {
  return [
    baseColor,
    { r: 1 - baseColor.r, g: 1 - baseColor.g, b: 1 - baseColor.b },
    { r: baseColor.g, g: baseColor.b, b: baseColor.r },
    // Add more color variations...
  ];
}

// Apply palette to selection
function applyPaletteToSelection(palette: RGB[]) {
  const selection = figma.currentPage.selection;
  selection.forEach((node, index) => {
    if ('fills' in node) {
      const colorIndex = index % palette.length;
      node.fills = [{ type: 'SOLID', color: palette[colorIndex] }];
    }
  });
}
```

### Grid Generator
Create customizable grid systems.

```typescript
function createGrid(rows: number, columns: number, spacing: number) {
  const frame = figma.createFrame();
  frame.name = `Grid ${rows}x${columns}`;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const rect = figma.createRectangle();
      rect.resize(100, 100);
      rect.x = col * (100 + spacing);
      rect.y = row * (100 + spacing);
      rect.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
      frame.appendChild(rect);
    }
  }
  
  figma.currentPage.appendChild(frame);
  return frame;
}
```

## 📝 Text Tools

### Text Case Converter
Convert text case across selected text nodes.

```typescript
function convertTextCase(caseType: 'upper' | 'lower' | 'title' | 'camel') {
  const selection = figma.currentPage.selection;
  
  selection.forEach(node => {
    if (node.type === 'TEXT') {
      const text = node.characters;
      let convertedText: string;
      
      switch (caseType) {
        case 'upper':
          convertedText = text.toUpperCase();
          break;
        case 'lower':
          convertedText = text.toLowerCase();
          break;
        case 'title':
          convertedText = text.replace(/\w\S*/g, txt => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          );
          break;
        case 'camel':
          convertedText = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          ).replace(/\s+/g, '');
          break;
      }
      
      node.characters = convertedText;
    }
  });
}
```

### Lorem Ipsum Generator
Fill text nodes with placeholder content.

```typescript
const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
  'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore'
];

function generateLorem(wordCount: number): string {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
  }
  return words.join(' ');
}

function fillWithLorem(wordCount: number = 50) {
  const selection = figma.currentPage.selection;
  
  selection.forEach(node => {
    if (node.type === 'TEXT') {
      node.characters = generateLorem(wordCount);
    }
  });
}
```

## 🔧 Utility Tools

### Layer Organizer
Organize and rename layers systematically.

```typescript
function organizeLayersByType() {
  const selection = figma.currentPage.selection;
  const groups: { [key: string]: SceneNode[] } = {};
  
  // Group by node type
  selection.forEach(node => {
    const type = node.type;
    if (!groups[type]) groups[type] = [];
    groups[type].push(node);
  });
  
  // Create frames for each type
  Object.entries(groups).forEach(([type, nodes]) => {
    const frame = figma.createFrame();
    frame.name = `${type} Group`;
    
    nodes.forEach(node => {
      frame.appendChild(node);
    });
    
    figma.currentPage.appendChild(frame);
  });
}
```

### Spacing Distributor
Distribute objects with equal spacing.

```typescript
function distributeHorizontally(spacing: number) {
  const selection = figma.currentPage.selection;
  
  // Sort by x position
  const sortedNodes = [...selection].sort((a, b) => a.x - b.x);
  
  let currentX = sortedNodes[0].x;
  
  sortedNodes.forEach(node => {
    node.x = currentX;
    currentX += node.width + spacing;
  });
}

function distributeVertically(spacing: number) {
  const selection = figma.currentPage.selection;
  
  // Sort by y position
  const sortedNodes = [...selection].sort((a, b) => a.y - b.y);
  
  let currentY = sortedNodes[0].y;
  
  sortedNodes.forEach(node => {
    node.y = currentY;
    currentY += node.height + spacing;
  });
}
```

## 📊 Data & Export Tools

### Export Manager
Batch export with custom settings.

```typescript
async function batchExport(format: 'PNG' | 'JPG' | 'SVG', scale: number = 1) {
  const selection = figma.currentPage.selection;
  
  for (const node of selection) {
    try {
      const exportSettings: ExportSettings = {
        format,
        constraint: { type: 'SCALE', value: scale }
      };
      
      const bytes = await node.exportAsync(exportSettings);
      
      // Send to UI for download
      figma.ui.postMessage({
        type: 'export-ready',
        data: {
          name: node.name,
          format,
          bytes: Array.from(bytes)
        }
      });
    } catch (error) {
      console.error(`Failed to export ${node.name}:`, error);
    }
  }
}
```

### Style Auditor
Analyze and report on design system usage.

```typescript
function auditStyles() {
  const allNodes = figma.currentPage.findAll();
  const styleUsage = {
    colors: new Map<string, number>(),
    fonts: new Map<string, number>(),
    effects: new Map<string, number>()
  };
  
  allNodes.forEach(node => {
    // Audit fills
    if ('fills' in node && node.fills !== figma.mixed && Array.isArray(node.fills)) {
      node.fills.forEach(fill => {
        if (fill.type === 'SOLID') {
          const colorKey = `${fill.color.r},${fill.color.g},${fill.color.b}`;
          styleUsage.colors.set(colorKey, (styleUsage.colors.get(colorKey) || 0) + 1);
        }
      });
    }
    
    // Audit text styles
    if (node.type === 'TEXT') {
      const fontKey = `${node.fontName?.family || 'unknown'}-${node.fontName?.style || 'unknown'}`;
      styleUsage.fonts.set(fontKey, (styleUsage.fonts.get(fontKey) || 0) + 1);
    }
  });
  
  return {
    totalNodes: allNodes.length,
    uniqueColors: styleUsage.colors.size,
    uniqueFonts: styleUsage.fonts.size,
    colorUsage: Object.fromEntries(styleUsage.colors),
    fontUsage: Object.fromEntries(styleUsage.fonts)
  };
}
```

## 🎯 Advanced Examples

### Component Finder
Find and manage component instances.

```typescript
function findComponentInstances(componentName: string) {
  const instances = figma.currentPage.findAll(node => 
    node.type === 'INSTANCE' && 
    node.mainComponent?.name.includes(componentName)
  );
  
  return instances.map(instance => ({
    id: instance.id,
    name: instance.name,
    component: instance.mainComponent?.name,
    x: instance.x,
    y: instance.y
  }));
}
```

### Auto-Layout Helper
Apply auto-layout with smart defaults.

```typescript
function applyAutoLayout(direction: 'HORIZONTAL' | 'VERTICAL', spacing: number = 8) {
  const selection = figma.currentPage.selection;
  
  selection.forEach(node => {
    if ('layoutMode' in node) {
      node.layoutMode = direction;
      node.itemSpacing = spacing;
      node.paddingLeft = spacing;
      node.paddingRight = spacing;
      node.paddingTop = spacing;
      node.paddingBottom = spacing;
      node.primaryAxisSizingMode = 'AUTO';
      node.counterAxisSizingMode = 'AUTO';
    }
  });
}
```

## 🚀 Getting Started Tips

1. **Start Small**: Begin with simple operations like changing colors or text
2. **Use the Console**: `console.log()` is your friend for debugging
3. **Test Frequently**: Always test with different types of selections
4. **Handle Errors**: Wrap operations in try-catch blocks
5. **Read the Docs**: The Figma Plugin API docs are comprehensive
6. **Study Examples**: Look at popular plugins on the Figma Community

## 💡 Plugin Ideas to Explore

- **Design System Manager**: Create and manage design tokens
- **Accessibility Checker**: Audit designs for accessibility compliance
- **Icon Organizer**: Batch process and organize icon libraries
- **Animation Helper**: Create micro-interactions and transitions
- **Content Filler**: Replace placeholder content with real data
- **Version Tracker**: Track design changes over time
- **Collaboration Tools**: Add commenting and review workflows
- **Asset Optimizer**: Compress and optimize images and assets

Remember to check the [Figma Plugin API documentation](https://www.figma.com/plugin-docs/) for the latest features and best practices!
