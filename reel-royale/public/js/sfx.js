// Little synth blips, no audio files. Muting is remembered per phone.
import { store } from './api.js';

let ctx = null;
let muted = store.get('rr:muted') === true;

function tone(freq, dur, { type = 'triangle', gain = 0.07, at = 0, slide = 0 } = {}) {
  if (muted) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime + at;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  } catch {}
}

const buzz = (ms) => {
  if (!muted) navigator.vibrate?.(ms);
};

export const sfx = {
  get muted() {
    return muted;
  },
  toggle() {
    muted = !muted;
    store.set('rr:muted', muted);
    if (!muted) this.pop();
    return muted;
  },
  tap() {
    tone(620, 0.07);
    buzz(8);
  },
  pop() {
    tone(520, 0.08);
    tone(820, 0.1, { at: 0.06 });
    buzz(12);
  },
  drop() {
    tone(700, 0.18, { slide: 0.5 });
  },
  whoosh() {
    tone(240, 0.35, { type: 'sine', gain: 0.05, slide: 3 });
  },
  reveal() {
    [523, 659, 784].forEach((f, i) => tone(f, 0.2, { at: i * 0.09 }));
    buzz([20, 40, 20]);
  },
  upset() {
    [784, 622, 988].forEach((f, i) => tone(f, 0.22, { type: 'square', gain: 0.04, at: i * 0.1 }));
    buzz([30, 30, 60]);
  },
  coin() {
    for (let i = 0; i < 14; i++) tone(1400 + (i % 2) * 300, 0.03, { type: 'square', gain: 0.02, at: i * 0.13 });
  },
  fanfare() {
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i === 5 ? 0.6 : 0.2, { type: 'square', gain: 0.045, at: i * 0.13 }));
    buzz([40, 60, 40, 60, 120]);
  },
};
