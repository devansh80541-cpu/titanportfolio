/**
 * TITAN FX — synth UI sound engine.
 * Zero audio assets: every effect is a tiny Web Audio oscillator envelope.
 *
 * Browsers require a user gesture before audio can play, so the context is
 * created/resumed on the first pointerdown/keydown (initSoundGestures —
 * called once from FXLayer). Until then play() is a silent no-op.
 * Preference persists in localStorage under "titan-sound".
 */

export type SfxName =
  | "hover"
  | "press"
  | "open"
  | "close"
  | "chime"
  | "toggle"
  | "party"
  | "katana"
  | "overdrive"
  | "laser"
  | "spark";

const STORAGE_KEY = "titan-sound";
const MASTER_GAIN = 0.5;
const HOVER_THROTTLE_MS = 70;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let gesturesBound = false;
let lastHoverAt = 0;

function readPreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true; // storage blocked — default to on
  }
}

function writePreference(on: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // storage blocked — session-only preference
  }
}

let enabled = true; // SSR default; hydrated from storage on first client read
if (typeof window !== "undefined") enabled = readPreference();

export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  writePreference(on);
}

/** Create the AudioContext on the first user gesture. Idempotent. */
export function initSoundGestures() {
  if (typeof window === "undefined" || gesturesBound) return;
  gesturesBound = true;

  const unlock = () => {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = MASTER_GAIN;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
  };

  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
}

/** One oscillator + gain envelope. Exponential ramps = percussive blip. */
function env(
  type: OscillatorType,
  f0: number,
  f1: number,
  dur: number,
  peak: number,
  delay = 0
) {
  if (!ctx || !master) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(f0, 1), t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/** Fire a named UI sound. Silent no-op until unlocked + enabled. */
export function play(name: SfxName) {
  if (!enabled || typeof window === "undefined" || !ctx) return;
  if (ctx.state === "suspended") {
    void ctx.resume();
    return; // this exact gesture can't sound yet — the next one will
  }

  if (name === "hover") {
    const now = performance.now();
    if (now - lastHoverAt < HOVER_THROTTLE_MS) return;
    lastHoverAt = now;
    env("sine", 620, 980, 0.07, 0.02);
    return;
  }

  switch (name) {
    case "press":
      env("triangle", 340, 170, 0.09, 0.05);
      break;
    case "open":
      env("sine", 420, 840, 0.12, 0.045);
      env("sine", 630, 1260, 0.1, 0.03, 0.05);
      break;
    case "close":
      env("sine", 840, 420, 0.12, 0.04);
      env("sine", 560, 280, 0.1, 0.025, 0.04);
      break;
    case "chime":
      env("sine", 880, 880, 0.32, 0.04);
      env("sine", 1318.5, 1318.5, 0.3, 0.03, 0.09);
      break;
    case "toggle":
      env("triangle", 523, 784, 0.08, 0.04);
      break;
    case "party":
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
        env("square", f, f, 0.12, 0.028, i * 0.07)
      );
      break;
    case "katana":
      // High-speed metallic slash whoosh
      env("sawtooth", 1800, 320, 0.16, 0.06);
      env("sine", 3200, 400, 0.14, 0.04);
      break;
    case "overdrive":
      // Epic anime powerup explosion: low sub boom + high voltage surge
      env("triangle", 65, 45, 0.7, 0.12);
      env("sawtooth", 120, 1400, 0.5, 0.07, 0.05);
      env("square", 440, 880, 0.25, 0.03, 0.15);
      break;
    case "laser":
      // Cyber laser blip
      env("sawtooth", 1600, 200, 0.08, 0.05);
      break;
    case "spark":
      // Electric spark crackle
      env("square", 2400, 800, 0.05, 0.04);
      break;
  }
}