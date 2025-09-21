import { useEffect, useRef, useCallback } from "react";

// Define a custom type for the Window object that includes the webkitAudioContext property
interface CustomWindow extends Window {
  webkitAudioContext: typeof AudioContext;
}

interface SoundOptions {
  frequency?: number;
  type?: OscillatorType;
  duration?: number;
  gainValue?: number;
  attack?: number;
  release?: number;
}

interface QueuedSound extends Required<SoundOptions> {
  id: number;
}

export const useSound = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const queueRef = useRef<QueuedSound[]>([]);
  const isPlayingRef = useRef<boolean>(false);
  const soundIdRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !ctxRef.current) {
      const TypedWindow = window as unknown as CustomWindow;

      if ("AudioContext" in window) {
        ctxRef.current = new window.AudioContext();
      } else if ("webkitAudioContext" in TypedWindow) {
        ctxRef.current = new TypedWindow.webkitAudioContext();
      }
    }

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close();
      }
    };
  }, []);

  const playNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    const { frequency, type, duration, gainValue, attack, release } =
      queueRef.current.shift()!;
    const ctx = ctxRef.current;

    if (!ctx) {
      isPlayingRef.current = false;
      return;
    }

    // Resume context if suspended (required for some browsers)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Use linear ramp for more predictable behavior
    const currentTime = ctx.currentTime;
    const attackTime = Math.max(attack, 0.001);
    const releaseTime = Math.max(release, 0.001);

    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, currentTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(
      gainValue,
      currentTime + duration - releaseTime,
    );
    gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);

    osc.start(currentTime);
    osc.stop(currentTime + duration);

    // Clean up oscillator after it finishes
    osc.addEventListener("ended", () => {
      osc.disconnect();
      gainNode.disconnect();
    });

    // Schedule the next sound with a small buffer to prevent timing issues
    const nextSoundDelay = Math.max(duration * 1000 - 10, 10);
    timeoutRef.current = setTimeout(playNext, nextSoundDelay);
  }, []);

  const playSound = useCallback(
    ({
      frequency = 800,
      type = "sine",
      duration = 0.08,
      gainValue = 0.6,
      attack = 0.01,
      release = 0.07,
    }: SoundOptions = {}) => {
      const validatedParams = {
        frequency: Math.max(20, Math.min(frequency, 20000)),
        type,
        duration: Math.max(0.01, duration),
        gainValue: Math.max(0, Math.min(gainValue, 1)),
        attack: Math.max(0.001, Math.min(attack, duration * 0.5)),
        release: Math.max(0.001, Math.min(release, duration * 0.5)),
        id: soundIdRef.current++,
      };

      queueRef.current.push(validatedParams);

      if (queueRef.current.length > 50) {
        queueRef.current = queueRef.current.slice(-50);
      }

      if (!isPlayingRef.current) {
        isPlayingRef.current = true;
        playNext();
      }
    },
    [playNext],
  );

  // Multi-note chord for magical positive effect
  const playChord = useCallback(
    (frequencies: number[], duration: number = 0.4) => {
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          playSound({
            frequency: freq,
            gainValue: 0.3, // Lower individual volume since we're playing multiple
            duration: duration,
            type: "sine",
            attack: 0.02,
            release: duration * 0.6,
          });
        }, index * 50); // Slight delay between notes for magical cascade effect
      });
    },
    [playSound],
  );

  // Magical positive sound - ascending major chord with sparkle
  const playPositiveSound = useCallback(() => {
    // Play a magical ascending arpeggio (C major chord)
    const magicalChord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    playChord(magicalChord, 0.5);

    // Add a high sparkle note after
    setTimeout(() => {
      playSound({
        frequency: 1568, // G6 - sparkly high note
        gainValue: 0.25,
        duration: 0.3,
        type: "triangle",
        attack: 0.01,
        release: 0.25,
      });
    }, 300);
  }, [playChord, playSound]);

  // Gentle disappointing sound - descending minor progression
  const playNegativeSound = useCallback(() => {
    // Play a gentle descending progression (Am chord)
    const disappointedChord = [440, 523.25, 659.25, 523.25]; // A4, C5, E5, C5

    disappointedChord.forEach((freq, index) => {
      setTimeout(() => {
        playSound({
          frequency: freq,
          gainValue: 0.25,
          duration: 0.3,
          type: "triangle",
          attack: 0.05,
          release: 0.2,
        });
      }, index * 150); // Slower cascade for melancholy effect
    });

    // End with a gentle low note
    setTimeout(() => {
      playSound({
        frequency: 220, // A3 - low, gentle resolution
        gainValue: 0.2,
        duration: 0.5,
        type: "sine",
        attack: 0.1,
        release: 0.4,
      });
    }, 600);
  }, [playSound]);

  // Special celebration sound - intense musical celebration
  const playCelebrationSound = useCallback(() => {
    // Major scale run up (C major scale)
    const celebrationScale = [
      261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25,
    ]; // C4 to C5

    celebrationScale.forEach((freq, index) => {
      setTimeout(() => {
        playSound({
          frequency: freq,
          gainValue: 0.4,
          duration: 0.15,
          type: "triangle",
          attack: 0.01,
          release: 0.1,
        });
      }, index * 80);
    });

    // Grand finale chord
    setTimeout(() => {
      const grandFinale = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C major with high E
      grandFinale.forEach((freq, index) => {
        setTimeout(() => {
          playSound({
            frequency: freq,
            gainValue: 0.3,
            duration: 1.0,
            type: "sine",
            attack: 0.05,
            release: 0.8,
          });
        }, index * 20);
      });
    }, 700);
  }, [playSound]);

  // Hooray sound - enthusiastic crowd-like cheer
  const playHooraySound = useCallback(() => {
    // Start with a triumphant fanfare-like progression
    const fanfareNotes = [
      { freq: 261.63, delay: 0 }, // C4
      { freq: 329.63, delay: 100 }, // E4
      { freq: 392, delay: 200 }, // G4
      { freq: 523.25, delay: 300 }, // C5 - triumphant high
    ];

    fanfareNotes.forEach(({ freq, delay }) => {
      setTimeout(() => {
        playSound({
          frequency: freq,
          gainValue: 0.45,
          duration: 0.4,
          type: "sawtooth", // Brassy, bold sound
          attack: 0.02,
          release: 0.3,
        });
      }, delay);
    });

    // Add exciting harmonic overtones for "crowd effect"
    setTimeout(() => {
      [659.25, 783.99, 987.77].forEach((freq, index) => {
        setTimeout(() => {
          playSound({
            frequency: freq,
            gainValue: 0.25,
            duration: 0.6,
            type: "triangle",
            attack: 0.05,
            release: 0.4,
          });
        }, index * 80);
      });
    }, 400);

    // Final triumphant blast
    setTimeout(() => {
      playSound({
        frequency: 1046.5, // C6 - very high and exciting
        gainValue: 0.4,
        duration: 0.8,
        type: "square", // Bold, attention-grabbing
        attack: 0.01,
        release: 0.6,
      });
    }, 800);
  }, [playSound]);

  // Fireworks sound - play actual audio file
  const playSoundFromAudioFile = useCallback(
    (audioFilePath: string = "/sounds/fireworks.mp3") => {
      try {
        const audio = new Audio(audioFilePath);

        // Set volume and other properties
        audio.volume = 0.7;
        audio.currentTime = 0; // Start from beginning

        // Handle loading and playback
        const playAudio = async () => {
          try {
            await audio.play();
          } catch (error) {
            console.warn("Fireworks audio playback failed:", error);
            // Fallback to a simple synthetic sound if audio fails
            playSound({
              frequency: 80,
              gainValue: 0.5,
              duration: 0.8,
              type: "sawtooth",
              attack: 0.01,
              release: 0.7,
            });
          }
        };

        // If audio is already loaded, play immediately
        if (audio.readyState >= 2) {
          playAudio();
        } else {
          // Wait for audio to load
          audio.addEventListener("canplaythrough", playAudio, { once: true });

          // Fallback timeout in case audio doesn't load
          setTimeout(() => {
            if (audio.readyState < 2) {
              console.warn(
                "Fireworks audio failed to load, using synthetic fallback",
              );
              playSound({
                frequency: 80,
                gainValue: 0.5,
                duration: 0.8,
                type: "sawtooth",
                attack: 0.01,
                release: 0.7,
              });
            }
          }, 1000);
        }

        // Cleanup event listener on component unmount
        return () => {
          audio.removeEventListener("canplaythrough", playAudio);
          audio.pause();
          audio.currentTime = 0;
        };
      } catch (error) {
        console.error("Error creating fireworks audio:", error);
        // Fallback to synthetic sound
        playSound({
          frequency: 80,
          gainValue: 0.5,
          duration: 0.8,
          type: "sawtooth",
          attack: 0.01,
          release: 0.7,
        });
      }
    },
    [playSound],
  );

  const clearQueue = useCallback(() => {
    queueRef.current = [];
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    isPlayingRef.current = false;
  }, []);

  return {
    playSound,
    playPositiveSound,
    playNegativeSound,
    playCelebrationSound, // Musical celebration
    playHooraySound, // Enthusiastic cheer
    playSoundFromAudioFile, // Explosive celebration
    clearQueue,
    isPlaying: isPlayingRef.current,
  };
};
