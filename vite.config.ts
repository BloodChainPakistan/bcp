import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // File watching/HMR can be disabled via DISABLE_HMR (used in AI Studio).
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    test: {
      // Placeholder Supabase env so modules that build the client at import time
      // (supabaseClient.ts) don't throw during unit tests in CI, where no .env
      // exists. These tests are pure functions and never touch the network.
      env: {
        VITE_SUPABASE_URL: 'https://placeholder.supabase.co',
        VITE_SUPABASE_PUBLISHABLE_KEY: 'placeholder-anon-key',
      },
    },
  };
});
