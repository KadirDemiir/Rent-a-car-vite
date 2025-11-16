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
            console.log(err);
            setError(err.response?.data?.error || "Kaydetme sırasında bir hata oluştu.");
        });
    };

    return(
        <div>
            {success && <div className={`w-full border-l-12 border-green-600 bg-green-500 text-white p-2`}>{success}</div>}
            {error   && <div className={`w-full border-l-12 border-red-600 bg-red-600 text-white p-2`}>{error}</div>}
            <br/>
            <div className={`w-full flex justify-end pr-16`}>
                <button onClick={handleSubmit} className={` bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 cursor-pointer`}>Save</button>
            </div>
            <SiteVariable keys={keys} formData={formData} setFormData={setFormData}/>
        </div>
    );
}
