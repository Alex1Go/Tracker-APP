// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
// import eslint from 'vite-plugin-eslint'

// export default defineConfig({
//   plugins: [
//     react(),
//     eslint({
//       cache: false,
//       include: ['./src/**/*.js', './src/**/*.jsx', './src/**/*.ts', './src/**/*.tsx'],
//       exclude: ['node_modules']
//     })
//   ],
//   server: {
//     port: 3000,
//     open: true,
//     hmr: {
//       overlay: false
//     }
//   },
//   build: {
//     outDir: 'dist',
//     sourcemap: true,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ['react', 'react-dom'],
//           ui: ['@mui/material', 'antd'], 
//           charts: ['recharts', 'chart.js'],
//           utils: ['lodash', 'moment', 'date-fns']
//         }
//       }
//     },
//     minify: 'terser',
//     terserOptions: {
//       compress: {
//         drop_console: true,
//         drop_debugger: true
//       }
//     },
//     chunkSizeWarningLimit: 1000
//   },
//   resolve: {
//     alias: {
//       '@': '/src',
//       '@components': '/src/components',
//       '@utils': '/src/utils',
//       '@assets': '/src/assets'
//     }
//   },
//   optimizeDeps: {
//     include: ['react', 'react-dom'],
//     exclude: ['@vitejs/plugin-react']
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})