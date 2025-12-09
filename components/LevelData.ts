
export interface WallConfig {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  type?: 'wall' | 'prop'; // To distinguish visually if needed
}

export const walls: WallConfig[] = [
  // --- OUTER SHELL (The Store Structure) ---
  // Height: 4 units (Standard ceiling relative to player)
  // Thickness: 0.5 units (Drywall)
  
  // Back Wall
  { position: [0, 2, -15], size: [40, 4, 0.5], color: '#e5e7eb', type: 'wall' },
  // Left Wall
  { position: [-20, 2, 0], size: [0.5, 4, 30], color: '#e5e7eb', type: 'wall' },
  // Right Wall
  { position: [20, 2, 0], size: [0.5, 4, 30], color: '#e5e7eb', type: 'wall' },
  
  // Front Wall (Left Segment)
  { position: [-12, 2, 15], size: [16.5, 4, 0.5], color: '#e5e7eb', type: 'wall' },
  // Front Wall (Right Segment)
  { position: [12, 2, 15], size: [16.5, 4, 0.5], color: '#e5e7eb', type: 'wall' },

  // --- FURNITURE & PROPS (Tech Store) ---
  // Height: ~1.2 units (Waist height counters)
  
  // Checkout Counter (Back Right) - L Shape
  { position: [15, 0.6, -12], size: [8, 1.2, 2], color: '#1f2937', type: 'prop' }, // Main desk
  { position: [12, 0.6, -9], size: [2, 1.2, 6], color: '#1f2937', type: 'prop' },  // Side return

  // Center Display Tables (Rows of Laptops/Gadgets)
  // Row 1
  { position: [-8, 0.5, -5], size: [6, 1, 3], color: '#f3f4f6', type: 'prop' }, // White table
  { position: [0, 0.5, -5], size: [6, 1, 3], color: '#f3f4f6', type: 'prop' },
  { position: [8, 0.5, -5], size: [6, 1, 3], color: '#f3f4f6', type: 'prop' },

  // Row 2
  { position: [-8, 0.5, 2], size: [6, 1, 3], color: '#f3f4f6', type: 'prop' },
  { position: [0, 0.5, 2], size: [6, 1, 3], color: '#f3f4f6', type: 'prop' },
  { position: [8, 0.5, 2], size: [6, 1, 3], color: '#f3f4f6', type: 'prop' },

  // Row 3 (Near Entrance)
  { position: [-8, 0.5, 9], size: [6, 1, 3], color: '#d1d5db', type: 'prop' }, // Grey table
  { position: [8, 0.5, 9], size: [6, 1, 3], color: '#d1d5db', type: 'prop' },

  // Feature Pillars (Structural)
  { position: [-10, 2, -14], size: [1, 4, 1], color: '#374151', type: 'wall' },
  { position: [10, 2, -14], size: [1, 4, 1], color: '#374151', type: 'wall' },
];
