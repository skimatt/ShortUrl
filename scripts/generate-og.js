const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Canvas size
const width = 1200;
const height = 630;

// Colors
const BG = [250, 250, 248]; // #FAFAF8
const CARD_BG = [255, 255, 255]; // #FFFFFF
const BORDER = [228, 228, 231]; // #E4E4E7
const TEXT_DARK = [24, 24, 27]; // #18181B
const TEXT_MUTED = [113, 113, 122]; // #71717A
const TERRACOTTA = [217, 119, 87]; // #D97757
const TERRACOTTA_LIGHT = [253, 245, 242]; // #FDF5F2

// Create pixel buffer (RGBA)
const buffer = Buffer.alloc(width * height * 4);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const idx = (y * width + x) * 4;
  buffer[idx] = r;
  buffer[idx + 1] = g;
  buffer[idx + 2] = b;
  buffer[idx + 3] = a;
}

function fillRect(x1, y1, w, h, r, g, b, a = 255) {
  for (let y = y1; y < y1 + h; y++) {
    for (let x = x1; x < x1 + w; x++) {
      setPixel(x, y, r, g, b, a);
    }
  }
}

function drawRoundedRect(x1, y1, w, h, radius, r, g, b, a = 255) {
  for (let y = y1; y < y1 + h; y++) {
    for (let x = x1; x < x1 + w; x++) {
      const dx = Math.max(Math.abs(x - (x1 + w / 2)) - (w / 2 - radius), 0);
      const dy = Math.max(Math.abs(y - (y1 + h / 2)) - (h / 2 - radius), 0);
      if (dx * dx + dy * dy <= radius * radius) {
        setPixel(x, y, r, g, b, a);
      }
    }
  }
}

// Fill background
fillRect(0, 0, width, height, ...BG);

// Draw subtle top terracotta accent bar
fillRect(0, 0, width, 8, ...TERRACOTTA);

// Draw central elegant card
const cardW = 960;
const cardH = 430;
const cardX = Math.floor((width - cardW) / 2);
const cardY = Math.floor((height - cardH) / 2) + 4;

// Subtle card border
drawRoundedRect(cardX - 1, cardY - 1, cardW + 2, cardH + 2, 25, ...BORDER);
// Card background
drawRoundedRect(cardX, cardY, cardW, cardH, 24, ...CARD_BG);

// Badge "PERSONAL URL SHORTENER"
const badgeW = 220;
const badgeH = 40;
const badgeX = cardX + 60;
const badgeY = cardY + 60;
drawRoundedRect(badgeX, badgeY, badgeW, badgeH, 20, ...TERRACOTTA_LIGHT);

// Terracotta dot inside card
const dotRadius = 14;
const dotCenterX = cardX + 60 + dotRadius;
const dotCenterY = cardY + 160;
for (let y = dotCenterY - dotRadius; y <= dotCenterY + dotRadius; y++) {
  for (let x = dotCenterX - dotRadius; x <= dotCenterX + dotRadius; x++) {
    const d2 = (x - dotCenterX) ** 2 + (y - dotCenterY) ** 2;
    if (d2 <= dotRadius ** 2) {
      setPixel(x, y, ...TERRACOTTA);
    }
  }
}

// Draw stylized minimalist branding lines to represent clean typography
// Line 1: Main Title Block (Terracotta + Dark bar)
fillRect(cardX + 110, cardY + 148, 220, 24, ...TEXT_DARK);
fillRect(cardX + 340, cardY + 154, 16, 16, ...TERRACOTTA); // terracotta period

// Subtitle block
fillRect(cardX + 60, cardY + 215, 520, 14, ...TEXT_DARK);
fillRect(cardX + 60, cardY + 245, 380, 12, ...TEXT_MUTED);

// Input mockup bar inside the card
const inputW = cardW - 120;
const inputH = 68;
const inputX = cardX + 60;
const inputY = cardY + 300;
drawRoundedRect(inputX - 1, inputY - 1, inputW + 2, inputH + 2, 12, ...BORDER);
drawRoundedRect(inputX, inputY, inputW, inputH, 12, 250, 250, 250);

// Inner input mock text line
fillRect(inputX + 24, inputY + 28, 240, 12, 180, 180, 185);

// Shorten button mock inside input bar
const btnW = 150;
const btnH = 48;
const btnX = inputX + inputW - btnW - 10;
const btnY = inputY + 10;
drawRoundedRect(btnX, btnY, btnW, btnH, 8, ...TERRACOTTA);
fillRect(btnX + 30, btnY + 20, 90, 8, 255, 255, 255);

// Convert RGBA buffer to PNG
function createPng(w, h, rgba) {
  // Scanlines with filter byte 0 (None)
  const rowBytes = w * 4;
  const rawData = Buffer.alloc(h * (rowBytes + 1));
  for (let y = 0; y < h; y++) {
    rawData[y * (rowBytes + 1)] = 0; // Filter None
    rgba.copy(rawData, y * (rowBytes + 1) + 1, y * rowBytes, (y + 1) * rowBytes);
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }

  function chunk(type, data) {
    const typeBuf = Buffer.from(type, "ascii");
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);

    const crcBuf = Buffer.alloc(4);
    const toCrc = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(toCrc), 0);

    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // 8 bit depth
  ihdr[9] = 6; // Color type 6 (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = chunk("IHDR", ihdr);
  const idatChunk = chunk("IDAT", compressed);
  const iendChunk = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const png = createPng(width, height, buffer);
const outPath = path.join(__dirname, "../public/og-image.png");
fs.writeFileSync(outPath, png);
console.log("Successfully generated public/og-image.png! Size:", png.length, "bytes");
