import {useMemo, useState} from "react";
import SiteVariableForm from "./SiteVariableForm.jsx";
import LanguageInformationForm from "./LanguageInformationForm.jsx";
import CampaignLanguage from "./CampaignLanguage.jsx";
import {useTranslation} from "react-i18next";
import { Globe, Code, Megaphone, Car } from "lucide-react";
import SuccessMessage from "../../SuccessMessage.jsx";

export default function LanguageForm({ language, keys, campaigns}) {
    const {t} = useTranslation();
    
    const EDIT_SECTION = [
        {label: t("adminpanel.languages.edit_language.language_information"), value: "lang_info", icon: Globe},
        {label: t("adminpanel.languages.edit_language.site_variables"), value: "site_variable", icon: Code},
        {label: t("adminpanel.languages.edit_language.related_campaigns"), value: "related_camp", icon: Megaphone},
        {label: t("adminpanel.languages.edit_language.cars"), value: "cars", icon: Car}
    ];

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
            const cmT = JSON.parse(cmp.title, true);
            const cmC = JSON.parse(cmp.content, true);
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
        const Icon = section.icon;

        return (
            <button
                key={section.value}
                onClick={() => setActiveSection(section.value)}
                className={`relative flex items-center justify-center gap-2 px-4 py-3 sm:py-4 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 ${
                    isActive
                        ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg ring-2 ring-gray-300 ring-offset-2'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                }`}
            >
                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500'} />
                <span className="hidden sm:inline">{section.label}</span>
                {hasError && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
                )}
            </button>
        );
    };

    return (
        <div className="w-full space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {EDIT_SECTION.map(renderTabButton)}
                </div>
            </div>

            {/* Alert Messages */}
            {(success || error) && (
                <div className="space-y-3">
                    <SuccessMessage message={success} className="mb-0" />
                    {error && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-sm sm:text-base font-medium">{error}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Content Sections */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
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
