import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../constans/language.js';

export default function LanguageDropdown() {
    const dropdownRef = useRef(null);
    const [isLanOpen, setIsLanOpen] = useState(false);
    const { i18n } = useTranslation();

    const currentLang = i18n.language.split('-')[0];

    const supportedLanguages = i18n.options?.supportedLngs?.filter(lng => lng !== 'cimode') || [];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLanOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="w-24 relative flex items-center justify-center">
            <button
                onClick={() => setIsLanOpen(!isLanOpen)}
                className="px-2 py-1 border rounded-xl flex items-center justify-center gap-2"
            >
                <img src={languages[currentLang]?.flag} alt="" className="h-6 w-6 rounded-2xl" />
                <span>{currentLang.toUpperCase()}</span>
                <div className="h-6 w-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                    >
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </button>

            {isLanOpen && (
                <ul className="absolute top-full mt-2 bg-white border rounded shadow-md w-24 z-40 text-center">
                    {supportedLanguages.map((lng) => (
                        <li key={lng}>
                            <button
                                onClick={() => {
                                    i18n.changeLanguage(lng);
                                    setIsLanOpen(false);
                                }}
                                className={`flex items-center justify-between w-full px-4 py-2 ${
                                    i18n.language.startsWith(lng) ? 'bg-blue-800 text-white' : ''
                                }`}
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
