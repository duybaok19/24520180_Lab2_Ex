export function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: String(text),
      children: []
    }
  };
}

export function createElement(type, props, ...children) {
  const flatChildren = children.flat(Infinity);

  const normalizedChildren = flatChildren
    .filter(child => child !== null && child !== undefined && child !== false)
    .map(child => {
      if (typeof child !== 'object') {
        return createTextElement(child);
      }

      return child;
    });

  return {
    type,
    props: {
      ...(props ?? {}),
      children: normalizedChildren
    }
  };
}