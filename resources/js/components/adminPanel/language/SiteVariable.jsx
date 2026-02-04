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
    };

    return (
        <div className="w-full space-y-4 md:space-y-6">
            {/* Sections Navigation */}
            <SiteVariableSection 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                sections={sections} 
                formData={formData} 
                section_config={SECTION_CONFIG}
            />

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <input 
                    value={search} 
                    onChange={handleSearch}
                    placeholder={t("adminpanel.add_languages.input.search")}
                    type="text" 
                    className="flex-1 px-4 py-2 md:py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm md:text-base"
                />
                <div className="flex gap-2 md:gap-3">
                    <button 
                        onClick={createHandle}
                        className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm md:text-base active:scale-95"
                    >
                        Üret
                    </button>
                    <button 
                        onClick={deleteHandle}
                        className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm md:text-base active:scale-95"
                    >
                        Sil
                    </button>
                </div>
            </div>

            {/* Site Variables List */}
            <SiteVariableList 
                keys={sections[activeSection].filter(k => k.key.toLowerCase().includes(search.toLowerCase()))} 
                formData={formData} 
                setFormData={setFormData}
            />
        </div>
    );
}
