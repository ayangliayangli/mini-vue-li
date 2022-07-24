export function h(tag, props, children) {
  return {
    tag,
    props,
    children,
  };
}

export function mountElement(vnode, container) {
  const { tag, props, children } = vnode;
  // 1. create dom
  const el = document.createElement(tag);
  vnode.el = el;
  // 2. handle props
  for (const key in props) {
    if (Object.hasOwnProperty.call(props, key)) {
      const value = props[key];
      el.setAttribute(key, value);
    }
  }

  // handle children
  if (typeof children === 'string') {
    el.append(document.createTextNode(children));
  } else if (Array.isArray(children)) {
    children.forEach((child) => {
      mountElement(child, el);
    });
  }

  // append to container
  container.append(el);
}
