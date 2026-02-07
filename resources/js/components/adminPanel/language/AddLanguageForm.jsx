import SiteVariable from "./SiteVariable.jsx";
import {useState} from "react";
import LanguageInformation from "./LanguageInformation.jsx";
import axios from "axios";
import {router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function AddLanguageForm({ keys}) {
    const {t, i18n} = useTranslation();
    const [formLanguageData, setFormLanguageData] = useState({
        name: { value:  "", error: "" },
        code: { value:  "", error: "" },
        flag: { value: null, error: "" },
    });
    const [formData, setFormData] = useState(() =>
        keys.reduce((acc, key) => {
            acc[key.key] = {
                value: "",
                error:   "",
            };
            return acc;
        }, {})
    );
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const handleSubmit = async () => {
        setSuccess("");
        setError("");
        const validatedData = Object.entries(formData).reduce((acc, [key, data]) => {
            acc[key] = { ...data, error: data.value.trim() === "" ? "Bu alan boş olamaz" : "" };
            return acc;
        }, {});

        const validatedLanguageData = Object.entries(formLanguageData).reduce((acc, [key, data]) => {
            let error = "";
            if (key === "flag" && !data.value) error = "This field can't be empty";
            else if (key === "code" && (typeof data.value !== "string" || data.value.trim().length !== 2))
                error = "This field has to be 2 char.";
            else if (key === "name" && data.value.trim() === "") error = "This field can't be empty";

            acc[key] = { ...data, error };
            return acc;
        }, {});

        setFormData(validatedData);
        setFormLanguageData(validatedLanguageData);

        if (
            Object.values(validatedData).some((d) => d.error) ||
            Object.values(validatedLanguageData).some((d) => d.error)
        ) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const data = new FormData();
        data.append("keys", JSON.stringify(validatedData));
        Object.entries(validatedLanguageData).forEach(([key, d]) => data.append(key, d.value));
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
        try {
            const response = await axios.post(`/${i18n.language}/adminpanel/languages/add`, data, {
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Content-Type": "multipart/form-data",
                },
            });
            router.visit(`/${i18n.language}/${t(`address.adminpanel`)}/${t('address.languages')}/${response.data.code}` ,);
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Bilinmeyen bir hata oluştu.");
        } finally {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };
    return (
        <div className="space-y-8">
            <div className="flex justify-end pr-16">
                <LanguageInformation data={formLanguageData} setData={setFormLanguageData} />
            </div>
            {success && <div className={`w-full border-l-12 border-green-600 bg-green-500 text-white p-2`}>{success}</div>}
            {error && <div className={`w-full border-l-12 border-red-600 bg-red-500 text-white p-2`}>{error}</div>}
            <button onClick={handleSubmit} className="mt-4 px-6 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-800 transition-colors">{t("adminpanel.add_languages.button.save")}</button>
            <SiteVariable keys={keys} formData={formData} setFormData={setFormData}/>
        </div>
    );
}
