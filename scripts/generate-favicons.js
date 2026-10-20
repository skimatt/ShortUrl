const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b111e" />
      <stop offset="100%" stop-color="#141c2e" />
    </linearGradient>
    <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e07a5f" />
      <stop offset="100%" stop-color="#d46a4a" />
    </linearGradient>
  </defs>

  <!-- Squircle Base with Subtle Border -->
  <rect width="64" height="64" rx="16" fill="url(#bgGrad)" />
  <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="15.25" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5" />

  <!-- Soft Ambient Glow behind the Terracotta Dot -->
  <circle cx="48" cy="16" r="9" fill="#d46a4a" opacity="0.35" />

  <!-- Aesthetic Minimal Link Geometry (45-deg Chain) -->
  <g stroke="#f8fafc" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left Loop -->
    <path d="M25 33 L21.5 36.5 C18.5 39.5 18.5 44.5 21.5 47.5 C24.5 50.5 29.5 50.5 32.5 47.5 L36 44" />
    <!-- Right Loop -->
    <path d="M28 20 L31.5 16.5 C34.5 13.5 39.5 13.5 42.5 16.5 C45.5 19.5 45.5 24.5 42.5 27.5 L39 31" />
    <!-- Connecting Bridge -->
    <path d="M26 38 L38 26" />
  </g>

  <!-- Signature Terracotta Dot representing 'links.' -->
  <circle cx="48" cy="16" r="4.5" fill="url(#terracottaGrad)" />
  <circle cx="46.8" cy="14.8" r="1.5" fill="#ffffff" opacity="0.7" />
</svg>
`;

// Save SVG to app/icon.svg and public/icon.svg
fs.writeFileSync(path.join(__dirname, "../app/icon.svg"), svgContent.trim());
fs.writeFileSync(path.join(__dirname, "../public/icon.svg"), svgContent.trim());
console.log("Created app/icon.svg and public/icon.svg");

// Function to generate standard PNG buffer
function createPng(w, h, rgba) {
  const rowBytes = w * 4;
  const rawData = Buffer.alloc(h * (rowBytes + 1));
  for (let y = 0; y < h; y++) {
    rawData[y * (rowBytes + 1)] = 0;
    rgba.copy(rawData, y * (rowBytes + 1) + 1, y * rowBytes, (y + 1) * rowBytes);
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });

  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Render raster 32x32 icon for standard .ico fallback
const size = 32;
const buffer = Buffer.alloc(size * size * 4);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= size || y < 0 || y >= size) return;
  const idx = (y * size + x) * 4;
  buffer[idx] = r;
  buffer[idx + 1] = g;
  buffer[idx + 2] = b;
  buffer[idx + 3] = a;
}

// Background squircle (radius 7 on 32x32)
const BG_COLOR = [11, 17, 30]; // #0b111e
const BORDER_COLOR = [255, 255, 255, 30];
const WHITE = [248, 250, 252];
const TERRACOTTA = [224, 122, 95];

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const rx = 7;
    const dx = Math.max(Math.abs(x - (size / 2 - 0.5)) - (size / 2 - rx), 0);
    const dy = Math.max(Math.abs(y - (size / 2 - 0.5)) - (size / 2 - rx), 0);
    const distSq = dx * dx + dy * dy;

    if (distSq <= rx * rx) {
      if (distSq >= (rx - 1) * (rx - 1)) {
        setPixel(x, y, 35, 45, 65, 255);
      } else {
        setPixel(x, y, ...BG_COLOR);
      }
    }
  }
}

// Draw diagonal chain link
function drawLine(x0, y0, x1, y1, color, r = 1.2) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.ceil(dist * 3);
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const cx = x0 + dx * t;
    const cy = y0 + dy * t;
    for (let py = Math.floor(cy - r); py <= Math.ceil(cy + r); py++) {
      for (let px = Math.floor(cx - r); px <= Math.ceil(cx + r); px++) {
        if ((px - cx) ** 2 + (py - cy) ** 2 <= r * r) {
          setPixel(px, py, ...color);
        }
      }
    }
  }
}

// Lower-left loop
drawLine(12, 17, 10, 19, WHITE, 1.1);
drawLine(10, 19, 10, 22, WHITE, 1.1);
drawLine(10, 22, 13, 24, WHITE, 1.1);
drawLine(13, 24, 16, 24, WHITE, 1.1);
drawLine(16, 24, 18, 22, WHITE, 1.1);

// Upper-right loop
drawLine(14, 10, 16, 8, WHITE, 1.1);
drawLine(16, 8, 19, 8, WHITE, 1.1);
drawLine(19, 8, 22, 11, WHITE, 1.1);
drawLine(22, 11, 22, 14, WHITE, 1.1);
drawLine(22, 14, 20, 16, WHITE, 1.1);

// Center bridge
drawLine(13, 19, 19, 13, WHITE, 1.1);

// Signature Terracotta Dot
for (let y = 5; y <= 9; y++) {
  for (let x = 22; x <= 26; x++) {
    if ((x - 24) ** 2 + (y - 7) ** 2 <= 2.2 ** 2) {
      setPixel(x, y, ...TERRACOTTA);
    }
  }
}
setPixel(23, 6, 255, 255, 255, 220); // highlight

const pngBuffer = createPng(size, size, buffer);

// Create ICO container holding the PNG
function createIco(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(1, 4); // 1 Image

  const entry = Buffer.alloc(16);
  entry[0] = 32; // Width 32
  entry[1] = 32; // Height 32
  entry[2] = 0; // Colors (0 = 256+)
  entry[3] = 0; // Reserved
  entry.writeUInt16LE(1, 4); // Color planes
  entry.writeUInt16LE(32, 6); // Bits per pixel
  entry.writeUInt32LE(png.length, 8); // Image size in bytes
  entry.writeUInt32LE(6 + 16, 12); // Image data offset

  return Buffer.concat([header, entry, png]);
}

const icoBuffer = createIco(pngBuffer);

// Write favicon.ico to app and public
fs.writeFileSync(path.join(__dirname, "../app/favicon.ico"), icoBuffer);
fs.writeFileSync(path.join(__dirname, "../public/favicon.ico"), icoBuffer);
console.log("Created app/favicon.ico and public/favicon.ico");
