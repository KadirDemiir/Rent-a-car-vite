import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {Link} from '@inertiajs/react';
import LanguageForm from "../../../components/adminPanel/language/LanguageForm.jsx";
import {useTranslation} from "react-i18next";
import LanguageProgress from "../../../components/adminPanel/LanguageProgress.jsx";
import { useMemo, useState } from "react";
import { Globe, ChevronRight, Sparkles } from "lucide-react";

export default function IndexLanguage({language, keys, campaigns}){
    const {t, i18n} = useTranslation();
    const [selectedLang, setSelectedLang] = useState(language.code);

    const langOpt = useMemo(() => {
        return [{ value: language.code, label: language.name }];
    }, [language]);

    const calculateProgress = useMemo(() => {
        return () => {
            if (!keys || keys.length === 0) return 100;
            const filled = keys.filter(key => {
                const translation = language.translations?.find(tr => tr.translation_key_id === key.id);
                return translation && translation.value?.trim();
            }).length;
            return Math.round((filled / keys.length) * 100);
        };
    }, [keys, language.translations]);

    const isLanguageFilled = (langCode) => {
        if (langCode !== language.code) return false;
        return calculateProgress() === 100;
    };

    const isNew = new Date(language.created_at) > new Date(Date.now() - 86400000);

    return(
        <div className="w-full min-h-screen bg-gray-50">
            <Navbar>
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                    {language.flag_photo_path ? (
                                        <img 
                                            src={`/storage/${language.flag_photo_path}`} 
                                            alt={language.name}
                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <Globe size={24} className="text-white sm:w-7 sm:h-7" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                        {t("adminpanel.languages.edit_language.language_information")}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                        <Link 
                                            href={`/${i18n.language}/${t("address.adminpanel")}/${t("address.languages")}`}
                                            className="hover:text-gray-700 transition-colors"
                                        >
                                            {t("adminpanel.languages.languages")}
                                        </Link>
                                        <ChevronRight size={14} />
                                        <span className="text-gray-700 font-medium">{language.name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {isNew && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold shadow-sm">
                                        <Sparkles size={14} />
                                        <span className="hidden sm:inline">{t("adminpanel.languages.add_new")}</span>
                                    </div>
                                )}
                                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                    language.status === 'active' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${
                                        language.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                                    }`}></span>
                                    {language.status === 'active' 
                                        ? t("adminpanel.languages.edit_language.button.active")
                                        : t("adminpanel.languages.edit_language.button.deactive")
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Language Progress Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                        <LanguageProgress 
                            langOpt={langOpt}
                            calculateProgress={calculateProgress}
                            isLanguageFilled={isLanguageFilled}
                            lang={selectedLang}
                            setLang={setSelectedLang}
                        />
                    </div>

                    {/* Language Form Section */}
                    <LanguageForm language={language} keys={keys} campaigns={campaigns}/>
                </div>
            </Navbar>
        </div>
    );
}
