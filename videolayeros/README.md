# VideoLayerOS

Programmatic video creation with Remotion.

## Structure

```
videolayeros/
├── src/
│   ├── index.ts          # Entry point
│   ├── Root.tsx          # Composition definitions
│   ├── scenes/           # Individual scene components
│   ├── layouts/          # Reusable layout components
│   └── compositions/     # Full video compositions
├── assets/
│   ├── logos/
│   ├── fonts/
│   └── images/
└── out/                  # Rendered output
```

## Usage

```bash
# Start the studio
npx remotion studio src/index.ts

# Render a video
npx remotion render src/index.ts <CompositionId> out/video.mp4
```
