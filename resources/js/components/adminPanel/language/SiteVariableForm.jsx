import {useState} from "react";
import SiteVariable from "./SiteVariable.jsx";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Save, CheckCircle, AlertCircle } from "lucide-react";

export default function SiteVariableForm({keys, language}){
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [formData, setFormData] = useState(() =>
        keys.reduce((acc, key) => {
            const translation = language.translations.find((t) => t.translation_key_id === key.id);
            acc[key.key] = {
                value: translation ? translation.value : "",
                error: !translation?.value?.trim(),
            };
            return acc;
        }, {})
    );
    const {t} = useTranslation();

    const handleSubmit = () => {
        console.log(1);
        const hasError = Object.entries(formData).some(([, value]) => value.value.trim() === "" || value.error);
        if (hasError) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        console.log(2);
        setError(null);
        setSuccess(null);
        console.log(3);
        const payload = Object.entries(formData).map(([key, value]) => ({
            key,
            value: value.value
        }));
        console.log(4);
        axios.put(`/adminpanel/languages/${language.code}/update-site-variable`, {
            language_id: language.id,
            translations: payload
        })
        .then(response => {
            console.log(response.data);
            setSuccess(response.data.success);
            localStorage.removeItem('i18n_config_cache');
        })
        .catch(err => {
            console.log(response.data);
            setError(err.response?.data?.error);
        });
    };

    return(
        <div className="w-full space-y-6">
            {/* Alert Messages */}
            {(success || error) && (
                <div className="space-y-3">
                    {success && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-800">
                            <CheckCircle size={18} />
                            <span className="text-sm sm:text-base font-medium">{success}</span>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
                            <AlertCircle size={18} />
                            <span className="text-sm sm:text-base font-medium">{error}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold text-sm sm:text-base rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                    <Save size={18} />
                    {t("adminpanel.add_languages.button.save")}
                </button>
            </div>

            {/* Seciton Variables */}
            <SiteVariable keys={keys} formData={formData} setFormData={setFormData}/>
        </div>
    );
}
