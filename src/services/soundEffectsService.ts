// Sound effects service for AptiDude
// Creates and plays sound effects for different actions with cat-themed sounds

class SoundEffectsService {
  private audioContext: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private happyAudio: HTMLAudioElement | null = null;
  private sadAudio: HTMLAudioElement | null = null;

  constructor() {
    this.soundEnabled = localStorage.getItem('sound-enabled') !== 'false';
    // Initialize happy sound audio element
    this.happyAudio = new Audio('/src/assets/HappySound.mpeg');
    this.happyAudio.volume = 0.5;
    // Initialize sad sound audio element
    this.sadAudio = new Audio('/src/assets/SadSound.mpeg');
    this.sadAudio.volume = 0.5;
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  // Stop background audio files
  stopBackgroundAudio() {
    if (this.happyAudio) {
      this.happyAudio.pause();
      this.happyAudio.currentTime = 0;
    }
    if (this.sadAudio) {
      this.sadAudio.pause();
      this.sadAudio.currentTime = 0;
    }
  }

  // Play the happy sound file
  playHappySoundFile() {
    if (!this.soundEnabled || !this.happyAudio) return;

    try {
      // Reset and play the audio file
      this.happyAudio.currentTime = 0;
      this.happyAudio.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
    } catch (error) {
      console.log('Sound file not available:', error);
    }
  }

  // Play the sad sound file
  playSadSoundFile() {
    if (!this.soundEnabled || !this.sadAudio) return;

    try {
      // Reset and play the audio file
      this.sadAudio.currentTime = 0;
      this.sadAudio.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
    } catch (error) {
      console.log('Sound file not available:', error);
    }
  }

  // Happy meow sound - for correct answers
  playHappyMeow() {
    if (!this.soundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Create a happy meow sound with frequency variations
      // Meow: starts low, goes up in pitch (like a cat's meow)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Meow characteristic: pitch rise then slight fall
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(350, now + 0.15);
      osc.frequency.linearRampToValueAtTime(280, now + 0.25);
      
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);

      // Add a second shorter meow for extra happiness
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        const startTime = ctx.currentTime;
        osc2.frequency.setValueAtTime(300, startTime);
        osc2.frequency.linearRampToValueAtTime(400, startTime + 0.1);
        osc2.type = 'sine';

        gain2.gain.setValueAtTime(0.3, startTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

        osc2.start(startTime);
        osc2.stop(startTime + 0.1);
      }, 150);
    } catch (error) {
      console.log('Sound not available:', error);
    }
  }

  // Sad meow sound - for wrong answers
  playSadMeow() {
    if (!this.soundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Create a sad meow sound - starts high, goes down
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Sad meow: high pitch dropping down
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(250, now + 0.2);
      osc.frequency.linearRampToValueAtTime(200, now + 0.3);
      
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (error) {
      console.log('Sound not available:', error);
    }
  }

  // Celebratory purring sound - for perfect score
  playPurr() {
    if (!this.soundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Purring: rapid oscillations with slight variations
      // Create a warm rumbling purr sound
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const startTime = now + i * 0.12;
        
        // Purr frequency (lower for cats): around 80-150 Hz with vibrato
        osc.frequency.setValueAtTime(120 + i * 10, startTime);
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

        osc.start(startTime);
        osc.stop(startTime + 0.15);
      }
    } catch (error) {
      console.log('Sound not available:', error);
    }
  }

  // Correct answer sound - uplifting beep sequence with happy sound file
  playCorrectSound() {
    if (!this.soundEnabled) return;

    try {
      // Play the happy sound file
      this.playHappySoundFile();

      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const duration = 0.1;

      // Create three ascending beeps
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (C Major chord)
      
      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = freq;
        osc.type = 'sine';

        const startTime = now + index * 0.1;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });

      // Play happy meow alongside
      this.playHappyMeow();
    } catch (error) {
      console.log('Sound not available:', error);
    }
  }

  // Wrong answer sound - descending sad beep sequence with sad sound file
  playWrongSound() {
    if (!this.soundEnabled) return;

    try {
      // Play the sad sound file
      this.playSadSoundFile();

      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const duration = 0.15;

      // Create two descending beeps
      const frequencies = [440, 329.63]; // A4, E4 (descending)
      
      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = freq;
        osc.type = 'sine';

        const startTime = now + index * 0.15;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });

      // Play sad meow alongside
      this.playSadMeow();
    } catch (error) {
      console.log('Sound not available:', error);
    }
  }

  // Celebration sound - winning tone
  playWinSound() {
    if (!this.soundEnabled) return;

    try {
      // Play the happy sound file
      this.playHappySoundFile();

      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Play a celebratory ascending sequence
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = freq;
        osc.type = 'sine';

        const startTime = now + index * 0.12;
        const duration = 0.15;
        
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });

      // Play purr sound for celebration
      setTimeout(() => this.playPurr(), 100);
    } catch (error) {
      console.log('Sound not available:', error);
    }
  }

  // Touch/hover sound - subtle gentle tap
  playTouchSound() {
    if (!this.soundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Create a subtle touch sound: very soft, brief, and gentle
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Soft touch pitch: quick subtle pitch
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.02);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.04);
      
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (error) {
      console.log('Sound not available:', error);
    }
  }

  // Button click sound - delightful paw tap sound
  playClickSound() {
    if (!this.soundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Create a cute paw-tap sound: quick pop with slight pitch bend
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Quick upward pitch sweep (like a cute paw tap)
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.08);

      // Add a subtle second tap for extra cuteness
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        const startTime = ctx.currentTime;
        osc2.frequency.setValueAtTime(800, startTime);
        osc2.frequency.exponentialRampToValueAtTime(1200, startTime + 0.02);
        osc2.type = 'sine';

        gain2.gain.setValueAtTime(0.08, startTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);

        osc2.start(startTime);
        osc2.stop(startTime + 0.05);
      }, 30);
    } catch (error) {
      console.log('Sound not available:', error);
    }
  }
}

export const soundEffects = new SoundEffectsService();
