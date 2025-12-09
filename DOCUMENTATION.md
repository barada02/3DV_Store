
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
2.  **Collision Detection**: Checks `dx` and `dz` separately against wall bounding boxes to allow "sliding" along walls.
3.  **Rotation**: Uses `Math.atan2(dx, dz)` to calculate the movement angle and `Quaternion.slerp` to smoothly rotate the character to face the direction of travel.
4.  **Animation**: Procedural "bobbing" (Sine wave on Y-axis) and limb rotation (via `CharacterModel`) simulate walking/running.

### `useKeyboard.ts`
*   Attaches event listeners to `window`.
*   Returns a reactive state object representing currently pressed keys.

## 🧠 AI Logic: Game AI vs Machine Learning

It is important to distinguish the type of AI used in this application.

**This is "Game AI" (Symbolic AI / Hardcoded Logic), NOT Machine Learning.**

### How it works:
The AI operates on a **Deterministic Finite State Machine (FSM)**. It does not "think" or "learn" in the neural network sense. It follows a strict set of programmer-defined rules:

1.  **Perception**: The AI accesses the exact coordinate of the player (`targetRef.current.position`). In a real scenario, this would be "Raycasting" or "Vision Cones", but here we cheat slightly for performance by giving it perfect knowledge of the target's location.
2.  **Decision**:
    *   *Condition A*: Am I moving slower than expected? -> **Action**: Trigger "Unstick" routine.
    *   *Condition B*: Is the path clear? -> **Action**: Move straight towards target.
3.  **Action**: The AI updates its input vector `{x, z}` which drives the physics engine.

### Why not Machine Learning?
*   **Performance**: Logic gates (`if/else`) are effectively free. Neural networks require heavy matrix multiplication.
*   **Predictability**: In game design, you often want enemies to be predictable so players can master the mechanics. ML agents can sometimes behave erratically or "break" the game in unforeseen ways.
*   **Setup**: Training a Reinforcement Learning (RL) model takes hours/days. Writing an FSM takes minutes.

## ⚡ Performance

*   **No React State in Render Loop**: The physics loop reads from `useRef` (Mutable objects) exclusively. This avoids React's reconciliation process during the critical 60FPS loop.
*   **Vector Pooling**: Mathematical vectors (`tempVector`) are instantiated once and reused, keeping memory footprint flat.
