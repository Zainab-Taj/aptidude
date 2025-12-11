import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { miniGamesService } from '@/services/miniGamesService';
import { storageService } from '@/services/storageService';

interface SudokuGameProps {
  onBack: () => void;
  onWin: (gemsEarned: number) => void;
}

export const SudokuGame = ({ onBack, onWin }: SudokuGameProps) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [puzzle, setPuzzle] = useState<(number | null)[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const startGame = (diff: 'easy' | 'medium' | 'hard') => {
    setDifficulty(diff);
    const puzzleData = miniGamesService.generateSudokuPuzzle(diff);
    setPuzzle(puzzleData.map(row => [...row]));
    setSolution(puzzleData.map(row => [...row]));
    setGameStarted(true);
    setGameWon(false);
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    if (!puzzle[row]) return;
    const num = value === '' ? null : parseInt(value);
    if (num !== null && (num < 1 || num > 6)) return;

    const newPuzzle = puzzle.map(r => [...r]);
    newPuzzle[row][col] = num;
    setPuzzle(newPuzzle);

    // Check if solved
    if (checkSolved(newPuzzle)) {
      setGameWon(true);
      storageService.addGems(1);
      onWin(1);
    }
  };

  const checkSolved = (board: (number | null)[][]): boolean => {
    return board.every((row, i) =>
      row.every((cell, j) => cell !== null && isValidSudoku(board, i, j, cell))
    );
  };

  const isValidSudoku = (board: (number | null)[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let i = 0; i < 6; i++) {
      if (i !== col && board[row][i] === num) return false;
    }
    // Check column
    for (let i = 0; i < 6; i++) {
      if (i !== row && board[i][col] === num) return false;
    }
    // Check 2x3 box
    const boxRow = Math.floor(row / 2) * 2;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 2; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if ((i !== row || j !== col) && board[i][j] === num) return false;
      }
    }
    return true;
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameWon(false);
    setDifficulty(null);
    setPuzzle([]);
    setSolution([]);
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
            <h2 className="text-3xl font-black text-primary mb-2">🧩 Sudoku</h2>
            <p className="text-muted-foreground mb-6">Fill the grid with numbers 1-6. Each row, column, and 2x3 box must contain all digits.</p>

            <div className="space-y-3">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <motion.button
                  key={diff}
                  onClick={() => startGame(diff)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold capitalize shadow-lg"
                >
                  {diff} Mode
                </motion.button>
              ))}
            </div>
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

        <div className="bg-card rounded-2xl p-6 border border-border shadow-lg overflow-x-auto">
          <div className="inline-block">
            {puzzle.map((row, i) => (
              <div key={i} className="flex">
                {row.map((cell, j) => (
                  <input
                    key={`${i}-${j}`}
                    type="number"
                    min="1"
                    max="6"
                    value={cell === null ? '' : cell}
                    onChange={(e) => handleCellChange(i, j, e.target.value)}
                    placeholder="·"
                    disabled={solution[i][j] !== 0}
                    onClick={() => setSelectedCell([i, j])}
                    className={`w-10 h-10 text-center font-bold text-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                      solution[i][j] !== 0
                        ? 'bg-muted text-foreground cursor-default'
                        : 'bg-background text-primary'
                    } ${(j + 1) % 3 === 0 && j < 5 ? 'border-r-4' : 'border-r'} ${
                      (i + 1) % 2 === 0 && i < 5 ? 'border-b-4' : 'border-b'
                    } border-border`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
