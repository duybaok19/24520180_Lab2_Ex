
export function startVisualizer(
  canvas: HTMLCanvasElement,
  analyser: AnalyserNode,
): { stop: () => void } {
  const ctx = canvas.getContext('2d');

  if (ctx === null) {
    throw new Error('Canvas 2D context is not supported.');
  }

  // Keep a non-null CanvasRenderingContext2D reference.
  const drawingContext: CanvasRenderingContext2D = ctx;

  // Allocate the frequency data array only once.
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);

  // Read the bar color from a CSS custom property.
  const styles = getComputedStyle(canvas);
  const barColor =
    styles.getPropertyValue('--visualizer-bar-color').trim() ||
    'currentColor';

  let animationId: number | null = null;
  let stopped = false;

  function draw(): void {
    if (stopped) {
      return;
    }

    analyser.getByteFrequencyData(frequencyData);

    const width = canvas.width;
    const height = canvas.height;

    drawingContext.clearRect(0, 0, width, height);
    drawingContext.fillStyle = barColor;

    const barCount = frequencyData.length;
    const barWidth = width / barCount;

    for (let i = 0; i < barCount; i++) {
      const barHeight = (frequencyData[i] / 255) * height;
      const x = i * barWidth;
      const y = height - barHeight;

      drawingContext.fillRect(
        x,
        y,
        Math.max(1, barWidth - 1),
        barHeight,
      );
    }

    animationId = requestAnimationFrame(draw);
  }

  animationId = requestAnimationFrame(draw);

  return {
    stop(): void {
      if (stopped) {
        return;
      }

      stopped = true;

      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }

      drawingContext.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}
