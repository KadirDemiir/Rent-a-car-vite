import { useMemo, useState } from "react";
import SiteVariableList from "./SiteVariableList.jsx";
import SiteVariableSection from "./SiteVariableSection.jsx";
import {useTranslation} from "react-i18next";
import { Search, Sparkles, Trash2 } from "lucide-react";

const SECTION_CONFIG = [
    { key: "website", label: "website" },
    { key: "adminpanel", label: "adminpanel" },
    { key: "general", label: "general" },
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
            Object.fromEntries(Object.entries(formData).map(([k]) => [k, { value: "deneme verisi", error: false }]))
        );
    };

    const deleteHandle = () => {
        setFormData(
            Object.fromEntries(Object.entries(formData).map(([k]) => [k, { value: "", error: true }]))
        );
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className="w-full space-y-6">
            {/* Sections Navigation */}
            <SiteVariableSection 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                sections={sections} 
                formData={formData} 
                section_config={SECTION_CONFIG}
            />

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        value={search} 
                        onChange={handleSearch}
                        placeholder={t("adminpanel.add_languages.input.search")}
                        type="text" 
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm sm:text-base bg-gray-50 focus:bg-white transition-all"
                    />
                </div>
                <div className="flex gap-2 sm:gap-3">
                    <button 
                        onClick={createHandle}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        <Sparkles size={18} />
                    </button>
                    <button 
                        onClick={deleteHandle}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        <Trash2 size={18} />
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
