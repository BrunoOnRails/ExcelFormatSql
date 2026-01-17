
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ExcelFormatSql/'
})

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
