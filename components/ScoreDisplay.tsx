import React from 'react';
import { type PlayerScore } from '../types';

interface ScoreDisplayProps {
  scores: PlayerScore[];
  timeLeft: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ scores, timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex justify-around items-center w-full max-w-xl mb-6 p-4 bg-gray-800 rounded-lg shadow-xl">
      {scores.length > 0 && (
        <div className="text-center px-2">
          <h2 className={`text-xl font-semibold ${scores[0].color.replace('bg-', 'text-')}`}>{scores[0].name}</h2>
          <p className="text-3xl font-bold text-white">{scores[0].score}</p>
        </div>
      )}

      <div className="text-center border-x-2 border-gray-700 px-6 mx-2">
        <div className="text-sm font-medium text-gray-400">TIME LEFT</div>
        <p className="text-4xl font-bold text-yellow-400 tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
      </div>

      {scores.length > 1 && (
        <div className="text-center px-2">
          <h2 className={`text-xl font-semibold ${scores[1].color.replace('bg-', 'text-')}`}>{scores[1].name}</h2>
          <p className="text-3xl font-bold text-white">{scores[1].score}</p>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;