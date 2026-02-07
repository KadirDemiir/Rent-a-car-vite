import { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage, router } from '@inertiajs/react';
import { languages } from '../../constans/language.js';
import axios from 'axios';

export default function LanguageDropdown() {
    const { i18n } = useTranslation();
    const { languages: inertiaLanguages, locale } = usePage().props;
    const ref = useRef(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const langs = useMemo(() =>
        inertiaLanguages?.map(l => l.code).filter(l => l !== 'cimode') || ['tr'],
        [inertiaLanguages]
    );

    useEffect(() => {
        if (locale && i18n.language.split('-')[0] !== locale) {
            i18n.changeLanguage(locale);
        }
    }, [locale, i18n]);

    useEffect(() => {
        const handle = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    const current = i18n.language.split('-')[0];

    const handleChangeLang = async (lng) => {
        if (current === lng || loading) return;

        setLoading(true);

        try {
            const currLang = i18n.language.split('-')[0];
            const urlSegments = window.location.pathname.toLocaleLowerCase().split('/').filter(Boolean);

            // Fetch translations for the new language BEFORE translating URL
            let newTranslations = i18n.store.data[lng]?.translation;

            if (!newTranslations || Object.keys(newTranslations).length === 0) {
                // Fetch from server
                const response = await axios.get(`/locales/${lng}/translation.json`);
                newTranslations = response.data;
                // Add to i18n store
                i18n.addResourceBundle(lng, 'translation', newTranslations, true, true);
            }

            await i18n.changeLanguage(lng);

            let newUrl = '/' + lng;

            const currTranslations = i18n.store.data[currLang]?.translation || {};

            for (let i = 1; i < urlSegments.length; i++) {
                const segment = urlSegments[i];
                const key = Object.keys(currTranslations).find(k => currTranslations[k] === segment);

                if (key && newTranslations[key]) {
                    newUrl += '/' + newTranslations[key].toLocaleLowerCase();
                } else {
                    newUrl += '/' + segment;
                }
            }

            const searchParams = window.location.search;
            const hash = window.location.hash;
            router.visit(newUrl + searchParams + hash);
        } catch (error) {
            console.error('Language switch error:', error);
            // Fallback: just change language segment
            const urlSegments = window.location.pathname.split('/').filter(Boolean);
            urlSegments[0] = lng;
            router.visit('/' + urlSegments.join('/') + window.location.search + window.location.hash);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={ref} className="w-28 relative flex items-center justify-center">
            <button type="button" onClick={() => !loading && setOpen(!open)} className={`w-full px-2 py-1.5 border border-gray-400/60 bg-gray-500 text-white rounded-xl flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}>
                {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <img src={languages[current]?.flag} alt="" className="h-5 w-5 rounded-full" />
                )}
                <span className="text-sm font-semibold">{current.toUpperCase()}</span>
                <div className="h-5 w-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 ${open ? "rotate-180" : ""} transition-transform`}>
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </button>
            {open && !loading && (
                <ul className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-full z-40 text-center overflow-hidden">
                    {langs.map(lng => (
                        <li key={lng}>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    handleChangeLang(lng);
                                }}
                                className={`flex items-center justify-between w-full px-3 py-2 text-sm ${current === lng ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                                <img src={languages[lng]?.flag} alt="" className="h-5 w-5 rounded-full" />
                                {lng.toUpperCase()}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
