import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import axios from 'axios';

const initI18n = async () => {
    let supportedLngs;
    let resources = {};
    let current;

    try {
        const currentRes = await axios.get('/get-current-language');
        current = currentRes.data;

        const langs = await axios.get('/supported-languages');
        if (langs.data.length) supportedLngs = langs.data;

        for (const lng of supportedLngs) {
            const res = await axios.get(`/translations/${lng}`);
            resources[lng] = { translation: res.data };
        }
    } catch (e) {
        console.error('Diller veya çeviriler alınamadı, default kullanılıyor.', e);
    }

    await i18next
        .use(initReactI18next)
        .init({
            supportedLngs,
            fallbackLng: 'tr',
            lng: current,
            interpolation: { escapeValue: false },
            resources,
        });

    return i18next;
};

export const reloadTranslations = async (language = i18next.language) => {
    try {
        const res = await axios.get(`/translations/${language}`);
        i18next.addResourceBundle(language, 'translation', res.data, true, true);
        await i18next.changeLanguage(language);
        console.log(`✅ ${language} dili için çeviriler yenilendi.`);
    } catch (e) {
        console.error('❌ Çeviriler yeniden yüklenemedi:', e);
    }
};

export default initI18n;
