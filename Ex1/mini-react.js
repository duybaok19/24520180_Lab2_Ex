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


export function renderToDOM(vNode) {
  // 1. Tạo DOM node thật
  const dom =
    vNode.type === 'TEXT_ELEMENT'
      ? document.createTextNode(vNode.props.nodeValue)
      : document.createElement(vNode.type);

  // 2. Gán thuộc tính và sự kiện
  Object.keys(vNode.props).forEach(name => {
    // Bỏ qua children và nodeValue
    if (name === 'children' || name === 'nodeValue') {
      return;
    }

    const value = vNode.props[name];

    // Gắn sự kiện bằng addEventListener
    if (name.startsWith('on') && typeof value === 'function') {
      const eventName = name.slice(2).toLowerCase();
      dom.addEventListener(eventName, value);
    } else {
      // Gán các thuộc tính còn lại trực tiếp
      dom[name] = value;
    }
  });

  // 3. Đệ quy render children
  if (vNode.type !== 'TEXT_ELEMENT') {
    vNode.props.children.forEach(child => {
      const childDOM = renderToDOM(child);
      dom.appendChild(childDOM);
    });
  }

  // 4. Trả về DOM node
  return dom;
}