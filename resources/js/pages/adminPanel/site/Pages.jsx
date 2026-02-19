import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { Edit2, CheckCircle, XCircle, X, Save, ShieldAlert } from "lucide-react";

export default function Pages() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingPage, setEditingPage] = useState(null);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/adminpanel/pages");
            setPages(res.data);
            setError(null);
        } catch (e) {
            setError("Failed to fetch pages");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const toggleStatus = async (id) => {
        try {
            await axios.post(`/adminpanel/pages/${id}/toggle-status`);
            fetchPages();
        } catch (e) {
            console.log(e);
            alert("Failed to update status");
        }
    };

    const handleEditClick = (page) => {
        setEditingPage(page);
        setFormData({
            title: page.title || { tr: "", en: "" },
            route_group_name: page.route_group_name || "",
            meta_title: page.meta_title || { tr: "", en: "" },
            meta_description: page.meta_description || { tr: "", en: "" },
            meta_keywords: page.meta_keywords || { tr: "", en: "" },
            is_active: page.is_active,
        });
    };

    const handleNestedChange = (field, lang, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                [lang]: value,
            },
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put(`/adminpanel/pages/${editingPage.id}`, formData);
            setEditingPage(null);
            fetchPages();
        } catch (e) {
            alert("Failed to update page");
        }
        setSaving(false);
    };

    const renderNestedInput = (label, field, isTextArea = false) => (
        <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700">{label}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['tr', 'en'].map((lang) => (
                    <div key={lang}>
                        <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">{lang}</label>
                        {isTextArea ? (
                            <textarea
                                value={formData[field]?.[lang] || ""}
                                onChange={(e) => handleNestedChange(field, lang, e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-24 text-sm"
                            />
                        ) : (
                            <input
                                type="text"
                                value={formData[field]?.[lang] || ""}
                                onChange={(e) => handleNestedChange(field, lang, e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar>
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900">Sayfa Yönetimi</h2>
                            <p className="text-sm text-gray-500 mt-1">Sistemdeki rotaları ve SEO ayarlarını yönetin.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-medium">
                            {error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pages.map((page) => (
                                <div key={page.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {page.route_group_name}
                                                </span>
                                                {page.is_system && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        <ShieldAlert size={12} />
                                                        Sistem
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                                                {typeof page.title === 'object' ? page.title?.tr || page.title?.en : page.title}
                                            </h3>
                                        </div>
                                        {page.is_system ? (
                                            <div className="w-6 h-6 flex items-center justify-center">
                                                <CheckCircle className="text-gray-300 w-6 h-6" />
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => toggleStatus(page.id)}
                                                className="transition-transform hover:scale-110 cursor-pointer"
                                            >
                                                {page.is_active ? (
                                                    <CheckCircle className="text-green-500 w-6 h-6" />
                                                ) : (
                                                    <XCircle className="text-red-500 w-6 h-6" />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="text-sm text-gray-500 line-clamp-2">
                                            <span className="font-semibold text-gray-700">SEO TR:</span> {page.meta_title?.tr}
                                        </div>
                                        <div className="text-sm text-gray-500 line-clamp-2">
                                            <span className="font-semibold text-gray-700">SEO EN:</span> {page.meta_title?.en}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-auto">
                                        <button
                                            onClick={() => handleEditClick(page)}
                                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                        >
                                            <Edit2 size={16} />
                                            Düzenle
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Navbar>

            {editingPage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                            <h3 className="text-xl font-bold text-gray-900">Sayfa Düzenle: {editingPage.route_group_name}</h3>
                            <button onClick={() => setEditingPage(null)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto grow space-y-6 custom-scrollbar">
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Route Group Name</label>
                                    <p className="text-xs text-gray-500">Sistem rotası</p>
                                </div>
                                <input
                                    type="text"
                                    name="route_group_name"
                                    value={formData.route_group_name}
                                    onChange={handleChange}
                                    disabled
                                    className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 font-mono text-sm w-48 text-right cursor-not-allowed"
                                />
                            </div>

                            {renderNestedInput("Sayfa Başlığı (Title)", "title")}
                            {renderNestedInput("SEO Başlığı (Meta Title)", "meta_title")}
                            {renderNestedInput("SEO Açıklaması (Meta Description)", "meta_description", true)}
                            {renderNestedInput("SEO Anahtar Kelimeler (Meta Keywords)", "meta_keywords", true)}

                            <div className={`flex items-center gap-3 p-4 rounded-xl border ${editingPage.is_system ? 'bg-gray-100 border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    disabled={editingPage.is_system}
                                    className={`w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 ${editingPage.is_system ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                />
                                <label htmlFor="is_active" className={`text-sm font-semibold text-gray-700 ${editingPage.is_system ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                                    Sayfa Aktif (Erişime Açık) {editingPage.is_system && <span className="text-red-500 ml-1 font-normal">- Sistem sayfası kapatılamaz</span>}
                                </label>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 shrink-0 flex justify-end gap-3 bg-gray-50">
                            <button
                                onClick={() => setEditingPage(null)}
                                className="px-6 py-2.5 rounded-xl text-gray-700 font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {saving ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Kaydet
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
