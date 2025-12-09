

# AI Agent Implementation Plan

## 1. Overview
The goal is to convert "Player 2" from a keyboard-controlled entity into an autonomous AI agent. This agent will exist within the same 3D scene, interact with the same physics (walls), and react to the human player's movement.

## 2. Technologies & Stack
We will stick to the existing stack to maintain performance and simplicity, leveraging math and vector logic over heavy external libraries.

*   **React Three Fiber (useFrame)**: The "heartbeat" of the AI. Logic will run every frame (60fps).
*   **Three.js (Vector3, Raycaster)**: Used for 3D spatial math, distance calculations, and "vision" (detecting walls).
*   **State Machine Pattern**: To manage behavior states (Chasing, Wandering, Avoiding).

## 3. Architecture Changes

### A. Component Refactoring
We will refactor the existing `Player.tsx` to accept a `controller` prop or split it into two specialized components:
1.  `HumanPlayer`: Controlled by `useKeyboard`.
2.  `AIPlayer`: Controlled by a new hook `useAIBehavior`.

### B. The `useAIBehavior` Hook
This is the "Brain". It will calculate the necessary inputs (`dx`, `dz`) that the `Player` component currently expects from a keyboard.

**Inputs:**
*   `agentPosition`: Where the AI is.
*   `targetPosition`: Where the Human Player is.
*   `walls`: The level data for collision anticipation.

**Outputs:**
*   `movementVector`: Direction to move.
*   `isSprinting`: Whether to run.

## 4. AI Logic & Techniques

We will implement a **Steering Behavior** model combined with a **Finite State Machine**.

### Phase 1: The State Machine
The AI will switch between modes based on context:

1.  **IDLE / PATROL**: When the player is far away, the AI moves randomly or stands still.
2.  **CHASE**: When the player is within a certain radius, the AI moves directly towards them.
3.  **AVOIDANCE (High Priority)**: If a wall is detected in front of the AI, this overrides all other states to steer away.

### Phase 2: Navigation (Steering)
Since we don't have a navigation mesh (NavMesh), we will use **Force-Based Steering**:

*   **Seek Force**: `(TargetPos - AgentPos).normalize() * Speed`
*   **Avoidance Force**: We will cast 3 "rays" (whiskers) in front of the AI (Left, Center, Right).
    *   If *Center* hits a wall: Turn hard Left or Right.
    *   If *Left* hits: Turn Right.
    *   If *Right* hits: Turn Left.

## 5. Diagrams

### Data Flow Diagram
```mermaid
graph TD
    A[Scene Loop (useFrame)] --> B{AI Controller}
    C[Human Player Pos] --> B
    D[Wall Data] --> B
    B --> E[Calculate Distance to Target]
    B --> F[Raycast / Wall Check]
    E --> G{State Decision}
    F --> G
    G -- "Path Clear" --> H[Seek Target]
    G -- "Wall Detected" --> I[Avoid Obstacle]
    H --> J[Update Velocity]
    I --> J
    J --> K[Move AI Mesh]
```

### Obstacle Avoidance Visualized
```text
      [Wall]
        ^
        |  Reflected Force
      \ | /
       \|/
    [AI Agent]  ----> [Target]
       ^
       |
    Original Path (Blocked)
```

## 6. Implementation Steps

1.  **Refactor Player**: Extract movement logic so it can be driven by props (Vector3) instead of just keyboard hooks.
2.  **Create AI Hook**: Implement `useAIBehavior` with basic "Move towards target" logic.
3.  **Add "Vision"**: Implement crude raycasting (checking distance to walls mathematically) to prevent the AI from running into walls.
4.  **Integration**: Replace the second `<Player />` in `Scene.tsx` with the AI-controlled version.

## 7. Character Model Upgrade Plan (New)

To replace the abstract cubes with recognizable characters without relying on external assets (which can be flaky), we will procedurally generate a **Voxel/Robot Style Character** using Three.js primitives.

### A. The "Voxel Bot" Design
The character will be a composite React component `CharacterModel.tsx` composed of grouped meshes:

