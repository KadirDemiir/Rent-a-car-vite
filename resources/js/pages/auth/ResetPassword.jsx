import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import Input from '../../components/websites/formElement/Input.jsx';
import Navbar from '../../components/websites/Navbar.jsx';
import { useTranslation } from 'react-i18next';
import SuccessMessage from '../../components/SuccessMessage.jsx';

export default function ResetPassword() {
    const { t } = useTranslation();
    const { token, email } = usePage().props;

    const [formData, setFormData] = useState({
        email: email || '',
        password: '',
        password_confirmation: '',
        token,
    });
    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const validateEmail = (value) =>
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? t("website.auth.login.invalid_email") : '';

    const validatePassword = (value) =>
        value.length < 6 ? t("website.auth.login.he_password_must_be_at_least_6_characters_long") : '';

    const validatePasswordConfirm = (value, value2) => {
        if (value.length < 6) return t("website.auth.login.he_password_must_be_at_least_6_characters_long");
        if (value2 && value !== value2) return t("website.auth.signup.passwords_do_not_match");
        return '';
    };

    const handleInputChange = (name, value, error) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = () => {
        const validationErrors = {
            email: validateEmail(formData.email || ''),
            password: validatePassword(formData.password || ''),
            password_confirmation: validatePasswordConfirm(formData.password_confirmation || '', formData.password || '')
        };

        setErrors(validationErrors);
        setShowErrors(true);

        const hasErrors = Object.values(validationErrors).some(error => typeof error === 'string' && error !== '');
        if (hasErrors) return;

        setLoading(true);
        axios.post('/reset-password', formData, { withCredentials: true })
            .then(response => {
                if (response.data?.success) {
                    setMessage({ type: 'success', text: response.data.message });
                    setTimeout(() => {
                        window.location.href = '/auth';
                    }, 1200);
                } else {
                    setMessage({ type: 'error', text: response.data?.message || 'An error occurred' });
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                setMessage({ type: 'error', text: error.response?.data?.message || 'An error occurred' });
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="px-8 py-8 space-y-6">
                        <h1 className="text-xl font-semibold text-gray-800">{t("website.auth.login.forgot_password", "Reset password")}</h1>

                        {message?.type === 'success' && <SuccessMessage message={message.text} />}
                        {message?.type === 'error' && (
                            <div className="bg-red-50 border-red-200 text-red-700 border px-4 py-3 rounded-lg flex items-start gap-2">
                                <span className="text-sm">{message.text}</span>
                            </div>
                        )}

                        <Input
                            type="email"
                            elementName="email"
                            labelName={t("website.auth.login.email_label")}
                            validate={validateEmail}
                            onChange={(val, err) => handleInputChange('email', val, err)}
                            formData={formData}
                            errors={errors}
                            setFormData={setFormData}
                            setErrors={setErrors}
                            showErrors={showErrors}
                        />

                        <Input
                            type="password"
                            elementName="password"
                            labelName={t("website.auth.signup.password")}
                            validate={validatePassword}
                            onChange={(val, err) => handleInputChange('password', val, err)}
                            formData={formData}
                            errors={errors}
                            setFormData={setFormData}
                            setErrors={setErrors}
                            showErrors={showErrors}
                        />

                        <Input
                            type="password"
                            elementName="password_confirmation"
                            labelName={t("website.auth.signup.password_confirmation")}
                            validate={(value) => validatePasswordConfirm(value, formData.password)}
                            onChange={(val, err) => handleInputChange('password_confirmation', val, err)}
                            formData={formData}
                            errors={errors}
                            setFormData={setFormData}
                            setErrors={setErrors}
                            showErrors={showErrors}
                        />

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t("website.auth.login.button.save")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
