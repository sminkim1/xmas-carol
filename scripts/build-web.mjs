// Builds a standalone browser player (docs/) from compositions/painting.html.
import { readFileSync, writeFileSync, mkdirSync, cpSync } from "node:fs";

const root = new URL("../", import.meta.url);
const src = readFileSync(new URL("compositions/painting.html", root), "utf8");
let script = src.match(/<script>([\s\S]*)<\/script>/)[1];
const credit = src.match(/<div id="painting-credit"[^>]*>([\s\S]*?)<\/div>/)[1].trim().replace(/\s+/g, " ");

// Swap the GSAP timeline for a hook the player drives from the audio clock.
const from = script.indexOf("const state = { t: 0 };");
const to = script.indexOf('window.__timelines["painting"] = tl;') + 'window.__timelines["painting"] = tl;'.length;
if (from < 0 || to < from) throw new Error("timeline block not found");
script = script.slice(0, from) + "draw(0);\n        window.__paint = draw;\n        window.dispatchEvent(new Event(\"paint-ready\"));" + script.slice(to);

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>첫눈 캐롤</title>
<meta name="description" content="코드로 칠한 인상파 크리스마스 캐롤 숏츠" />
<style>
  @font-face { font-family: "Jua"; font-weight: 400; src: url("assets/fonts/Jua-Regular.ttf"); }
  @font-face { font-family: "Mountains of Christmas"; font-weight: 700; src: url("assets/fonts/MountainsofChristmas-Bold.ttf"); }
  :root { --ground: #0b1428; --ink: #fff6e0; --accent: #f7c948; }
  * { box-sizing: border-box; margin: 0; }
  html, body { height: 100%; background: var(--ground); color: var(--ink); font-family: "Jua", system-ui, sans-serif; }
  body { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 16px; }
  .stage { position: relative; height: min(88vh, calc((100vw - 32px) * 16 / 9)); aspect-ratio: 9 / 16; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,.5); }
  #painting-canvas { width: 100%; height: 100%; display: block; }
  #play { position: absolute; inset: 0; border: 0; background: rgba(11,20,40,.45); color: var(--ink); font: inherit; font-size: clamp(22px, 4vh, 36px); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
  #play span { font-size: 2.4em; color: var(--accent); }
  #play[hidden] { display: none; }
  .credit { max-width: 640px; font-family: system-ui, sans-serif; font-size: 12px; opacity: .65; text-align: center; line-height: 1.5; }
</style>
</head>
<body>
  <div class="stage">
    <canvas id="painting-canvas" width="1080" height="1920"></canvas>
    <button id="play" disabled><span>▶</span><em id="play-label">불러오는 중…</em></button>
  </div>
  <p class="credit">${credit}<br />Music, lyrics and painting code: original. Fonts: Jua, Mountains of Christmas (SIL OFL).</p>
  <audio id="carol" src="assets/carol.wav" preload="auto"></audio>
<script>${script}</script>
<script>
  const audio = document.getElementById("carol"), play = document.getElementById("play"), label = document.getElementById("play-label");
  let raf = 0;
  function loop() { window.__paint(audio.currentTime); if (!audio.paused) raf = requestAnimationFrame(loop); }
  function enable() { play.disabled = false; label.textContent = "재생"; }
  if (window.__paint) enable(); else window.addEventListener("paint-ready", enable);
  play.addEventListener("click", () => { if (audio.ended) audio.currentTime = 0; audio.play(); play.hidden = true; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); });
  audio.addEventListener("ended", () => { window.__paint(30); play.hidden = false; label.textContent = "다시 보기"; });
  document.querySelector(".stage").addEventListener("click", (e) => { if (play.contains(e.target) || !play.hidden || audio.paused) return; audio.pause(); play.hidden = false; label.textContent = "이어서 재생"; });
</script>
</body>
</html>
`;

const out = new URL("docs/", root);
mkdirSync(out, { recursive: true });
writeFileSync(new URL("index.html", out), html);
for (const p of ["assets/photos", "assets/fonts", "assets/carol.wav"]) cpSync(new URL(p, root), new URL(p, out), { recursive: true });
console.log("wrote docs/index.html");
