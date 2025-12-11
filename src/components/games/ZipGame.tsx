import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { miniGamesService } from '@/services/miniGamesService';
import { storageService } from '@/services/storageService';

interface ZipGameProps {
  onBack: () => void;
  onWin: (gemsEarned: number) => void;
}

export const ZipGame = ({ onBack, onWin }: ZipGameProps) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [target, setTarget] = useState(0);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          setWon(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  const startGame = () => {
    const game = miniGamesService.generateZipGame();
    setTarget(game.target);
    setNumbers(game.numbers);
    setSelected([]);
    setTimeLeft(30);
    setGameStarted(true);
    setGameOver(false);
    setWon(false);
  };

  const toggleNumber = (index: number) => {
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  const submitAnswer = () => {
    const sum = selected.reduce((acc, idx) => acc + numbers[idx], 0);
    if (sum === target) {
      setWon(true);
      setGameOver(true);
      storageService.addGems(1);
      onWin(1);
    } else {
      setWon(false);
      setGameOver(true);
    }
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
            <h2 className="text-3xl font-black text-primary mb-2">⚡ ZIP</h2>
            <p className="text-muted-foreground mb-6">Find the numbers that add up to the target sum within 30 seconds!</p>
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
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Games
        </button>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-lg mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Target</p>
              <p className="text-4xl font-black text-primary">{target}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Time Left</p>
              <p className={`text-4xl font-black ${timeLeft > 10 ? 'text-accent' : 'text-destructive'}`}>
                {timeLeft}s
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {numbers.map((num, idx) => (
              <motion.button
                key={idx}
                onClick={() => !gameOver && toggleNumber(idx)}
                disabled={gameOver}
                whileHover={!gameOver ? { scale: 1.1 } : undefined}
                whileTap={!gameOver ? { scale: 0.95 } : undefined}
                className={`py-4 rounded-lg font-bold text-lg transition-all ${
                  selected.includes(idx)
                    ? 'bg-primary text-primary-foreground scale-110'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {num}
              </motion.button>
            ))}
          </div>

          {!gameOver && (
            <motion.button
              onClick={submitAnswer}
              disabled={selected.length === 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-bold disabled:opacity-50"
            >
              Submit ({selected.reduce((acc, idx) => acc + numbers[idx], 0)})
            </motion.button>
          )}
        </div>

        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-6 border-2 text-center ${
              won
                ? 'bg-green-500/10 border-green-500'
                : 'bg-destructive/10 border-destructive'
            }`}
          >
            <p className={`text-2xl font-black mb-2 ${won ? 'text-green-600' : 'text-destructive'}`}>
              {won ? '🎉 Correct!' : '❌ Game Over'}
            </p>
            {won && <p className="text-green-600 font-bold mb-4">Earned 💎 1 Gem</p>}
            <motion.button
              onClick={() => startGame()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold"
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
