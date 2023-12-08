import react from "@vitejs/plugin-react"
import mdx from "@mdx-js/rollup"
import { defineConfig } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import notifier from "vite-plugin-notifier"
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    notifier(),
    mdx(),
    svgr(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  server: {
    port: 4000,
  },
  resolve: {
    alias:
      /** browserify for @jbrowse/react-linear-genome-view */
      {
        stream: "stream-browserify",
        'scss': '/src/styles',
      },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
    },
  },
  build: {
    outDir: "build",
    // used for "Graph" is undefined error with Dagre package https://github.com/vitejs/vite/issues/5759
    commonjsOptions: {
      ignoreTryCatch: false,
    },
  },
  // needed to fix the "react not defined" error in the ag-grid renderer components
  // https://github.com/vitejs/vite/issues/2369
  esbuild: {
    jsxFactory: "_jsx",
    jsxFragment: "_jsxFragment",
    jsxInject: `import { createElement as _jsx, Fragment as _jsxFragment } from 'react'`,
  },
})
