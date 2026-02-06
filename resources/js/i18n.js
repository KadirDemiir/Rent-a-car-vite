import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * Initialize i18next with bundled translations (from Inertia props)
 * This eliminates the HTTP request that HttpBackend was making
 */
const initI18n = (locale, translations = {}) => {
    if (!i18next.isInitialized) {
        i18next
            .use(initReactI18next)
            .init({
                lng: locale,
                fallbackLng: 'tr',
                resources: {
                    [locale]: {
                        translation: translations
                    }
                },
                interpolation: { escapeValue: false },
                react: { 
                    useSuspense: false
                }
            });
    } else {
        if (i18next.language !== locale) {
            // Add new language resources and switch
            i18next.addResourceBundle(locale, 'translation', translations, true, true);
            i18next.changeLanguage(locale);
        }
    }
    
    return i18next;
};

export default initI18n;