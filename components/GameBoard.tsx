import React from 'react';
import { type Food, type Snake } from '../types'; // Updated to use Food type
import { FOOD_COLOR, BONUS_FOOD_COLOR, BOARD_BG_COLOR } from '../constants';

interface GameBoardProps {
  snakes: Snake[];
  food: Food; // Changed from Coordinate to Food
  boardSize: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ snakes, food, boardSize }) => {
  const cells = Array.from({ length: boardSize * boardSize });

  return (
    <div 
      className={`grid shadow-2xl rounded-lg overflow-hidden border-2 border-gray-700 ${BOARD_BG_COLOR}`}
      style={{ 
        gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
        width: `${boardSize * 1.5}rem`, 
        height: `${boardSize * 1.5}rem`,
      }}
    >
      {cells.map((_, index) => {
        const x = index % boardSize;
        const y = Math.floor(index / boardSize);
        let cellContent = '';
        let cellColor = '';
        let additionalStyles = '';

        for (const snake of snakes) {
          if (snake.body.some(segment => segment.x === x && segment.y === y)) {
            cellColor = snake.color;
            if (snake.body[0].x === x && snake.body[0].y === y) {
               additionalStyles += ' ring-2 ring-offset-1 ring-offset-gray-800 ring-white';
            }
            break; 
          }
        }

        if (food.x === x && food.y === y) {
          cellColor = food.type === 'bonus' ? BONUS_FOOD_COLOR : FOOD_COLOR;
          additionalStyles += ' animate-pulse';
          if (food.type === 'bonus') {
            additionalStyles += ' ring-2 ring-yellow-200 ring-offset-1 ring-offset-gray-800 brightness-125';
          }
        }
        
        const isLastCol = (x + 1) % boardSize === 0;
        const isLastRow = (y + 1) % boardSize === 0;

        return (
          <div
            key={index}
            className={`w-full h-full flex items-center justify-center ${cellColor} ${additionalStyles}
                        ${isLastCol ? 'border-r-0' : 'border-r'} 
                        ${isLastRow ? 'border-b-0' : 'border-b'} 
                        border-gray-700/50`}
          >
            {cellContent}
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;