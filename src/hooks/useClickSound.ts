import { soundEffects } from '@/services/soundEffectsService';

/**
 * Hook to add click sound effects to buttons
 * Returns a handler that plays a click sound and calls the original handler
 */
export const useClickSound = (callback?: () => void) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundEffects.playClickSound();
    callback?.();
  };

  return handleClick;
};
