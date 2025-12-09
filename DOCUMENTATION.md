# Technical Documentation

This document provides an in-depth look at the architecture, logic, and component structure of the 3D React Playground application.

## 🏗 Architecture

The application is built using a **Component-Based Architecture** typical of React applications, but adapted for the 3D scene graph via **React Three Fiber**.

### Directory Structure

*   `components/`: Contains all visual and logical 3D elements.
*   `hooks/`: Custom React hooks for logic reuse (input handling).
*   `App.tsx`: The main entry point combining HTML UI and the WebGL Canvas.
*   `index.tsx`: React DOM root renderer.
*   `LevelData.ts`: Configuration data for the scene layout.

## 🧩 Components

### 1. `App.tsx`
The root component that manages the layout. It renders:
*   **HTML Overlay**: A `div` layer with `z-index` containing the title and control instructions, styled with Tailwind CSS.
*   **Canvas**: The R3F Canvas element that initializes the WebGL context.
*   **OrbitControls**: Handles camera interaction, constrained to prevent the user from looking underneath the map.

### 2. `Scene.tsx`
Composes the 3D world. It handles:
*   **Lighting**: Uses `AmbientLight` for base illumination and `DirectionalLight` for casting shadows.
*   **Environment**: Renders the floor with `MeshReflectorMaterial` for high-quality reflections.
*   **Level Construction**: Iterates over the `walls` array from `LevelData.ts` to generate the static geometry of the level.
*   **Fog**: Adds depth to the scene.

### 3. `Player.tsx`
The most complex component, handling physics and input.

**Key Logic: The Render Loop (`useFrame`)**
The logic inside `useFrame` runs 60+ times per second.

1.  **State Calculation**: Determines speed based on the Sprint key.
2.  **Input Mapping**: Converts boolean flags from `useKeyboard` into directional vectors (`dx`, `dz`).
3.  **Collision Detection (AABB)**:
    *   **Algorithm**: Axis-Aligned Bounding Box.
    *   **Optimization**: We reuse `THREE.Box3` and `THREE.Vector3` instances stored in `useRef` to avoid JavaScript Garbage Collection overhead during the render loop.
    *   **Sliding**: We check the X-axis and Z-axis movements *independently*.
        *   Calculate potential X position.
        *   Check for overlap with all wall boxes.
        *   If no collision, apply X movement.
        *   Repeat for Z position.
        *   *Result*: If a player walks diagonally into a wall, they slide along it rather than stopping completely.
4.  **Animation**:
    *   Applies a sine wave to the Y-position for a "bobbing" effect.
    *   Tilts the mesh slightly in the direction of movement for visual feedback.

### 4. `LevelData.ts`
A configuration file acting as a simplified "Level Editor". It exports a `walls` array containing position, size, and color data. This decouples the level design from the rendering logic.

## 🪝 Custom Hooks

### `useKeyboard.ts`
A hook that tracks the state of specific keys.
*   **Event Listeners**: Attaches `keydown` and `keyup` listeners to the `window`.
*   **State Mapping**: Maps physical key codes (e.g., `KeyW`, `ArrowUp`) to logical actions (`moveForward`).
*   **Cleanup**: Removes listeners on component unmount to prevent memory leaks.

## 🎨 Styling & Graphics

*   **Tailwind CSS**: Used for the HUD (Heads-Up Display).
*   **Three.js Materials**:
    *   `MeshStandardMaterial`: Used for walls and the player to react to light.
    *   `MeshReflectorMaterial`: Used for the floor to provide real-time planar reflections, enhancing the sense of scale and polish.

## ⚡ Performance Considerations

1.  **Object Pooling**: `Vector3` and `Box3` objects are instantiated once in `useRef` hooks rather than created every frame.
2.  **Geometry Reuse**: Wall geometry is simple `boxGeometry`. In a larger scale app, these should be merged using `InstancedMesh`.
3.  **React Concurrency**: The `Suspense` boundary in `App.tsx` ensures the app doesn't crash while assets or shaders are compiling.
