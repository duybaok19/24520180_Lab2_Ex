import type { AudioTask } from './audio-queue-contract';

export class AudioTaskQueue {
  private queue: AudioTask[] = [];
  private isProcessing = false;

  constructor(private readonly audioCtx: AudioContext) {}

  enqueue(trackUrl: string): Promise<AudioBuffer> {
    return new Promise<AudioBuffer>((resolve, reject) => {
      const task: AudioTask = {
        trackUrl,
        controller: new AbortController(),
        resolve,
        reject,
      };

      // Add the task to the end of the queue (FIFO).
      this.queue.push(task);

      // Start processing the queue.
      void this.processNext();
    });
  }

  private async processNext(): Promise<void> {
    // Do not process multiple tasks concurrently.
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    // Take the first task from the queue.
    const task = this.queue.shift();

    if (!task) {
      return;
    }

    this.isProcessing = true;

    try {
      await this.loadTrack(task);
    } finally {
      // Always reset the flag and continue with the next task.
      this.isProcessing = false;
      void this.processNext();
    }
  }

  private async loadTrack(task: AudioTask): Promise<void> {
    try {
      const response = await fetch(task.trackUrl, {
        signal: task.controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load audio: HTTP ${response.status} ${response.statusText}`,
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = await this.audioCtx.decodeAudioData(arrayBuffer);

      task.resolve(buffer);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        task.reject(new Error('Audio loading was cancelled.'));
      } else {
        task.reject(error);
      }
    }
  }
}
