#!/bin/bash

# Figma Plugin Boilerplate Setup Script
# Usage: ./create-plugin.sh [plugin-name]

set -e

PLUGIN_NAME=${1:-my-figma-plugin}
CURRENT_DIR=$(pwd)
BOILERPLATE_DIR="$CURRENT_DIR"

echo "🚀 Creating Figma plugin: $PLUGIN_NAME"
echo "📂 Target directory: $CURRENT_DIR/$PLUGIN_NAME"

# Create plugin directory
if [ -d "$PLUGIN_NAME" ]; then
  echo "❌ Directory '$PLUGIN_NAME' already exists!"
  exit 1
fi

mkdir "$PLUGIN_NAME"
cd "$PLUGIN_NAME"

# Copy boilerplate files
echo "📋 Copying boilerplate files..."
cp -r "$BOILERPLATE_DIR"/* . 2>/dev/null || true
cp -r "$BOILERPLATE_DIR"/.[^.]* . 2>/dev/null || true

# Update manifest.json with plugin name
echo "🔧 Updating plugin configuration..."
if command -v sed >/dev/null 2>&1; then
  sed -i.bak "s/\"name\": \"Figma Plugin Boilerplate\"/\"name\": \"$PLUGIN_NAME\"/" manifest.json
  sed -i.bak "s/\"id\": \"figma-plugin-boilerplate\"/\"id\": \"$(echo $PLUGIN_NAME | tr '[:upper:]' '[:lower:]' | tr ' ' '-')\"/" manifest.json
  rm manifest.json.bak
fi

# Update package.json
if command -v sed >/dev/null 2>&1; then
  sed -i.bak "s/\"name\": \"figma-plugin-boilerplate\"/\"name\": \"$(echo $PLUGIN_NAME | tr '[:upper:]' '[:lower:]' | tr ' ' '-')\"/" package.json
  sed -i.bak "s/\"description\": \"A lightweight boilerplate for creating Figma plugins with React, TypeScript, and shadcn\/ui\"/\"description\": \"A Figma plugin built with React, TypeScript, and shadcn\/ui\"/" package.json
  rm package.json.bak
fi

# Install dependencies
echo "📦 Installing dependencies..."
if command -v npm >/dev/null 2>&1; then
  npm install
  echo "🔨 Building plugin..."
  npm run build
else
  echo "❌ npm not found! Please install Node.js and npm first."
  exit 1
fi

# Initialize git repository
if command -v git >/dev/null 2>&1; then
  echo "🔧 Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit: Figma plugin boilerplate"
fi

echo ""
echo "✅ Plugin '$PLUGIN_NAME' created successfully!"
echo ""
echo "📂 Next steps:"
echo "   cd $PLUGIN_NAME"
echo "   npm run dev          # Start development mode"
echo ""
echo "🎯 To use in Figma:"
echo "   1. Open Figma Desktop App"
echo "   2. Go to Plugins → Development → Import plugin from manifest"
echo "   3. Select the manifest.json file from this directory"
echo "   4. Run your plugin from the Plugins menu"
echo ""
echo "📚 Documentation: https://www.figma.com/plugin-docs/"
echo "💡 Plugin ideas: Check out EXAMPLES.md"
echo ""
echo "Happy plugin development! 🎨"
