import CarPropertiesGenericInfo from "./CarPropertiesGenericInfo.jsx";
import {useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import SuccessMessage from "../../SuccessMessage.jsx";

export default function TransmissionTypeForm({mode="create", lngs, transmission=null}){
    const {t} = useTranslation();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [formData, setFormData] = useState(() => {
        const nameObj = lngs.reduce((acc, lang) => {
            acc[lang.code] = { value: transmission?.translation_key_id ? t(`transmission.${transmission.id}`) :  "", error: "" };
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
        const url = mode === 'create' ? '/adminpanel/transmissions/add' : `/adminpanel/transmissions/${transmission?.id}`;
        const request =
            mode === "create"
                ? axios.post(url, data, { headers: { "X-CSRF-TOKEN": csrfToken } })
                : axios.put(url, data, { headers: { "X-CSRF-TOKEN": csrfToken, "Content-Type": "application/json" }});
        request
            .then((response) => {
                if (response.data.success) {
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
        <div className={`shadow-lg p-8`}>
            <SuccessMessage message={success} />
            {error && <p className={`w-full border-l-12 border-red-700 bg-red-300 text-red-700 font-semibold p-2`}>{error}</p>}
            <CarPropertiesGenericInfo title={t("adminpanel.add_fuel.select_language")} name={t("adminpanel.add_fuel.fuel_name")} formData={formData} currentLang={currentLang} langOptions={langOptions} setCurrentLang={setCurrentLang} setFormData={setFormData}/>
            <br/>
            <div className={`w-full flex justify-end pr-4`}><button onClick={handleSubmit} className={`bg-gray-700 rounded-lg py-1 px-4 text-white`}>{t("adminpanel.add_transmission.button.save")}</button></div>
        </div>
    );
}
