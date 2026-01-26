import axios from 'axios';
import {router} from '@inertiajs/react';
import {useState} from 'react'
import Input from '../../components/websites/formElement/Input.jsx';
import {useTranslation} from "react-i18next";

export default function LogInForm() {
    const {t} = useTranslation();
      const [formData, setFormData] = useState({});
      const [errors, setErrors] = useState({});

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

    const handleSubmit = (e) => {
      e.preventDefault();
      const hasErrors = Object.values(errors).some(   error => typeof error === 'string' && error !== '');
      if (hasErrors) {
          return;
      }

      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      axios.post('/auth', formData, {
          headers: {
              'X-CSRF-TOKEN': csrfToken,
          },
          withCredentials: true,
      }).then(response => {
        console.log('Login response:', response.data);
        console.log('Login response headers:', response.headers);
        console.log('Cookies after login:', document.cookie);
          if(response.data.success){
            // Wait a moment for session to be saved, then redirect
            setTimeout(() => {
              window.location.href = '/';
            }, 100);
          }else{
            setErrors({
              ...errors,
              general: response.data.message
            });
          }
      }).catch(error => {
          console.error('There was an error!', error);
      });

  };

        const validateEmail = (value) =>
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? t("website.auth.login.invalid_email") : '';

          const validatePassword = (value) =>
            value.length < 6 ? t("website.auth.login.he_password_must_be_at_least_6_characters_long") : '';

          return (
            <div className="mt-4 border w-full">
              <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center gap-4 p-4">

                <Input
                  type="email"
                  elementName="email"
                  labelName={t("website.auth.login.email_label")}
                  validate={validateEmail}
                  onChange={(val, err) => handleInputChange('email', val, err)}
                />

                <Input
                  type="password"
                  elementName="password"
                  labelName={t("website.auth.login.password_label")}
                  validate={validatePassword}
                  onChange={(val, err) => handleInputChange('password', val, err)}
                />

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {t("website.auth.login.button.save")}
                </button>
              </form>
            </div>
          );
    }
