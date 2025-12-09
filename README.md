# 3D React Playground

A high-performance, interactive 3D web application built with React Three Fiber. This project demonstrates third-person character control, physics-based collision detection, and modern web graphics techniques.

## 🌟 Features

*   **Responsive 3D Controls**: Smooth character movement using WASD or Arrow keys.
*   **Collision Detection**: Robust, axis-independent collision logic that prevents clipping and allows sliding along walls.
*   **Dynamic Visuals**:
    *   Real-time shadows and lighting.
    *   Reflective flooring with blur effects.
    *   Reactive player materials (changes color when sprinting).
*   **Clean UI**: Minimalist overlay built with Tailwind CSS.

## 🛠 Tech Stack

*   **React 19**: Core UI library.
*   **Three.js**: 3D graphics library.
*   **React Three Fiber (R3F)**: React renderer for Three.js.
*   **React Three Drei**: Helper library for R3F (providing `RoundedBox`, `OrbitControls`, `MeshReflectorMaterial`).
*   **Tailwind CSS**: Styling for the UI overlay.

## 🎮 Controls

*   **W / Up Arrow**: Move Forward
*   **S / Down Arrow**: Move Backward
*   **A / Left Arrow**: Move Left
*   **D / Right Arrow**: Move Right
*   **Shift**: Sprint (Move faster)
*   **Mouse Left Click + Drag**: Rotate Camera
*   **Mouse Scroll**: Zoom In/Out
