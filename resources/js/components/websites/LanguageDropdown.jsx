import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {router, usePage} from '@inertiajs/react';
import { languages } from '../../constans/language.js';

export default function LanguageDropdown() {
    const { i18n } = useTranslation();
    const {languages: inertiaLanguages } = usePage().props;
    const ref = useRef(null);
    const [open, setOpen] = useState(false);
    const { locale } = usePage().props;
    const langs = inertiaLanguages?.map(l => l.code).filter(l => l !== 'cimode') || ['tr'];

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

    const handleChangeLang = async (lng) => {
        const currLang = i18n.language.split('?');
        const url = window.location.pathname.split('/').filter(Boolean);
        let newUrl = '/' + lng;
        await i18n.changeLanguage(lng)
        .then(() => {
        console.log(i18n.language);

        for (let i = 1; i < url.length; i++) {
            const currTranslations = i18n.store.data[currLang[0].split('/')[0]]?.translation || {};
            const newTranslations = i18n.store.data[lng]?.translation || {};
            const key = Object.keys(currTranslations).find(k => currTranslations[k] === url[i]);
            if (key) {
                const translatedSegment = newTranslations[key] || url[i];
                newUrl += '/' + translatedSegment;
            } else {
                newUrl += '/' + url[i];
            }
        }

        const searchParams = window.location.search;
        const hash = window.location.hash;
        newUrl += searchParams + hash;

            window.location.href = newUrl + window.location.search;
        });
    };

    return (
        <div ref={ref} className="w-28 relative flex items-center justify-center">
            <button type={`button`} onClick={() => setOpen(!open)} className="w-full px-2 py-1.5 border border-blue-400/60 bg-blue-500 text-white rounded-xl flex items-center justify-center gap-2">
                <img src={languages[current]?.flag} alt="" className="h-5 w-5 rounded-full" />
                <span className="text-sm font-semibold">{current.toUpperCase()}</span>
                <div className="h-5 w-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 ${open ? "rotate-180" : ""} transition-transform`}>
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </button>
            {open && (
                <ul className="absolute top-full mt-2 bg-white border border-blue-200 rounded-lg shadow-lg w-full z-40 text-center overflow-hidden">
                    {langs.map(lng => (
                        <li key={lng}>
                            <button
                                onClick={() => {handleChangeLang(lng); setOpen(false)}}
                                className={`flex items-center justify-between w-full px-3 py-2 text-sm ${current === lng ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}>
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
