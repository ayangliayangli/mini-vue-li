import { createApp, h, reactive } from '../dist/vue.esm.js';

const App = {
  setup() {
    const state = reactive({
      count: 1,
    });

    // for console debug
    window.state = state;

    return {
      state,
    };
  },
  render(ctx) {
    return h('div', {}, [
      h('div', { id: 1, class: 'class-1' }, 'ctx.state.count: ' + String(ctx.state.count)),
      h('div', {}, '其他文本'),
    ]);
  },
};

createApp(App).mount(document.querySelector('#app'));
