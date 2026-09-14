// Web Audio API Procedural Synthesizer for 1998 Myanmar Hostel Atmosphere

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private isAmbientRunning: boolean = false;
  private rainNode: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  private isRainRunning: boolean = false;
  private radioBallad: HTMLAudioElement | null = null;

  private playAsset(src: string, options: { loop?: boolean; volume?: number } = {}) {
    if (this.isMuted || typeof Audio === 'undefined') return null;
    try {
      const audio = new Audio(src);
      audio.loop = Boolean(options.loop);
      audio.volume = options.volume ?? 0.45;
      void audio.play().catch(() => undefined);
      return audio;
    } catch {
      return null;
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);
    }
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setValueAtTime(this.isMuted ? 0 : 0.035, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean): boolean {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);
    }
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setValueAtTime(this.isMuted ? 0 : 0.035, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public startAmbient() {
    if (this.isAmbientRunning || this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.03, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      // Low drone osc (traditional gong/drone pitch ~ 110Hz A2)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(108, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, this.ctx.currentTime);

      osc1.connect(filter);
      filter.connect(this.ambientGain);
      osc1.start();
      this.isAmbientRunning = true;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playSeanceRainLoop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Start background drone as well
    this.startAmbient();

    if (this.isRainRunning) return;

    try {
      const bufferSize = 2 * this.ctx.sampleRate;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.15;
      }

      this.rainNode = this.ctx.createBufferSource();
      this.rainNode.buffer = buffer;
      this.rainNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(this.isMuted ? 0 : 0.035, this.ctx.currentTime);

      this.rainNode.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);

      this.rainNode.start();
      this.isRainRunning = true;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public startRainAmbient() {
    this.playSeanceRainLoop();
  }

  public stopRainAmbient() {
    if (this.rainGain && this.ctx) {
      try {
        this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch {}
    }
    if (this.rainNode) {
      try {
        this.rainNode.stop();
        this.rainNode.disconnect();
      } catch {}
      this.rainNode = null;
    }
    this.isRainRunning = false;
  }

public playBenchInspect() {
    this.playAsset('/assets/audio/sfx/bench_inspect.mp3', { volume: 0.45 });
  }

  public playLockerCreak() {
    this.playAsset('/assets/audio/sfx/locker_creak.mp3', { volume: 0.5 });
  }

  public playItemPickup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.25);
      osc2.stop(this.ctx.currentTime + 0.25);
    } catch {}
  }

  public playBatteryInsert() {
    this.playAsset('/assets/audio/sfx/battery_insert.mp3', { volume: 0.55 });
  }

  public playRadioStaticBurst() {
    this.playAsset('/assets/audio/sfx/radio_static.mp3', { volume: 0.25 });
  }

  public playDialClick() {
    this.playAsset('/assets/audio/sfx/dial_click.mp3', { volume: 0.4 });
  }

  public playRadioBallad() {
    this.stopRadioBallad();
    this.radioBallad = this.playAsset('/assets/audio/bgm/ballad_1998.mp3', { loop: true, volume: 0.5 });
  }

  public stopRadioBallad() {
    if (!this.radioBallad) return;
    try {
      this.radioBallad.pause();
      this.radioBallad.currentTime = 0;
    } catch {}
    this.radioBallad = null;
  }

  public playDoorPush() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Heavy metallic/wooden door push with low friction scrape
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(85, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(55, this.ctx.currentTime + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(140, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.38);
    } catch {}
  }

  public stopAllAmbience() {
    this.stopAmbient();
    if (this.rainGain && this.ctx) {
      try {
        this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch {}
    }
    if (this.rainNode) {
      try {
        this.rainNode.stop();
        this.rainNode.disconnect();
      } catch {}
      this.rainNode = null;
    }
    this.isRainRunning = false;
  }

  public stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch {}
    }
    this.isAmbientRunning = false;
  }

  public playKeyClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  public playChime(success: boolean = true) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      if (success) {
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.2); // E5
      } else {
        osc.frequency.setValueAtTime(220, this.ctx.currentTime); // A3
        osc.frequency.exponentialRampToValueAtTime(174.61, this.ctx.currentTime + 0.3); // F3
      }
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch {}
  }

  public playMenuHover() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Glass clink / paper scratch
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {}
  }

  public playError() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(65, this.ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {}
  }

  public playWoodTap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {}
  }

  public playMenuSelect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Heavy ritual drum/thud + eerie metallic harmonic
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(95, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.35);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.45);
      osc2.stop(this.ctx.currentTime + 0.45);
    } catch {}
  }

  public playDramaticSting() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(55, this.ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.9);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.9);
    } catch {}
  }

  public playDamage() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch {}
  }

  public playSuccessTune() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.12);
        osc.stop(this.ctx.currentTime + i * 0.12 + 0.4);
      });
    } catch {}
  }

  public playPaperRustle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 + Math.random() * 200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  public playDoorCreak() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      // Low friction pitch ramp characteristic of heavy door creak
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.linearRampToValueAtTime(190, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(85, now + 0.45);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(3.5, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }

  public playGhostWhisper() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 0.6);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(444, this.ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(316, this.ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.7);
      osc2.stop(this.ctx.currentTime + 0.7);
    } catch {}
  }

  public playCordSnap() {
    this.playAsset('/assets/audio/sfx/cord_snap.mp3', { volume: 0.5 });
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Crisp nylon cord tension snap: sudden transient burst + resonant twang
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(820, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }

  public playKeyDrop() {
    this.playAsset('/assets/audio/sfx/key_drop.mp3', { volume: 0.5 });
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Metallic brass key dropping on wet stone floor: initial clatter followed by smaller bounce
      const now = this.ctx.currentTime;
      const keyFrequencies = [2400, 3100, 1850];
      keyFrequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.12, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.2);
      });
    } catch {}
  }

  public playGlassBreak() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // 1. Noise burst for high-energy shattering impact
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1600, this.ctx.currentTime);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start();

      // 2. Low-end heavy fracture punch
      const punchOsc = this.ctx.createOscillator();
      const punchGain = this.ctx.createGain();
      punchOsc.type = 'sawtooth';
      punchOsc.frequency.setValueAtTime(180, this.ctx.currentTime);
      punchOsc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.2);
      punchGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      punchGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      punchOsc.connect(punchGain);
      punchGain.connect(this.ctx.destination);
      punchOsc.start();
      punchOsc.stop(this.ctx.currentTime + 0.2);

      // 3. Sharded resonant glass spikes
      for (let i = 0; i < 6; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2200 + i * 450 + Math.random() * 300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.18 + i * 0.04);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.22 + i * 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.015);
        osc.stop(this.ctx.currentTime + 0.28 + i * 0.04);
      }
    } catch {}
  }

  public playWaterDrop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }

  public playItemLooted() {
    if (this.isMuted) return;
    this.playAsset('/assets/audio/sfx/item_looted.mp3', { volume: 0.5 });
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Triumphant item acquisition jingle - ascending major triad
      const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      frequencies.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.3);
      });
    } catch {}
  }

  public playScareSlam() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // 1. Audio hum immediately drops to zero right before impact
      if (this.ambientGain) {
        this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      if (this.rainGain) {
        this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }

      // 2. High-impact terrifying slam: low-end sub bass drop (140Hz -> 24Hz)
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(140, this.ctx.currentTime);
      bassOsc.frequency.exponentialRampToValueAtTime(24, this.ctx.currentTime + 0.9);

      bassGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.9);

      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start();
      bassOsc.stop(this.ctx.currentTime + 0.9);

      // 3. Piercing spectral screech / distorted harmonic spikes
      const screechOsc1 = this.ctx.createOscillator();
      const screechOsc2 = this.ctx.createOscillator();
      const screechGain = this.ctx.createGain();

      screechOsc1.type = 'sawtooth';
      screechOsc1.frequency.setValueAtTime(880, this.ctx.currentTime);
      screechOsc1.frequency.linearRampToValueAtTime(1760, this.ctx.currentTime + 0.15);
      screechOsc1.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.8);

      screechOsc2.type = 'square';
      screechOsc2.frequency.setValueAtTime(895, this.ctx.currentTime);
      screechOsc2.frequency.linearRampToValueAtTime(1820, this.ctx.currentTime + 0.15);
      screechOsc2.frequency.exponentialRampToValueAtTime(210, this.ctx.currentTime + 0.8);

      screechGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      screechGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.85);

      screechOsc1.connect(screechGain);
      screechOsc2.connect(screechGain);
      screechGain.connect(this.ctx.destination);
      screechOsc1.start();
      screechOsc2.start();
      screechOsc1.stop(this.ctx.currentTime + 0.85);
      screechOsc2.stop(this.ctx.currentTime + 0.85);

      // 4. White noise blast for violent visceral impact
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);
      noise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start();
    } catch {}
  }

  public playLockJiggle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Rapid metallic padlock jiggle: two quick metallic clicks
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.05);
      osc.frequency.setValueAtTime(600, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch {}
  }

  public playKeyUnlock() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Satisfying brass lock mechanism click & spring retract
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'square';
      osc1.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.08);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(320, this.ctx.currentTime + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start(this.ctx.currentTime + 0.04);
      osc1.stop(this.ctx.currentTime + 0.1);
      osc2.stop(this.ctx.currentTime + 0.25);
    } catch {}
  }

  public playKeyTurn() {
    if (this.isMuted) return;
    this.playAsset('/assets/audio/sfx/key_turn.mp3', { volume: 0.5 });
    this.initCtx();
    if (!this.ctx) return;
    try {
      // Key insertion into brass cylinder & tumbler friction
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.06);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }

  public playPadlockOpen() {
    if (this.isMuted) return;
    this.playAsset('/assets/audio/sfx/padlock_open.mp3', { volume: 0.55 });
    this.initCtx();
    if (!this.ctx) return;
    try {
      // Padlock unlatch & spring-loaded shackle snap
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'square';
      osc1.frequency.setValueAtTime(1850, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.07);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, this.ctx.currentTime + 0.03);
      osc2.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.26);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start(this.ctx.currentTime + 0.03);
      osc1.stop(this.ctx.currentTime + 0.09);
      osc2.stop(this.ctx.currentTime + 0.26);
    } catch {}
  }

  public playChainDrop() {
    if (this.isMuted) return;
    this.playAsset('/assets/audio/sfx/chain_drop.mp3', { volume: 0.55 });
    this.initCtx();
    if (!this.ctx) return;
    try {
      // Heavy iron chain links rattling, colliding, and dropping on hard ground
      const now = this.ctx.currentTime;
      const chainFreqs = [1850, 1420, 2400, 980, 720, 310, 140];
      chainFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx % 2 === 0 ? 'triangle' : 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.18 - idx * 0.015, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.2);
      });
    } catch {}
  }

  public playMetalGateSlide() {
    if (this.isMuted) return;
    this.playAsset('/assets/audio/sfx/metal_gate_slide.mp3', { volume: 0.55 });
    this.initCtx();
    if (!this.ctx) return;
    try {
      // Scissor accordion gate screech and heavy metallic rail slide
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(460, now + 0.3);
      osc.frequency.linearRampToValueAtTime(180, now + 0.7);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch {}
  }

  public playMonsoonOutdoorAmbience() {
    if (this.isMuted) return;
    this.playAsset('/assets/audio/bgm/monsoon_outdoor_ambience.mp3', { loop: true, volume: 0.5 });
    this.initCtx();
    if (!this.ctx) return;
    try {
      this.playSeanceRainLoop();
    } catch {}
  }

  public playRainOutdoor() {
    this.playMonsoonOutdoorAmbience();
  }

  public playGateRattle() {
    if (this.isMuted) return;
    this.playAsset('/assets/audio/sfx/gate_rattle.mp3', { volume: 0.5 });
    this.initCtx();
    if (!this.ctx) return;
    try {
      this.playLockStuckRattle();
    } catch {}
  }

  public playFootstep() {
    if (this.isMuted) return;
    this.playAsset('/assets/audio/sfx/footstep_wet.mp3', { volume: 0.4 });
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public playMetalCreak() {
    if (this.isMuted) return;
    this.playAsset('/assets/audio/sfx/metal_creak.mp3', { volume: 0.5 });
    this.initCtx();
    if (!this.ctx) return;
    try {
      this.playLockerCreak();
    } catch {}
  }

  public playDrip() {
    this.playWaterDrop();
  }

  public playItemCollect() {
    this.playItemPickup();
  }

  public playInventoryAdd() {
    this.playItemLooted();
  }

  public playWoodChop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playPhaseComplete() {
    if (this.isMuted) return;
    this.playAsset('/assets/audio/sfx/phase_complete.mp3', { volume: 0.6 });
    this.initCtx();
    if (!this.ctx) return;
    try {
      // Triumphant yet eerie phase completion chime / chord (D-F#-A with high overtone)
      const now = this.ctx.currentTime;
      const chord = [146.83, 220.0, 293.66, 369.99, 1174.66];
      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx === 4 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 2.2);
      });
    } catch {
      this.playItemLooted();
    }
  }

  public playLockerDoorOpen() {
    if (this.isMuted) return;
    this.playAsset('/assets/audio/sfx/locker_door_open.mp3', { volume: 0.5 });
    this.initCtx();
    if (!this.ctx) return;
    try {
      // Sheet metal locker door swinging open on rusted hinge
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 0.2);
      osc.frequency.linearRampToValueAtTime(140, this.ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch {}
  }

  public playMetallicTumblerClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Crisp mechanical rotary tumbler notch click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {}
  }

  public playHeavyLatchClank() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Deep heavy iron/brass padlock latch release & spring clank
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'square';
      osc1.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.28);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1100, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.32);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.32);
      osc2.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }

  public playLockStuckRattle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Dull heavy shackle stuck rattle
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.setValueAtTime(160, this.ctx.currentTime + 0.06);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {}
  }

  public playCreepInsect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // High-pitch skittering / crawling insect scurry
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const pulse = Math.sin(i * 0.08) > 0.4 ? 1 : 0;
        data[i] = (Math.random() * 2 - 1) * pulse * (1 - i / bufferSize);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
      filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {}
  }

  public playMatchStrike() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Friction scraping noise burst followed by brief sizzle
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.25);
      filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {}
  }

  public playMatchSnap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Sharp wood snapping click & sudden fail dissipation
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  public playCandleIgnite() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Soft sulfur flare whoosh and warm resonant sustain
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2200, this.ctx.currentTime + 0.15);
      filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      // Add warm hum
      const humOsc = this.ctx.createOscillator();
      const humGain = this.ctx.createGain();
      humOsc.type = 'sine';
      humOsc.frequency.setValueAtTime(180, this.ctx.currentTime);
      humGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      humGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      humOsc.connect(humGain);
      humGain.connect(this.ctx.destination);

      noise.start();
      humOsc.start();
      humOsc.stop(this.ctx.currentTime + 0.5);
    } catch {}
  }

  public playBellChimeReverb() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Rich, deep bronze ceremonial bell with decaying metallic harmonics
      const freqs = [440, 880, 1320, 1760, 2640];
      const gains = [0.35, 0.25, 0.15, 0.1, 0.05];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const initialVol = gains[idx] || 0.1;
        gain.gain.setValueAtTime(initialVol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 2.8);
      });
    } catch {}
  }

  public playSpiritManifestHiss() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Soft airy spirit chime / ethereal hiss
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.9);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3600, this.ctx.currentTime + 0.4);
      filter.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.9);
      filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();

      // High spiritual bell overtone (E6 / 1318.5Hz)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.5, this.ctx.currentTime);
      oscGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch {}
  }

  public playStaticGlitch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.6);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.3 ? 0.8 : 0.1);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 0.3);
      oscGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch {}
  }

  public playGhostScreech() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Piercing spectral screech with distorted harmonic spikes & rapid pitch bend
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(1760, this.ctx.currentTime + 0.15);
      osc1.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.8);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(895, this.ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(1820, this.ctx.currentTime + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(210, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.85);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.85);
      osc2.stop(this.ctx.currentTime + 0.85);
    } catch {}
  }

  public playHollowChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Low resonant hollow chime (164Hz -> 110Hz with eerie decay)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(164.81, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 1.2);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(247.23, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(165, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 1.2);
      osc2.stop(this.ctx.currentTime + 1.2);
    } catch {}
  }

  public playEerieHum() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Deep ominous hum / drone with slow sine sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(92.5, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(65.4, this.ctx.currentTime + 1.0);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.0);
    } catch {
      this.playHollowChime();
    }
  }
}

export const sound = new AudioEngine();
