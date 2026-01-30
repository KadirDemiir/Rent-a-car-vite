import axios from 'axios';
import Input from '../../components/websites/formElement/Input.jsx';
import {useState} from 'react'
import {useTranslation} from "react-i18next";

export default function SignUpForm({ onMessage, setFormType }) {
    const {t} = useTranslation();
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);

    const handleInputChange = (name, value, error) => {
        if (name === 'password_confirmation')
            error = validatePasswordConfirm(value, formData.password);

        setFormData({
            ...formData,
            [name]: value,
            sign_up: true,
        });

        setErrors({
            ...errors,
            [name]: error
        });
    };

    const handleSubmit = () => {
        // Validate all fields
        const validationErrors = {
            name: validateName(formData.name || ''),
            surname: validateName(formData.surname || ''),
            email: validateEmail(formData.email || ''),
            birthday: validateName(formData.birthday || ''),
            phone_number: validatePhoneNumber(formData.phone_number || ''),
            tc_number: validateTcNumber(formData.tc_number || '') || '',
            password: validatePassword(formData.password || ''),
            password_confirmation: validatePasswordConfirm(formData.password_confirmation || '', formData.password || '')
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
            setFormType('Login');
          } else {
            onMessage({ type: 'error', text: response.data.message });
          }
        }).catch(error => {
          console.error('There was an error!', error);
          onMessage({ type: 'error', text: error.response?.data?.message || 'An error occurred' });
        });

    };

    const validateName = (value) => value.trim() === '' ? '*'+t("website.auth.signup.this_area_cannot_be_empty") : '';
    const validateEmail = (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '*'+t("website.auth.signup.invalid_email") : '';
    const validatePassword = (value) => value.length < 6 ? '*'+t("website.auth.signup.he_password_must_be_at_least_6_characters_long") : '';
    const validatePasswordConfirm = (value, value2) => {
        if(value.length < 6)
            return '*'+t("website.auth.signup.he_password_must_be_at_least_6_characters_long");
        if(value2  && value !== value2)
            return '*'+t("website.auth.signup.passwords_do_not_match");
        return "";
    }

    const validateTcNumber = (value) => {
        if(!( /^\d+$/.test(value)))
            return '*'+t("website.auth.signup.you_can_enter_only_number");
        if(value.length != 11)
            return '*'+t("website.auth.signup.this_area_cannot_be_empty");
        return
    };

    const validatePhoneNumber = (value) => {
        if(!( /^\d+$/.test(value)))
            return '*'+t("website.auth.signup.you_can_enter_only_number");
        if(value.length != 10)
            return '*'+t("website.auth.signup.this_area_cannot_be_empty");
        return '';
    };


    return(
        <div className="bg-white rounded-b-2xl shadow-lg border border-gray-100 border-t-0">
            <div className="px-8 py-8 space-y-5 flex flex-col gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type={'text'}
                    elementName={'name'}
                    labelName={t("website.auth.signup.name")}
                    validate={validateName}
                    onChange={(value, error) => handleInputChange('name', value, error)}
                    formData={formData}
                    errors={errors}
                    setFormData={setFormData}
                    setErrors={setErrors}
                    showErrors={showErrors}
                  />

                  <Input
                    type={'text'}
                    labelName={t("website.auth.signup.surname")}
                    elementName={'surname'}
                    validate={validateName}
                    onChange={(value, error) => handleInputChange('surname', value, error)}
                    formData={formData}
                    errors={errors}
                    setFormData={setFormData}
                    setErrors={setErrors}
                    showErrors={showErrors}
                  />
                </div>

                <Input
                  type={'email'}
                  elementName={'email'}
                  labelName={t("website.auth.signup.email")}
                  validate={validateEmail}
                  onChange={(value, error) => handleInputChange('email', value, error)}
                  formData={formData}
                  errors={errors}
                  setFormData={setFormData}
                  setErrors={setErrors}
                  showErrors={showErrors}
                />

                <Input
                  type={'date'}
                  elementName={'birthday'}
                  labelName={t("website.auth.signup.birthday")}
                  validate={validateName}
                  onChange={(value, error) => handleInputChange('birthday', value, error)}
                  formData={formData}
                  errors={errors}
                  setFormData={setFormData}
                  setErrors={setErrors}
                  showErrors={showErrors}
                />

                <Input
                  type={'text'}
                  elementName={'phone_number'}
                  labelName={t("website.auth.signup.phone_number")}
                  validate={validatePhoneNumber}
                  onChange={(value, error) => handleInputChange('phone_number', value, error)}
                  maxV={13}
                  prefix={'+90'}
                  formData={formData}
                  errors={errors}
                  setFormData={setFormData}
                  setErrors={setErrors}
                  showErrors={showErrors}
                />

                <Input
                  type={'text'}
                  elementName={'tc_number'}
                  labelName={t("website.auth.signup.tc_number")}
                  validate={validateTcNumber}
                  onChange={(value, error) => handleInputChange('tc_number', value, error)}
                  maxV={11}
                  formData={formData}
                  errors={errors}
                  setFormData={setFormData}
                  setErrors={setErrors}
                  showErrors={showErrors}
                />

                <Input
                  type={'password'}
                  elementName={'password'}
                  labelName={t("website.auth.signup.password")}
                  validate={validatePassword}
                  onChange={(value, error) => handleInputChange('password', value, error)}
                  formData={formData}
                  errors={errors}
                  setFormData={setFormData}
                  setErrors={setErrors}
                  showErrors={showErrors}
                />

                <Input
                  type={'password'}
                  elementName={'password_confirmation'}
                  labelName={t("website.auth.signup.password_confirmation")}
                  validate={(value) => validatePasswordConfirm(value, formData.password)}
                  onChange={(value, error) => handleInputChange('password_confirmation', value, error)}
                  formData={formData}
                  errors={errors}
                  setFormData={setFormData}
                  setErrors={setErrors}
                  showErrors={showErrors}
                />

                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t("website.auth.signup.button.save")}
                </button>
              </div>
        </div>
    );
}
