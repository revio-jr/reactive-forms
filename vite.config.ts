import { resolve } from "path";
import { defineConfig } from 'vite'
import dts from "vite-plugin-dts";
import { peerDependencies } from "./package.json";

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ReactiveForms",
      fileName: (format) => `reactive-forms.${format}.js`,
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)],
    },
    sourcemap: true,
    emptyOutDir: true,
    copyPublicDir: false,
  },
  plugins: [dts({ rollupTypes: true, tsconfigPath: "./tsconfig.app.json" })],
})
