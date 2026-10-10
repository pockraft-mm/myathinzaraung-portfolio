import { useEffect, useRef } from 'react';

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const CAUSTIC_TINT = [11, 46, 89] as const;
// Convert desired contrast against white to alpha; alpha alone isn't visual intensity.
const TINT_CONTRAST = 1 - (
  CAUSTIC_TINT[0] * 0.2126 + CAUSTIC_TINT[1] * 0.7152 + CAUSTIC_TINT[2] * 0.0722
) / 255;
const CELL_SIZE = 160;
const GRID_PADDING = 3;

function seed(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function OceanBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let width = 0;
    let height = 0;
    let image: ImageData | null = null;
    let scale = 1;
    let lastDraw = 0;
    let elapsed = 0;
    let scrollFrame = 0;
    let gridWidth = 0;
    let gridHeight = 0;
    let pointsX = new Float32Array(0);
    let pointsY = new Float32Array(0);
    let phasesX = new Float32Array(0);
    let phasesY = new Float32Array(0);
    let heroRegions: Array<{ left: number; right: number; top: number; bottom: number }> = [];
    const frameInterval = 1000 / 16;

    const updateHeroRegions = () => {
      heroRegions = Array.from(
        document.querySelectorAll<HTMLElement>('.portfolio-hero .hero-copy, .portfolio-hero .hero-intro'),
        (element) => {
          const rect = element.getBoundingClientRect();
          return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
        }
      );
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      updateHeroRegions();

      // Cap the working resolution to keep the per-frame pixel work light.
      scale = Math.min(0.55, Math.sqrt(180_000 / (width * height)));
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      image = context.createImageData(canvas.width, canvas.height);
      gridWidth = Math.ceil(width / CELL_SIZE) + GRID_PADDING * 2;
      gridHeight = Math.ceil(height / CELL_SIZE) + GRID_PADDING * 2;
      pointsX = new Float32Array(gridWidth * gridHeight);
      pointsY = new Float32Array(gridWidth * gridHeight);
      phasesX = new Float32Array(gridWidth * gridHeight);
      phasesY = new Float32Array(gridWidth * gridHeight);
      for (let y = 0; y < gridHeight; y += 1) {
        for (let x = 0; x < gridWidth; x += 1) {
          const index = y * gridWidth + x;
          phasesX[index] = seed(x - GRID_PADDING, y - GRID_PADDING) * Math.PI * 2;
          phasesY[index] = seed(y - GRID_PADDING + 19, x - GRID_PADDING + 37) * Math.PI * 2;
        }
      }
      render(elapsed);
    };

    const render = (time: number) => {
      if (!image) return;
      const pixels = image.data;
      const pixelWidth = canvas.width;
      const pixelHeight = canvas.height;

      // Move irregular refraction points slowly; their curved boundaries form the light network.
      for (let y = 0; y < gridHeight; y += 1) {
        for (let x = 0; x < gridWidth; x += 1) {
          const index = y * gridWidth + x;
          pointsX[index] = x - GRID_PADDING + 0.5 + Math.sin(phasesX[index] + time * 0.31) * 0.45;
          pointsY[index] = y - GRID_PADDING + 0.5 + Math.sin(phasesY[index] + time * 0.27) * 0.45;
        }
      }

      for (let y = 0; y < pixelHeight; y += 1) {
        const py = y / scale;
        for (let x = 0; x < pixelWidth; x += 1) {
          const px = x / scale;

          const u = px / CELL_SIZE;
          const v = py / CELL_SIZE;
          const warpX = u + 0.24 * Math.sin(v * 2.8 + time * 0.42)
            + 0.12 * Math.sin(u * 4.6 + v * 1.5 - time * 0.24);
          const warpY = v + 0.24 * Math.sin(u * 2.3 - time * 0.36)
            + 0.12 * Math.sin(v * 4.1 - u * 1.3 + time * 0.2);
          const cellX = Math.floor(warpX) + GRID_PADDING;
          const cellY = Math.floor(warpY) + GRID_PADDING;
          let nearest = Infinity;
          let second = Infinity;
          for (let row = cellY - 1; row <= cellY + 1; row += 1) {
            for (let column = cellX - 1; column <= cellX + 1; column += 1) {
              const point = row * gridWidth + column;
              const dx = warpX - pointsX[point];
              const dy = warpY - pointsY[point];
              const distance = dx * dx + dy * dy;
              if (distance < nearest) {
                second = nearest;
                nearest = distance;
              } else if (distance < second) {
                second = distance;
              }
            }
          }
          const gap = Math.sqrt(second) - Math.sqrt(nearest);
          const reflection = 1 - smoothstep(0.006, 0.032, gap);
          const glow = (1 - smoothstep(0.015, 0.1, gap)) * 0.16;
          const shimmer = 0.7 + 0.3 * Math.sin(warpX * 2.9 + warpY * 3.1 + time * 0.45) ** 2;
          const caustic = Math.min(1, reflection + glow) * shimmer;
          const edgeDistance = Math.min(px / width, (width - px) / width, py / height, (height - py) / height);
          const edgeBoost = 1 - smoothstep(0.04, 0.36, edgeDistance);
          let textAttenuation = 1;
          for (let i = 0; i < heroRegions.length; i += 1) {
            const region = heroRegions[i];
            const dx = Math.max(region.left - px, 0, px - region.right);
            const dy = Math.max(region.top - py, 0, py - region.bottom);
            const feather = smoothstep(0, 72 * 72, dx * dx + dy * dy);
            textAttenuation = Math.min(textAttenuation, 0.35 + feather * 0.65);
          }
          const contrast = caustic * (0.05 + edgeBoost * 0.07) * textAttenuation;
          const alpha = Math.round(contrast / TINT_CONTRAST * 255);
          const index = (y * pixelWidth + x) * 4;

          // Navy source pixels blend gently into the pure white surface.
          pixels[index] = CAUSTIC_TINT[0];
          pixels[index + 1] = CAUSTIC_TINT[1];
          pixels[index + 2] = CAUSTIC_TINT[2];
          pixels[index + 3] = alpha;
        }
      }

      context.putImageData(image, 0, 0);
    };

    const animate = (now: number) => {
      if (document.hidden || reducedMotion.matches) return;
      if (now - lastDraw >= frameInterval) {
        // Keep the caustics calm, but move them fast enough to read as animated.
        elapsed = now * 0.0007;
        render(elapsed);
        lastDraw = now;
      }
      frame = window.requestAnimationFrame(animate);
    };

    const updateMotion = () => {
      window.cancelAnimationFrame(frame);
      if (reducedMotion.matches || document.hidden) {
        render(elapsed);
      } else {
        lastDraw = 0;
        frame = window.requestAnimationFrame(animate);
      }
    };

    const handleVisibility = () => updateMotion();
    const handleScroll = () => {
      updateHeroRegions();
      if (reducedMotion.matches) {
        window.cancelAnimationFrame(scrollFrame);
        scrollFrame = window.requestAnimationFrame(() => render(elapsed));
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    reducedMotion.addEventListener('change', updateMotion);
    updateMotion();

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      reducedMotion.removeEventListener('change', updateMotion);
    };
  }, []);

  return <canvas ref={canvasRef} className="ocean-background" aria-hidden="true" />;
}

export { OceanBackground };
