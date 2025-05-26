export interface Coordinate {
  x: number;
  y: number;
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface Snake {
  id: number;
  name: string;
  body: Coordinate[];
  direction: Direction;
  color: string; // Tailwind CSS class for background color
  controls: {
    up: string;
    down: string;
    left: string;
    right: string;
  };
  originalLengthBeforeMove?: number; // Used for bonus food calculation
}

export interface Food extends Coordinate {
  type: 'normal' | 'bonus';
}

export enum GameState {
  StartScreen,
  Playing,
  Paused,
  GameOver,
}

export interface PlayerScore {
  name: string;
  score: number; // Represents current length
  color: string;
}

export type CrashType = 'none' | 'self' | 'opponent';

export interface PlayerStats {
  name: string;
  finalLength: number;
  adjustedScore: number;
  crashType: CrashType;
  color: string;
}

export interface GameResultDetails {
  agilityWinner: string; // Player name or "Draw"
  sizeWinner: string; // Player name or "Draw"
  player1Stats: PlayerStats;
  player2Stats: PlayerStats;
  reason: 'crash' | 'timeout'; // Why the game ended
}
