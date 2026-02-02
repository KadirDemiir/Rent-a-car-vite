import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const initI18n = async (locale, translations, allTranslations = {}) => {
    console.log('Initializing i18n with locale:', locale);
    
    // Build resources for all languages
    const resources = {};
    Object.keys(allTranslations).forEach(lang => {
        resources[lang] = {
            translation: allTranslations[lang] || {}
        };
    });
    
    // Ensure current locale is included
    if (!resources[locale]) {
        resources[locale] = {
            translation: translations || {}
        };
    }

    const config = {
        lng: locale,
        fallbackLng: 'tr',
        resources: resources,
        interpolation: { escapeValue: false },
        react: { useSuspense: false }
    };

    if (!i18next.isInitialized) {
        await i18next
            .use(initReactI18next)
            .init(config);
    } else {
        // Add all resource bundles
        Object.keys(resources).forEach(lang => {
            i18next.addResourceBundle(lang, 'translation', resources[lang].translation, true, true);
        });
        await i18next.changeLanguage(locale);
    }

    return i18next;
};

export const updateI18nResources = (locale, translations) => {
    if (!translations || !locale) return;

    i18next.addResourceBundle(locale, 'translation', translations, true, true);

    if (i18next.language !== locale) {
        i18next.changeLanguage(locale);
    }
};

export const reloadTranslations = async () => {};

export default initI18n;