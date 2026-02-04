import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { InertiaProgress } from '@inertiajs/progress';
import { I18nextProvider } from 'react-i18next';
import initI18n from './i18n';
import { CurrencyProvider } from "./providers/CurrencyContext.jsx";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

InertiaProgress.init();

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./pages/**/*.jsx');
        const importPage = pages[`./pages/${name}.jsx`];

        if (!importPage) throw new Error(`Sayfa bulunamadı: ${name}`);

        return importPage().then(module => {
            const page = module.default;
            const defaultLayout = page.layout || ((page) => page);

            page.layout = (children) => (
                <CurrencyProvider>
                    {defaultLayout(children)}
                </CurrencyProvider>
            );

            return page;
        });
    },
    setup({ el, App, props }) {
        // Props'tan sadece locale bilgisini alıyoruz. 
        // Translations artık prop olarak gelmiyor.
        const { locale } = props.initialPage.props;

        initI18n(locale).then((i18nInstance) => {
            createRoot(el).render(
                <I18nextProvider i18n={i18nInstance}>
                    <App {...props} />
                </I18nextProvider>
            );
        });
    },
});