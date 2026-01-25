import {useTranslation} from "react-i18next";

export default function SiteVariableList({keys, formData, setFormData}){
    const {t} = useTranslation();

    const handleChange = (value, keyObj) => {
        const keyName = keyObj.key;
        const placeholders = keyObj.key.match(/{\w+}/g) || keyObj.description?.match(/{\w+}/g) || [];
        let error = "";
        if (value.trim() === "") error = "Bu alan boş olamaz";
        else if (value.length > 500) error = "Çeviri 500 karakteri geçemez";
        else if (/<script|alert\(|eval\(/i.test(value)) error = "Geçersiz karakter içeriyor";
        else if (/<[a-z][\s\S]*>/i.test(value)) error = "You cannot write HTML Tags";
        else if (keyObj.format && !new RegExp(keyObj.format).test(value)) error = "Geçersiz format";
        else if (placeholders.length && !placeholders.every(ph => value.includes(ph))) error = `Metin şu değişkenleri içermelidir: ${placeholders.join(", ")}`;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {keys.map((key, index) => (
                <div 
                    key={key.key} 
                    className={`p-4 md:p-5 bg-white shadow-sm rounded-lg border transition-all duration-200 ${
                        formData[key.key]?.error 
                            ? 'border-red-500 ring-1 ring-red-200' 
                            : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                    }`}
                >
                    {/* Index */}
                    <div className="text-xs md:text-sm text-gray-500 mb-3 font-medium">
                        #{index + 1}
                    </div>

                    {/* Key */}
                    <div className="mb-3 md:mb-4">
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">Key:</label>
                        <div className="text-xs md:text-sm text-gray-900 font-mono break-all bg-gray-50 p-2 rounded border border-gray-200">
                            {key.key}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-3 md:mb-4">
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">Description:</label>
                        <div className="text-xs md:text-sm text-gray-700 break-words">
                            {key.description}
                        </div>
                    </div>

                    {/* Translation Input */}
                    <div className="mb-3 md:mb-4">
                        <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Translation</label>
                        <input 
                            onChange={(e) => handleChange(e.target.value, key)} 
                            type="text" 
                            name={key.key} 
                            value={formData[key.key]?.value || ""}
                            className={`w-full px-3 py-2 md:py-2.5 rounded-lg border outline-none focus:ring-1 transition-all text-xs md:text-sm ${
                                formData[key.key]?.error 
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                            }`}
                        />
                        {formData[key.key]?.error && (
                            <p className="mt-1 md:mt-2 text-xs md:text-sm text-red-600 font-medium">
                                {formData[key.key].error}
                            </p>
                        )}
                    </div>

                    {/* Apply All Button */}
                    <button 
                        onClick={() => applyAll(key, formData[key.key].value)} 
                        disabled={!!formData[key.key]?.error}
                        className={`w-full px-3 py-2 rounded-lg font-medium text-xs md:text-sm transition-all duration-200 active:scale-95 ${
                            formData[key.key]?.error
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {t("adminpanel.add_languages.apply_all")} '{key.key.split('.').reverse()[0]}'
                    </button>
                </div>
            ))}
        </div>
    );
}
