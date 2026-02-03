# VideoLayerOS

Programmatic video creation with Remotion.

## Overview

VideoLayerOS is a framework for creating videos programmatically using React and Remotion. It provides reusable scene components and composition patterns for building explainer videos, marketing content, and more.

## Current State

**Status**: MVP Complete - Studio running, basic explainer composition working

### What's Working
- Remotion Studio running on port 5000
- TextScene component (reusable text display primitive)
- SimpleExplainer composition with 3 sequenced scenes
- Project structure established

### File Structure
```
videolayeros/
├── src/
│   ├── index.ts              # Entry point
│   ├── Root.tsx              # Composition definitions
│   ├── scenes/
│   │   ├── IntroScene.tsx    # Fade-in title scene
│   │   ├── TextScene.tsx     # Generic text scene (core building block)
│   │   └── QuoteScene.tsx    # Quote display scene
│   ├── layouts/
│   │   └── FullscreenCentered.tsx
│   └── compositions/
│       └── SimpleExplainer.tsx  # 3-scene explainer video
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
2. **Scene schemas (JSON input)** - Data-driven scene generation from JSON config
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
