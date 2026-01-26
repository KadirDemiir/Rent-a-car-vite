import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { InertiaProgress } from '@inertiajs/progress';
import { I18nextProvider } from 'react-i18next';
import initI18n from './i18n';
import { CurrencyProvider } from "./providers/CurrencyContext.jsx";
import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

InertiaProgress.init();

initI18n().then(i18nInstance => {
    createInertiaApp({
        resolve: name => {
            const pages = import.meta.glob('./pages/**/*.jsx');
            const importPage = pages[`./pages/${name}.jsx`];

            if (!importPage) throw new Error(`Sayfa bulunamadı: ${name}`);

            return importPage().then(module => {
                const page = module.default;

                // 1. Sayfanın mevcut bir layout'u var mı kontrol et
                // Yoksa sayfayı olduğu gibi döndüren basit bir fonksiyon ata
                const defaultLayout = page.layout || ((page) => page);

                // 2. Layout fonksiyonunu CurrencyProvider ile sarmala
                // Böylece Provider, Inertia'nın İÇİNDE kalır ve usePage() çalışır.
                page.layout = (children) => (
                    <CurrencyProvider>
                        {defaultLayout(children)}
                    </CurrencyProvider>
                );

                return page;
            });
        },
        setup({ el, App, props }) {
            createRoot(el).render(
                <I18nextProvider i18n={i18nInstance}>
                    {/* CurrencyProvider'ı BURADAN SİLDİK */}
                    <App {...props} />
                </I18nextProvider>
            );
        },
    });
});