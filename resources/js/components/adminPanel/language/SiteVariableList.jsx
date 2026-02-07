import {useTranslation} from "react-i18next";
import { Key, FileText, Copy, AlertCircle, CheckCircle } from "lucide-react";

export default function SiteVariableList({keys, formData, setFormData}){
    const {t} = useTranslation();

    const handleChange = (value, keyObj) => {
        const keyName = keyObj.key;
        const placeholders = keyObj.key.match(/{\w+}/g) || keyObj.description?.match(/{\w+}/g) || [];
        let error = false;
        if (value.trim() === "") error = true;
        else if (value.length > 500) error = true;
        else if (/<script|alert\(|eval\(/i.test(value)) error = true;
        else if (/<[a-z][\s\S]*>/i.test(value)) error = true;
        else if (keyObj.format && !new RegExp(keyObj.format).test(value)) error = true;
        else if (placeholders.length && !placeholders.every(ph => value.includes(ph))) error = true;
        setFormData(prev => ({...prev,[keyName]:{...prev[keyName],value,error}}));
    };

    const applyAll = (tKey, value) => {
        if(formData[tKey.key]?.error)
            return;
        const filteredKeys = keys.filter(k => k.key.split('.').reverse()[0] === tKey.key.split('.').reverse()[0]);
        filteredKeys.forEach(fk => {
            if(!formData[fk.key].value)
                handleChange(value, fk);
        })
    }

    return(
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {keys.map((key, index) => {
                const hasError = formData[key.key]?.error;
                const hasValue = formData[key.key]?.value?.trim();
                
                return (
                    <div 
                        key={key.key} 
                        className={`relative p-4 sm:p-5 bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                            hasError 
                                ? 'border-red-300 bg-red-50/30' 
                                : hasValue 
                                    ? 'border-green-200 bg-green-50/20' 
                                    : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {/* Status indicator */}
                        <div className="absolute top-3 right-3">
                            {hasError ? (
                                <AlertCircle size={18} className="text-red-500" />
                            ) : hasValue ? (
                                <CheckCircle size={18} className="text-green-500" />
                            ) : null}
                        </div>

                        {/* Index Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 mb-4">
                            #{index + 1}
                        </div>

                        {/* Key */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Key size={14} className="text-gray-400" />
                            </div>
                            <div className="text-xs text-gray-900 font-mono break-all bg-gray-100 p-3 rounded-xl border border-gray-200">
                                {key.key}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText size={14} className="text-gray-400" />
                            </div>
                            <div className="text-sm text-gray-700 break-words leading-relaxed">
                                {key.description}
                            </div>
                        </div>

                        {/* Translation Input */}
                        <div className="mb-4">
                            <input 
                                onChange={(e) => handleChange(e.target.value, key)} 
                                type="text" 
                                name={key.key} 
                                value={formData[key.key]?.value || ""}
                                className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:ring-2 transition-all text-sm ${
                                    hasError 
                                        ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-white" 
                                        : "border-gray-200 focus:border-blue-400 focus:ring-blue-100 bg-gray-50 focus:bg-white"
                                }`}
                            />
                        </div>

                        {/* Apply All Button */}
                        <button 
                            onClick={() => applyAll(key, formData[key.key].value)} 
                            disabled={hasError || !hasValue}
                            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${
                                hasError || !hasValue
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 shadow-sm hover:shadow-md'
                            }`}
                        >
                            <Copy size={16} />
                            {t("adminpanel.add_languages.apply_all")} '{key.key.split('.').reverse()[0]}'
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
