## Figma Plugin Boilerplate

Minimal two-step setup.

### 1) Quick install (one command)
```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/smithinator100/figma-plugin-boilerplate/main/install.sh)"
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
