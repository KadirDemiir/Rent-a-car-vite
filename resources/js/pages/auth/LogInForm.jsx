import axios from 'axios';
import {useState} from 'react'
import Input from '../../components/websites/formElement/Input.jsx';
import {useTranslation} from "react-i18next";

export default function LogInForm({ onMessage }) {
    const {t} = useTranslation();
      const [formData, setFormData] = useState({});
      const [errors, setErrors] = useState({});
      const [showErrors, setShowErrors] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotData, setForgotData] = useState({ email: '' });
  const [forgotErrors, setForgotErrors] = useState({});
  const [showForgotErrors, setShowForgotErrors] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

      const handleInputChange = (name, value, error) => {
          setFormData({
              ...formData,
              [name]: value,
              log_in: true,
          });

          setErrors({
              ...errors,
              [name]: error
          });
      };

    const handleSubmit = () => {
      // Validate all fields
      const emailError = validateEmail(formData.email || '');
      const passwordError = validatePassword(formData.password || '');
      
      const validationErrors = {
        email: emailError,
        password: passwordError
      };
      
      setErrors(validationErrors);
      setShowErrors(true);
      
      const hasErrors = Object.values(validationErrors).some(error => typeof error === 'string' && error !== '');
      if (hasErrors) {
          return;
      }
      
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      axios.post('/auth', formData, {
          withCredentials: true,
      }).then(response => {
          if(response.data.success){
            onMessage({ type: 'success', text: response.data.message });
            setTimeout(() => {
              window.location.href = '/';
            }, 100);
          }else{
            onMessage({ type: 'error', text: response.data.message });
          }
      }).catch(error => {
          console.error('There was an error!', error);
          onMessage({ type: 'error', text: error.response?.data?.message || 'An error occurred' });
      });

  };

    const handleForgotChange = (name, value, error) => {
      setForgotData({
        ...forgotData,
        [name]: value,
      });

      setForgotErrors({
        ...forgotErrors,
        [name]: error
      });
    };

    const handleForgotSubmit = () => {
      const emailError = validateEmail(forgotData.email || '');
      const validationErrors = { email: emailError };

      setForgotErrors(validationErrors);
      setShowForgotErrors(true);

      const hasErrors = Object.values(validationErrors).some(error => typeof error === 'string' && error !== '');
      if (hasErrors) return;

      setSendingReset(true);
      axios.post('/forgot-password', { email: forgotData.email }, { withCredentials: true })
        .then(response => {
          if (response.data?.success) {
            onMessage({ type: 'success', text: response.data.message });
            setForgotOpen(false);
          } else {
            onMessage({ type: 'error', text: response.data?.message || 'An error occurred' });
          }
        })
        .catch(error => {
          console.error('There was an error!', error);
          onMessage({ type: 'error', text: error.response?.data?.message || 'An error occurred' });
        })
        .finally(() => setSendingReset(false));
    };

        const validateEmail = (value) =>
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? t("website.auth.login.invalid_email") : '';

          const validatePassword = (value) =>
            value.length < 6 ? t("website.auth.login.he_password_must_be_at_least_6_characters_long") : '';

          return (
            <div className="bg-white rounded-b-2xl shadow-lg border border-gray-100 border-t-0">
              <div className="px-8 py-8 space-y-6 flex flex-col gap-2">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-sm">{errors.general}</span>
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
                    labelName={t("website.auth.login.password_label")}
                    validate={validatePassword}
                    onChange={(val, err) => handleInputChange('password', val, err)}
                    formData={formData}
                    errors={errors}
                    setFormData={setFormData}
                    setErrors={setErrors}
                    showErrors={showErrors}
                  />

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setForgotOpen(p => !p)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t("website.auth.login.forgot_password", "Forgot password?")}
                    </button>
                  </div>

                  {forgotOpen && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
                      <Input
                        type="email"
                        elementName="email"
                        labelName={t("website.auth.login.email_label")}
                        validate={validateEmail}
                        onChange={(val, err) => handleForgotChange('email', val, err)}
                        formData={forgotData}
                        errors={forgotErrors}
                        setFormData={setForgotData}
                        setErrors={setForgotErrors}
                        showErrors={showForgotErrors}
                      /> 
                      <br /><br />
                      <button
                        type="button"
                        onClick={handleForgotSubmit}
                        disabled={sendingReset}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t("website.auth.login.send_reset_link", "Send reset link")}
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t("website.auth.login.button.save")}
                  </button>
              </div>
            </div>
          );
    }
