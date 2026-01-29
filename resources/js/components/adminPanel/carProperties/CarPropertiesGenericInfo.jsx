import {useTranslation} from "react-i18next";
import LanguageProgress from "../LanguageProgress.jsx";

    export default function CarPropertiesGenericInfo({title, name, langOptions, currentLang, setCurrentLang, formData, setFormData}){
        const {t} = useTranslation();
        const langProgress = () => {
            const total = Object.keys(formData.name).length;
            const filled = Object.entries(formData.name).filter(([key, value]) => value.value.trim() !== "" ).length;
            return filled*100/total;
        }

        const progressPercentage = Math.round(langProgress());

    return(
        <div className="w-full">
            <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200">
                <LanguageProgress langOpt={langOptions} calculateProgress={langProgress} isLanguageFilled={(langValue) => formData.name[langValue]?.value.trim() !== ""} lang={currentLang} setLang={setCurrentLang} />

                <div className="space-y-6 mt-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{name}:</label>
                        <input 
                            value={formData.name[currentLang].value}   
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    name: {
                                        ...prev.name,
                                        [currentLang]: {
                                            ...prev.name[currentLang],
                                            value: e.target.value
                                        }
                                    }
                                }))
                            } 
                            type="text" 
                            placeholder={name}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                        {formData.name[currentLang].error && <span className="mt-2 block p-3 border-l-4 border-red-500 bg-red-50 text-red-700 text-sm rounded">*{formData.name[currentLang].error}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
    }
