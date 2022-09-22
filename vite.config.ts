import { defineConfig } from 'vite';

// https://vitejs.dev/config/

const rollupOptions = {
  external: ['vue', 'vue-router'],
  output: {
    globals: {
      vue: 'Vue',
    },
  },
};

export default defineConfig({
  plugins: [
  ],
  build: {
    rollupOptions,
    cssCodeSplit: false, // default false
    minify: false,
    lib: {
      entry: './src/index.ts',
      name: 'Vue', // lib 的名称, 在umd iife 等构建中的全局变量
      fileName: 'vue', // 构建的文件名称
      // 导出模块格式
      //   umd === amd + cjs + iife
      formats: ['iife', 'cjs', 'umd', 'esm' as any,], // 不要打包umd就暂时不会报错
      // formats: ['iife', 'umd'], // 如果同时打包 iife 和 umd,  it's recommanded to set `build.cssCodeSplit` to true.
    },
  },
});
