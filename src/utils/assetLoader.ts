import * as THREE from 'three';

export function loadTextureSafely(
  url: string,
  fallbackDraw: (ctx: CanvasRenderingContext2D, size: number) => void,
  size = 16
): THREE.Texture {
  const loader = new THREE.TextureLoader();
  
  // Create the canvas fallback texture first
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    fallbackDraw(ctx, size);
  }
  const fallbackTex = new THREE.CanvasTexture(canvas);
  fallbackTex.magFilter = THREE.NearestFilter;
  fallbackTex.minFilter = THREE.NearestFilter;

  // Load actual texture
  const texture = loader.load(
    url,
    // onLoad
    (loadedTexture) => {
      loadedTexture.magFilter = THREE.NearestFilter;
      loadedTexture.minFilter = THREE.NearestFilter;
      loadedTexture.needsUpdate = true;
    },
    // onProgress
    undefined,
    // onError
    () => {
      console.warn(`Failed to load texture at ${url}. Using procedural fallback.`);
      texture.image = canvas as any;
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.needsUpdate = true;
    }
  );

  return texture;
}

// Fallback graphic generators
export function drawSkyFallback(ctx: CanvasRenderingContext2D, size: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, '#75c3ec');
  grad.addColorStop(1, '#a6dcf2');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
}

export function drawMountainsFallback(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#518cb3';
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, size * 0.5);
  ctx.quadraticCurveTo(size * 0.25, size * 0.3, size * 0.5, size * 0.55);
  ctx.quadraticCurveTo(size * 0.75, size * 0.2, size, size * 0.45);
  ctx.lineTo(size, size);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#427494';
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, size * 0.75);
  ctx.quadraticCurveTo(size * 0.3, size * 0.6, size * 0.6, size * 0.78);
  ctx.quadraticCurveTo(size * 0.8, size * 0.5, size, size * 0.7);
  ctx.lineTo(size, size);
  ctx.closePath();
  ctx.fill();
}

export function drawTreesFallback(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#2c6d48';
  
  const drawTree = (x: number, y: number, w: number, h: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - w / 2, y + h);
    ctx.lineTo(x + w / 2, y + h);
    ctx.closePath();
    ctx.fill();
  };

  drawTree(size * 0.25, size * 0.4, size * 0.3, size * 0.6);
  drawTree(size * 0.6, size * 0.3, size * 0.4, size * 0.7);
  drawTree(size * 0.85, size * 0.45, size * 0.25, size * 0.55);
}

export function drawBushesFallback(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#3a8758';
  
  const drawBush = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  };

  drawBush(size * 0.2, size * 0.8, size * 0.25);
  drawBush(size * 0.4, size * 0.75, size * 0.28);
  drawBush(size * 0.55, size * 0.85, size * 0.22);
  drawBush(size * 0.75, size * 0.8, size * 0.3);
  ctx.fillRect(0, size * 0.8, size, size * 0.2);
}

export function drawForegroundFallback(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#4fa838';
  ctx.fillRect(0, size * 0.9, size, size * 0.1);

  // Draw some basic grass lines
  ctx.strokeStyle = '#4fa838';
  ctx.lineWidth = 2;
  const drawTuft = (x: number, y: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 4, y - 8);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 10);
    ctx.moveTo(x, y);
    ctx.lineTo(x + 4, y - 8);
    ctx.stroke();
  };

  drawTuft(size * 0.15, size * 0.9);
  drawTuft(size * 0.45, size * 0.9);
  drawTuft(size * 0.75, size * 0.9);
}
