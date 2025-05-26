import React from 'react';
import { SNAKE_CONFIG, MAX_GAME_TIME_SECONDS, POINTS_FOR_BONUS_TRIGGER } from '../constants';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const gameMinutes = Math.floor(MAX_GAME_TIME_SECONDS / 60);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-lg">
      <h2 className="text-3xl font-bold mb-6 text-white">Welcome to Dual Snake Arena!</h2>
      <div className="mb-6 space-y-4 text-left text-gray-300">
        <p className="text-lg">Two players, two snakes. Grow longer, don't crash!</p>
        
        <div className="p-3 bg-gray-700/50 rounded-md">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Game Rules & Scoring:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Game lasts for <strong>{gameMinutes} minute{gameMinutes > 1 ? 's' : ''}</strong>.</li>
                <li>Every <strong>{POINTS_FOR_BONUS_TRIGGER}</strong> normal foods eaten triggers a <strong className="text-yellow-300">Bonus Food</strong>!</li>
                <li>Eating Bonus Food <strong className="text-yellow-300">doubles</strong> your snake's length.</li>
                <li><strong>Victory Type 1 (Agility):</strong> Last snake standing wins. If both crash or time out, longest snake wins.</li>
                <li><strong>Victory Type 2 (Size):</strong> Highest score after penalties wins.
                    <ul className="list-['-_'] list-inside ml-4 text-xs">
                        <li>Crash into self: <strong>-50%</strong> score penalty.</li>
                        <li>Crash into opponent: <strong>-40%</strong> score penalty.</li>
                    </ul>
                </li>
            </ul>
        </div>

        <div>
          <h3 className={`text-lg font-semibold ${SNAKE_CONFIG[0].color.replace('bg-','text-')}`}>Player 1 Controls:</h3>
          <p className="text-sm">Up: W, Down: S, Left: A, Right: D</p>
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${SNAKE_CONFIG[1].color.replace('bg-','text-')}`}>Player 2 Controls:</h3>
          <p className="text-sm">Up: ArrowUp, Down: ArrowDown, Left: ArrowLeft, Right: ArrowRight</p>
        </div>
        <p className="mt-2 text-sm">Press 'P' during game to Pause/Resume.</p>
      </div>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        aria-label="Start Game (Press Enter)"
      >
        Start Game (Enter)
      </button>
    </div>
  );
};

export default StartScreen;