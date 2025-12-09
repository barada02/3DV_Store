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
