// Utility functions and constants for memory management simulators

import { firstFit } from '../algorithms/firstFit';
import { bestFit } from '../algorithms/bestFit';
import { worstFit } from '../algorithms/worstFit';

export function parseInput(str) {
  return str
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n) && n > 0);
}

export function allocateMemory(blocks, processes, algorithm) {
  if (algorithm === 'first') return firstFit(blocks, processes);
  if (algorithm === 'best') return bestFit(blocks, processes);
  if (algorithm === 'worst') return worstFit(blocks, processes);
  throw new Error('Unknown algorithm');
}

export const COLORS = [
  '#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1', '#c2185b', '#ffa000', '#388e3c', '#512da8'
];

export const SPEEDS = {
  slow: 1500,
  normal: 800,
  fast: 300,
}; 