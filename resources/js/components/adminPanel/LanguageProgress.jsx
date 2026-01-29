import {useTranslation} from "react-i18next";;
export default function LanguageProgress({langOpt, calculateProgress, isLanguageFilled, lang, setLang}){
    const {t} = useTranslation();
    return(
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">{t("adminpanel.pricing.adding_services.internal_services.select_language")}</label>
                <span className={`font-bold text-sm ${calculateProgress() === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                    {calculateProgress()}%
                </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2 mb-4">
                <div 
                    className={`h-2 rounded-full transition-all duration-300 ${calculateProgress() === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                    style={{ width: `${calculateProgress()}%` }}
                />
            </div>
            <div className="flex gap-2 justify-center overflow-x-auto">
                {langOpt?.map((l) => {
                    const isFilled = isLanguageFilled(l.value);
                    const isActive = lang === l.value;
                    return (
                        <button
                            key={l.value}
                            type="button"
                            
                            onClick={() => setLang(l.value)}
                            className={`
                                px-4 py-2 rounded-lg text-sm font-medium transition-all select-none flex items-center gap-2
                                ${isActive 
                                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }
                                ${!isFilled && !isActive ? 'border-red-200 bg-red-50' : ''}
                            `}
                        >
                            {l.label}
                            {isFilled && (
                                <span className={`flex items-center justify-center w-4 h-4 text-xs rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600'}`}>
                                    ✓
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}