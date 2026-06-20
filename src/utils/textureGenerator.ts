import * as THREE from 'three';

export function pixelTexture(
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  size = 16
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    draw(ctx, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  return tex;
}

// Character Drawing helper
function drawCharacter(
  ctx: CanvasRenderingContext2D,
  s: number,
  skin: string,
  shirt: string
) {
  ctx.fillStyle = skin;
  ctx.fillRect(s * 0.32, s * 0.08, s * 0.36, s * 0.3); // head
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(s * 0.3, s * 0.05, s * 0.4, s * 0.12); // hair
  ctx.fillStyle = shirt;
  ctx.fillRect(s * 0.28, s * 0.38, s * 0.44, s * 0.34); // body
  ctx.fillStyle = '#3b3b5c';
  ctx.fillRect(s * 0.3, s * 0.72, s * 0.16, s * 0.24); // leg L
  ctx.fillRect(s * 0.54, s * 0.72, s * 0.16, s * 0.24); // leg R
  ctx.fillStyle = '#222';
  ctx.fillRect(s * 0.28, s * 0.94, s * 0.18, s * 0.06);
  ctx.fillRect(s * 0.54, s * 0.94, s * 0.18, s * 0.06);
}

// Pre-cached textures
let cachedGroundTex: THREE.CanvasTexture | null = null;
let cachedHillsTex: THREE.CanvasTexture | null = null;
let cachedCloudTex: THREE.CanvasTexture | null = null;
let cachedTreeTex: THREE.CanvasTexture | null = null;
let cachedRockTex: THREE.CanvasTexture | null = null;
let cachedPlayerTexA: THREE.CanvasTexture | null = null;
let cachedPlayerTexB: THREE.CanvasTexture | null = null;
let cachedNpcTex: THREE.CanvasTexture | null = null;
let cachedGateClosedTex: THREE.CanvasTexture | null = null;
let cachedGateOpenTex: THREE.CanvasTexture | null = null;
const cachedFlowerTextures: { [color: string]: THREE.CanvasTexture } = {};

export function getGroundTexture(): THREE.CanvasTexture {
  if (cachedGroundTex) return cachedGroundTex;
  cachedGroundTex = pixelTexture((ctx, s) => {
    ctx.fillStyle = '#4f9b3a';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#3f8a2c' : '#5fae46';
      ctx.fillRect((Math.random() * s) | 0, (Math.random() * s) | 0, 1, 1);
    }
  }, 64);
  cachedGroundTex.wrapS = THREE.RepeatWrapping;
  cachedGroundTex.wrapT = THREE.RepeatWrapping;
  cachedGroundTex.repeat.set(14, 8);
  return cachedGroundTex;
}

export function getHillsTexture(): THREE.CanvasTexture {
  if (cachedHillsTex) return cachedHillsTex;
  cachedHillsTex = pixelTexture((ctx, s) => {
    ctx.fillStyle = '#6fb0d9';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#5a9bc7';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(i * 20 + 10, s, 16, 0, Math.PI * 2);
      ctx.fill();
    }
  }, 128);
  return cachedHillsTex;
}

