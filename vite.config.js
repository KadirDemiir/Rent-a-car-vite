import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => ({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Heavy UI libraries - split into separate chunks
                    'vendor-react': ['react', 'react-dom'],
                    'vendor-inertia': ['@inertiajs/react', '@inertiajs/progress'],
                    'vendor-i18n': ['i18next', 'react-i18next'],
                    // Rich text editors - lazy load these
                    'vendor-tiptap': [
                        '@tiptap/react',
                        '@tiptap/starter-kit',
                        '@tiptap/extension-color',
                        '@tiptap/extension-heading',
                        '@tiptap/extension-image',
                        '@tiptap/extension-link',
                        '@tiptap/extension-text-style',
                        '@tiptap/extension-underline'
                    ],
                    // Maps - lazy load
                    'vendor-maps': ['leaflet', 'react-leaflet'],
                    // Charts - lazy load
                    'vendor-charts': ['recharts'],
                    // Date picker
                    'vendor-datepicker': ['react-datepicker'],
                    // Drag and drop
                    'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
                }
            }
        },
        chunkSizeWarningLimit: 500,
        minify: 'esbuild',
    },
    esbuild: {
        jsx: 'automatic',
        // Remove console.log and debugger in production only
        drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    optimizeDeps: {
        exclude: [
            'lightningcss'
        ]
    },
    ssr: {
        noExternal: [
            'lightningcss'
        ]
    },
    resolve: {
        alias: {
            'ziggy-js': path.resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
}));
