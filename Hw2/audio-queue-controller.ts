import type { AudioTask } from './audio-queue-contract';

export class AudioTaskQueue {
  private queue: AudioTask[] = [];
  private isProcessing = false;
  private activeTask: AudioTask | null = null;

  constructor(private readonly audioCtx: AudioContext) {}

  enqueue(trackUrl: string): Promise<AudioBuffer> {
    return new Promise<AudioBuffer>((resolve, reject) => {
      const task: AudioTask = {
        trackUrl,
        controller: new AbortController(),
        resolve,
        reject,
      };

      this.queue.push(task);
      void this.processNext();
    });
  }

  cancel(trackUrl: string): void {
    // Cancel queued tasks matching this URL.
    const queuedTasks = this.queue.filter(
      (task) => task.trackUrl === trackUrl,
    );

    this.queue = this.queue.filter(
      (task) => task.trackUrl !== trackUrl,
    );

    for (const task of queuedTasks) {
      task.controller.abort();
      task.reject(new Error('Audio loading was cancelled.'));
    }

    // Cancel the active task if its URL matches.
    if (this.activeTask?.trackUrl === trackUrl) {
      this.activeTask.controller.abort();
    }
  }

  private async processNext(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();

    if (!task) {
      return;
    }

    this.isProcessing = true;
    this.activeTask = task;

    try {
      await this.loadTrack(task);
    } finally {
      this.activeTask = null;
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