export function getCloudTexture(): THREE.CanvasTexture {
  if (cachedCloudTex) return cachedCloudTex;
  cachedCloudTex = pixelTexture((ctx, s) => {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.ellipse(s * 0.3, s * 0.5, s * 0.25, s * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(s * 0.55, s * 0.4, s * 0.3, s * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(s * 0.75, s * 0.55, s * 0.2, s * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();
  }, 32);
  return cachedCloudTex;
}

export function getTreeTexture(): THREE.CanvasTexture {
  if (cachedTreeTex) return cachedTreeTex;
  cachedTreeTex = pixelTexture((ctx, s) => {
    ctx.fillStyle = '#6b4226';
    ctx.fillRect(s * 0.42, s * 0.55, s * 0.16, s * 0.4);
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.arc(s * 0.5, s * 0.4, s * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#388e3c';
    ctx.beginPath();
    ctx.arc(s * 0.38, s * 0.32, s * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }, 32);
  return cachedTreeTex;
}

export function getRockTexture(): THREE.CanvasTexture {
  if (cachedRockTex) return cachedRockTex;
  cachedRockTex = pixelTexture((ctx, s) => {
    ctx.fillStyle = '#8d8d8d';
    ctx.beginPath();
    ctx.ellipse(s * 0.5, s * 0.6, s * 0.4, s * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a8a8a8';
    ctx.beginPath();
    ctx.ellipse(s * 0.4, s * 0.5, s * 0.18, s * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
  }, 16);
  return cachedRockTex;
}

export function getFlowerTexture(color: string): THREE.CanvasTexture {
  if (cachedFlowerTextures[color]) return cachedFlowerTextures[color];
  const tex = pixelTexture((ctx, s) => {
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(s * 0.47, s * 0.6, s * 0.06, s * 0.35);
    ctx.fillStyle = color;
    [
      [0.5, 0.3],
      [0.38, 0.45],
      [0.62, 0.45],
      [0.5, 0.55],
    ].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(s * x, s * y, s * 0.1, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(s * 0.5, s * 0.45, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
  }, 16);
  cachedFlowerTextures[color] = tex;
  return tex;
}

export function getPlayerTextureA(): THREE.CanvasTexture {
  if (cachedPlayerTexA) return cachedPlayerTexA;
  cachedPlayerTexA = pixelTexture((ctx, s) => drawCharacter(ctx, s, '#f1c27d', '#2196f3'), 32);
  return cachedPlayerTexA;
}

export function getPlayerTextureB(): THREE.CanvasTexture {
  if (cachedPlayerTexB) return cachedPlayerTexB;
  cachedPlayerTexB = pixelTexture((ctx, s) => {
    drawCharacter(ctx, s, '#f1c27d', '#2196f3');
    ctx.clearRect(s * 0.28, s * 0.94, s * 0.18, s * 0.06);
    ctx.clearRect(s * 0.54, s * 0.94, s * 0.18, s * 0.06);
    ctx.fillStyle = '#222';
    ctx.fillRect(s * 0.34, s * 0.92, s * 0.18, s * 0.08);
    ctx.fillRect(s * 0.48, s * 0.92, s * 0.18, s * 0.08);
  }, 32);
  return cachedPlayerTexB;
}

export function getNpcTexture(): THREE.CanvasTexture {
  if (cachedNpcTex) return cachedNpcTex;
  cachedNpcTex = pixelTexture((ctx, s) => drawCharacter(ctx, s, '#e0ac69', '#ef6c6c'), 32);
  return cachedNpcTex;
}

export function getGateTexture(open: boolean): THREE.CanvasTexture {
  if (open) {
    if (cachedGateOpenTex) return cachedGateOpenTex;
    cachedGateOpenTex = pixelTexture((ctx, s) => {
      ctx.fillStyle = '#6b4226';
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = '#8a5a32';
      for (let x = 2; x < s; x += 6) ctx.fillRect(x, 2, 3, s - 4);
      ctx.clearRect(s * 0.15, s * 0.05, s * 0.7, s * 0.9);
    }, 32);
    return cachedGateOpenTex;
  } else {
    if (cachedGateClosedTex) return cachedGateClosedTex;
    cachedGateClosedTex = pixelTexture((ctx, s) => {
      ctx.fillStyle = '#6b4226';
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = '#8a5a32';
      for (let x = 2; x < s; x += 6) ctx.fillRect(x, 2, 3, s - 4);
      ctx.fillStyle = 'rgba(255,215,0,0.5)';
      ctx.fillRect(s * 0.42, s * 0.1, s * 0.16, s * 0.8);
    }, 32);
    return cachedGateClosedTex;
  }
}
