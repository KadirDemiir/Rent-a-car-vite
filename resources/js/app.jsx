import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { InertiaProgress } from '@inertiajs/progress';
import './i18n';

InertiaProgress.init();

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./pages/**/*.jsx');
        const importPage = pages[`./pages/${name}.jsx`];

        if (!importPage) {
            throw new Error(`Sayfa bulunamadı: ${name}`);
        }

        return importPage().then(module => module.default);
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
