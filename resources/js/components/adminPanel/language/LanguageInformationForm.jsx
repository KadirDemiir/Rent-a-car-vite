import LanguageInformation from "./LanguageInformation.jsx";
import {useState} from "react";
import LanguageDelete from "./LanguageDelete.jsx";
import LanguageChangeStatus from "./LanguageChangeStatus.jsx";
import axios from "axios";
import {useTranslation} from "react-i18next";
import { Save, Megaphone, Code, CheckCircle, AlertCircle } from "lucide-react";

export default function LanguageInformationForm({lang, setLang, totalCmpCount, cmpErrorCount, totalVariableCount, variableErrorCount}){
    const {t} = useTranslation();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [data, setData] = useState({
        name: { value:  lang.name || '', error: !lang.name},
        code: { value:  lang.code || '', error: !lang.code },
        flag: { value: lang.flag_photo_path || null, error: !lang.flag_photo_path },
    });

    const handleSubmit = () => {
        if(Object.entries(data).some(([k, v]) => v.error)){
            window.scrollTo({top: 0, behavior: "smooth"});
            return;
        }
        const form_data = new FormData();
        form_data.append('name', data.name.value);
        form_data.append('code', data.code.value);
        if(data.flag.value instanceof File)
            form_data.append('flag', data.flag.value);
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
        form_data.append('_method', 'PUT');
        axios.post(`/adminpanel/languages/${lang.code}`, form_data, {
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            }
        })
            .then(response => setSuccess(response.data.success))
            .catch(error => setError(error.response.data.error));
    }
    
    const campaignProgress = totalCmpCount > 0 ? ((totalCmpCount - cmpErrorCount) / totalCmpCount) * 100 : 0;
    const variableProgress = totalVariableCount > 0 ? ((totalVariableCount - variableErrorCount) / totalVariableCount) * 100 : 0;

    return(
        <div className="w-full space-y-6">
            {/* Alert Messages */}
            {(error || success) && (
                <div className="space-y-3">
                    {error && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
                            <AlertCircle size={18} />
                            <span className="text-sm sm:text-base font-medium">{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-800">
                            <CheckCircle size={18} />
                            <span className="text-sm sm:text-base font-medium">{success}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Form Section */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <LanguageInformation data={data} setData={setData}/>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Campaign Stats */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Megaphone size={20} className="text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{t("adminpanel.languages.edit_language.related_campaigns")}</h3>
                            <p className="text-xs text-gray-500">
                                <span className="font-bold text-purple-600">{totalCmpCount - cmpErrorCount}</span>
                                <span className="mx-1">/</span>
                                <span>{totalCmpCount}</span>
                            </p>
                        </div>
                        {cmpErrorCount === 0 ? (
                            <CheckCircle size={20} className="text-green-500" />
                        ) : (
                            <span className="px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-full">
                                {cmpErrorCount}
                            </span>
                        )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                                cmpErrorCount === 0 ? 'bg-green-500' : 'bg-purple-500'
                            }`}
                            style={{width: `${campaignProgress}%`}}
                        ></div>
                    </div>
                </div>

                {/* Site Variables Stats */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Code size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{t("adminpanel.languages.edit_language.site_variables")}</h3>
                            <p className="text-xs text-gray-500">
                                <span className="font-bold text-blue-600">{totalVariableCount - variableErrorCount}</span>
                                <span className="mx-1">/</span>
                                <span>{totalVariableCount}</span>
                            </p>
                        </div>
                        {variableErrorCount === 0 ? (
                            <CheckCircle size={20} className="text-green-500" />
                        ) : (
                            <span className="px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-full">
                                {variableErrorCount}
                            </span>
                        )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                                variableErrorCount === 0 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{width: `${variableProgress}%`}}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Actions Section */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button 
                        onClick={handleSubmit}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        <Save size={18} />
                        {t("adminpanel.add_languages.button.save")}
                    </button>
                    <div className="flex-1">
                        <LanguageChangeStatus lang={lang} setLang={setLang} setError={setError} setSuccess={setSuccess}/>
                    </div>
                    <div className="flex-shrink-0">
                        <LanguageDelete setError={setError} lang={lang}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
