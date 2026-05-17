// ─── Tunnel Configuration ────────────────────────────────────────────────────
export const TUNNEL_CONFIG = {
  RING_COUNT: 40,
  RING_SPACING: 6,
  TUNNEL_RADIUS: 4.5,
  CAMERA_SPEED: 12,
  RING_SIDES: 8,
};

// ─── Color Themes ─────────────────────────────────────────────────────────────
// Each theme is a palette of neon colors that dominate during that cycle.
// TunnelWorld lerps between themes over COLOR_THEME_DURATION seconds.
export const COLOR_THEMES = [
  {
    name: 'cyberpunk',
    colors: ['#ff00ff', '#00ffff', '#ff0066', '#7700ff', '#0066ff'],
    fog: '#0a000f',
  },
  {
    name: 'matrix',
    colors: ['#00ff88', '#00ffcc', '#44ff00', '#00ff44', '#88ff00'],
    fog: '#000f04',
  },
  {
    name: 'inferno',
    colors: ['#ff6600', '#ff2200', '#ff9900', '#ffcc00', '#ff4400'],
    fog: '#0f0400',
  },
  {
    name: 'ultraviolet',
    colors: ['#cc00ff', '#7700ff', '#ff00cc', '#4400ff', '#ff0088'],
    fog: '#04000f',
  },
];

export const COLOR_THEME_DURATION = 12; // seconds per theme

// ─── Fallback flat palette (used before first theme loads) ───────────────────
export const NEON_COLORS = COLOR_THEMES[0].colors;

// ─── Obstacle Types ──────────────────────────────────────────────────────────
export const OBSTACLE_TYPES = ['bar', 'ring', 'cross'];

// ─── Particle Configuration ──────────────────────────────────────────────────
export const PARTICLE_CONFIG = {
  COUNT: 600,
  SPREAD_XY: 3.5,
  DEPTH: 250,
  SIZE: 0.04,
};
