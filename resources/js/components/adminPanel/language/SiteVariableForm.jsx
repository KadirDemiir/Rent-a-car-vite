import {useState} from "react";
import SiteVariable from "./SiteVariable.jsx";
import axios from "axios";
import {reloadTranslations} from "../../../i18n.js";
import { useTranslation } from "react-i18next";

export default function SiteVariableForm({keys, language}){
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [formData, setFormData] = useState(() =>
        keys.reduce((acc, key) => {
            const translation = language.translations.find((t) => t.translation_key_id === key.id);
            acc[key.key] = {
                value: translation ? translation.value : "",
                error: translation?.value.trim() ? "" : "This field can't be empty" ,
            };
            return acc;
        }, {})
    );
    const {i18n} = useTranslation();

    const handleSubmit = () => {
        const hasError = Object.entries(formData).some(([, value]) => value.value.trim() === "" || value.error !== "");

        if (hasError) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setError(null);
        setSuccess(null);

        const payload = Object.entries(formData).map(([key, value]) => ({
            key,
            value: value.value
        }));

        axios.put(`/adminpanel/languages/${language.id}/update-site-variable`, {
            language_id: language.id,
            translations: payload
        })
        .then(response => {
            setSuccess(response.data.success);
            localStorage.removeItem('i18n_config_cache');
            reloadTranslations(i18n.language);
        })
        .catch(err => {
            setError(err.response?.data?.error || "Kaydetme sırasında bir hata oluştu.");
        });
    };

    return(
        <div className="w-full space-y-4 md:space-y-6">
            {/* Alert Messages */}
            <div className="space-y-2 md:space-y-3">
                {success && (
                    <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm md:text-base">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm md:text-base">
                        {error}
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button 
                    onClick={handleSubmit}
                    className="px-6 md:px-8 py-2 md:py-3 bg-blue-600 text-white font-medium text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm active:scale-95"
                >
                    Save
                </button>
            </div>

            {/* Site Variables */}
            <SiteVariable keys={keys} formData={formData} setFormData={setFormData}/>
        </div>
    );
}
