---
name: remotion-video
description: Create programmatic videos with Remotion. Use when the user asks to generate videos, create video content, build explainer videos, or set up a Remotion project.
---

# Remotion Video Generation

Create programmatic videos using Remotion - a React-based video creation framework.

## Project Structure

```
projectname/
├── src/
│   ├── index.ts              # Entry point - registers root
│   ├── Root.tsx              # Composition definitions
│   ├── scenes/               # Reusable scene components
│   │   ├── TextScene.tsx
│   │   ├── IntroScene.tsx
│   │   └── QuoteScene.tsx
│   ├── layouts/              # Reusable layout components
│   │   └── FullscreenCentered.tsx
│   └── compositions/         # Full video compositions
│       └── SimpleExplainer.tsx
├── assets/
│   ├── logos/
│   ├── fonts/
│   └── images/
├── out/                      # Rendered output
└── package.json
```

## Setup Steps

1. Install Node.js and dependencies:
```bash
npm install remotion @remotion/cli react react-dom
```

2. Create entry point `src/index.ts`:
```typescript
import {registerRoot} from 'remotion';
import {Root} from './Root';

registerRoot(Root);
```

3. Configure workflow for Replit (CRITICAL - must bind to 0.0.0.0:5000):
```bash
npx remotion studio src/index.ts --port 5000 --ipAddress 0.0.0.0
```

## Core Patterns

### Scene Component (Reusable Primitive)
```typescript
import React from 'react';
import { AbsoluteFill } from 'remotion';

export const TextScene: React.FC<{
  text: string;
  background?: string;
}> = ({ text, background = '#6B5BFF' }) => {
  return (
    <AbsoluteFill
      style={{
        background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 72,
        fontWeight: 600,
        padding: 80,
        textAlign: 'center',
      }}
    >
      {text}
    </AbsoluteFill>
  );
};
```

### Animated Scene with Interpolation
```typescript
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const IntroScene: React.FC<{title: string}> = ({title}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #6B5BFF, #9B8CFF)',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: 80,
        fontWeight: 600,
        opacity,
      }}
    >
      {title}
    </AbsoluteFill>
  );
};
```

### Composition (Combines Scenes with Sequences)
```typescript
import React from 'react';
import { Sequence } from 'remotion';
import { TextScene } from '../scenes/TextScene';

export const SimpleExplainer: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={90}>
        <TextScene text="First Message" />
      </Sequence>
      <Sequence from={90} durationInFrames={120}>
        <TextScene text="Second Message" background="#4F46E5" />
      </Sequence>
      <Sequence from={210} durationInFrames={120}>
        <TextScene text="Third Message" background="#1E293B" />
      </Sequence>
    </>
  );
};
```

### Root Component (Registers Compositions)
```typescript
import React from 'react';
import { Composition } from 'remotion';
import { SimpleExplainer } from './compositions/SimpleExplainer';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="SimpleExplainer"
        component={SimpleExplainer}
        durationInFrames={330}  // Total frames (sum of all sequences)
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
```

## Aspect Ratios

- **16:9 Landscape**: width={1920} height={1080}
- **9:16 Vertical** (TikTok/Reels): width={1080} height={1920}
- **1:1 Square**: width={1080} height={1080}

## Rendering

### Preview in Studio
```bash
npx remotion studio src/index.ts --port 5000 --ipAddress 0.0.0.0
```

### Render to MP4
```bash
npx remotion render src/index.ts CompositionId out/video.mp4
```

### Cloud Rendering (Remotion Lambda)
For production scale, use Remotion Lambda for AWS-based rendering.

## Key Remotion Concepts

- **Composition**: A video definition with id, dimensions, duration, fps
- **Sequence**: Places content at specific frame ranges
- **AbsoluteFill**: Full-screen container for scenes
- **useCurrentFrame()**: Get current frame number for animations
- **interpolate()**: Map frame numbers to animated values

## Replit-Specific Notes

- Always use `--port 5000 --ipAddress 0.0.0.0` for the studio to be accessible
- Set workflow output_type to "webview" with wait_for_port=5000
- Rendered videos go to the `out/` directory
