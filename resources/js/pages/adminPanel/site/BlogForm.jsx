import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import LanguageProgress from "../../../components/adminPanel/LanguageProgress.jsx";
import CampaignTextEditor from "../../../components/adminPanel/campaign/ContentEditor.jsx"
import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import SuccessMessage from "../../../components/SuccessMessage.jsx";

export default function BlogForm({languages = [], blog = null}) {
    const langOpt = languages.map(l => ({label: l.name, value: l.code}));

    const defaultLangState = languages.reduce((acc, l) => {
        acc[l.code] = '';
        return acc;
    }, {});

    const topRef = useRef(null);
    const [lang, setLang] = useState(languages.length > 0 ? languages[0].code : '');
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(blog?.cover_photo_path || null);
    const [coverImage, setCoverImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        title: blog?.title || { ...defaultLangState },
        slug: blog?.slug || { ...defaultLangState },
        content: blog?.content || { ...defaultLangState },
        meta_title: blog?.meta_title || { ...defaultLangState },
        meta_description: blog?.meta_description || { ...defaultLangState },
        meta_keywords: blog?.meta_keywords || { ...defaultLangState },
        is_active: blog?.is_active ?? true,
    });

    useEffect(() => {
        if (languages.length > 0 && !lang) {
            setLang(languages[0].code);
        }
    }, [languages, lang]);

    const isLanguageFilled = (langCode) => {
        const requiredFields = ['title', 'slug', 'content', 'meta_title', 'meta_description'];
        return requiredFields.every(field => formData[field][langCode] && formData[field][langCode].trim() !== '' && formData[field][langCode] !== '<p></p>');
    };

    const calculateProgress = () => {
        if (langOpt.length === 0) return 0;
        const totalLanguages = langOpt.length;
        const filledLanguages = langOpt.filter(l => isLanguageFilled(l.value)).length;
        return Math.round((filledLanguages / totalLanguages) * 100);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [lang]: value
            }
        }));
    };

    const handleSingleChange = (field, value) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        const data = new FormData();

        data.append('title', JSON.stringify(formData.title));
        data.append('slug', JSON.stringify(formData.slug));
        data.append('content', JSON.stringify(formData.content));
        data.append('meta_title', JSON.stringify(formData.meta_title));
        data.append('meta_description', JSON.stringify(formData.meta_description));
        data.append('meta_keywords', JSON.stringify(formData.meta_keywords));
        data.append('is_active', formData.is_active ? 1 : 0);

        if (coverImage) {
            data.append('cover_image', coverImage);
        }

        if (blog?.id) {
            data.append('_method', 'PUT');
        }

        try {
            const url = blog?.id ? `/api/blogs/${blog.id}` : '/adminpanel/blogs';
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (response.data.success) {
                setSuccessMessage(response.data.message || 'İşlem başarıyla tamamlandı.');
                setTimeout(() => {
                    setSuccessMessage("");
                },10000)
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.errors) {
                    const firstErrorKey = Object.keys(responseData.errors)[0];
                    setErrorMessage(responseData.errors[firstErrorKey][0]);
                    setTimeout(() => {
                        setErrorMessage("");
                    },10000)
                } else {
                    setErrorMessage(responseData.message || 'Beklenmeyen bir hata oluştu.');
                    setTimeout(() => {
                        setErrorMessage("");
                    },10000)
                }
            } else {
                setErrorMessage('Sunucu ile iletişim kurulamadı.');
                setTimeout(() => {
                    setErrorMessage("");
                }, 10000)
            }
            topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!lang) return null;

    return (
        <Navbar>
            <div ref={topRef} className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {blog ? 'Blog Düzenle' : 'Yeni Blog Ekle'}
                </h2>

                {successMessage && (
                    <SuccessMessage message={successMessage} className="mb-6 w-full shadow-sm" />
                )}

                {errorMessage && (
                    <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center shadow-sm">
                        <span className="block sm:inline font-medium">{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <LanguageProgress
                        langOpt={langOpt}
                        calculateProgress={calculateProgress}
                        isLanguageFilled={isLanguageFilled}
                        lang={lang}
                        setLang={setLang}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Başlık ({lang.toUpperCase()})</label>
                            <input
                                type="text"
                                value={formData.title[lang] || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Slug ({lang.toUpperCase()})</label>
                            <input
                                type="text"
                                value={formData.slug[lang] || ''}
                                onChange={(e) => handleChange('slug', e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                            <CampaignTextEditor
                                content={formData.content[lang] || ''}
                                setContent={(newContent) => handleChange('content', newContent)}
                                currLan={lang}
                                label={`İçerik (${lang.toUpperCase()})`}
                                page="blog"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Meta Başlık ({lang.toUpperCase()})</label>
                            <input
                                type="text"
                                value={formData.meta_title[lang] || ''}
                                onChange={(e) => handleChange('meta_title', e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Meta Keywords ({lang.toUpperCase()})</label>
                            <input
                                type="text"
                                value={formData.meta_keywords[lang] || ''}
                                onChange={(e) => handleChange('meta_keywords', e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Meta Açıklama ({lang.toUpperCase()})</label>
                            <textarea
                                rows="3"
                                value={formData.meta_description[lang] || ''}
                                onChange={(e) => handleChange('meta_description', e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full resize-y"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Kapak Fotoğrafı</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {previewImage && (
                                <div className="mt-4">
                                    <img
                                        src={previewImage.startsWith('blob:') ? previewImage : `/storage/${previewImage}`}
                                        alt="Preview"
                                        className="w-full max-h-48 object-cover rounded-lg border border-gray-200"/>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-start pt-6">
                            <label className="relative inline-flex items-center cursor-pointer w-max">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => handleSingleChange('is_active', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-semibold text-gray-700">
                                    {formData.is_active ? 'Blog Aktif' : 'Blog Pasif'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isLoading || calculateProgress() < 100}
                            className={`px-6 py-3 rounded-lg text-white font-semibold transition-all w-full md:w-auto
                            ${isLoading || calculateProgress() < 100
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {isLoading ? 'İşleniyor...' : (blog ? 'Güncelle' : 'Kaydet')}
                        </button>
                    </div>
                </form>
            </div>
        </Navbar>
    );
}
