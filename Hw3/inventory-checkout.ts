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

type CheckoutResult =
  | { ok: true }
  | { ok: false; reason: string };

export function confirmCheckout(
  store: InventoryStore,
  itemId: string,
  userId: string,
): CheckoutResult {
  const item = store.items.get(itemId);

  if (!item) {
    return { ok: false, reason: 'Item not found.' };
  }

  if (item.state !== 'RESERVED' || !item.reservation) {
    return {
      ok: false,
      reason: 'Item is not currently reserved.',
    };
  }

  if (item.reservation.userId !== userId) {
    return {
      ok: false,
      reason: 'Reservation belongs to another user.',
    };
  }

  if (Date.now() >= item.reservation.expiresAt) {
    if (item.timeoutId !== undefined) {
      clearTimeout(item.timeoutId);
      item.timeoutId = undefined;
    }

    item.state = transition(item.state, 'EXPIRE');
    item.reservation = undefined;

    return {
      ok: false,
      reason: 'Reservation has expired.',
    };
  }

  // Cancel the expiry timer before completing checkout.
  if (item.timeoutId !== undefined) {
    clearTimeout(item.timeoutId);
    item.timeoutId = undefined;
  }

  // RESERVED -> CHECKOUT -> SOLD
  item.state = transition(item.state, 'CONFIRM');
  item.state = transition(item.state, 'CONFIRM');

  item.reservation = undefined;

  return { ok: true };
}

export function cancelReservation(
  store: InventoryStore,
  itemId: string,
  userId: string,
): CheckoutResult {
  const item = store.items.get(itemId);

  if (!item) {
    return { ok: false, reason: 'Item not found.' };
  }

  if (item.state !== 'RESERVED' || !item.reservation) {
    return {
      ok: false,
      reason: 'Item is not currently reserved.',
    };
  }

  if (item.reservation.userId !== userId) {
    return {
      ok: false,
      reason: 'Reservation belongs to another user.',
    };
  }

  // Cancel the expiry timer.
  if (item.timeoutId !== undefined) {
    clearTimeout(item.timeoutId);
    item.timeoutId = undefined;
  }

  // RESERVED -> AVAILABLE
  item.state = transition(item.state, 'CANCEL');
  item.reservation = undefined;

  return { ok: true };
}
