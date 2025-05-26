import { Direction } from './types';

export const BOARD_SIZE = 28; 
export const GAME_SPEED_MS = 120; 
export const INITIAL_SNAKE_LENGTH = 3;
export const MAX_GAME_TIME_SECONDS = 120; // 2 minutes
export const POINTS_FOR_BONUS_TRIGGER = 5; // Every 5 normal foods trigger a bonus

export const PLAYER_1_COLOR = 'bg-cyan-500';
export const PLAYER_2_COLOR = 'bg-lime-500';
export const FOOD_COLOR = 'bg-red-500'; // For normal food
export const BONUS_FOOD_COLOR = 'bg-yellow-400'; // For bonus food
export const BOARD_BG_COLOR = 'bg-gray-800';
export const CELL_BORDER_COLOR = 'border-gray-700';

export const SNAKE_CONFIG = [
  {
    id: 1,
    name: "Player 1 (WASD)",
    color: PLAYER_1_COLOR,
    initialPos: { x: 5, y: Math.floor(BOARD_SIZE / 2) }, 
    initialDirection: Direction.RIGHT,
    controls: { up: 'w', down: 's', left: 'a', right: 'd' }
  },
  {
    id: 2,
    name: "Player 2 (Arrows)",
    color: PLAYER_2_COLOR,
    initialPos: { x: BOARD_SIZE - 6, y: Math.floor(BOARD_SIZE / 2) }, 
    initialDirection: Direction.LEFT,
    controls: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }
  }
];