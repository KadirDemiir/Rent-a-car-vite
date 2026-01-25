import LanguageInformation from "./LanguageInformation.jsx";
import {useState} from "react";
import LanguageDelete from "./LanguageDelete.jsx";
import LanguageChangeStatus from "./LanguageChangeStatus.jsx";
import axios from "axios";
import {useTranslation} from "react-i18next";

export default function LanguageInformationForm({lang, setLang, totalCmpCount, cmpErrorCount, totalVariableCount, variableErrorCount}){
    const {t} = useTranslation();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [data, setData] = useState({
        name: { value:  lang.name || '', error: lang.name ?  '' : 'This Field Cant Be Empty.'},
        code: { value:  lang.code || '', error: lang.code ? '' : 'This Field Cant Be Empty.' },
        flag: { value: lang.flag_photo_path || null, error: lang.flag_photo_path ? '' : 'This Field Cant Be Empty.'  },
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
        axios.post(`/adminpanel/languages/${lang.id}`, form_data, {
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            }
        })
            .then(response => setSuccess(response.data.success))
            .catch(error => setError(error.response.data.error));
    }
    return(
        <div className="w-full space-y-4 lg:space-y-6 px-2 sm:px-4 md:px-0">
            {/* Alert Messages */}
            <div className="space-y-2 md:space-y-3">
                {error && (
                    <div className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm md:text-base">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm md:text-base">
                        {success}
                    </div>
                )}
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 space-y-4 md:space-y-6">
                <LanguageInformation data={data} setData={setData}/>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 space-y-2 md:space-y-3">
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 break-words">TOTAL CAMPAIGN COUNT: {totalCmpCount}, LANGUAGE ERROR CAMPAIGN COUNT:{cmpErrorCount}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 md:h-2.5">
                        <div 
                            className={`h-2 md:h-2.5 rounded-full transition-all ${
                                cmpErrorCount === 0 ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{width: `${totalCmpCount > 0 ? ((totalCmpCount - cmpErrorCount) / totalCmpCount) * 100 : 0}%`}}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 space-y-2 md:space-y-3">
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 break-words">TOTAL SITE VARİABLE COUNT: {totalVariableCount}, VARIABLE ERROR COUNT: {variableErrorCount}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 md:h-2.5">
                        <div 
                            className={`h-2 md:h-2.5 rounded-full transition-all ${
                                variableErrorCount === 0 ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{width: `${totalVariableCount > 0 ? ((totalVariableCount - variableErrorCount) / totalVariableCount) * 100 : 0}%`}}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Actions Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 lg:gap-4">
                    <button 
                        onClick={handleSubmit}
                        className="w-full sm:flex-1 px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white font-medium text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm active:scale-95"
                    >
                        {t("adminpanel.languages.edit_language.button.delete")}
                    </button>
                    <div className="w-full sm:flex-1 flex flex-col sm:flex-row gap-2 md:gap-3">
                        <div className="flex-1">
                            <LanguageChangeStatus lang={lang} setLang={setLang} setError={setError} setSuccess={setSuccess}/>
                        </div>
                        <div className="flex-1">
                            <LanguageDelete setError={setError} lang={lang}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
