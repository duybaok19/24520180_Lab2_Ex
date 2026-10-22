import type {
  InventoryState,
  InventoryEvent,
} from './flash-sale-contract';

/**
 * Valid transition table:
 *
 * AVAILABLE --RESERVE--> RESERVED
 *
 * RESERVED --CONFIRM--> CHECKOUT
 * RESERVED --CANCEL--> AVAILABLE
 * RESERVED --EXPIRE--> EXPIRED
 *
 * CHECKOUT --CONFIRM--> SOLD
 * CHECKOUT --CANCEL--> AVAILABLE
 * CHECKOUT --EXPIRE--> EXPIRED
 *
 * All transitions not listed above are forbidden.
 */

const transitions: Partial<
  Record<
    InventoryState,
    Partial<Record<InventoryEvent, InventoryState>>
  >
> = {
  AVAILABLE: {
    RESERVE: 'RESERVED',
  },

  RESERVED: {
    CONFIRM: 'CHECKOUT',
    CANCEL: 'AVAILABLE',
    EXPIRE: 'EXPIRED',
  },

  CHECKOUT: {
    CONFIRM: 'SOLD',
    CANCEL: 'AVAILABLE',
    EXPIRE: 'EXPIRED',
  },

  SOLD: {},

  EXPIRED: {},
};

/**
 * Pure state transition function.
 * Does not mutate external state or access the DOM.
 */
export function transition(
  state: InventoryState,
  event: InventoryEvent,
): InventoryState {
  const nextState = transitions[state]?.[event];

  if (!nextState) {
    throw new Error(
      `Invalid inventory transition: ${state} --${event}--> (forbidden)`,
    );
  }

  return nextState;
}

/**
 * Basic transition tests.
 */

// Test 1: AVAILABLE -> RESERVED
console.assert(
  transition('AVAILABLE', 'RESERVE') === 'RESERVED',
  'Test 1 failed: AVAILABLE --RESERVE--> RESERVED',
);

// Test 2: RESERVED -> CHECKOUT
console.assert(
  transition('RESERVED', 'CONFIRM') === 'CHECKOUT',
  'Test 2 failed: RESERVED --CONFIRM--> CHECKOUT',
);

// Test 3: CHECKOUT -> SOLD
console.assert(
  transition('CHECKOUT', 'CONFIRM') === 'SOLD',
  'Test 3 failed: CHECKOUT --CONFIRM--> SOLD',
);

// Test 4: RESERVED -> AVAILABLE
console.assert(
  transition('RESERVED', 'CANCEL') === 'AVAILABLE',
  'Test 4 failed: RESERVED --CANCEL--> AVAILABLE',
);

// Test 5: RESERVED -> EXPIRED
console.assert(
  transition('RESERVED', 'EXPIRE') === 'EXPIRED',
  'Test 5 failed: RESERVED --EXPIRE--> EXPIRED',
);

// Test 6: SOLD cannot be reserved again.
console.assert(
  (() => {
    try {
      transition('SOLD', 'RESERVE');
      return false;
    } catch (error) {
      return (
        error instanceof Error &&
        error.message.includes('SOLD --RESERVE--> (forbidden)')
      );
    }
  })(),
  'Test 6 failed: SOLD --RESERVE--> must throw Error',
);

// Test 7: EXPIRED cannot be confirmed.
console.assert(
  (() => {
    try {
      transition('EXPIRED', 'CONFIRM');
      return false;
    } catch (error) {
      return (
        error instanceof Error &&
        error.message.includes('EXPIRED --CONFIRM--> (forbidden)')
      );
    }
  })(),
  'Test 7 failed: EXPIRED --CONFIRM--> must throw Error',
);

console.log('Inventory state machine tests completed.');