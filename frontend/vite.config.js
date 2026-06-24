import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /tasks gets forwarded to FastAPI.
      // This means in your JS you write fetch('/tasks') instead of
      // fetch('http://localhost:8000/tasks') — cleaner and works in production too.
      '/tasks': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      // Same idea for projects: fetch('/projects') reaches FastAPI,
      // not the Vite dev server.
      '/projects': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
