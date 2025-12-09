import { useState, useEffect } from 'react';

export interface KeyboardState {
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  jump: boolean;
  sprint: boolean;
}

type ControlScheme = 'wasd' | 'arrows';

const useKeyboard = (scheme: ControlScheme = 'wasd'): KeyboardState => {
  const [movement, setMovement] = useState<KeyboardState>({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
    sprint: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Player 1 Controls (WASD)
      if (scheme === 'wasd') {
        switch (e.code) {
          case 'KeyW': setMovement((m) => ({ ...m, moveForward: true })); break;
          case 'KeyS': setMovement((m) => ({ ...m, moveBackward: true })); break;
          case 'KeyA': setMovement((m) => ({ ...m, moveLeft: true })); break;
          case 'KeyD': setMovement((m) => ({ ...m, moveRight: true })); break;
          case 'Space': setMovement((m) => ({ ...m, jump: true })); break;
          case 'ShiftLeft': setMovement((m) => ({ ...m, sprint: true })); break;
        }
      } 
      // Player 2 Controls (Arrows)
      else if (scheme === 'arrows') {
        switch (e.code) {
          case 'ArrowUp': setMovement((m) => ({ ...m, moveForward: true })); break;
          case 'ArrowDown': setMovement((m) => ({ ...m, moveBackward: true })); break;
          case 'ArrowLeft': setMovement((m) => ({ ...m, moveLeft: true })); break;
          case 'ArrowRight': setMovement((m) => ({ ...m, moveRight: true })); break;
          case 'ControlRight': 
          case 'Numpad0':
            setMovement((m) => ({ ...m, jump: true })); break;
          case 'ShiftRight': setMovement((m) => ({ ...m, sprint: true })); break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (scheme === 'wasd') {
        switch (e.code) {
          case 'KeyW': setMovement((m) => ({ ...m, moveForward: false })); break;
          case 'KeyS': setMovement((m) => ({ ...m, moveBackward: false })); break;
          case 'KeyA': setMovement((m) => ({ ...m, moveLeft: false })); break;
          case 'KeyD': setMovement((m) => ({ ...m, moveRight: false })); break;
          case 'Space': setMovement((m) => ({ ...m, jump: false })); break;
          case 'ShiftLeft': setMovement((m) => ({ ...m, sprint: false })); break;
        }
      } 
      else if (scheme === 'arrows') {
        switch (e.code) {
          case 'ArrowUp': setMovement((m) => ({ ...m, moveForward: false })); break;
          case 'ArrowDown': setMovement((m) => ({ ...m, moveBackward: false })); break;
          case 'ArrowLeft': setMovement((m) => ({ ...m, moveLeft: false })); break;
          case 'ArrowRight': setMovement((m) => ({ ...m, moveRight: false })); break;
          case 'ControlRight':
          case 'Numpad0': 
            setMovement((m) => ({ ...m, jump: false })); break;
          case 'ShiftRight': setMovement((m) => ({ ...m, sprint: false })); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [scheme]);

  return movement;
};

export default useKeyboard;