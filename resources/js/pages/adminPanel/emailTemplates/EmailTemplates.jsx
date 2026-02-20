import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../../components/adminPanel/navbar/Navbar.jsx';
import axios from 'axios';
import LanguageProgress from '../../../components/adminPanel/LanguageProgress.jsx';
import CampaignTextEditor from '../../../components/adminPanel/campaign/ContentEditor.jsx';

export default function EmailTemplates({ templates, languages }) {
    const { t, i18n } = useTranslation();
    const langOpt = useMemo(() => languages.map(l => ({ label: l.name, value: l.code })), [languages]);
    const [lang, setLang] = useState(langOpt[0]?.value || 'tr');
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        subject: Object.fromEntries(languages.map(l => [l.code, ''])),
        body: Object.fromEntries(languages.map(l => [l.code, ''])),
        variables: [],
        is_active: true
    });
    const [formError, setFormError] = useState('');
    const filteredTemplates = templates.filter(t =>
        (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.subject || '').toLowerCase().includes(search.toLowerCase())
    );

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (langOpt.some(l => !formData.subject[l.value]?.trim() || !formData.body[l.value]?.trim())) {
            setFormError(t('adminpanel.email.fill_all_languages'));
            return;
        }
        try {
            await axios.post('/adminpanel/email-templates', formData);
            router.reload();
            setShowAddModal(false);
            setFormData({
                name: '',
                subject: Object.fromEntries(languages.map(l => [l.code, ''])),
                body: Object.fromEntries(languages.map(l => [l.code, ''])),
                variables: [],
                is_active: true
            });
            setFormError('');
        } catch (error) {
            console.error('Error creating template:', error);
            alert(error.response?.data?.message || t('adminpanel.email.failed_create_template'));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(t('adminpanel.email.confirm_delete_template'))) return;

        try {
            await axios.delete(`/adminpanel/email-templates/${id}`);
            router.reload();
        } catch (error) {
            console.error('Error deleting template:', error);
            alert(t('adminpanel.email.failed_delete_template'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">{t('adminpanel.email.email_templates')}</h1>
                    <button
                        onClick={() => setShowAddModal(!showAddModal)}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        {showAddModal ? t('adminpanel.email.cancel') : t('adminpanel.email.add_template')}
                    </button>
                </div>

                {showAddModal && (
                    <div className="bg-white rounded-lg shadow p-6 mb-8">
                        <h2 className="text-xl font-bold mb-6">{t('adminpanel.email.add_email_template')}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {formError && (
                                <div className="border-l-4 border-red-500 bg-red-50 text-red-700 p-3 rounded">
                                    {formError}
                                </div>
                            )}

                            <LanguageProgress
                                langOpt={langOpt}
                                calculateProgress={languageProgress}
                                isLanguageFilled={isLanguageFilled}
                                lang={lang}
                                setLang={setLang}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('adminpanel.email.template_name')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder={t('adminpanel.email.template_name_placeholder')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('adminpanel.email.subject')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject[lang] || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        subject: { ...formData.subject, [lang]: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder={t('adminpanel.email.email_subject_input')}
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
                                    page="email_temp"
                                />
                                <p className="mt-1 text-sm text-gray-500">{t('adminpanel.email.email_body_placeholder')}</p>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="mr-2"
                                />
                                <label className="text-sm text-gray-700">{t('adminpanel.email.active')}</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                                >
                                    {t('adminpanel.email.create_template')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                                >
                                    {t('adminpanel.email.cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder={t('adminpanel.email.search_templates')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="bg-white rounded-lg shadow overflow-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminpanel.email.name')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminpanel.email.subject')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminpanel.email.status')}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminpanel.email.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTemplates.map((template) => (
                                <tr key={template.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {(() => {
                                            const localized = parseLocalizedValue(template.subject);
                                            if (localized) {
                                                return localized[i18n.language ] || localized[langOpt[0]?.value] || Object.values(localized)[0] || '';
                                            }
                                            return template.subject;
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {template.is_active ? t('adminpanel.email.active') : t('adminpanel.email.inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => router.get(`/${i18n.language}/${t('address.adminpanel')}/${t('address.email-templates')}/${template.id}`)}
                                            className="text-gray-700 hover:text-gray-900 mr-4"
                                        >
                                            {t('adminpanel.email.edit')}
                                        </button>
{/*                                         <button
                                            onClick={() => handleDelete(template.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            {t('adminpanel.email.delete')}
                                        </button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </Navbar>
        </div>
    );
}
