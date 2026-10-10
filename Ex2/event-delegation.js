
export function setupEventDelegation(rootContainer) {
  const eventTypes = ['click', 'input', 'keydown'];

  eventTypes.forEach(eventType => {
    rootContainer.addEventListener(eventType, nativeEvent => {
      let target = nativeEvent.target;

      const handlerProp =
        'on' + eventType.charAt(0).toUpperCase() + eventType.slice(1);

      while (target && target !== rootContainer) {
        const vnode = target.__vnode;

        if (
          vnode &&
          vnode.props &&
          typeof vnode.props[handlerProp] === 'function'
        ) {
          vnode.props[handlerProp](nativeEvent);
          break;
        }

        target = target.parentNode;
      }
    });
  });
}