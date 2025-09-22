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

# Copy boilerplate files excluding git and scripts themselves
echo "📋 Copying boilerplate files..."
if command -v rsync >/dev/null 2>&1; then
  rsync -a --exclude ".git" --exclude ".gitignore" --exclude "node_modules" \
        --exclude "install.sh" --exclude "create-plugin.sh" --exclude "*.log" \
        --exclude "tmp" --exclude "*.DS_Store" "$BOILERPLATE_DIR/" "$PLUGIN_NAME/"
else
  # Fallback to cp; copy files while excluding the target directory itself
  for item in "$BOILERPLATE_DIR"/*; do
    [ "$(basename "$item")" != "$PLUGIN_NAME" ] && cp -R "$item" "$PLUGIN_NAME/" 2>/dev/null || true
  done
  for item in "$BOILERPLATE_DIR"/.[^.]*; do
    [ -e "$item" ] && [ "$(basename "$item")" != "$PLUGIN_NAME" ] && cp -R "$item" "$PLUGIN_NAME/" 2>/dev/null || true
  done
  rm -rf "$PLUGIN_NAME/.git" "$PLUGIN_NAME/node_modules" 2>/dev/null || true
  rm -f "$PLUGIN_NAME/install.sh" "$PLUGIN_NAME/create-plugin.sh" 2>/dev/null || true
fi

cd "$PLUGIN_NAME"

# Update manifest.json with plugin name
echo "🔧 Updating plugin configuration..."
if command -v sed >/dev/null 2>&1; then
  sed -i.bak "s/\"name\": \"Figma Plugin Boilerplate\"/\"name\": \"$PLUGIN_NAME\"/" manifest.json
  sed -i.bak "s/\"id\": \"figma-plugin-boilerplate\"/\"id\": \"$(echo "$PLUGIN_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')\"/" manifest.json
  rm -f manifest.json.bak
fi

# Update package.json
if command -v sed >/dev/null 2>&1; then
  sed -i.bak "s/\"name\": \"figma-plugin-boilerplate\"/\"name\": \"$(echo "$PLUGIN_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')\"/" package.json
  sed -i.bak "s/\"description\": \"A lightweight boilerplate for creating Figma plugins with React, TypeScript, and shadcn\\/ui\"/\"description\": \"A Figma plugin built with React, TypeScript, and shadcn\\/ui\"/" package.json
  rm -f package.json.bak
fi

# Ensure tsconfig has Figma typings enabled
if command -v sed >/dev/null 2>&1; then
  if ! grep -q '"types"\s*:\s*\["@figma/plugin-typings"\]' tsconfig.json 2>/dev/null; then
    sed -i.bak 's/"typeRoots"\s*:\s*\[[^]]*\]/&,\n    "types": ["@figma\/plugin-typings"]/g' tsconfig.json || true
    rm -f tsconfig.json.bak
  fi
fi

# Install dependencies and build
echo "📦 Installing dependencies..."
if command -v npm >/dev/null 2>&1; then
  npm install
  echo "🔨 Building plugin..."
  npm run build
else
  echo "❌ npm not found! Please install Node.js and npm first."
  exit 1
fi

# Note: Git repository initialization removed - users can initialize manually if needed

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
