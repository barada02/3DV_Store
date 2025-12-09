# Technical Documentation

This document provides an in-depth look at the architecture, logic, and component structure of the 3D AI Chase Playground.

## 🏗 Architecture

The application uses a **Component-Based Architecture** with a clear separation between "Brain" (Input) and "Body" (Physics).

### The "Brain vs Body" Pattern
To support both Human and AI players without duplicating code, we extracted the movement mechanics into a shared hook.

1.  **The Body (`useCharacterPhysics`)**: Handles velocity, collision detection, and mesh updates. It doesn't care *where* the input comes from.
2.  **The Brain**:
    *   **Human**: `useKeyboard` hook maps physical keys to input vectors.
    *   **AI**: `useFrame` loop calculates vectors based on target position and logic states.

## 🧩 Components

### 1. `Scene.tsx`
Composes the world. It holds the "Truth" of the level:
*   Instantiates the **Level Data** (Walls).
*   Creates the `ref` for the Human Player.
*   Passes that `ref` to the `AIPlayer`, enabling the "Vision" capability.

### 2. `HumanPlayer.tsx`
*   **Input**: Listens to WASD via `useKeyboard`.
*   **Logic**: Converts booleans (`isPressed`) into a normalized Vector3 direction.
*   **Rendering**: Renders a Blue `RoundedBox` with a `MeshStandardMaterial`.

### 3. `AIPlayer.tsx` (The Autonomous Agent)
*   **Input**: Mathematically derived frame-by-frame.
*   **State Machine**:
    *   **CHASE**: Calculates direction vector: `(TargetPos - CurrentPos).normalize()`.
    *   **UNSTICK**: If `position` changes by < 0.01 units over 0.5s while trying to move, the AI assumes it is stuck. It switches to this state, picks a random direction, and sprints for 1.0s to clear the obstacle.
*   **Rendering**: Renders a Red `RoundedBox` and a floating Text label showing current state.

## 🪝 Custom Hooks

### `useCharacterPhysics.ts` ( The Physics Engine )
This is the core engine used by both entities.

**Parameters**:
*   `meshRef`: Reference to the 3D object to move.
*   `inputRef`: A mutable ref containing `{ x, z, sprint }`. We use a Ref instead of State to avoid re-rendering the React component 60 times a second.
*   `walls`: Array of bounding boxes for collision.

**Logic Loop (`useFrame`)**:
1.  **Delta Time**: Multiplies speed by `delta` to ensure movement is framerate independent.
2.  **X-Axis Move**: Calculates theoretical next X position. Checks collision. If clear, commit move.
3.  **Z-Axis Move**: Calculates theoretical next Z position. Checks collision. If clear, commit move.
    *   *Note*: Separating X and Z checks allows "Sliding". If you run diagonally into a wall, you don't stop; you slide along the open axis.
4.  **Animation**: Procedural "bobbing" (Sine wave on Y-axis) and "tilting" (Rotation based on velocity) to simulate walking/running.

### `useKeyboard.ts`
*   Attaches event listeners to `window`.
*   Returns a reactive state object representing currently pressed keys.

## 📐 Math & Logic

### Collision Detection (AABB)
We use **Axis-Aligned Bounding Boxes**.
*   We maintain a reusable `THREE.Box3` instance.
*   Every frame, we expand the player's position into this box.
*   We check `box.intersectsBox(wallBox)` for every wall in the level.
*   *Optimization*: Objects are pooled (created once in `useRef`) to prevent Garbage Collection stutters.

### AI Navigation
Currently uses a direct **Seek Behavior** with a **Timeout Heuristic** for obstacle avoidance.
*   **Seek**: `Direction = Target - Me`.
*   **Heuristic**: "If I want to move but I am not moving, I am blocked. Do something random."

## ⚡ Performance

*   **No React State in Render Loop**: The physics loop reads from `useRef` (Mutable objects) exclusively. This avoids React's reconciliation process during the critical 60FPS loop.
*   **Vector Pooling**: Mathematical vectors (`tempVector`) are instantiated once and reused, keeping memory footprint flat.
