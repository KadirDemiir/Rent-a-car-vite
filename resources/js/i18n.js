import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

const initI18n = async (locale) => {
    if (!i18next.isInitialized) {
        await i18next
            .use(HttpBackend) 
            .use(initReactI18next)
            .init({
                lng: locale,
                fallbackLng: 'tr',
                backend: {
                    loadPath: '/locales/{{lng}}/translation.json',
                },
                interpolation: { escapeValue: false },
                react: { 
                    useSuspense: false
                }
            });
    } else {
        if (i18next.language !== locale) {
            await i18next.changeLanguage(locale);
        }
    }
    
    return i18next;
};

export default initI18n;