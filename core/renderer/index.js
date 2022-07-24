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

/**
 * diff算法, 比较两个vnode, 最小化更新到dom
 * @param {*} n1
 * @param {*} n2
 */
export function diff(n1, n2) {
  const { tag: tagOld, props: propsOld, children: childrenOld } = n1;
  const { tag: tagNew, props: propsNew, children: childrenNew } = n2;

  const el = (n2.el = n1.el);

  // tag
  console.log('diff handle tag')
  if (tagNew !== tagOld) {
    el.replaceWith(document.createElement(tagNew));
  }

  // props
  // a b c
  // a b1 d
  // a 没变 b变成了b1 c删除了 d是新增的
  console.log('diff handle props')
  Object.keys(propsNew).forEach((key) => {
    const valNew = propsNew[key];
    const valOld = propsOld[key];

    if (valNew !== valOld) {
      el.setAttribute(key, valNew);
    }
  });

  // old 特有的props 需要删除
  Object.keys(propsOld).forEach((key) => {
    const valNew = propsNew[key];
    const valOld = propsOld[key];

    if (valOld && !valNew) {
      el.removeAttribute(key);
    }
  });

  // children
  console.log('diff handle children')
  if (typeof childrenNew === 'string') {
    if (typeof childrenOld === 'string') {
      // new: string old: string
      console.log('new: string old: string')
      if (childrenNew !== childrenOld) {
        el.innerHTML = childrenNew;
      }
    } else if (Array.isArray(childrenOld)) {
      // new: string   old: array
      console.log('// new: string   old: array')
      el.innerHTML = childrenNew;
    }
  } else if (Array.isArray(childrenNew)) {
    if (typeof childrenOld === 'string') {
      // new: array old: string
      console.log('new: array old: string')
      el.innerHTML = '';
      for (const child of childrenNew) {
        mountElement(child, el);
      }
    } else if (Array.isArray(childrenOld)) {
      // new: array
      // old: array
      // 最复杂的情况
      console.log('new: array  old: array')

      //   长度相同的部分,递归diff
      console.log('处理长度相同的部分')
      const minLen = Math.min(childrenNew.length, childrenOld.length);
      for (let index = 0; index < minLen; index++) {
        const childNew = childrenNew[index];
        const childOld = childrenOld[index];
        diff(childOld, childNew);
      }

      // old特有的, 需要删除
      for (let index = minLen; index < childrenOld.length; index++) {
        const childOld = childrenOld[index];
        childOld.el.parentNode.removeChild(childOld.el);
      }

      // new 特有的, 需要追加
      for (let index = minLen; index < childrenNew.length; index++) {
        const childNew = childrenNew[index];
        mountElement(childNew, el)
      }
    }
  }
}
