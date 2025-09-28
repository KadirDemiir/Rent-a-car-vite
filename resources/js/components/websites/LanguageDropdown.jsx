import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {router, usePage} from '@inertiajs/react';
import { languages } from '../../constans/language.js';

export default function LanguageDropdown() {
    const { i18n } = useTranslation();
    const ref = useRef(null);
    const [open, setOpen] = useState(false);
    const { locale } = usePage().props;
    const langs = i18n.options?.supportedLngs?.filter(l => l !== 'cimode') || [];

    useEffect(() => {
        if (locale && i18n.language.split('-')[0] !== locale) {
            i18n.changeLanguage(locale);
        }
    }, [locale, i18n.language, i18n]);

    useEffect(() => {
        const handle = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    const current = i18n.language.split('-')[0];

    const handleChangeLang = (lng) => {
        const currLang = i18n.language.split('-')[0];
        const url = window.location.pathname.split('/').filter(Boolean);
        let newUrl = '/' + lng;
        for (let i = 1; i < url.length; i++) {
            const currTranslations = i18n.store.data[currLang]?.translation || {};
            const newTranslations = i18n.store.data[lng]?.translation || {};
            const key = Object.keys(currTranslations).find(k => currTranslations[k] === url[i]);
            if (key) {
                const translatedSegment = newTranslations[key] || url[i];
                newUrl += '/' + translatedSegment;
            } else {
                newUrl += '/' + url[i];
            }
        }
        router.visit(newUrl, { method: 'get', preserveState: true, preserveScroll: true });
    };

    return (
        <div ref={ref} className="w-24 relative flex items-center justify-center">
            <button onClick={() => setOpen(!open)} className="px-2 py-1 border rounded-xl flex items-center justify-center gap-2">
                <img src={languages[current]?.flag} alt="" className="h-6 w-6 rounded-2xl" />
                <span>{current.toUpperCase()}</span>
                <div className="h-6 w-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </button>
            {open && (
                <ul className="absolute top-full mt-2 bg-white border rounded shadow-md w-24 z-40 text-center">
                    {langs.map(lng => (
                        <li key={lng}>
                            <button
                                onClick={() => handleChangeLang(lng)}
                                className={`flex items-center justify-between w-full px-4 py-2 ${current === lng ? 'bg-blue-800 text-white' : ''}`}
                            >
                                <img src={languages[lng]?.flag} alt="" className="h-6 w-6 rounded-2xl" />
                                {lng.toUpperCase()}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
