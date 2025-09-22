#!/bin/bash

set -euo pipefail

echo "🚀 Figma Plugin Boilerplate Installer"

# Check prerequisites
if ! command -v git >/dev/null 2>&1; then
  echo "❌ git is required. Please install git and try again."
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm is required. Please install Node.js (includes npm) and try again."
  exit 1
fi

read -r -p "Plugin name: " PLUGIN_NAME
if [ -z "${PLUGIN_NAME// }" ]; then
  echo "❌ Plugin name cannot be empty."
  exit 1
fi

ORIG_DIR="$(pwd)"

# Create a temporary directory to clone the boilerplate into
TMP_DIR=$(mktemp -d 2>/dev/null || mktemp -d -t 'figma-plugin')

echo "📥 Cloning boilerplate..."
if ! git clone https://github.com/smithinator100/figma-plugin-boilerplate.git "$TMP_DIR" >/dev/null 2>&1; then
  echo "❌ Failed to clone repository."
  rm -rf "$TMP_DIR"
  exit 1
fi

cd "$TMP_DIR"

chmod +x create-plugin.sh

echo "🔧 Generating plugin project '$PLUGIN_NAME'..."
./create-plugin.sh "$PLUGIN_NAME"

# Move the generated project to the original directory
echo "📦 Moving project to: $ORIG_DIR/$PLUGIN_NAME"
mv "$TMP_DIR/$PLUGIN_NAME" "$ORIG_DIR/$PLUGIN_NAME"

# Cleanup
cd "$ORIG_DIR"
rm -rf "$TMP_DIR"

echo "✅ Plugin '$PLUGIN_NAME' created successfully!"

# Open in Cursor (macOS)
if command -v open >/dev/null 2>&1; then
  echo "🧭 Opening in Cursor..."
  cd "$ORIG_DIR/$PLUGIN_NAME" && open -a "Cursor" .
else
  echo "👉 Open the project manually: cd \"$ORIG_DIR/$PLUGIN_NAME\" && Cursor ."
fi


