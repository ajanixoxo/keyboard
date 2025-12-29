# Scroll → Animation Mapping

## Overview
This document explains how scroll position maps to 3D animations in the keyboard showcase.

## Architecture

### Component Structure
```
/components/three/
  ├── KeyboardScene.tsx    # Main 3D scene with fixed Canvas
  ├── KeyboardModels.tsx    # Loads all 4 GLB files independently
  └── useKeyboardScroll.ts # GSAP + ScrollTrigger logic

/components/ui/
  └── ScrollText.tsx        # Text animations with Anime.js

/app/
  └── page.tsx              # 5 scroll sections (100vh each)
```

## Scroll Sections (100vh each)

### Section 1: Hero (0% - 20% scroll)
**Trigger:** `.section-1`

**Animations:**
- Camera: Moves from `z: 6` to `z: 5` (slight zoom in)
- Models: Full keyboard visible (opacity: 1)
- Other parts: Hidden (opacity: 0)

**Text:** "Mechanical Excellence" - Anime.js fade-in

---

### Section 2: Keys Focus (20% - 40% scroll)
**Trigger:** `.section-2`

**Animations:**
- Camera: 
  - Position: `z: 3, y: 0.5, x: 0` (zooms in, slight tilt)
  - Rotation: `x: -0.1` (subtle downward angle)
- Full keyboard: Fades to opacity 0.3
- Keys: 
  - Opacity: 0 → 1
  - Scale: 1 → 1.1 (emphasis)
- Inner & PCB: Fade to opacity 0.2

**Text:** "Premium Keycaps" - Anime.js slide-in

---

### Section 3: Internal Layout - Exploded Start (40% - 60% scroll)
**Trigger:** `.section-3`

**Animations:**
- Camera:
  - Position: `z: 4, y: 0, x: 0`
  - Rotation: `x: -0.15` (more pronounced angle)
- Parts begin gradual separation:
  - Keys: `y: 0 → 1.5` (moves up)
  - Inner: `y: 0` (stays center)
  - PCB Base: `y: 0 → -1.5` (moves down)
- Full keyboard: Fades out (opacity: 0)
- Individual parts: Fade in (opacity: 1)
- Keys scale: Returns to 1.0

**Text:** "Internal Architecture" - Anime.js slide-in

---

### Section 4: Fully Exploded (60% - 80% scroll)
**Trigger:** `.section-4`

**Animations:**
- Camera:
  - Position: `z: 5, y: 0.5, x: 0.8` (orbits to side)
  - Rotation: `x: -0.1, y: 0.2` (angled view)
- Maximum separation:
  - Keys: `y: 2.5, z: 0.5` (top, slight forward)
  - Inner: `y: 0, z: 0` (center)
  - PCB Base: `y: -2.5, z: -0.5` (bottom, slight back)

**Text:** "Every Component Matters" - Anime.js slide-in

---

### Section 5: Reassemble / Finish (80% - 100% scroll)
**Trigger:** `.section-5`

**Animations:**
- Camera:
  - Position: Returns to `z: 5, y: 0, x: 0`
  - Rotation: Returns to `x: 0, y: 0, z: 0` (neutral)
- Parts reassemble:
  - All parts: `y: 0, x: 0, z: 0` (return to center)
- Full keyboard: Fades in (opacity: 1)
- Individual parts: Fade out (opacity: 0)

**Text:** "Complete. Refined." - Anime.js fade-in

---

## Technical Details

### Animation System
- **GSAP ScrollTrigger:** All 3D animations are scroll-scrubbed (smooth, no snapping)
- **Progress-based:** Animations are tied to scroll progress, not triggers
- **Material Opacity:** Custom proxy system animates material opacity on all meshes
- **Camera Control:** Programmatic (no OrbitControls)

### Separation of Concerns
- **KeyboardModels.tsx:** Only loads GLB files, exposes refs
- **useKeyboardScroll.ts:** Owns all GSAP + ScrollTrigger logic
- **KeyboardScene.tsx:** Renders Canvas and sets up scene
- **ScrollText.tsx:** Uses Anime.js for text animations only

### Key Features
- ✅ Fixed Canvas (doesn't scroll with page)
- ✅ Smooth scroll-scrubbed animations
- ✅ Independent GLB loading
- ✅ Proper cleanup on unmount
- ✅ No CSS scroll hacks
- ✅ No Canvas re-mounting

---

## Adding GLB Files

Place your keyboard GLB files in `/public/`:
- `keyboard_full.glb`
- `keyboard_keys.glb`
- `keyboard_inner.glb`
- `keyboard_pcb_base.glb`

The models are automatically preloaded for better performance.


