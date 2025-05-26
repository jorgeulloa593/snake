import React from 'react';
import { type GameResultDetails, type PlayerStats } from '../types';

interface GameOverScreenProps {
  results: GameResultDetails;
  onRestart: () => void;
}

const getPlayerColor = (playerName: string, p1Stats: PlayerStats, p2Stats: PlayerStats): string => {
  if (playerName === p1Stats.name) return p1Stats.color.replace('bg-', 'text-');
  if (playerName === p2Stats.name) return p2Stats.color.replace('bg-', 'text-');
  return 'text-gray-300'; // For "Draw"
};

const getWinnerColorClass = (winnerName: string, p1Name: string, p2Name: string, p1Color: string, p2Color: string): string => {
    if (winnerName.includes(p1Name)) return p1Color.replace('bg-', 'text-');
    if (winnerName.includes(p2Name)) return p2Color.replace('bg-', 'text-');
    if (winnerName.toLowerCase().includes("draw")) return 'text-yellow-300'; // Draw color
    return 'text-white'; // Default
};

const PlayerStatDisplay: React.FC<{ stats: PlayerStats, isWinner: boolean }> = ({ stats, isWinner }) => {
  let penaltyText = "(No penalties)";
  if (stats.crashType === 'self') penaltyText = "(Crashed into self: -50% score)";
  else if (stats.crashType === 'opponent') penaltyText = "(Crashed into opponent: -40% score)";
  
  const winnerTextColor = stats.color.replace('bg-', 'text-');

  return (
    <div className={`p-3 rounded-md ${isWinner ? 'ring-2 ring-yellow-400 bg-gray-700/50' : 'bg-gray-700/30'}`}>
      <h4 className={`text-lg font-semibold ${winnerTextColor}`}>{stats.name}</h4>
      <p className="text-sm">Final Length: <span className="font-medium">{stats.finalLength}</span></p>
      <p className="text-sm">Adjusted Score (Size): <span className="font-medium">{stats.adjustedScore}</span></p>
      <p className="text-xs text-gray-400">{penaltyText}</p>
    </div>
  );
};


const GameOverScreen: React.FC<GameOverScreenProps> = ({ results, onRestart }) => {
  const { agilityWinner, sizeWinner, player1Stats, player2Stats, reason } = results;

  const agilityWinnerColor = getWinnerColorClass(agilityWinner, player1Stats.name, player2Stats.name, player1Stats.color, player2Stats.color);
  const sizeWinnerColor = getWinnerColorClass(sizeWinner, player1Stats.name, player2Stats.name, player1Stats.color, player2Stats.color);
  
  let gameOverReasonText = "Game Over!";
  if (reason === 'timeout') gameOverReasonText = "Time's Up!";
  else if (reason === 'crash') gameOverReasonText = "Crash!";


  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-85 flex flex-col items-center justify-center z-10 p-4 overflow-y-auto">
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-2xl text-center w-full max-w-xl md:max-w-2xl my-auto">
        <h2 className="text-4xl font-bold mb-3 text-red-500">{gameOverReasonText}</h2>
        
        <div className="mb-6 p-4 bg-gray-700/70 rounded-lg">
          <h3 className="text-2xl font-semibold mb-2 text-sky-400">Type 1: Victory by Agility</h3>
          <p className={`text-xl font-bold ${agilityWinnerColor}`}>{agilityWinner.replace(" (Time's Up!)", "")} Wins!</p>
           {agilityWinner.includes("Time's Up!") && <p className="text-sm text-gray-400">(Result due to timeout)</p>}
        </div>

        <div className="mb-8 p-4 bg-gray-700/70 rounded-lg">
          <h3 className="text-2xl font-semibold mb-3 text-amber-400">Type 2: Victory by Size</h3>
          <p className={`text-xl font-bold mb-4 ${sizeWinnerColor}`}>{sizeWinner} Wins!</p>
          <div className="space-y-3 text-left">
            <PlayerStatDisplay stats={player1Stats} isWinner={sizeWinner === player1Stats.name} />
            <PlayerStatDisplay stats={player2Stats} isWinner={sizeWinner === player2Stats.name} />
          </div>
        </div>
        
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
          aria-label="Play Again (Press Enter)"
        >
          Play Again (Enter)
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;