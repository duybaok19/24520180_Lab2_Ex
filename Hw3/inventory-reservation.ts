import type {
  InventoryState,
  Reservation,
} from './flash-sale-contract';

import { transition } from './inventory-state';

interface InventoryItem {
  state: InventoryState;
  reservation?: Reservation;
  timeoutId?: ReturnType<typeof setTimeout>;
}

interface InventoryStore {
  items: Map<string, InventoryItem>;
}

type ReserveResult =
  | { ok: true; reservation: Reservation }
  | { ok: false; reason: string };

export function reserveItem(
  store: InventoryStore,
  itemId: string,
  userId: string,
  ttlMs: number,
): ReserveResult {
  const item = store.items.get(itemId);

  if (!item) {
    return {
      ok: false,
      reason: 'Item not found.',
    };
  }

  if (item.state !== 'AVAILABLE') {
    return {
      ok: false,
      reason: `Item is not available (current state: ${item.state}).`,
    };
  }

  if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
    return {
      ok: false,
      reason: 'ttlMs must be a positive finite number.',
    };
  }

  // Transition to RESERVED.
  item.state = transition(item.state, 'RESERVE');

  const reservation: Reservation = {
    itemId,
    userId,
    expiresAt: Date.now() + ttlMs,
  };

  item.reservation = reservation;

  // Automatically expire the reservation after its TTL.
  item.timeoutId = setTimeout(() => {
    // Ignore stale timers or reservations that have changed.
    if (
      item.state !== 'RESERVED' ||
      item.reservation !== reservation
    ) {
      return;
    }

    item.state = transition(item.state, 'EXPIRE');
    item.reservation = undefined;
    item.timeoutId = undefined;
  }, ttlMs);

  return {
    ok: true,
    reservation,
  };
}