*   **Head**: `boxGeometry` with a glowing "visor" for eyes.
*   **Torso**: `boxGeometry` slightly tapered (Trapezoid feel).
*   **Limbs**: Separate meshes for Left Arm, Right Arm, Left Leg, Right Leg.
*   **Joints**: Pivot points at the shoulders and hips to allow rotation.

### B. Procedural Animation
Instead of static meshes, we will implement a "Walking Cycle" directly in the component loop.

**Logic:**
Inside `useFrame`:
1.  **Check Velocity**: If the character is moving (`velocity > 0.1`):
2.  **Sine Wave Calculation**: `Math.sin(time * speed)`
3.  **Apply Rotation**:
    *   Left Arm: `rotation.x = sin(t)`
    *   Right Arm: `rotation.x = -sin(t)` (Opposite phase)
    *   Left Leg: `rotation.x = -sin(t)`
    *   Right Leg: `rotation.x = sin(t)`

This creates a natural "marching" or running look.

## 8. Character Rotation & Orientation (New)

Currently, characters slide in X/Z directions while facing a fixed direction. To improve realism, they must rotate to face their movement vector.

### A. Math
We will use the `Math.atan2(x, z)` function to calculate the angle of the movement vector.
*   `targetRotation = Math.atan2(deltaX, deltaZ)`

### B. Smoothing (Lerp)
Instant snapping looks robotic. We will use **Spherical Linear Interpolation (Slerp)** or basic **Angle Lerp** to rotate the character smoothly over time.
*   `currentRotation = MathUtils.lerp(currentRotation, targetRotation, 0.1)`

### C. Logic Location
This logic will be added to `useCharacterPhysics.ts`.
1.  Check if `dx` or `dz` is non-zero.
2.  Calculate angle.
3.  Apply rotation to `meshRef.current.rotation.y`.
4.  Remove the old "tilt" logic (`rotation.z = -dx * 0.1`) as it conflicts with proper facing.

## 9. Store Transformation & Scale Fix (New)

We will transform the environment from a "Testing Arena" to a "Retail Store".

### A. Layout ASCII Diagram
We will implement a classic retail layout with two distinct sections.

```text
    +-------------------------------------------------------+
    |                      BACK WALL                        |
    |  +-----------+                       +-------------+  |
    |  | Change Rm |      [STORAGE]        |  Stock Rm   |  |
    |  +-----------+                       +-------------+  |
    |                                                       |
    |   [ TECH ZONE ]                     [ FASHION ZONE ]  |
    |    (Blue/Grey)                        (Pink/Gold)     |
    |                                                       |
    |   +--Table--+      +---------+       +--Rack---+      |
    |   | Laptops |      | Checkout|       | Clothes |      |
    |   +---------+      | Counter |       +---------+      |
    |                    +---------+                        |
    |                                                       |
    |                      ENTRANCE                         |
    +-------------------------------------------------------+
```

### B. Scale Strategy (The "Ant" Fix)
Currently, walls are 5 units high while players are effectively ~1.4 units high. This creates a "Warehouse" feel.
To fix this, we will adjust the ratios to feel like a boutique:

1.  **Player Size**: Increase `CharacterModel` scale from `0.4` to `0.6`. This makes the player ~2.2 units tall (approx 1.8m relative).
2.  **Wall Height**: Decrease Outer Walls from `5` to `4` units.
3.  **Wall Thickness**: Decrease from `2` units to `0.5` units (Drywall thickness vs Castle walls).
4.  **Furniture Height**: Tables/Racks should be `1` to `1.2` units high (Waist height).

### C. Technical Implementation
We will update `LevelData.ts` to separate "Structure" from "Props".

1.  **Walls**: The outer bounding box and internal dividers.
2.  **Props**: Low-height obstacles (Tables, Racks). These act as obstacles but allow the camera to see over them.
3.  **Zones**:
    *   **Tech Zone**: Cool colors, sharp geometric tables.
    *   **Fashion Zone**: Warm colors, thinner "rack" like obstacles.

### D. Visuals
*   **Floor**: Change to a Tiled or Wood texture look (using grid or colors).
*   **Lighting**: Warmer, more inviting lighting rather than the harsh "Arena" light.
