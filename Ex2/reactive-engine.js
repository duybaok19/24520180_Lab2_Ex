let stateStore = [];
let cursor = 0;

let triggerRender = () => {};

export function resetCursor() {
  cursor = 0;
}

export function setRenderer(fn) {
  triggerRender = fn;
}

export function useState(initialValue) {
  const currentCursor = cursor;

  stateStore[currentCursor] =
    stateStore[currentCursor] ?? initialValue;

  const setState = (nextValue) => {
    const newValue =
      typeof nextValue === 'function'
        ? nextValue(stateStore[currentCursor])
        : nextValue;

    if (!Object.is(stateStore[currentCursor], newValue)) {
      stateStore[currentCursor] = newValue;
      triggerRender();
    }
  };

  const value = stateStore[currentCursor];

  cursor++;

  return [value, setState];
}