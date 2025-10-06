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
export default function LanguageForm({ language  , keys, campaigns}) {
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
                console.log(kk);
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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-center">
                <div className="w-[60%] h-16 flex items-center justify-evenly gap-4 py-2 text-white">
                    {EDIT_SECTION.map(section => (
                        <button key={section.value} onClick={() => setActiveSection(section.value)} className={`relative w-full h-16 px-2 rounded-lg hover:bg-blue-600 ${activeSection === section.value ? "bg-blue-600" : "bg-blue-400"}`}>
                            {section.label}
                            {section.value === "site_variable" && siteVariableStats.hasError && (
                                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
                            )}
                            {section.value === "related_camp" && hasCampaignError && (
                                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
            {success && <div className={`w-full border-l-12 border-green-600 bg-green-500 text-white p-2`}>{success}</div>}
            {error && <div className={`w-full border-l-12 border-red-600 bg-red-500 text-white p-2`}>{error}</div>}

            {activeSection === 'lang_info' && <LanguageInformationForm lang={lang} setLang={setLang} totalCmpCount={totalCampaign} cmpErrorCount={campaignErrorCount} totalVariableCount={siteVariableStats.total} variableErrorCount={siteVariableStats.errorCount}/>}
            {activeSection === 'site_variable' && <SiteVariableForm keys={keys} language={lang} setLang={setLang}/>}
            {activeSection === 'related_camp' && <CampaignLanguage campaigns={campaigns} lang={lang}/>}
        </div>
    );
}
