import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import axios from 'axios';

const CACHE_KEY = 'i18n_config_cache';
const CACHE_VERSION = 'v1.0.0';

const getCachedConfig = () => {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (!cachedData) return null;

        const { version, config } = JSON.parse(cachedData);

        if (version !== CACHE_VERSION) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
        return config;
    } catch (e) {
        console.error('Önbellek okunurken hata:', e);
        return null;
    }
};

const setCachedConfig = (config) => {
    try {
        const cacheData = JSON.stringify({ version: CACHE_VERSION, config });
        localStorage.setItem(CACHE_KEY, cacheData);
    } catch (e) {
        console.error('Önbelleğe kaydetme hatası:', e);
    }
};

const setConfig = async () => {
    let config;
    console.log('⌛ Önbellek boş. Sunucudan çekiliyor... (Cache Miss)');
    try {
        const [currentRes, langsRes] = await Promise.all([
            axios.get('/get-current-language'),
            axios.get('/supported-languages')
        ]);

        const current = currentRes.data;
        const supportedLngs = langsRes.data.length ? langsRes.data : ['tr'];

        const translationPromises = supportedLngs.map(lng =>
            axios.get(`/translations/${lng}`)
                .then(res => ({[lng]: {translation: res.data}}))
        );

        const translationResults = await Promise.all(translationPromises);

        const resources = translationResults.reduce((acc, res) => ({...acc, ...res}), {});

        config = {
            lng: current,
            supportedLngs,
            resources,
            fallbackLng: 'tr',
            interpolation: {escapeValue: false},
        };
    } catch (e) {
        console.error('Diller veya çeviriler alınamadı, default kullanılıyor.', e);
        config = {
            lng: 'tr',
            supportedLngs: ['tr'],
            resources: {tr: {translation: {}}},
            fallbackLng: 'tr',
            interpolation: {escapeValue: false},
        };
    }
    return config;
}

const initI18n = async () => {
    let config = getCachedConfig();

    if (config) {
        console.log('✅ Çeviriler önbellekten yüklendi (Cache Hit)');
    } else {
        const config = setConfig();
        setCachedConfig(config);
    }

    await i18next
        .use(initReactI18next)
        .init(config);

    return i18next;
};

export const reloadTranslations = async (language = i18next.language) => {
    try {
        const res = await axios.get(`/translations/${language}`);
        const newTranslations = res.data;

        i18next.addResourceBundle(language, 'translation', newTranslations, true, true);
        await i18next.changeLanguage(language);

        const currentConfig = getCachedConfig() || {
            lng: language,
            supportedLngs: [language],
            resources: {},
            fallbackLng: 'tr'
        };

        currentConfig.resources[language] = { translation: newTranslations };
        currentConfig.lng = language;
        setCachedConfig(currentConfig);

        console.log(`✅ ${language} dili için çeviriler yenilendi ve önbellek güncellendi.`);
    } catch (e) {
        console.error('❌ Çeviriler yeniden yüklenemedi:', e);
    }
};

export default initI18n;
