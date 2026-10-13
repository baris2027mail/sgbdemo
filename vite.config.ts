import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { defineConfig } from 'vite'
import react from '@reactjs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Bunu eklemeniz kök dizin hatalarını önler
})

