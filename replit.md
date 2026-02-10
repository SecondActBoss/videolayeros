# VideoLayerOS

Programmatic video creation with Remotion.

## Overview

VideoLayerOS is a framework for creating videos programmatically using React and Remotion. It provides reusable scene components and composition patterns for building explainer videos, marketing content, and more.

## Current State

**Status**: CharacterScene + Caption Layer Complete - Image scenes with motion + captions

### What's Working
- Remotion Studio running on port 5000
- **JSON-driven scene system**: Schema → Factory → Composition pipeline
- **CharacterScene**: Static images with deterministic pan/zoom motion from JSON config
- **Caption Layer**: Word-timed captions with active word highlighting
- ConfigDrivenExplainer: Videos defined by data with caption overlay
- TextScene and IntroScene as reusable primitives
- SimpleExplainer (legacy hardcoded) still available

### Architecture: The OS Layer

```
JSON Config → Schema Types → Scene Factory → Remotion Composition → Video
                                                    ↑
                                            Caption Layer (overlay)
                                                    ↑
                                          Word Timings JSON
```

VideoLayerOS accepts structured intent (JSON), not videos. The engine translates intent to rendered output. Captions are a global overlay layer driven by word-timing data.

### File Structure
```
videolayeros/
├── src/
│   ├── index.ts              # Entry point
│   ├── Root.tsx              # Composition definitions
│   ├── schema/
│   │   ├── video.ts          # SceneConfig, VideoConfig types (the contract)
│   │   └── captions.ts       # WordTiming, CaptionsFile types
│   ├── factory/
│   │   └── renderScene.tsx   # Maps scene type → React component
│   ├── components/
│   │   └── CaptionLayer.tsx  # Word-timed caption overlay component
│   ├── scenes/
│   │   ├── IntroScene.tsx    # Fade-in title scene
│   │   ├── TextScene.tsx     # Generic text scene (core building block)
│   │   ├── CharacterScene.tsx # Image with pan/zoom motion
│   │   └── QuoteScene.tsx    # Quote display scene
│   ├── layouts/
│   │   └── FullscreenCentered.tsx
│   ├── assets/
│   │   └── captions/
│   │       └── ep01.words.json  # Sample word timings
│   └── compositions/
│       ├── SimpleExplainer.tsx       # Legacy hardcoded
│       └── ConfigDrivenExplainer.tsx # JSON-driven composition with captions
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
