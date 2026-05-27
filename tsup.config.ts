import { defineConfig } from 'tsup'
export default defineConfig({
  entry: { 'widget-intel': 'src/index.ts' },
  format: ['esm', 'iife'],
  dts: {
    resolve: true,
    compilerOptions: {
      ignoreDeprecations: '6.0',
    },
  },
  sourcemap: true,
  clean: true,
  target: 'es2022',
  outDir: 'dist',
  splitting: false,
  globalName: 'TendersaIntel',
})
