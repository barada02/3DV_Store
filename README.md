# 3D AI Chase Playground

A high-performance, interactive 3D web application built with React Three Fiber. This project demonstrates a "Human vs AI" chase mechanic, featuring a custom physics engine and an autonomous agent with obstacle-handling logic.

## 🌟 Features

*   **Autonomous AI Agent**:
    *   **State Machine Behavior**: Switches dynamically between "Chase" and "Unstick" modes.
    *   **Stuck Detection**: Intelligently detects when blocked by walls and navigates out.
    *   **Vector Math**: Real-time path calculation to intercept the player.
*   **Responsive Physics**:
    *   **Shared Physics Engine**: Both Human and AI use the same collision logic (`useCharacterPhysics`).
    *   **Sliding Collision**: robust AABB collision allowing characters to slide along walls rather than stopping dead.
*   **Dynamic Visuals**:
    *   Real-time shadows, reflective flooring, and reactive materials.
    *   Floating state labels above the AI for debugging/visualization.

## 🛠 Tech Stack

*   **React 19**: Core UI library.
*   **Three.js**: 3D graphics and vector mathematics.
*   **React Three Fiber (R3F)**: React renderer for Three.js.
*   **React Three Drei**: Helper library (Camera controls, Shapes, Text).
*   **Tailwind CSS**: Styling for the HUD overlay.

## 🎮 Controls

### Human (You)
*   **W / A / S / D**: Move Character
*   **Shift**: Sprint (Move faster)
*   **Mouse Left Click + Drag**: Rotate Camera
*   **Mouse Scroll**: Zoom In/Out

### AI Agent
*   **Autonomous**: It will relentlessly chase you.
*   **Behavior**: If it gets stuck on a wall for >0.5s, it will pick a random direction to break free before resuming the chase.
