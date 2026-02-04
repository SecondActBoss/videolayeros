# VideoLayerOS

Programmatic video creation with Remotion.

## Overview

VideoLayerOS is a framework for creating videos programmatically using React and Remotion. It provides reusable scene components and composition patterns for building explainer videos, marketing content, and more.

## Current State

**Status**: JSON-Driven Architecture Complete - Data defines videos, engine renders

### What's Working
- Remotion Studio running on port 5000
- **JSON-driven scene system**: Schema → Factory → Composition pipeline
- ConfigDrivenExplainer: Videos defined by data, not hardcoded components
- TextScene and IntroScene as reusable primitives
- SimpleExplainer (legacy hardcoded) still available

### Architecture: The OS Layer

```
JSON Config → Schema Types → Scene Factory → Remotion Composition → Video
```

VideoLayerOS accepts structured intent (JSON), not videos. The engine translates intent to rendered output.

### File Structure
```
videolayeros/
├── src/
│   ├── index.ts              # Entry point
│   ├── Root.tsx              # Composition definitions
│   ├── schema/
│   │   └── video.ts          # SceneConfig, VideoConfig types (the contract)
│   ├── factory/
│   │   └── renderScene.tsx   # Maps scene type → React component
│   ├── scenes/
│   │   ├── IntroScene.tsx    # Fade-in title scene
│   │   ├── TextScene.tsx     # Generic text scene (core building block)
│   │   └── QuoteScene.tsx    # Quote display scene
│   ├── layouts/
│   │   └── FullscreenCentered.tsx
│   └── compositions/
│       ├── SimpleExplainer.tsx       # Legacy hardcoded
│       └── ConfigDrivenExplainer.tsx # JSON-driven composition
├── assets/
│   ├── logos/
│   ├── fonts/
│   └── images/
├── out/                      # Rendered output
├── package.json
└── README.md
```

## Running the Project

```bash
# Start studio (configured in workflow)
cd videolayeros && npx remotion studio src/index.ts --port 5000 --ipAddress 0.0.0.0

# Render video locally
npx remotion render src/index.ts SimpleExplainer out/explainer.mp4
```

## Roadmap

Next build layers (in order):

1. **9:16 vertical rendering** - Add vertical format for TikTok/Reels/Shorts
2. ~~**Scene schemas (JSON input)** - Data-driven scene generation from JSON config~~ ✅ DONE
3. **AgentLayerOS explainer** - Create explainer video for AgentLayerOS using VideoLayerOS
4. **README + positioning** - Documentation and value prop
5. **Cloud rendering (Remotion Lambda)** - AWS Lambda for scalable rendering

## User Preferences

- Keep scenes as reusable primitives (building blocks)
- Compositions combine scenes using Sequences
- Clean file structure with scenes/, layouts/, compositions/ separation

## Technical Notes

- Remotion must bind to 0.0.0.0:5000 for Replit preview to work
- Frame math: 30 fps, so 90 frames = 3 seconds, 150 frames = 5 seconds
- Use interpolate() for smooth animations based on current frame
