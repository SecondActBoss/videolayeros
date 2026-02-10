# VideoLayerOS

Programmatic video creation with Remotion.

## Overview

VideoLayerOS is a framework for creating videos programmatically using React and Remotion. It provides reusable scene components and composition patterns for building explainer videos, marketing content, and more.

## Current State

**Status**: Poster Mode Complete - Single-frame thumbnail/poster rendering from video config

### What's Working
- Remotion Studio running on port 5000
- **JSON-driven scene system**: Schema → Factory → Composition pipeline
- **Poster Mode**: Generate high-impact still images (thumbnails/posters) from existing scenes
- **PosterLayer**: Crop/zoom + headline overlay for thumbnail energy
- **PosterComposition**: 1-frame composition with aspect ratio support (16:9, 1:1, 4:5)
- **CharacterScene**: Static images with deterministic pan/zoom motion from JSON config
- **MultiCharacterScene**: Multiple character layers with independent position, scale, and motion
- **Shared motion utils**: `src/utils/motion.ts` - reusable interpolation logic
- **Character Emotion Registry**: Auto-selects character assets by emotion (no manual asset paths in JSON)
- **Scene Intent Resolver**: Maps scene-level intent (e.g. "overload") to per-character emotions automatically
- **Script Intent Compiler**: Converts narrative script beats into auto-generated scenes with captions
- **Caption Intelligence**: WPM-paced captions with punctuation pauses and emphasis flags
- **Caption Layer**: Word-timed captions with active word highlighting and emphasis visuals
- ConfigDrivenExplainer: 5 scenes (23 seconds) with caption overlay
- ScriptDrivenExplainer: Auto-compiled from ep01.script.json (3 beats → 3 scenes)
- TextScene and IntroScene as reusable primitives
- SimpleExplainer (legacy hardcoded) still available

### Architecture: The OS Layer

```
Script Beats → Intent Compiler → Scene Factory → Remotion Composition → Video
       OR                ↑              ↑                    ↑
JSON Config →    Intent Resolver   Schema Types    Caption Layer (overlay)
                      ↓                                     ↑
                Emotion Registry                  Word Timings (auto or JSON)
             (auto asset selection)
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
│   │   ├── script.ts         # ScriptBeat, ScriptFile types
│   │   └── captions.ts       # WordTiming, CaptionsFile types
│   ├── compiler/
│   │   ├── intentCompiler.ts # Script → scenes + captions compilation
│   │   └── captionCompiler.ts # WPM pacing, punctuation pauses, emphasis
│   ├── factory/
│   │   └── renderScene.tsx   # Maps scene type → React component
│   ├── components/
│   │   ├── CaptionLayer.tsx  # Word-timed caption overlay component
│   │   └── PosterLayer.tsx   # Crop/zoom + headline for poster mode
│   ├── registry/
│   │   ├── characterEmotions.ts # Emotion → asset mapping + auto-selection
│   │   └── sceneIntents.ts      # Intent → character emotion mapping
│   ├── utils/
│   │   └── motion.ts         # Shared motion interpolation (computeMotion)
│   ├── scenes/
│   │   ├── IntroScene.tsx    # Fade-in title scene
│   │   ├── TextScene.tsx     # Generic text scene (core building block)
│   │   ├── CharacterScene.tsx # Single image with pan/zoom motion
│   │   ├── MultiCharacterScene.tsx # Multiple layered characters
│   │   └── QuoteScene.tsx    # Quote display scene
│   ├── layouts/
│   │   └── FullscreenCentered.tsx
│   ├── assets/
│   │   ├── captions/
│   │   │   └── ep01.words.json  # Sample word timings
│   │   └── scripts/
│   │       └── ep01.script.json # Script beats for auto-compilation
│   └── compositions/
│       ├── SimpleExplainer.tsx       # Legacy hardcoded
│       ├── ConfigDrivenExplainer.tsx  # JSON-driven composition (supports scriptFile)
│       ├── ScriptDrivenExplainer.tsx # Auto-compiled from script beats
│       └── PosterComposition.tsx     # Single-frame poster/thumbnail render
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

# Render video
npx remotion render src/index.ts ConfigDrivenExplainer out/explainer.mp4

# Render poster/thumbnail (all aspect ratios)
npx remotion still src/index.ts Poster-16x9 out/poster-16x9.png
npx remotion still src/index.ts Poster-9x16 out/poster-9x16.png
npx remotion still src/index.ts Poster-1x1 out/poster-1x1.png
npx remotion still src/index.ts Poster-4x5 out/poster-4x5.png
```

## Roadmap

Next build layers (in order):

1. ~~**9:16 vertical rendering** - Add vertical format for TikTok/Reels/Shorts~~ ✅ DONE (multi-aspect poster: 16:9, 9:16, 1:1, 4:5)
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
