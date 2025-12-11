import { motion } from 'framer-motion';
import { Dices, Home } from 'lucide-react';

interface MiniGameCardProps {
  title: string;
  icon: string;
  description: string;
  rewardGems: number;
  onClick?: () => void;
  locked?: boolean;
}

export const MiniGameCard = ({
  title,
  icon,
  description,
  rewardGems,
  onClick = () => {},
  locked = false,
}: MiniGameCardProps) => {
  return (
    <motion.button
      onClick={!locked ? onClick : undefined}
      disabled={locked}
      whileHover={!locked ? { scale: 1.05, y: -4 } : undefined}
      whileTap={!locked ? { scale: 0.98 } : undefined}
      className={`relative w-full p-6 rounded-2xl border-2 transition-all ${
        locked
          ? 'opacity-50 cursor-not-allowed border-muted bg-muted/20'
          : 'border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 hover:border-primary/60 shadow-lg'
      }`}
    >
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 backdrop-blur-sm">
          <div className="text-center">
            <span className="text-3xl">🔒</span>
            <p className="text-xs font-bold text-foreground mt-2">Coming Soon</p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1 text-left">
          <h3 className="font-bold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          {!locked && (
            <div className="flex items-center gap-1 mt-3 text-sm font-bold text-purple-500">
              <span>💎 +{rewardGems}</span>
              <span className="text-xs text-muted-foreground">per win</span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
};
