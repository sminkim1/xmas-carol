// Music box carol, 6/8, eighth = 0.25 s, bar = 1.5 s, 20 bars = 30 s. Original melody.
import { writeFileSync, mkdirSync } from "node:fs";

const SR = 44100, DUR = 30, E = 0.25, BAR = 1.5;
const buf = new Float32Array(SR * DUR);
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const N = { G4: 67, A4: 69, C5: 72, D5: 74, E5: 76, F5: 77, G5: 79, A5: 81, C6: 84 };

function tone(t0, midi, gain, partials, decay) {
  const f = hz(midi), start = Math.floor(t0 * SR), len = Math.floor(SR * 3.5);
  for (let i = 0; i < len && start + i < buf.length; i++) {
    const t = i / SR, att = Math.min(1, t / 0.004);
    let s = 0;
    for (const [r, a, d] of partials) s += a * Math.sin(2 * Math.PI * f * r * t) * Math.exp(-t * d * decay);
    buf[start + i] += gain * att * s;
  }
}
const musicBox = [[1, 1, 1.6], [2.76, 0.35, 4], [5.4, 0.12, 7]];
const bell = [[1, 1, 0.9], [2.0, 0.5, 1.2], [2.4, 0.35, 1.6], [3.0, 0.25, 2], [4.5, 0.15, 3]];
const soft = [[1, 1, 1.2], [2, 0.2, 2.5]];

const melody = [
  ["G4",2,"C5",1,"E5",2,"D5",1], ["C5",3,"G4",3], ["A4",2,"C5",1,"F5",2,"E5",1], ["D5",6],
  ["G4",2,"C5",1,"E5",2,"G5",1], ["A5",3,"G5",3], ["F5",2,"E5",1,"D5",2,"C5",1], ["D5",6],
  ["E5",2,"E5",1,"E5",2,"D5",1], ["C5",2,"D5",1,"E5",3], ["F5",2,"F5",1,"F5",2,"E5",1], ["D5",6],
  ["G5",3,"E5",3], ["G5",3,"E5",3], ["A5",2,"G5",1,"F5",2,"E5",1], ["D5",3,"G5",3],
  ["C6",3,"G5",3], ["E5",2,"F5",1,"D5",3], ["C5",6], [],
];
melody.forEach((bar, b) => {
  let e = 0;
  for (let i = 0; i < bar.length; i += 2) {
    tone(b * BAR + e * E, N[bar[i]], 0.32, musicBox, 1);
    e += bar[i + 1];
  }
});

// Bass: root on beat 1, fifth on beat 2 (dotted quarters).
const roots = [48,48,53,55, 48,53,50,55, 48,48,53,55, 48,45,53,55, 48,53,48,48];
roots.forEach((r, b) => {
  tone(b * BAR, r, 0.22, soft, 1);
  if (b < 19) tone(b * BAR + 0.75, r + 7, 0.14, soft, 1);
});
// Arpeggio sparkle in the last bars.
[60, 64, 67, 72, 76, 79, 84].forEach((m, i) => tone(27 + i * 0.12, m, 0.12, musicBox, 0.8));

// Bells from the chorus on (bar 12 = 18 s); the star hit at 21 s is the strongest.
for (let b = 12; b <= 18; b++) tone(b * BAR, roots[b] + 24, b === 14 ? 0.3 : 0.16, bell, 1);

// Fade, normalise to -1.5 dBFS, write 16-bit WAV.
for (let i = 0; i < buf.length; i++) {
  const t = i / SR;
  if (t < 0.02) buf[i] *= t / 0.02;
  if (t > DUR - 2) buf[i] *= Math.max(0, (DUR - t) / 2);
}
let peak = 0;
for (const v of buf) peak = Math.max(peak, Math.abs(v));
const g = Math.pow(10, -1.5 / 20) / peak;
const data = Buffer.alloc(buf.length * 2);
buf.forEach((v, i) => data.writeInt16LE(Math.round(Math.tanh(v * g * 1.05) * 32000), i * 2));
const h = Buffer.alloc(44);
h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVEfmt ", 8);
h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
h.write("data", 36); h.writeUInt32LE(data.length, 40);
mkdirSync(new URL("../assets/", import.meta.url), { recursive: true });
writeFileSync(new URL("../assets/carol.wav", import.meta.url), Buffer.concat([h, data]));
console.log("wrote assets/carol.wav");
