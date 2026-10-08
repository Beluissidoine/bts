import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const previewUrl = process.env.PREVIEW_URL || 'https://localhost';
const preview = new URL(previewUrl);

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['.e2b.app', preview.hostname],
    hmr: {
      host: preview.hostname,
      protocol: 'wss',
      clientPort: Number(preview.port || 443),
    },
  },
});
