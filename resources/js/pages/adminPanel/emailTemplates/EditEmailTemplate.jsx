import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../../components/adminPanel/navbar/Navbar.jsx';
import axios from 'axios';
import CampaignTextEditor from '../../../components/adminPanel/campaign/ContentEditor.jsx';
import LanguageProgress from '../../../components/adminPanel/LanguageProgress.jsx';

export default function EditEmailTemplate({ template, languages }) {
    const { t, i18n } = useTranslation();
    console.log(template);
    const langOpt = useMemo(() => languages.map(l => ({ label: l.name, value: l.code })), [languages]);
    const [lang, setLang] = useState(langOpt[0]?.value || 'tr');

    const parseLocalizedValue = (value) => {
        if (!value) return null;
        if (typeof value === 'object') return value;
        if (typeof value !== 'string') return null;
        try {
            const parsed = JSON.parse(value);
            return parsed && typeof parsed === 'object' ? parsed : null;
        } catch {
            return null;
        }
    };

    const initLocalizedField = (value) => {
        const parsed = parseLocalizedValue(value) || {};
        return Object.fromEntries(languages.map(l => [l.code, parsed[l.code] || '']));
    };

    const [formData, setFormData] = useState({
        name: template.name || '',
        subject: initLocalizedField(template.subject),
        body: initLocalizedField(template.body),
        variables: template.variables || [],
        is_active: template.is_active ?? true
    });
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/adminpanel/email-templates/${template.id}`, formData);
            setMessage({ type: 'success', text: response.data.message });
            setTimeout(() => router.get(`/${i18n.language}/${t('address.adminpanel')}/${t('address.email-templates')}`), 1000);
        } catch (error) {
            console.error('Error updating template:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update template' });
        }
    };

    const languageProgress = () => {
        const totalFields = langOpt.length * 2;
        const filledFields = langOpt.filter(l =>
            formData.subject[l.value]?.trim() && formData.body[l.value]?.trim()
        ).length * 2;
        return totalFields ? Math.round((filledFields / totalFields) * 100) : 0;
    };

    const isLanguageFilled = (langValue) => {
        return formData.subject[langValue]?.trim() && formData.body[langValue]?.trim();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar >
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">{t('adminpanel.email.edit_email_template')}</h1>
                    <button
                        onClick={() => router.get('/adminpanel/email-templates')}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        ← {t('adminpanel.email.back')}
                    </button>
                </div>

                {message && (
                    <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <LanguageProgress
                            langOpt={langOpt}
                            calculateProgress={languageProgress}
                            isLanguageFilled={isLanguageFilled}
                            lang={lang}
                            setLang={setLang}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('adminpanel.email.template_name')}</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder={t('adminpanel.email.template_name_placeholder')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('adminpanel.email.subject')}</label>
                            <input
                                type="text"
                                required
                                value={formData.subject[lang] || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    subject: { ...formData.subject, [lang]: e.target.value }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder={t('adminpanel.email.email_subject_placeholder')}
                            />
                        </div>

                        <div>
                            <CampaignTextEditor
                                content={formData.body[lang] || ''}
                                setContent={(value) => setFormData({
                                    ...formData,
                                    body: { ...formData.body, [lang]: value }
                                })}
                                currLan={lang}
                                label={t('adminpanel.email.body')}
                                showCount={false}
                            />
                            <p className="mt-1 text-sm text-gray-500">{t('adminpanel.email.email_body_placeholder')}</p>
                        </div>
{/* 
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                Active
                            </label>
                        </div> */}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                {t('adminpanel.email.update_template')}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.get('/adminpanel/email-templates')}
                                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                {t('adminpanel.email.cancel')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </Navbar >
        </div>
    );
}
