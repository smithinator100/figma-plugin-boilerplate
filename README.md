## Figma Plugin Boilerplate

Minimal two-step setup.

### 1) Copy–paste this into Cursor’s Terminal
```bash
chmod +x create-plugin.sh && ./create-plugin.sh "My Figma Plugin"
```
- Replace "My Figma Plugin" with your desired name.

### 2) Use the generated Cursor rules
```bash
cd "My Figma Plugin" && open -a "Cursor" .
```
- Replace "My Figma Plugin" with the name you used above.
- This opens the folder as a new Cursor workspace so `.cursorrules` is active.

That’s it.
