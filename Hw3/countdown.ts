import { createAntiDriftTimer } from './timer';

export function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (value: number): string =>
    String(value).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function bindSaleCountdown(
  deadlineISO: string,
): () => void {
  const countdownElement = document.getElementById(
    'sale-countdown',
  ) as HTMLTimeElement | null;

  const statusElement = document.getElementById(
    'sale-countdown-status',
  );

  const endTime = Date.parse(deadlineISO);

  if (
    !countdownElement ||
    !statusElement ||
    !Number.isFinite(endTime)
  ) {
    throw new Error('Invalid countdown element or UTC end time.');
  }

  // Store the normalized UTC deadline.
  countdownElement.dateTime = new Date(endTime).toISOString();

  let announced60Seconds = false;
  let announcedEnded = false;

  const cancelTimer = createAntiDriftTimer(
    Math.max(0, endTime - Date.now()),
    (remaining:number) => {
      const display = formatRemaining(remaining);

      // Update the DOM only when the displayed time changes.
      if (countdownElement.textContent !== display) {
        countdownElement.textContent = display;
      }

      if (
        remaining > 0 &&
        remaining <= 60_000 &&
        !announced60Seconds
      ) {
        statusElement.textContent =
          'Flash sale ends in 60 seconds or less.';
        announced60Seconds = true;
      }

      if (remaining === 0 && !announcedEnded) {
        statusElement.textContent = 'The flash sale has ended.';
        announcedEnded = true;
      }
    },
  );

  return cancelTimer;
}