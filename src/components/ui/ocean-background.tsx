import { useEffect, useRef } from 'react';

function OceanBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      const gap = 62;
      const step = 12;
      const phase = now * 0.00022;
      const lineCount = Math.ceil(height / gap) + 2;

      for (let line = -1; line < lineCount; line += 1) {
        const baseY = line * gap + 24;
        const amplitude = 6 + (line % 3 + 3) % 3 * 2.5;
        context.beginPath();
        for (let x = -step; x <= width + step; x += step) {
          const longSwell = Math.sin(x * 0.0038 + phase + line * 0.68) * amplitude;
          const softChop = Math.sin(x * 0.0105 - phase * 0.72 + line * 1.17) * amplitude * 0.32;
          const rollingBend = Math.sin(x * 0.0019 + phase * 0.54 - line * 0.83) * amplitude * 0.55;
          const y = baseY + longSwell + softChop + rollingBend;
          if (x === -step) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.lineWidth = line % 3 === 0 ? 1.15 : 0.8;
        context.strokeStyle = line % 3 === 0
          ? 'rgba(51, 161, 253, 0.15)'
          : 'rgba(25, 52, 91, 0.12)';
        context.stroke();
      }

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ocean-background" aria-hidden="true" />;
}

export { OceanBackground };
