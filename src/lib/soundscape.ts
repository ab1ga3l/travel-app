"use client";
// Generated ambient soundscapes (no audio files): ocean, forest, city, market, waterfall, wind.
// Everything is synthesized with the Web Audio API from filtered noise and simple oscillators.
import type { Sound } from "./gems";

type Ctx = AudioContext;

function noise(ctx: Ctx, kind: "white" | "pink" | "brown", seconds = 4) {
  const len = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0, last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === "white") d[i] = w;
      else if (kind === "pink") {
        b0 = 0.997 * b0 + w * 0.029591; b1 = 0.985 * b1 + w * 0.032534; b2 = 0.95 * b2 + w * 0.048056;
        d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.9;
      } else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    }
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  return src;
}

function filter(ctx: Ctx, type: BiquadFilterType, freq: number, q = 0.7) {
  const f = ctx.createBiquadFilter();
  f.type = type; f.frequency.value = freq; f.Q.value = q;
  return f;
}

function lfo(ctx: Ctx, rate: number, depth: number, target: AudioParam) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.value = rate; g.gain.value = depth;
  o.connect(g).connect(target);
  o.start();
  return o;
}

export class Soundscape {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private stops: (() => void)[] = [];
  private timers: number[] = [];

  async play(sound: Sound) {
    this.stop();
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;
    this.ctx = this.ctx ?? new AC();
    const ctx = this.ctx;
    if (ctx.state === "suspended") await ctx.resume();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.5);
    this.master = master;

    const bed = (kind: "white" | "pink" | "brown", f: BiquadFilterNode[], gain: number) => {
      const s = noise(ctx, kind);
      const g = ctx.createGain();
      g.gain.value = gain;
      let node: AudioNode = s;
      for (const x of f) { node.connect(x); node = x; }
      node.connect(g).connect(master);
      s.start();
      this.stops.push(() => s.stop());
      return g;
    };
    const every = (min: number, max: number, fn: () => void) => {
      const tick = () => { fn(); this.timers.push(window.setTimeout(tick, min + Math.random() * (max - min))); };
      this.timers.push(window.setTimeout(tick, min));
    };
    const L = (rate: number, depth: number, target: AudioParam) => { const o = lfo(ctx, rate, depth, target); this.stops.push(() => o.stop()); };
    const chirp = (from: number, to: number, dur: number, vol: number, type: OscillatorType = "sine") => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const p = ctx.createStereoPanner();
      p.pan.value = Math.random() * 1.6 - 0.8;
      o.type = type;
      const t = ctx.currentTime;
      o.frequency.setValueAtTime(from, t);
      o.frequency.exponentialRampToValueAtTime(to, t + dur);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(p).connect(master);
      o.start(t); o.stop(t + dur + 0.05);
    };

    switch (sound) {
      case "ocean": {
        const g = bed("brown", [filter(ctx, "lowpass", 700)], 0.5);
        L(0.09, 0.35, g.gain);
        const hiss = bed("white", [filter(ctx, "highpass", 2500), filter(ctx, "lowpass", 7000)], 0.04);
        L(0.09, 0.035, hiss.gain);
        every(4000, 9000, () => chirp(1800, 1400, 0.5, 0.02)); // distant gull
        break;
      }
      case "forest": {
        bed("pink", [filter(ctx, "bandpass", 900, 0.5)], 0.12);
        every(400, 2200, () => { const f = 2200 + Math.random() * 2200; chirp(f, f * (0.7 + Math.random() * 0.6), 0.08 + Math.random() * 0.12, 0.05); });
        every(5000, 12000, () => { for (let i = 0; i < 3; i++) setTimeout(() => chirp(1300, 900, 0.18, 0.04, "triangle"), i * 220); });
        break;
      }
      case "city": {
        bed("brown", [filter(ctx, "lowpass", 280)], 0.6);
        bed("pink", [filter(ctx, "bandpass", 1200, 0.4)], 0.05);
        every(5000, 11000, () => { chirp(392, 392, 0.35, 0.025, "square"); setTimeout(() => chirp(330, 330, 0.3, 0.02, "square"), 380); });
        break;
      }
      case "market": {
        const g = bed("pink", [filter(ctx, "bandpass", 700, 0.6), filter(ctx, "lowpass", 2500)], 0.22);
        L(0.7, 0.06, g.gain);
        L(1.9, 0.04, g.gain);
        every(700, 2600, () => chirp(2400 + Math.random() * 900, 2400, 0.12, 0.025, "triangle")); // clinks
        every(6000, 14000, () => chirp(220, 180, 0.6, 0.03, "sawtooth")); // a distant call
        break;
      }
      case "waterfall": {
        bed("white", [filter(ctx, "highpass", 300), filter(ctx, "lowpass", 6500)], 0.22);
        bed("brown", [filter(ctx, "lowpass", 400)], 0.45);
        every(1500, 4000, () => { const f = 3000 + Math.random() * 1500; chirp(f, f * 0.8, 0.1, 0.02); });
        break;
      }
      case "wind": {
        const f = filter(ctx, "bandpass", 500, 1.2);
        const g = bed("pink", [f], 0.5);
        L(0.07, 350, f.frequency);
        L(0.11, 0.25, g.gain);
        break;
      }
    }
    return true;
  }

  stop() {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
    const ctx = this.ctx;
    const m = this.master;
    const stops = this.stops;
    this.stops = [];
    this.master = null;
    if (ctx && m) {
      m.gain.cancelScheduledValues(ctx.currentTime);
      m.gain.setValueAtTime(m.gain.value, ctx.currentTime);
      m.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      setTimeout(() => { stops.forEach((s) => { try { s(); } catch {} }); m.disconnect(); }, 700);
    }
  }
}
