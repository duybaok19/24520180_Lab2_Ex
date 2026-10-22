export function createAntiDriftTimer(
  durationMs: number,
  onTick: (remaining: number) => void,
): () => void {
  const targetTime = Date.now() + Math.max(0, durationMs);

  let animationId: number | null = null;
  let cancelled = false;

  function tick(): void {
    if (cancelled) {
      return;
    }

    const remaining = Math.max(0, targetTime - Date.now());

    onTick(remaining);

    if (remaining > 0 && !cancelled) {
      animationId = requestAnimationFrame(tick);
    } else {
      animationId = null;
    }
  }

  tick();

  return (): void => {
    if (cancelled) {
      return;
    }

    cancelled = true;

    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };
}
