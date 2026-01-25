import {useMemo, useState} from "react";
import SiteVariableForm from "./SiteVariableForm.jsx";
import LanguageInformationForm from "./LanguageInformationForm.jsx";
import CampaignLanguage from "./CampaignLanguage.jsx";
import {useTranslation} from "react-i18next";

const EDIT_SECTION = [
    {label: "Language Information", value: "lang_info"},
    {label: "Site Variable", value: "site_variable"},
    {label: "Related Campaigns", value: "related_camp"},
    {label: "Cars", value: "cars"}
];

export default function LanguageForm({ language, keys, campaigns}) {
    const {t} = useTranslation();
    const [activeSection, setActiveSection] = useState(EDIT_SECTION[0].value);
    const [lang, setLang] = useState(language);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const siteVariableStats = useMemo(() => {
        let errors = 0;
        keys.forEach(key => {
            const kk = lang.translations.find(a => a.translation_key_id === key.id);
            if (!kk || !kk.value?.trim()) {
                errors++
            }
        });
        return {
            hasError: errors > 0,
            total: keys.length,
            errorCount: errors
        };
    }, [keys, lang.translations]);

    const { hasCampaignError, totalCampaign, campaignErrorCount } = useMemo(() => {
        let errors = 0;
        campaigns.forEach(cmp => {
            const cmT = JSON.parse(cmp.title || "{}");
            const cmC = JSON.parse(cmp.content || "{}");
            if (!cmT?.[lang.code]?.trim() || !cmC?.[lang.code]?.trim()) errors++;
        });
        return {
            hasCampaignError: errors > 0,
            totalCampaign: campaigns.length,
            campaignErrorCount: errors
        };
    }, [campaigns, lang.code]);

    const renderTabButton = (section) => {
        const isActive = activeSection === section.value;
        const hasError = (section.value === "site_variable" && siteVariableStats.hasError) || 
                        (section.value === "related_camp" && hasCampaignError);

        return (
            <button
                key={section.value}
                onClick={() => setActiveSection(section.value)}
                className={`relative flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                {section.label}
                {hasError && (
                    <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
            </button>
        );
    };

    return (
        <div className="w-full space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {EDIT_SECTION.map(renderTabButton)}
                </div>
            </div>

            {/* Alert Messages */}
            <div className="space-y-3">
                {success && (
                    <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800">
                        {error}
                    </div>
                )}
            </div>

            {/* Content Sections */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {activeSection === 'lang_info' && (
                    <LanguageInformationForm 
                        lang={lang} 
                        setLang={setLang} 
                        totalCmpCount={totalCampaign} 
                        cmpErrorCount={campaignErrorCount} 
                        totalVariableCount={siteVariableStats.total} 
                        variableErrorCount={siteVariableStats.errorCount}
                    />
                )}
                {activeSection === 'site_variable' && (
                    <SiteVariableForm 
                        keys={keys} 
                        language={lang} 
                        setLang={setLang}
                    />
                )}
                {activeSection === 'related_camp' && (
                    <CampaignLanguage 
                        campaigns={campaigns} 
                        lang={lang}
                    />
                )}
            </div>
        </div>
    );
}
