import SegmentForm from "./SegmentForm.jsx";
import {useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import i18next from "i18next";

export default function SegmentFormModal({segment = null, lngs, translations = null, mode="create"}){
    const {t} = useTranslation();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [formData, setFormData] = useState(() => {
        const nameObj = lngs.reduce((acc, lang) => {
            const val = translations?.find(t => t.language_id === lang.id && t.translation_key_id === segment?.translation_key_id)?.value ?? "";
            acc[lang.code] = { value: val, error: "" };
            return acc;
        }, {});
        return { coefficient: { value: segment?.coefficient ?? "", error: "" }, name: nameObj };
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
        const errorMsg = updated.coefficient.value.trim() === "" ? "Bu alan zorunlu" : "";
        updated.coefficient = { ...updated.coefficient, error: errorMsg };
        if (errorMsg) hasError = true;
        setFormData(updated);
        if (hasError) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const data = new FormData();
        data.append('names', JSON.stringify(formData.name));
        data.append('coefficient', formData.coefficient.value);
        const url = mode === "create" ? '/adminpanel/segments/add' : `/adminpanel/segments/${segment.id}`;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const request =
            mode === "create"
                ? axios.post(url, data, { headers: { "X-CSRF-TOKEN": csrfToken } })
                : axios.put(url, data, { headers: { "X-CSRF-TOKEN": csrfToken, "Content-Type": "application/json" }});
        request
            .then((response) => {
                if (response.data.success) {
                    if( response.data.translations){
                        Object.entries(response.data.translations).forEach(([langId, tVal]) => {
                            const code = lngs.find(l => l.id == langId)?.code;
                            if(code) i18next.addResource(code, 'translation', `segment.${response.data.segment_id}`, tVal.value);
                        });
                    }
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
        <div className={`shadow-lg p-8 bg-white`}>
            {success && <p className={`w-full border-l-12 border-green-700 bg-green-300 text-green-700 font-semibold p-2`}>{success}</p>}
            <SegmentForm formData={formData} currentLang={currentLang} langOptions={langOptions} setCurrentLang={setCurrentLang} setFormData={setFormData}/>
            <div className={`w-full flex justify-end p-8`}>
                <button onClick={handleSubmit} className={`bg-gray-700 rounded-lg py-1 px-4 text-white`}>
                    {mode==='create' ? t("adminpanel.segments.add_segment.button.save") : t("adminpanel.update_segment.button.save")}
                </button>
            </div>
        </div>
    );
}
