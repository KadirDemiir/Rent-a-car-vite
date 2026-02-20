import React, { useState } from "react";
import { X } from "lucide-react";
import ContentEditor from "../../../components/adminPanel/campaign/ContentEditor.jsx";
import LanguageProgress from "../../../components/adminPanel/LanguageProgress.jsx";

export default function SectionModal({ isOpen, onClose, formData, setFormData, onSubmit, langOpt }) {
    const [lang, setLang] = useState(langOpt[0]?.value || "tr");

    if (!isOpen) return null;

    const isLanguageFilled = (l) => {
        const titleFilled = formData.title?.[l] && formData.title[l].trim() !== "";
        if (formData.is_default) {
            return titleFilled;
        }
        const contentFilled = formData.content?.[l] && formData.content[l].trim() !== "" && formData.content[l] !== "<p><br></p>";
        return titleFilled && contentFilled;
    };

    const calculateProgress = () => {
        if (!langOpt || langOpt.length === 0) return 0;
        const filled = langOpt.filter(l => isLanguageFilled(l.value)).length;
        return Math.round((filled / langOpt.length) * 100);
    };

    const handleTitleChange = (e) => {
        setFormData({
            ...formData,
            title: {
                ...formData.title,
                [lang]: e.target.value
            }
        });
    };

    const handleContentChange = (newContent) => {
        setFormData({
            ...formData,
            content: {
                ...formData.content,
                [lang]: newContent
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {formData.id ? "Bölümü Düzenle" : "Yeni Bölüm Ekle"}
                    </h2>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col p-4 gap-4 overflow-y-auto">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Admin Açıklaması (Sadece Panel)</label>
                        <input
                            type="text"
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={formData?.is_default}
                            placeholder={formData.is_default ? "Varsayılan bölümlerin açıklaması değiştirilemez" : "Bu bölümün amacını belirten kısa not..."}
                            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none w-full bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500"
                        />
                    </div>

                    <hr className="my-2" />

                    <LanguageProgress
                        langOpt={langOpt}
                        calculateProgress={calculateProgress}
                        isLanguageFilled={isLanguageFilled}
                        lang={lang}
                        setLang={setLang}
                    />

                    <div className="flex flex-col gap-1 mt-2">
                        <label className="text-sm font-medium text-gray-700">Başlık ({lang.toUpperCase()})</label>
                        <input
                            type="text"
                            value={formData.title?.[lang] || ""}
                            onChange={handleTitleChange}
                            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed w-full"
                            required={!formData.is_default}
                        />
                    </div>

                    <div className="flex flex-col gap-1 h-50]">
                        <label className="text-sm font-medium text-gray-700">İçerik ({lang.toUpperCase()})</label>
                        <ContentEditor
                            content={formData.content?.[lang] || ""}
                            setContent={handleContentChange}
                            currLan={lang}
                            page="sections"
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                            Aktif
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
