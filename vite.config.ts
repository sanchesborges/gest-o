import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.svg', 'favicon.ico', 'icon-192.svg', 'icon-512.svg'],
          manifest: {
            name: 'Maná - Gestão de Produtos',
            short_name: 'Maná',
            description: 'Sistema completo de gestão para padarias e distribuidoras de produtos congelados',
            theme_color: '#5B6B9E',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'portrait-primary',
            start_url: '/',
            scope: '/',
            icons: [
              {
                src: '/icon-192.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              },
              {
                src: '/icon-512.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              }
            ]
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'tailwind-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/aistudiocdn\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'react-cdn-cache',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'charts': ['recharts'],
              'utils': ['jspdf', 'html2canvas']
            }
          }
        }
      }
    };
});
