import CarPropertiesGenericInfo from "./CarPropertiesGenericInfo.jsx";
import {useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import {reloadTranslations} from "../../../i18n.js";

export default function BodyTypeForm({mode="create", lngs, bt=null}){
    const {t} = useTranslation();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [formData, setFormData] = useState(() => {
        const nameObj = lngs.reduce((acc, lang) => {
            acc[lang.code] = { value: bt?.translation_key_id ? t(`body_type.${bt.id}`) :  "", error: "" };
            return acc;
        }, {});
        return { name: nameObj };
    });

    const [currentLang, setCurrentLang] = useState(lngs[0].code);

    const handleSubmit = () => {
        const updated = { ...formData };
        let hasError = false;

        Object.entries(updated.name).forEach(([lang, data]) => {
            const errorMsg = data.value.trim() === "" ? "Bu alan zorunlu" : "";
            updated.name[lang] = { ...data, error: errorMsg };
            if (errorMsg) hasError = true;
        });
        setFormData(updated);
        if (hasError) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const data = new FormData();
        data.append('names', JSON.stringify(formData.name));
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const url = mode === 'create' ? '/adminpanel/body_types/add' : `/adminpanel/body_types/${bt.id}`;
        const request =
            mode === "create"
                ? axios.post(url, data, { headers: { "X-CSRF-TOKEN": csrfToken } })
                : axios.put(url, data, { headers: { "X-CSRF-TOKEN": csrfToken, "Content-Type": "application/json" }});
        request
            .then((response) => {
                if (response.data.success) {
                    reloadTranslations();
                    setSuccess(mode === "create" ? "Added Successfully!" : "Updated Successfully!");
                } else
                    setError(mode === "create" ? "Failed to add BodyType" : "Failed to update BodyType");
            })
            .catch((error) => {
                setError(error.response?.data?.message || "Something went wrong!");
            });
    };

    const langOptions = lngs.map(curr => {
        const hasError = formData.name?.[curr.code]?.error;
        return {
            value: curr.code,
            label: hasError ? <span style={{ color: "red" }}>{curr.name}</span> : curr.name
        };
    });
    return(
        <div className={`p-8 shadow-lg`}>
            {success && <p className={`w-full border-l-12 border-green-700 bg-green-300 text-green-700 font-semibold p-2`}>{success}</p>}
            <CarPropertiesGenericInfo title={t("adminpanel.add_body_type.select_language")} name={t("adminpanel.add_body_type.body_type_name")} formData={formData} currentLang={currentLang} langOptions={langOptions } setCurrentLang={setCurrentLang} setFormData={setFormData}
            />
            <br />
            <div className="w-full flex justify-end pr-4">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 rounded-lg py-1 px-4 text-white"
                >
                    {t("adminpanel.add_body_type.button.save")}
                </button>
            </div>
        </div>
    );
}
