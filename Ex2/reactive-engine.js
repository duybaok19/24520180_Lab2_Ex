let stateStore = [];
let cursor = 0;

let triggerRender = () => {};

export function resetCursor() {
  cursor = 0;
}

export function setRenderer(fn) {
  triggerRender = fn;
}