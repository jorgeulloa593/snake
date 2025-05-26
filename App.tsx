import React, { useState, useEffect, useCallback } from 'react';
import { GameState, type Coordinate, type Snake, Direction, type PlayerScore, type Food, type GameResultDetails, type CrashType } from './types';
import { BOARD_SIZE, GAME_SPEED_MS, INITIAL_SNAKE_LENGTH, SNAKE_CONFIG, MAX_GAME_TIME_SECONDS, POINTS_FOR_BONUS_TRIGGER } from './constants';
import GameBoard from './components/GameBoard';
import ScoreDisplay from './components/ScoreDisplay';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import PauseScreen from './components/PauseScreen';

const App: React.FC = () => {
  const [snakes, setSnakes] = useState<Snake[]>([]);
  const [food, setFood] = useState<Food>({ x: 0, y: 0, type: 'normal' });
  const [gameState, setGameState] = useState<GameState>(GameState.StartScreen);
  const [gameResultDetails, setGameResultDetails] = useState<GameResultDetails | null>(null);
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(MAX_GAME_TIME_SECONDS);
  const [normalFoodEatenCount, setNormalFoodEatenCount] = useState<number>(0);
  const [nextFoodShouldBeBonus, setNextFoodShouldBeBonus] = useState<boolean>(false);

  const initializeSnake = (config: typeof SNAKE_CONFIG[0]): Snake => {
    const body: Coordinate[] = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      let segment: Coordinate;
      if (config.initialDirection === Direction.RIGHT) {
        segment = { x: config.initialPos.x - i, y: config.initialPos.y };
      } else if (config.initialDirection === Direction.LEFT) {
        segment = { x: config.initialPos.x + i, y: config.initialPos.y };
      } else if (config.initialDirection === Direction.UP) {
        segment = { x: config.initialPos.x, y: config.initialPos.y + i };
      } else { // DOWN
        segment = { x: config.initialPos.x, y: config.initialPos.y - i };
      }
      body.push(segment);
    }
    return { ...config, body, direction: config.initialDirection };
  };
  
  const generateFood = useCallback((currentSnakes: Snake[], isBonus: boolean): Food => {
    let newFoodCoord: Coordinate;
    const allSnakeSegments = currentSnakes.flatMap(s => s.body);
    do {
      newFoodCoord = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (allSnakeSegments.some(segment => segment.x === newFoodCoord.x && segment.y === newFoodCoord.y));
    return { ...newFoodCoord, type: isBonus ? 'bonus' : 'normal' };
  }, []);

  const initializeGame = useCallback(() => {
    const initialSnakes = SNAKE_CONFIG.map(config => initializeSnake(config));
    setSnakes(initialSnakes);
    setFood(generateFood(initialSnakes, false));
    setGameState(GameState.Playing);
    setGameResultDetails(null);
    setScores(initialSnakes.map(s => ({ name: s.name, score: s.body.length, color: s.color })));
    setTimeLeft(MAX_GAME_TIME_SECONDS);
    setNormalFoodEatenCount(0);
    setNextFoodShouldBeBonus(false);
  }, [generateFood]);

  const updateScores = (currentSnakes: Snake[]) => {
    setScores(currentSnakes.map(s => ({ name: s.name, score: s.body.length, color: s.color })));
  };

  const calculateAdjustedScore = (snakeLength: number, crashType: CrashType): number => {
    let score = snakeLength;
    if (crashType === 'self') score *= 0.5; // 50% penalty
    else if (crashType === 'opponent') score *= 0.6; // 40% penalty
    return Math.round(score);
  };

  const handleEndGameByCrash = useCallback((
    finalSnakes: Snake[], 
    p1Crashed: boolean, 
    p2Crashed: boolean, 
    p1CrashCause: CrashType, 
    p2CrashCause: CrashType
  ) => {
    setGameState(GameState.GameOver);

    const snake1 = finalSnakes.find(s => s.id === SNAKE_CONFIG[0].id)!;
    const snake2 = finalSnakes.find(s => s.id === SNAKE_CONFIG[1].id)!;

    let agilityWinnerName: string;
    if (p1Crashed && p2Crashed) {
      if (snake1.body.length > snake2.body.length) agilityWinnerName = snake1.name;
      else if (snake2.body.length > snake1.body.length) agilityWinnerName = snake2.name;
      else agilityWinnerName = "It's a Draw!";
    } else if (p1Crashed) {
      agilityWinnerName = snake2.name;
    } else { // p2Crashed
      agilityWinnerName = snake1.name;
    }

    const p1Adjusted = calculateAdjustedScore(snake1.body.length, p1CrashCause);
    const p2Adjusted = calculateAdjustedScore(snake2.body.length, p2CrashCause);

    let sizeWinnerName: string;
    if (p1Adjusted > p2Adjusted) sizeWinnerName = snake1.name;
    else if (p2Adjusted > p1Adjusted) sizeWinnerName = snake2.name;
    else sizeWinnerName = "It's a Draw!";
    
    setGameResultDetails({
      agilityWinner: agilityWinnerName,
      sizeWinner: sizeWinnerName,
      player1Stats: { name: snake1.name, finalLength: snake1.body.length, adjustedScore: p1Adjusted, crashType: p1CrashCause, color: snake1.color },
      player2Stats: { name: snake2.name, finalLength: snake2.body.length, adjustedScore: p2Adjusted, crashType: p2CrashCause, color: snake2.color },
      reason: 'crash',
    });
    updateScores(finalSnakes);
  }, [ /* SNAKE_CONFIG is constant, updateScores has no deps if it only uses its args */ ]);

  const handleEndGameByTimeout = useCallback(() => {
    setGameState(GameState.GameOver);
    setSnakes(currentSnakes => {
        const snake1 = currentSnakes.find(s => s.id === SNAKE_CONFIG[0].id)!;
        const snake2 = currentSnakes.find(s => s.id === SNAKE_CONFIG[1].id)!;

        let agilityWinnerName: string;
        if (snake1.body.length > snake2.body.length) agilityWinnerName = `${snake1.name} (Time's Up!)`;
        else if (snake2.body.length > snake1.body.length) agilityWinnerName = `${snake2.name} (Time's Up!)`;
        else agilityWinnerName = "It's a Draw! (Time's Up!)";

        const p1Adjusted = calculateAdjustedScore(snake1.body.length, 'none'); // No crash penalty on timeout
        const p2Adjusted = calculateAdjustedScore(snake2.body.length, 'none');

        let sizeWinnerName: string;
        if (p1Adjusted > p2Adjusted) sizeWinnerName = snake1.name;
        else if (p2Adjusted > p1Adjusted) sizeWinnerName = snake2.name;
        else sizeWinnerName = "It's a Draw!";
        
        setGameResultDetails({
            agilityWinner: agilityWinnerName,
            sizeWinner: sizeWinnerName,
            player1Stats: { name: snake1.name, finalLength: snake1.body.length, adjustedScore: p1Adjusted, crashType: 'none', color: snake1.color },
            player2Stats: { name: snake2.name, finalLength: snake2.body.length, adjustedScore: p2Adjusted, crashType: 'none', color: snake2.color },
            reason: 'timeout',
        });
        updateScores(currentSnakes);
        return currentSnakes; 
    });
  }, [ /* SNAKE_CONFIG, updateScores */ ]);


  useEffect(() => {
    if (gameState === GameState.Playing) {
      const timerInterval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            handleEndGameByTimeout();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [gameState, handleEndGameByTimeout]);


  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameState === GameState.Playing) {
      setSnakes(prevSnakes => 
        prevSnakes.map(snake => {
          if (event.key.toLowerCase() === snake.controls.up.toLowerCase() && snake.direction !== Direction.DOWN) return { ...snake, direction: Direction.UP };
          if (event.key.toLowerCase() === snake.controls.down.toLowerCase() && snake.direction !== Direction.UP) return { ...snake, direction: Direction.DOWN };
          if (event.key.toLowerCase() === snake.controls.left.toLowerCase() && snake.direction !== Direction.RIGHT) return { ...snake, direction: Direction.LEFT };
          if (event.key.toLowerCase() === snake.controls.right.toLowerCase() && snake.direction !== Direction.LEFT) return { ...snake, direction: Direction.RIGHT };
          return snake;
        })
      );
      if (event.key.toLowerCase() === 'p') {
        setGameState(GameState.Paused);
      }
    } else if (gameState === GameState.Paused && event.key.toLowerCase() === 'p') {
      setGameState(GameState.Playing);
    } else if ((gameState === GameState.GameOver || gameState === GameState.StartScreen) && event.key === 'Enter') {
      initializeGame();
    }
  }, [gameState, initializeGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState !== GameState.Playing) return;

    const gameInterval = setInterval(() => {
      setSnakes(prevSnakes => {
        const movedSnakes = prevSnakes.map(snake => {
          const newBody = [...snake.body];
          const head = { ...newBody[0] }; 

          switch (snake.direction) {
            case Direction.UP: head.y -= 1; break;
            case Direction.DOWN: head.y += 1; break;
            case Direction.LEFT: head.x -= 1; break;
            case Direction.RIGHT: head.x += 1; break;
          }

          if (head.x < 0) head.x = BOARD_SIZE - 1;
          else if (head.x >= BOARD_SIZE) head.x = 0;
          if (head.y < 0) head.y = BOARD_SIZE - 1;
          else if (head.y >= BOARD_SIZE) head.y = 0;
          
          newBody.unshift(head); 
          return { ...snake, body: newBody, originalLengthBeforeMove: snake.body.length };
        });

        // Collision detection
        const playerCrashInfos: { crashed: boolean; type: CrashType }[] = [
          { crashed: false, type: 'none' }, { crashed: false, type: 'none' }
        ];
        const finalSnakesAtCrash = [...movedSnakes]; // Snakes with new heads, before pop/growth

        for (let i = 0; i < finalSnakesAtCrash.length; i++) {
          const currentSnake = finalSnakesAtCrash[i];
          const head = currentSnake.body[0];

          // Self-collision
          for (let k = 1; k < currentSnake.body.length; k++) {
            if (head.x === currentSnake.body[k].x && head.y === currentSnake.body[k].y) {
              playerCrashInfos[i] = { crashed: true, type: 'self' };
              break;
            }
          }
          if (playerCrashInfos[i].crashed) continue;

          // Opponent collision
          const opponentSnakeIndex = 1 - i;
          const opponentSnake = finalSnakesAtCrash[opponentSnakeIndex];
          for (let k = 0; k < opponentSnake.body.length; k++) {
            if (head.x === opponentSnake.body[k].x && head.y === opponentSnake.body[k].y) {
              playerCrashInfos[i] = { crashed: true, type: 'opponent' };
              // If head-on collision (current snake's head hits opponent's head at k=0)
              if (k === 0) {
                // Mark opponent as also crashed into an opponent, if not already self-crashed
                if (!playerCrashInfos[opponentSnakeIndex].crashed || playerCrashInfos[opponentSnakeIndex].type === 'none') {
                  playerCrashInfos[opponentSnakeIndex] = { crashed: true, type: 'opponent' };
                }
              }
              break;
            }
          }
        }
        
        const p1Crashed = playerCrashInfos[0].crashed;
        const p1CrashType = playerCrashInfos[0].type;
        const p2Crashed = playerCrashInfos[1].crashed;
        const p2CrashType = playerCrashInfos[1].type;

        if (p1Crashed || p2Crashed) {
          handleEndGameByCrash(finalSnakesAtCrash, p1Crashed, p2Crashed, p1CrashType, p2CrashType);
          return finalSnakesAtCrash.map(s => ({...s, body: s.body.map(seg => ({...seg}))}));
        }

        // Food eating and tail popping logic
        let foodEatenOnThisTick = false;
        const snakesAfterGrowthOrPop = finalSnakesAtCrash.map(snake => {
            let currentSnakeBody = [...snake.body]; // Work with a copy for this snake
            const head = currentSnakeBody[0];
            let ateFoodThisSnake = false;

            if (head.x === food.x && head.y === food.y) {
                foodEatenOnThisTick = true;
                ateFoodThisSnake = true;
                if (food.type === 'bonus') {
                    const segmentsToAdd = Math.max(0, (snake.originalLengthBeforeMove || INITIAL_SNAKE_LENGTH) -1);
                    if (segmentsToAdd > 0) {
                        const tailSegmentToReplicate = { ...currentSnakeBody[currentSnakeBody.length - 1] };
                        for (let k = 0; k < segmentsToAdd; k++) {
                            currentSnakeBody.push({ ...tailSegmentToReplicate });
                        }
                    }
                    setNextFoodShouldBeBonus(false);
                } else {
                    setNormalFoodEatenCount(prevCount => {
                        const newCount = prevCount + 1;
                        if (newCount >= POINTS_FOR_BONUS_TRIGGER) {
                            setNextFoodShouldBeBonus(true);
                            return 0;
                        }
                        return newCount;
                    });
                }
            }

            if (!ateFoodThisSnake) {
                currentSnakeBody.pop();
            }
            return { ...snake, body: currentSnakeBody };
        });
        
        if (foodEatenOnThisTick) {
            // nextFoodShouldBeBonus state is updated via setNormalFoodEatenCount's callback for the *next* spawn.
            // The current `nextFoodShouldBeBonus` state (before this tick's potential update) determined the type of food spawned *now*.
            // So, when generating new food, use the `nextFoodShouldBeBonus` state value that will be effective for the next cycle.
            // This is tricky because state updates are async.
            // For generateFood, it needs to know if the *newly spawned* food should be bonus.
            // This is determined by whether `POINTS_FOR_BONUS_TRIGGER` was hit *by eating the current normal food*.
            let isNewFoodBonus = false;
            if(food.type === 'normal') { // Only normal food counts towards bonus
                 // Check if the count *after* eating this normal food hits the trigger
                if ((normalFoodEatenCount + 1) % POINTS_FOR_BONUS_TRIGGER === 0 && normalFoodEatenCount + 1 !== 0) {
                     isNewFoodBonus = true;
                }
            }
            // If a bonus food was just eaten, the next one is normal (set by setNextFoodShouldBeBonus(false) above).
            // The `nextFoodShouldBeBonus` state will correctly reflect this for the generateFood call.
            setFood(generateFood(snakesAfterGrowthOrPop, nextFoodShouldBeBonus));
        }

        updateScores(snakesAfterGrowthOrPop);
        return snakesAfterGrowthOrPop.map(s => ({...s, body: s.body.map(seg => ({...seg}))}));
      });
    }, GAME_SPEED_MS);

    return () => clearInterval(gameInterval);
  }, [gameState, food, generateFood, normalFoodEatenCount, nextFoodShouldBeBonus, handleEndGameByCrash, handleEndGameByTimeout]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-lime-400">Dual Snake Arena</h1>
      
      {gameState === GameState.StartScreen && <StartScreen onStart={initializeGame} />}
      
      {(gameState === GameState.Playing || gameState === GameState.Paused || gameState === GameState.GameOver) && (
        <ScoreDisplay scores={scores} timeLeft={timeLeft} />
      )}

      {(gameState === GameState.Playing || gameState === GameState.Paused || (gameState === GameState.GameOver && gameResultDetails)) && (
         <GameBoard snakes={snakes} food={food} boardSize={BOARD_SIZE} />
      )}
      
      {gameState === GameState.Playing && (
        <p className="mt-4 text-sm text-gray-400">Press 'P' to Pause</p>
      )}


      {gameState === GameState.Paused && (
         <PauseScreen onResume={() => setGameState(GameState.Playing)} />
      )}
      
      {gameState === GameState.GameOver && gameResultDetails && (
        <GameOverScreen results={gameResultDetails} onRestart={initializeGame} />
      )}
    </div>
  );
};

export default App;