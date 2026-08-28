/**
 * Sensory Sound Engine for Birthday Experience
 * Procedural Web Audio API sound synthesis with zero external audio file dependencies.
 * Produces tactile, high-fidelity sound effects:
 * - Match strike & candle spark
 * - Breath gust & flame snuff
 * - Party confetti pop & sparkle chimes
 * - Cake slice porcelain clink
 * - 35mm film reel sprocket tick
 * - Mechanical camera shutter click
 * - Paper letter unfold
 * - Ambient Music Box Happy Birthday Melody
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicPlaying = false;
  private musicInterval: number | null = null;
  private isMuted = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.musicPlaying) {
      this.stopBirthdayMusic();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  /**
   * 1. Match Strike & Spark
   * Friction noise sweep + ignition snap
   */
  public playMatchStrike() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Friction noise (the scratch)
    const bufferSize = ctx.sampleRate * 0.18;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.15);
    filter.Q.value = 3.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);

    // 2. Spark Ignition Pop
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(480, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.22);

    oscGain.gain.setValueAtTime(0.0, now + 0.08);
    oscGain.gain.linearRampToValueAtTime(0.35, now + 0.1);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now + 0.08);
    osc.stop(now + 0.35);
  }

  /**
   * 2. Flame Snuff & Breath Gust
   * Soft whoosh + sizzle fade
   */
  public playFlameSnuff() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  /**
   * 3. Confetti Popper & Sparkle Chimes
   */
  public playConfettiPop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Pop thump
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);

    // Chimes cascade (pentatonic scale sparkle)
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      const chimeTime = now + 0.06 + idx * 0.045;
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();

      chimeOsc.type = "sine";
      chimeOsc.frequency.setValueAtTime(freq, chimeTime);

      chimeGain.gain.setValueAtTime(0.0, chimeTime);
      chimeGain.gain.linearRampToValueAtTime(0.18, chimeTime + 0.015);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, chimeTime + 0.7);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(chimeTime);
      chimeOsc.stop(chimeTime + 0.75);
    });
  }

  /**
   * 4. Cake Slice Clink
   * Resonant porcelain dish ping
   */
  public playCakeSliceClink() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1174.66, now); // D6
    osc.frequency.exponentialRampToValueAtTime(1160, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  /**
   * 5. 35mm Film Sprocket Click (Tick)
   * Tactile click when scrolling filmstrip
   */
  public playFilmSprocketClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(1800 + Math.random() * 300, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.02);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  /**
   * 6. Mechanical Camera Shutter Click
   * Dual actuation: mirror lift + shutter click
   */
  public playShutterClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First click (mirror)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(850, now);
    osc1.frequency.exponentialRampToValueAtTime(200, now + 0.03);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.04);

    // Second click (shutter curtain)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1400, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(300, now + 0.09);
    gain2.gain.setValueAtTime(0.25, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.11);
  }

  /**
   * 7. Paper Letter Unfold
   */

  private projectorInterval: any = null;
  private projectorGain: GainNode | null = null;
  
  public playProjector() {
    const ctx = this.getContext();
    if (!ctx || this.projectorInterval) return;
    
    this.projectorGain = ctx.createGain();
    this.projectorGain.gain.value = 0.08;
    if (ctx) this.projectorGain.connect(ctx.destination);
    
    const tick = () => {
      if (!ctx || !this.projectorGain) return;
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(200 + Math.random()*100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.05);
      
      const env = ctx.createGain();
      env.gain.setValueAtTime(1, ctx.currentTime);
      env.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      
      osc.connect(env);
      env.connect(this.projectorGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    };
    
    this.projectorInterval = setInterval(tick, 110);
  }
  
  public stopProjector() {
    if (this.projectorInterval) {
      clearInterval(this.projectorInterval);
      this.projectorInterval = null;
    }
  }

  public playPaperUnfold() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.22;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.6));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.value = 1.2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  /**
   * 8. Ambient Music Box Happy Birthday Melody
   * Synthesizes warm music-box bells with gentle reverb decay
   */
  public playBirthdayMelodyNote(frequency: number, time: number, duration = 0.8) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, time);

    // Warm second harmonic for music box bell texture
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(frequency * 2, time);

    gain.gain.setValueAtTime(0.0, time);
    gain.gain.linearRampToValueAtTime(0.16, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + duration);
    osc2.stop(time + duration);
  }

  public startBirthdayMusic() {
    if (this.musicPlaying || this.isMuted) return;
    this.musicPlaying = true;
    const ctx = this.getContext();
    if (!ctx) return;

    // Happy Birthday notes (G4, A4, B4, C5, D5, E5, F5, G5)
    const G4 = 392.0, A4 = 440.0, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;
    
    // Notes and durations [pitch, beatLength]
    const melody: [number, number][] = [
      [G4, 0.75], [G4, 0.25], [A4, 1.0], [G4, 1.0], [C5, 1.0], [B4, 2.0],
      [G4, 0.75], [G4, 0.25], [A4, 1.0], [G4, 1.0], [D5, 1.0], [C5, 2.0],
      [G4, 0.75], [G4, 0.25], [G5, 1.0], [E5, 1.0], [C5, 1.0], [B4, 1.0], [A4, 1.5],
      [F5, 0.75], [F5, 0.25], [E5, 1.0], [C5, 1.0], [D5, 1.0], [C5, 2.5],
    ];

    const playFullSong = () => {
      if (!this.musicPlaying || this.isMuted || !this.ctx) return;
      let currentTime = this.ctx.currentTime + 0.1;
      const tempo = 0.42; // Seconds per beat

      melody.forEach(([pitch, beats]) => {
        this.playBirthdayMelodyNote(pitch, currentTime, Math.max(0.6, beats * tempo * 1.5));
        currentTime += beats * tempo;
      });

      const totalDuration = (melody.reduce((acc, [, b]) => acc + b, 0) * tempo + 2.5) * 1000;
      this.musicInterval = window.setTimeout(() => {
        if (this.musicPlaying) playFullSong();
      }, totalDuration);
    };

    playFullSong();
  }

  public stopBirthdayMusic() {
    this.musicPlaying = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleBirthdayMusic(): boolean {
    if (this.musicPlaying) {
      this.stopBirthdayMusic();
      return false;
    } else {
      this.startBirthdayMusic();
      return true;
    }
  }

  public isMusicPlaying(): boolean {
    return this.musicPlaying;
  }
}

export const soundEngine = new SoundEngine();
