import { watchEffect } from './reactivity/index.js';
import { mountElement } from './renderer/index.js';

export function createApp(rootApp) {
  return {
    mount(rootContainer) {
      const ctx = rootApp.setup();

      watchEffect(() => {
        rootContainer.innerHTML = '';
        const vnode = rootApp.render(ctx);
        mountElement(vnode, rootContainer);
      });
    },
  };
}
