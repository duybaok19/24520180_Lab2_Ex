export function playBuffer(
  audioCtx: AudioContext,
  buffer: AudioBuffer,
  analyser: AnalyserNode,
): {
  source: AudioBufferSourceNode;
  stop: () => void;
} {
  const source = audioCtx.createBufferSource();

  source.buffer = buffer;
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  source.start();

  return {
    source,
    stop() {
      try {
        source.stop();
      } catch (error: unknown) {
        if (
          !(error instanceof DOMException &&
            error.name === 'InvalidStateError')
        ) {
          throw error;
        }
      }

      source.disconnect();
    },
  };
}

export function createAnalyser(
  audioCtx: AudioContext,
  fftSize = 256,
): AnalyserNode {
  const analyser = audioCtx.createAnalyser();

  analyser.fftSize = fftSize;
  analyser.smoothingTimeConstant = 0.8;

  return analyser;
}
