import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { miniGamesService } from '@/services/miniGamesService';
import { storageService } from '@/services/storageService';

interface QueensGameProps {
  onBack: () => void;
  onWin: (gemsEarned: number) => void;
}

export const QueensGame = ({ onBack, onWin }: QueensGameProps) => {
  const BOARD_SIZE = 8;
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<number[][]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [hint, setHint] = useState(''); // State variable for hint is present but unused in the logic, which is fine.

  const startGame = () => {
    // Assuming miniGamesService.generateQueensPuzzle initializes an empty 8x8 board
    const { board: initialBoard } = miniGamesService.generateQueensPuzzle(BOARD_SIZE);
    setBoard(initialBoard.map(row => [...row]));
    setGameStarted(true);
    setGameWon(false);
    setHint('');
  };

  const toggleCell = (row: number, col: number) => {
    if (gameWon) return;
    
    // Create a deep copy of the board to perform mutation
    const newBoard = board.map(r => [...r]);
    
    // Toggle the cell value (0 to 1, or 1 to 0)
    newBoard[row][col] = newBoard[row][col] === 1 ? 0 : 1;
    
    setBoard(newBoard);

    // CRITICAL FIX: Only check for a win if the correct number of queens are placed.
    // This logic ensures 'checkWin' is only called when 8 queens are on the board.
    const currentQueens = newBoard.flat().filter(x => x === 1).length;

    if (currentQueens === BOARD_SIZE) {
      checkWin(newBoard);
    }
  };

  const checkWin = (boardToCheck: number[][]) => {
    // This function assumes validateQueensSolution checks for both the 8-queen count
    // and the non-attacking configuration.
    if (miniGamesService.validateQueensSolution(boardToCheck, BOARD_SIZE)) {
      setGameWon(true);
      storageService.addGems(1);
      onWin(1);
    }
  };

  const resetGame = () => {
    startGame();
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-card rounded-3xl p-6 border border-border shadow-lg">
            <h2 className="text-3xl font-black text-primary mb-2">👑 N-Queens</h2>
            <p className="text-muted-foreground mb-6">Place 8 queens on the board so that no two queens attack each other. Queens can attack horizontally, vertically, and diagonally.</p>
            <motion.button
              onClick={startGame}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg"
            >
              Start Game
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Games
        </button>

        {gameWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border-2 border-green-500 rounded-2xl p-6 mb-4 text-center"
          >
            <p className="text-2xl font-black text-green-600">🎉 You Won!</p>
            <p className="text-green-600 font-bold mt-2">Earned 💎 1 Gem</p>
            <motion.button
              onClick={resetGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
            >
              Play Again
            </motion.button>
          </motion.div>
        )}

        <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
          {/* Chessboard Rendering Area */}
          <div className="inline-block border-4 border-border">
            {board.map((row, i) => (
              <div key={i} className="flex">
                {row.map((cell, j) => (
                  <motion.button
                    key={`${i}-${j}`}
                    onClick={() => toggleCell(i, j)}
                    disabled={gameWon}
                    whileHover={!gameWon ? { scale: 1.05 } : undefined}
                    whileTap={!gameWon ? { scale: 0.95 } : undefined}
                    className={`w-12 h-12 flex items-center justify-center text-xl font-bold transition-all ${
                      (i + j) % 2 === 0 ? 'bg-muted' : 'bg-background'
                    } ${cell === 1 ? 'text-2xl' : ''} hover:opacity-80`}
                  >
                    {cell === 1 ? '👑' : ''}
                  </motion.button>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Queens placed: {board.flat().filter(x => x === 1).length}/8</p>
            {!gameWon && (
              <motion.button
                onClick={resetGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-muted text-foreground rounded-lg font-bold"
              >
                Reset
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};