
export interface AudioTask {
  trackUrl: string;
  controller: AbortController;
  resolve: (buffer: AudioBuffer) => void;
  reject: (error: unknown) => void;
}

export type QueueState = 'IDLE' | 'PROCESSING';

/**
 * Queue invariants:
 *
 * 1. PROCESSING invariant:
 *    At most one task may be in the PROCESSING state at any time.
 *
 * 2. FIFO invariant:
 *    Tasks must be processed in the same order they were enqueued
 *    (First In, First Out).
 *
 * 3. State invariant:
 *    IDLE means no task is currently being processed.
 *    PROCESSING means exactly one task is being processed.
 */
