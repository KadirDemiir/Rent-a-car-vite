import { useState } from "react";
import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import CampaignTextEditor from "../../../components/adminPanel/campaign/ContentEditor.jsx";
import LanguageProgress from "../../../components/adminPanel/LanguageProgress.jsx";
import axios from "axios";

export default function AboutPage({ languages = [], about_info }) {
    const [currentLang, setCurrentLang] = useState(languages.length > 0 ? languages[0].code : "");
    const [success, setSuccess] = useState("");
    const [serverError, setServerError] = useState("");

    const [formData, setFormData] = useState(() => {
        const initialData = { title: {}, content: {} };
        languages.forEach(lang => {
            initialData.title[lang.code] = about_info?.title?.[lang.code] || "";
            initialData.content[lang.code] = about_info?.content?.[lang.code] || "";
        });
        return initialData;
    });

    const [formError, setformError] = useState(() => {
        const initialData = { title: {}, content: {} };
        languages.forEach(lang => {
            initialData.title[lang.code] = "";
            initialData.content[lang.code] = "";
        });
        return initialData;
    });

    const langOpt = languages.map(lang => ({
        value: lang.code,
        label: lang.name
    }));

    const isLanguageFilled = (langCode) => {
        const title = formData.title[langCode] || "";
        const content = formData.content[langCode] || "";

        const isTitleFilled = title.trim().length > 0;
        const isContentFilled = content.trim().length > 0 && content !== "<p></p>";

        return isTitleFilled && isContentFilled;
    };

    const calculateProgress = () => {
        if (languages.length === 0) return 0;
        const filledCount = languages.filter(lang => isLanguageFilled(lang.code)).length;
        return Math.round((filledCount / languages.length) * 100);
    };

    const handleTitleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            title: {
                ...prev.title,
                [currentLang]: e.target.value
            }
        }));
        setformError(prev => ({
            ...prev,
            title: {
                ...prev.title,
                [currentLang]: ""
            }
        }));
    };

    const handleContentChange = (newContent) => {
        setFormData(prev => ({
            ...prev,
            content: {
                ...prev.content,
                [currentLang]: newContent
            }
        }));
        setformError(prev => ({
            ...prev,
            content: {
                ...prev.content,
                [currentLang]: ""
            }
        }));
    };

    const handleSave = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        let hasError = false;
        const newErrors = { title: {}, content: {} };

        languages.forEach(lang => {
            const titleVal = formData.title[lang.code] || "";
            const contentVal = formData.content[lang.code] || "";

            if (titleVal.trim() === "") {
                newErrors.title[lang.code] = "Başlık alanı boş bırakılamaz.";
                hasError = true;
            } else {
                newErrors.title[lang.code] = "";
            }

            if (contentVal.trim() === "" || contentVal === "<p></p>") {
                newErrors.content[lang.code] = "İçerik alanı boş bırakılamaz.";
                hasError = true;
            } else {
                newErrors.content[lang.code] = "";
            }
        });

        setformError(newErrors);

        if (hasError) {
            const firstErrorLang = languages.find(lang => newErrors.title[lang.code] !== "" || newErrors.content[lang.code] !== "");
            if (firstErrorLang) {
                setCurrentLang(firstErrorLang.code);
            }
            return;
        }

        axios.post('/adminpanel/about_page', formData)
            .then(response => {
                if (response.data.success) {
                    setSuccess("İşlem Başarılı");
                    setServerError("");
                    setTimeout(() => {
                        setSuccess("");
                    }, 50000);
                }
            })
            .catch(error => {
                setSuccess("");
                setServerError(error.response?.data?.message || "Kayıt işlemi sırasında bir sunucu hatası oluştu.");
                setTimeout(() => {
                    setServerError("");
                }, 50000);
            });
    };

    if (!languages.length || !currentLang) return null;

    return (
        <Navbar>
            <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white shadow-lg rounded-xl p-4 sm:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h1 className="text-2xl font-bold text-gray-800 w-full text-center sm:text-left">
                            Biz Kimiz Sayfası Yönetimi
                        </h1>
                    </div>

                    {success && (
                        <div className="w-full bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center transition-all">
                            <span className="font-semibold">{success}</span>
                        </div>
                    )}

                    {serverError && (
                        <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center transition-all">
                            <span className="font-semibold">{serverError}</span>
                        </div>
                    )}

                    <div className="mb-8 w-full">
                        <LanguageProgress
                            langOpt={langOpt}
                            calculateProgress={calculateProgress}
                            isLanguageFilled={isLanguageFilled}
                            lang={currentLang}
                            setLang={setCurrentLang}
                        />
                    </div>

                    <div className="space-y-6 w-full">
                        <div className="flex flex-col space-y-2 w-full">
                            <label htmlFor="title" className="text-sm font-semibold text-gray-700">
                                Başlık ({currentLang.toUpperCase()})
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={formData.title[currentLang] || ""}
                                onChange={handleTitleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
                                    formError.title[currentLang]
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-indigo-500"
                                }`}
                            />
                            {formError.title[currentLang] && (
                                <span className="text-xs text-red-500 font-medium">
                                    {formError.title[currentLang]}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col space-y-2 w-full">
                            <label className="text-sm font-semibold text-gray-700">
                                İçerik ({currentLang.toUpperCase()})
                            </label>
                            <div className={`border rounded-lg overflow-hidden min-h-[400px] flex flex-col w-full transition-colors ${
                                formError.content[currentLang]
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}>
                                <CampaignTextEditor
                                    content={formData.content[currentLang] || ""}
                                    setContent={handleContentChange}
                                    currLan={currentLang}
                                />
                            </div>
                            {formError.content[currentLang] && (
                                <span className="text-xs text-red-500 font-medium">
                                    {formError.content[currentLang]}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-end pt-6 mt-4 border-t border-gray-100 w-full">
                            <button
                                onClick={handleSave}
                                className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Değişiklikleri Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Navbar>
    );
}
