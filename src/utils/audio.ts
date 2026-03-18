import * as Tone from 'tone';

class AudioEngine {
  private static instance: AudioEngine;
  private synth: Tone.PolySynth;
  private isInitialized = false;

  private constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth, {
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.1,
        release: 1
      }
    }).toDestination();
    this.synth.volume.value = -18; // Soft volume for UI interactions
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public async init() {
    if (this.isInitialized) return;
    try {
      await Tone.start();
      console.log('Audio engine initialized');
      this.isInitialized = true;
    } catch (e) {
      console.warn('Failed to initialize audio:', e);
    }
  }

  public playHoverSound() {
    if (!this.isInitialized) return;
    try {
      this.synth.triggerAttackRelease("C5", "64n");
    } catch (e) {
      console.warn('Hover sound failed:', e);
    }
  }

  public playClickSound() {
    if (!this.isInitialized) return;
    try {
      this.synth.triggerAttackRelease(["E5", "G5"], "16n");
    } catch (e) {
      console.warn('Click sound failed:', e);
    }
  }
}

export const audioEngine = AudioEngine.getInstance();
