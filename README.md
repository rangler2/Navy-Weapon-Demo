# L403A1 Field Strip Trainer

Interactive top-down workbench trainer for the **L403A1** (Knight’s Armament KS-1 / Alternative Individual Weapon).

## Features

- Full-viewport bench view of a stylised L403A1 (suppressor, LPVO, URX-6, mag, BCG, charging handle, ambi lower, CTR stock)
- **Hover hotspots** for handguard, barrel, gas block, stock, grip, ambi controls, and E3.2 bolt (when BCG is out)
- **Drag-and-drop** field strip / reassembly with snap-to-fit ghosts and tray parking
- **Guided** mode (enforced strip / rebuild order) and **Free** mode (dependency-valid moves only)
- Auto-strip and reset controls
- Desktop-primary; pointer events work for touch as well

## Why 2D SVG (not 3D)?

A free game-ready KS-1 / L403A1 mesh exists on Sketchfab, but it is a single assembled model (not separable for field strip) and carries a NoAI licence. Layered SVG parts give reliable drag targets, hotspots, and offline demos without asset-licence risk. A future 3D pass can swap the visuals if a rights-cleared, part-separated glTF becomes available.

## Photorealistic reference photos

The **Photo** view uses rights-cleared issued-system photographs (no interactive part separation):

- UK MoD Ranger / Arctic images under [OGL v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)
- U.S. Marine Corps range photos (public domain)

See `public/assets/photos/ATTRIBUTION.md` for per-file credits. Schematic parts are tinted Flat Dark Earth to match the issued AIW finish shown in those photos.

## Run

```bash
npm install
npm run dev
```

## Credits

Part facts drawn from open public reporting on the KS-1 / L403A1 AIW suite (KAC KS-1, URX-6, E3.2 bolt, QDC/MCQ-PRT, Vortex LPVO). Interactive illustrations are schematic training graphics, not manufacturer diagrams.
