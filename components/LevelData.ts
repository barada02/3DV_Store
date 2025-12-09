
export interface WallConfig {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

export const walls: WallConfig[] = [
  // Outer Walls (The Arena) - Colorful boundaries
  { position: [0, 2.5, -15], size: [32, 5, 2], color: '#EF4444' }, // North - Red
  { position: [0, 2.5, 15], size: [32, 5, 2], color: '#3B82F6' },  // South - Blue
  { position: [-15, 2.5, 0], size: [2, 5, 32], color: '#10B981' }, // West - Green
  { position: [15, 2.5, 0], size: [2, 5, 32], color: '#F59E0B' },  // East - Yellow

  // Simple Obstacles (Not a maze, just objects to move around)
  { position: [-5, 2.5, -5], size: [4, 5, 1], color: '#8B5CF6' }, // Purple wall
  { position: [6, 2.5, 6], size: [2, 5, 6], color: '#EC4899' },   // Pink block
  { position: [8, 1, -8], size: [3, 2, 3], color: '#6366F1' },    // Small Indigo cube
];
