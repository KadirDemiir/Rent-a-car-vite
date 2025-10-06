import { useMemo, useState } from "react";
import SiteVariableList from "./SiteVariableList.jsx";
import SiteVariableSection from "./SiteVariableSection.jsx";
import {useTranslation} from "react-i18next";

const SECTION_CONFIG = [
    { key: "website", label: "Website" },
    { key: "adminpanel", label: "Admin Panel" },
    { key: "general", label: "General" },
];

export default function SiteVariable({ keys, formData, setFormData }) {
    const {t} = useTranslation();
    const [search, setSearch] = useState("");
    const [error, setError] = useState();
    const [success, setSuccess] = useState();


    const [activeSection, setActiveSection] = useState(SECTION_CONFIG[0].key);

    const sections = useMemo(
        () => ({
            website: keys.filter((key) => key.key.startsWith("website.")),
            adminpanel: keys.filter((key) => key.key.startsWith("adminpanel.")),
            general: keys.filter((key) => !key.key.startsWith("website.") && !key.key.startsWith("adminpanel.")),
        }),
        [keys]
    );


    const createHandle = () => {
        setFormData(
            Object.fromEntries(Object.entries(formData).map(([k]) => [k, { value: "deneme verisi", error: "" }]))
        );
    };

    const deleteHandle = () => {
        setFormData(
            Object.fromEntries(Object.entries(formData).map(([k]) => [k, { value: "", error: "" }]))
        );
    };

    const handleSearch = (e) => {
            setSearch(e.target.value);

    }
    return (
        <>
            {success && (<div className="w-full border-l-12 border-green-600 bg-green-500 text-white p-2">{success}</div>)}
            {error && (<div className="w-full border-l-12 border-red-600 bg-red-500 text-white p-2">{error}</div>)}
            <div className="flex justify-center gap-8">
                <SiteVariableSection activeSection={activeSection} setActiveSection={setActiveSection} sections={sections} formData={formData} section_config={SECTION_CONFIG}/>
                <div onClick={createHandle} className="px-8 bg-blue-500 hover:bg-blue-600 rounded-xl text-white cursor-pointer flex items-center">
                    Üret
                </div>
                <div onClick={deleteHandle} className="px-8 bg-blue-500 hover:bg-blue-600 rounded-xl text-white cursor-pointer flex items-center">
                    Sil
                </div>
                <input value={search} onChange={(e) => handleSearch(e)} placeholder={t("adminpanel.add_languages.input.search")} type="text" className={`border border-gray-500 rounded-xl pl-2 outline-none`}/>
            </div><br/>
            <SiteVariableList keys={sections[activeSection].filter(k => k.key.toLowerCase().includes(search.toLowerCase()))} formData={formData} setFormData={setFormData} />
        </>
    );
}
