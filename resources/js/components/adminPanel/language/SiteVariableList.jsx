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
        console.log(tKey.key.split('.').reverse()[0] === keys[0].key.split('.').reverse()[0]);
        if(formData[tKey.key]?.error)
            return;
        const filteredKeys = keys.filter(k => k.key.split('.').reverse()[0] === tKey.key.split('.').reverse()[0]);
        console.log(filteredKeys);
        filteredKeys.forEach(fk => {
            console.log(fk, value);
            if(!formData[fk.key].value)
                handleChange(value, fk);
        })
    }
    return(
        <div className={`space-y-4 space-x-4 grid grid-cols-2 `}>
            {keys.map((key, index) => (
                <div key={key.key} className={`p-4 bg-white shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition ${formData[key.key]?.error ? 'border-12 border-red-500' : ''}`}>
                    <div className="text-sm text-gray-500 mb-1">#{index + 1}</div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700">Key:</label>
                        <div className="mt-1 text-gray-900 font-mono text-sm break-all font-bold">{key.key}</div>
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700">Description:</label>
                        <div className="mt-1 text-gray-700 font-semibold break-all">{key.description}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Translation</label>
                        <input onChange={(e) => handleChange(e.target.value, key)} type="text" name={key.key} value={formData[key.key]?.value || ""}
                               className={`mt-1 w-full h-8 rounded-md border ${formData[key.key]?.error ? "border-red-500" : "border-gray-300"} shadow-sm sm:text-otline-none p-2 outline-none`}
                        />
                        {formData[key.key]?.error && (
                            <p className="mt-1 text-sm text-red-600">{formData[key.key].error}</p>
                        )}
                    </div><br/>
                    <div>
                        <div className={`rounded-xl `}>
                            <button onClick={() => applyAll(key, formData[key.key].value)} className={`py-1 px-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600`}>{t("adminpanel.add_languages.apply_all")} '.{ key.key.split('.').reverse()[0] }'</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
