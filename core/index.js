import { watchEffect } from './reactivity/index.js';
import { mountElement, diff } from './renderer/index.js';

export function createApp(rootApp) {
  return {
    mount(rootContainer) {
      const ctx = rootApp.setup();
      let isMounted = true;
      let prevVNode;

      watchEffect(() => {
        console.log('start to update');
        if (isMounted) {
          console.log('mounte');
          rootContainer.innerHTML = '';
          const vnode = rootApp.render(ctx);
          mountElement(vnode, rootContainer);
          // 改变全局变量
          isMounted = false;
          prevVNode = vnode;
        } else {
          console.log('update');
          const vnode = rootApp.render(ctx);
          diff(prevVNode, vnode);
          prevVNode = vnode;
        }
      });
    },
  };
}
