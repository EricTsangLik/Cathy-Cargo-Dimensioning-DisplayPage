import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../public/mock-images/', import.meta.url);
const COUNT = 12;

function color(id, offset = 0) {
  return `hsl(${(id * 47 + offset) % 360} 76% 48%)`;
}

function depthSvg(id) {
  const length = 1100 + (id % 5) * 25;
  const width = 760 + (id % 4) * 20;
  const height = 920 + (id % 6) * 18;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#101827"/>
      <stop offset="0.52" stop-color="${color(id)}"/>
      <stop offset="1" stop-color="${color(id, 220)}"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <g opacity="0.22" stroke="#fff" stroke-width="2">
    <path d="M0 120H1280M0 240H1280M0 360H1280M0 480H1280M0 600H1280"/>
    <path d="M160 0V720M320 0V720M480 0V720M640 0V720M800 0V720M960 0V720M1120 0V720"/>
  </g>
  <g transform="translate(${260 + (id % 5) * 10} ${150 + (id % 4) * 12})">
    <polygon points="230,120 560,44 800,178 448,282" fill="#06111d" opacity="0.42"/>
    <polygon points="230,110 560,34 800,170 448,272" fill="${color(id, 110)}"/>
    <polygon points="230,110 448,272 448,500 230,326" fill="${color(id)}"/>
    <polygon points="448,272 800,170 800,404 448,500" fill="${color(id, 220)}"/>
    <g fill="none" stroke="#fff" stroke-width="8" opacity="0.82">
      <path d="M286 154 452 262 452 458"/>
      <path d="M560 78 728 172"/>
      <path d="M534 294 740 236"/>
    </g>
  </g>
  <g fill="#fff" font-family="Inter, Arial, sans-serif">
    <text x="58" y="74" font-size="32" font-weight="700">Measurement Device Feed</text>
    <text x="58" y="118" font-size="22" opacity="0.78">Depth image scan #${id}</text>
    <text x="58" y="660" font-size="22" opacity="0.86">L ${length} mm / W ${width} mm / H ${height} mm</text>
  </g>
</svg>`;
}

function ocrSvg(id) {
  const palletId = `PLT-DEMO-${String(id).padStart(4, '0')}`;
  const bars = Array.from({ length: 18 }, (_, index) => {
    const width = 10 + ((id + index * 7) % 5) * 8;
    const x = 52 + index * 42;
    return `<rect x="${x}" y="218" width="${width}" height="82"/>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="#17202a"/>
  <rect x="86" y="78" width="1108" height="564" rx="18" fill="${color(id, 80)}"/>
  <rect x="126" y="118" width="1028" height="484" rx="10" fill="#e8edf3"/>
  <g transform="translate(${210 + (id % 4) * 12} ${180 + (id % 3) * 18})">
    <rect x="0" y="0" width="860" height="352" rx="18" fill="#fff"/>
    <text x="48" y="84" fill="#1a1a1a" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="700">PALLET ID</text>
    <text x="48" y="154" fill="${color(id, 190)}" font-family="Inter, Arial, sans-serif" font-size="56" font-weight="800">${palletId}</text>
    <g fill="#111827">${bars}</g>
    <text x="48" y="330" fill="#6c757d" font-family="Inter, Arial, sans-serif" font-size="20">OCR image scan #${id}</text>
  </g>
  <g fill="none" stroke="#28a745" stroke-width="8" opacity="0.9">
    <path d="M172 150h120M172 150v90"/>
    <path d="M1108 150h-120M1108 150v90"/>
    <path d="M172 570h120M172 570v-90"/>
    <path d="M1108 570h-120M1108 570v-90"/>
  </g>
</svg>`;
}

mkdirSync(join(ROOT.pathname, 'ocr'), { recursive: true });
mkdirSync(join(ROOT.pathname, 'depth'), { recursive: true });

for (let id = 1; id <= COUNT; id += 1) {
  writeFileSync(join(ROOT.pathname, 'ocr', `${id}.svg`), ocrSvg(id));
  writeFileSync(join(ROOT.pathname, 'depth', `${id}.svg`), depthSvg(id));
}

console.log(`Generated ${COUNT * 2} demo images in public/mock-images`);
