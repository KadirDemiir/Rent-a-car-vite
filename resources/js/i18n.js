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
    } catch {
        return null;
    }
};

const setCachedConfig = (config) => {
    try {
        const cacheData = JSON.stringify({ version: CACHE_VERSION, config });
        localStorage.setItem(CACHE_KEY, cacheData);
    } catch {}
};

const setConfig = async () => {
    let config;
    try {
        const [currentRes, langsRes] = await Promise.all([
            axios.get('/get-current-language'),
            axios.get('/supported-languages')
        ]);

        const current = currentRes.data;
        const supportedLngs = langsRes.data.length ? langsRes.data : ['tr'];

        const translationPromises = supportedLngs.map(lng =>
            axios.get(`/translations/${lng}`)
                .then(res => ({ [lng]: { translation: res.data } }))
        );

        const translationResults = await Promise.all(translationPromises);

        const resources = translationResults.reduce((acc, res) => ({ ...acc, ...res }), {});

        config = {
            lng: current,
            supportedLngs,
            resources,
            fallbackLng: 'tr',
            interpolation: { escapeValue: false }
        };
    } catch {
        config = {
            lng: 'tr',
            supportedLngs: ['tr'],
            resources: { tr: { translation: {} } },
            fallbackLng: 'tr',
            interpolation: { escapeValue: false }
        };
    }
    return config;
};

const initI18n = async () => {
    let config = getCachedConfig();

    if (!config) {
        config = await setConfig();
        setCachedConfig(config);
    }

    await i18next
        .use(initReactI18next)
        .init(config);

    return i18next;
};

export const reloadTranslations = async () => {
    localStorage.removeItem(CACHE_KEY)
    await initI18n();
};

export default initI18n;
