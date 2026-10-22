
import type { AudioTask } from './audio-queue-contract';

export class AudioTaskQueue {
  private queue: AudioTask[] = [];
  private isProcessing = false;

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
      const buffer = await this.loadTrack(task);
      task.resolve(buffer);
    } catch (error: unknown) {
      task.reject(error);
    } finally {
      // Always reset the flag and continue with the next task.
      this.isProcessing = false;
      void this.processNext();
    }
  }

  private async loadTrack(_task: AudioTask): Promise<AudioBuffer> {
    // Implemented in HW2-3.
    throw new Error('not implemented');
  }
}
