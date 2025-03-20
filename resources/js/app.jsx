import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { InertiaProgress } from '@inertiajs/progress';

InertiaProgress.init();

createInertiaApp({
    resolve: async name => {
        const module = await import(`./pages/${name}`);
        return module.default;
      },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});