import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { storageService } from '@/services/storageService';

interface MemoryMatchGameProps {
  onBack: () => void;
  onWin: (gemsEarned: number) => void;
}

interface Card {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatchGame = ({ onBack, onWin }: MemoryMatchGameProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const emojis = ['🐟', '🐱', '🦴', '😻', '🍤', '🐾'];

  const initializeGame = () => {
    const cardPairs = [...emojis, ...emojis];

    const shuffledCards = cardPairs
      .map((emoji) => ({
        id: crypto.randomUUID(),
        value: emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
    setGameStarted(true);
  };

  const handleCardClick = (cardId: string) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;

    const clickedCard = cards.find((c) => c.id === cardId);
    if (!clickedCard || clickedCard.isMatched) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // ✅ MATCH FOUND
        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card
            );

            // ✅ WIN CHECK (correct state)
            if (updated.every((card) => card.isMatched)) {
              setGameWon(true);
              storageService.addGems(1);
              onWin(1);
            }

            return updated;
          });

          setFlippedCards([]);
        }, 500);
      } else {
        // ❌ NO MATCH
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => initializeGame();

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
            <h2 className="text-3xl font-black text-primary mb-2">🧠 Memory Match</h2>
            <p className="text-muted-foreground mb-6">
              Flip cards to find matching pairs. Test your memory and concentration!
            </p>
            <motion.button
              onClick={initializeGame}
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
    <div className="min-h-screen bg-background p-4 flex flex-col items-center overflow-y-auto">
      <div className="w-full max-w-md flex-shrink-0">
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
              <p className="text-sm text-muted-foreground">Moves</p>
              <p className="text-2xl font-black text-primary">{moves}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Pairs Left</p>
              <p className="text-2xl font-black text-accent">
                {cards.filter((c) => !c.isMatched).length / 2}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {cards.map((card) => (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isMatched || flippedCards.length === 2}
                whileHover={
                  !card.isMatched && flippedCards.length < 2
                    ? { scale: 1.05 }
                    : undefined
                }
                whileTap={
                  !card.isMatched && flippedCards.length < 2
                    ? { scale: 0.95 }
                    : undefined
                }
                className={`aspect-square rounded-lg font-bold text-3xl transition-all duration-300 ${
                  card.isFlipped || card.isMatched
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                } ${card.isMatched ? 'opacity-75' : ''}`}
              >
                {card.isFlipped || card.isMatched ? card.value : '?'}
              </motion.button>
            ))}
          </div>
        </div>

        {gameWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border-2 border-green-500 rounded-2xl p-6 text-center"
          >
            <p className="text-2xl font-black text-green-600 mb-2">🎉 You Won!</p>
            <p className="text-green-600 font-bold mb-4">Earned 💎 1 Gem</p>
            <p className="text-muted-foreground mb-4">Completed in {moves} moves</p>
            <motion.button
              onClick={resetGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};