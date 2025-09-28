import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { InertiaProgress } from '@inertiajs/progress';
import { I18nextProvider } from 'react-i18next';
import initI18n from './i18n';
import {StrictMode} from "react";

InertiaProgress.init();

initI18n().then(i18nInstance => {
    createInertiaApp({
        resolve: name => {
            const pages = import.meta.glob('./pages/**/*.jsx');
            const importPage = pages[`./pages/${name}.jsx`];

            if (!importPage) throw new Error(`Sayfa bulunamadı: ${name}`);

            return importPage().then(module => module.default);
        },
        setup({ el, App, props }) {
            createRoot(el).render(
                <I18nextProvider i18n={i18nInstance}>
                    {/*<StrictMode>*/}
                        <App {...props} />
                    {/*</StrictMode>*/}
                </I18nextProvider>
            );
        },
    });
});
