#!/bin/bash

set -euo pipefail

echo "🚀 Figma Plugin Boilerplate Installer"

usage() {
  echo "\nUsage: install.sh [-n|--name \"My Plugin\"]\n" >&2
}

# Parse args for non-interactive usage
PLUGIN_NAME_ARG=""
while [ ${#} -gt 0 ]; do
  case "${1}" in
    -n|--name)
      shift
      PLUGIN_NAME_ARG="${1:-}"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
  esac
  shift || true
done

# Check prerequisites
if ! command -v git >/dev/null 2>&1; then
  echo "❌ git is required. Please install git and try again."
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm is required. Please install Node.js (includes npm) and try again."
  exit 1
fi

# Determine plugin name (arg → env → prompt). Ensure prompt works with piped installs.
PLUGIN_NAME=${PLUGIN_NAME_ARG:-${PLUGIN_NAME:-}}
if [ -z "${PLUGIN_NAME// }" ]; then
  if [ -t 0 ]; then
    read -r -p "Plugin name: " PLUGIN_NAME
  else
    # Read from controlling terminal if stdin is not a TTY (e.g. curl | bash)
    read -r -p "Plugin name: " PLUGIN_NAME </dev/tty || true
  fi
fi

if [ -z "${PLUGIN_NAME// }" ]; then
  echo "❌ Plugin name cannot be empty. Provide with -n \"Name\" or via prompt."
  exit 1
fi

ORIG_DIR="$(pwd)"

# Pre-flight: prevent overwriting an existing directory
if [ -e "$ORIG_DIR/$PLUGIN_NAME" ]; then
  echo "❌ Destination already exists: $ORIG_DIR/$PLUGIN_NAME"
  echo "   Choose a different name with -n or remove the existing directory."
  exit 1
fi

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
if ! mv "$TMP_DIR/$PLUGIN_NAME" "$ORIG_DIR/$PLUGIN_NAME"; then
  echo "❌ Failed to move generated project into destination folder."
  cd "$ORIG_DIR"
  rm -rf "$TMP_DIR"
  exit 1
fi

# Cleanup
cd "$ORIG_DIR"
rm -rf "$TMP_DIR"

# Post-flight verification before success message
if [ ! -f "$ORIG_DIR/$PLUGIN_NAME/manifest.json" ] || [ ! -f "$ORIG_DIR/$PLUGIN_NAME/package.json" ]; then
  echo "❌ Setup incomplete. Required files missing in $ORIG_DIR/$PLUGIN_NAME"
  exit 1
fi

echo "✅ Plugin '$PLUGIN_NAME' created successfully at: $ORIG_DIR/$PLUGIN_NAME"

# Change to the new directory and start the development server
echo "🚀 Starting development server..."
cd "$ORIG_DIR/$PLUGIN_NAME"

# Start the dev server in the background and provide instructions
echo "📂 Changed to plugin directory: $(pwd)"
echo "🔥 Starting development mode..."

# Check if we're in an interactive shell
if [ -t 0 ]; then
  echo ""
  echo "👉 Development server will start now. Press Ctrl+C to stop."
  echo "📚 Open Figma Desktop → Plugins → Development → Import plugin from manifest"
  echo "   Select: $(pwd)/manifest.json"
  echo ""
  
  # Start the dev server
  npm run dev
else
  echo ""
  echo "👉 To start development:"
  echo "   cd \"$ORIG_DIR/$PLUGIN_NAME\""
  echo "   npm run dev"
  echo ""
  echo "📚 To use in Figma:"
  echo "   1. Open Figma Desktop App"
  echo "   2. Go to Plugins → Development → Import plugin from manifest"
  echo "   3. Select: $ORIG_DIR/$PLUGIN_NAME/manifest.json"
fi

