## Figma Plugin Boilerplate

Minimal two-step setup.

### 1) Quick install (one command)
```bash
# Interactive (prompts even with pipes):
bash -c "$(curl -fsSL https://raw.githubusercontent.com/smithinator100/figma-plugin-boilerplate/main/install.sh)" -- -n "My Plugin Name"

# Or provide a name flag up-front (non-interactive):
curl -fsSL https://raw.githubusercontent.com/smithinator100/figma-plugin-boilerplate/main/install.sh | bash -s -- -n "My Plugin Name"
```
- You’ll be prompted for your plugin name.

### 2) Use the generated Cursor rules
- The installer automatically opens your new plugin in Cursor.
- If it doesn’t, run:
```bash
cd "<your plugin name>" && open -a "Cursor" .
```
- This opens the folder as a new Cursor workspace so `.cursorrules` is active.

That’s it.

### ✅ Success criteria
- The installer asks for the plugin name even when run via pipe, or accepts `-n/--name`.
- A new folder with the provided name is created in the current directory.
- The folder contains `manifest.json` and `package.json` with the correct name/id.
- `node_modules` is installed and `npm run build` completes without error.
- The success message appears only after verifying required files exist.
- The new project is not polluted by the boilerplate repo’s `.git` or scripts.
