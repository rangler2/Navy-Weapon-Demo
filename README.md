# L403A1 Field Strip Trainer

Interactive top-down workbench trainer for the **L403A1** (Knight’s Armament KS-1 / Alternative Individual Weapon).

## Features

- Full-viewport bench view of a stylised L403A1
- **Hover hotspots** with part names, descriptions, and key facts
- **Drag-and-drop** field strip / reassembly with snap-to-fit ghosts
- **Guided** mode (enforced strip order) and **Free** mode (dependency-valid moves)
- Auto-strip and reset controls

## Why 2D SVG (not 3D)?

A free game-ready KS-1 / L403A1 mesh exists on Sketchfab, but it is a single assembled model (not separable for field strip) and carries a NoAI licence. Layered SVG parts give reliable drag targets, hotspots, and offline demos without asset-licence risk. A future 3D pass can swap the visuals if a rights-cleared, part-separated glTF becomes available.

## Run

```bash
npm install
npm run dev
```

## Credits

Part facts drawn from open public reporting on the KS-1 / L403A1 AIW suite (KAC KS-1, URX-6, E3.2 bolt, QDC/MCQ-PRT, Vortex LPVO). Illustrations are schematic training graphics, not manufacturer diagrams.
