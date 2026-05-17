import { NEON_COLORS, OBSTACLE_TYPES } from './constants';

/** Pick a random element from an array */
export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Return a random neon color string */
export function randomNeonColor() {
  return randomFrom(NEON_COLORS);
}

/** Return a random obstacle type */
export function randomObstacleType() {
  return randomFrom(OBSTACLE_TYPES);
}

/** Linear interpolation */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Map a value from one range to another */
export function mapRange(val, inMin, inMax, outMin, outMax) {
  return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/** Generate a repeatable ring ID for a given Z index */
export function ringId(index) {
  return `ring-${index}`;
}
