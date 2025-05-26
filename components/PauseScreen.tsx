
import React from 'react';

interface PauseScreenProps {
  onResume: () => void;
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResume }) => {
  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-10 p-4">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-yellow-400 animate-pulse">Paused</h2>
        <p className="text-xl mb-6 text-gray-300">Press 'P' to Resume</p>
        <button
          onClick={onResume}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md transition-colors"
        >
          Resume
        </button>
      </div>
    </div>
  );
};

export default PauseScreen;
    