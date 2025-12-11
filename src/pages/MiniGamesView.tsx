import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

import { SudokuGame } from '@/components/games/SudokuGame';
import { ZipGame } from '@/components/games/ZipGame';
import { MemoryMatchGame } from '@/components/games/MemoryMatchGame';

import { MiniGameCard } from '@/components/MiniGameCard';
import { UserStats } from '@/types';
import { storageService } from '@/services/storageService';

interface MiniGamesViewProps {
  stats: UserStats;
}

type ActiveGame = null | 'sudoku' | 'zip' | 'memory';

export const MiniGamesView = ({ stats }: MiniGamesViewProps) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [showHeartRestore, setShowHeartRestore] = useState(false);
  const [currentStats, setCurrentStats] = useState(stats);

  const refreshStats = () => {
    const updated = storageService.getStats();
    setCurrentStats(updated);
  };

  const handleGameWin = () => {
    refreshStats();
  };

  const handleBack = () => {
    setActiveGame(null);
    refreshStats();
  };

  const restoreHeart = () => {
    if (currentStats.gems >= 5 && currentStats.hearts < currentStats.maxHearts) {
      const updated = storageService.restoreHeart(5);
      setCurrentStats(updated);
    }
  };

  const restoreAllHearts = () => {
    const heartsNeeded = currentStats.maxHearts - currentStats.hearts;
    const gemsCost = heartsNeeded * 5;

    if (currentStats.gems >= gemsCost && heartsNeeded > 0) {
      const updated = storageService.restoreAllHearts(gemsCost);
      setCurrentStats(updated);
    }
  };

  // ✅ Game Routing
  if (activeGame === 'sudoku') {
    return <SudokuGame onBack={handleBack} onWin={handleGameWin} />;
  }

  if (activeGame === 'zip') {
    return <ZipGame onBack={handleBack} onWin={handleGameWin} />;
  }

  if (activeGame === 'memory') {
    return <MemoryMatchGame onBack={handleBack} onWin={handleGameWin} />;
  }

  // ✅ Main Menu
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4"
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-black text-foreground mb-2">🎮 Mini Games</h1>
          <p className="text-muted-foreground">Play games and earn gems!</p>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="sticky top-20 z-30 bg-background border-b border-border px-4 py-3"
      >
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-semibold">Gems</p>
              <p className="text-2xl font-black text-purple-500">💎 {currentStats.gems}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-semibold">Hearts</p>
              <p className="text-2xl font-black text-destructive">
                ❤️ {currentStats.hearts}/{currentStats.maxHearts}
              </p>
            </div>
          </div>

          <motion.button
            onClick={() => setShowHeartRestore(!showHeartRestore)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg font-bold"
          >
            <Heart className="w-5 h-5" />
            Restore
          </motion.button>
        </div>

        {/* Heart Restore Panel */}
        {showHeartRestore && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto mt-4 bg-card border border-border rounded-lg p-4 space-y-3"
          >
            {/* Restore 1 Heart */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-foreground">Restore 1 Heart</p>
                <p className="text-sm text-muted-foreground">5 gems</p>
              </div>
              <motion.button
                onClick={restoreHeart}
                disabled={currentStats.gems < 5 || currentStats.hearts >= currentStats.maxHearts}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Restore
              </motion.button>
            </div>

            {/* Restore All Hearts */}
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <div>
                <p className="font-bold text-foreground">Restore All Hearts</p>
                <p className="text-sm text-muted-foreground">
                  {(currentStats.maxHearts - currentStats.hearts) * 5} gems
                </p>
              </div>
              <motion.button
                onClick={restoreAllHearts}
                disabled={
                  currentStats.hearts >= currentStats.maxHearts ||
                  currentStats.gems < (currentStats.maxHearts - currentStats.hearts) * 5
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Restore
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Games Grid */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <MiniGameCard
            title="Sudoku"
            icon="🧩"
            description="Fill the 9x9 grid with numbers. Each row, column, and 3x3 box must contain all digits 1-9."
            rewardGems={1}
            onClick={() => setActiveGame('sudoku')}
          />

          <MiniGameCard
            title="ZIP"
            icon="⚡"
            description="Find the numbers that add up to the target sum within 30 seconds. Quick thinking required!"
            rewardGems={1}
            onClick={() => setActiveGame('zip')}
          />

          <MiniGameCard
            title="Memory Match"
            icon="🧠"
            description="Flip cards to find matching pairs. Test your memory and concentration!"
            rewardGems={1}
            onClick={() => setActiveGame('memory')}
          />

          <MiniGameCard
            title="More Games"
            icon="🔒"
            description="More exciting mini games are on the way! Stay tuned for updates."
            rewardGems={1}
            locked={true}
          />
        </motion.div>
      </div>
    </div>
  );
};