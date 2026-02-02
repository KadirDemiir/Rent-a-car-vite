import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * Initialize i18n with translations from Inertia props
 * Database -> Laravel Cache -> Inertia Props -> i18n
 */
const initI18n = async (translations = {}, languages = []) => {
    // Get language config from database (via Inertia props)
    const supportedLngs = languages?.map(lang => lang.code) || ['tr'];
    const currentLang = languages?.[0]?.code || 'tr';
    const fallbackLng = languages?.find(l => l.code === 'tr')?.code || supportedLngs[0] || 'tr';

    // Build resources object
    const resources = {};
    supportedLngs.forEach(lng => {
        resources[lng] = {
            translation: translations[lng] || {}
        };
    });

    const config = {
        lng: currentLang,
        fallbackLng: fallbackLng,
        supportedLngs: supportedLngs,
        resources: resources,
        interpolation: { escapeValue: false }
    };

    await i18next
        .use(initReactI18next)
        .init(config);

    return i18next;
};

/**
 * Update i18n resources with translations from Inertia props
 * This is called from a React component where we can access Inertia props
 */
export const updateI18nResources = (translations, languages) => {
    if (!translations || !languages) {
        console.warn('Translations or languages not available');
        return;
    }

    const supportedLngs = languages?.map(lang => lang.code) || ['tr'];
    const currentLang = languages?.[0]?.code || 'tr';

    // Update i18next config
    supportedLngs.forEach(lng => {
        const translationData = translations[lng] || {};
        i18next.addResourceBundle(lng, 'translation', translationData, true, true);
    });

    // Set current language
    if (i18next.language !== currentLang) {
        i18next.changeLanguage(currentLang);
    }
};

/**
 * Reload translations after updates
 */
export const reloadTranslations = async () => {
    // Will be called from component with fresh props
};

export default initI18n;
