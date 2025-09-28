import { router } from '@inertiajs/react'
import Input from '../../components/websites/formElement/Input.jsx';
import {useState} from 'react'
import {useTranslation} from "react-i18next";

export default function SignUpForm() {
    const {t} = useTranslation();
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const hasErrors = Object.values(errors).some(   error => typeof error === 'string' && error !== '');
        if (hasErrors) {
            return;
        }

        if(formData.password_confirmation !== formData.password){
            validatePassword( formData.password_confirmation, formData.password);
            return
        }

        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        router.post('/auth', formData, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },
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
        <div className="mt-4 border w-full">
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center gap-4 p-4">


                 < Input
                 type={'text'}
                 elementName={'name'}
                 labelName={t("website.auth.signup.name")}
                 validate={validateName}
                 onChange={(value, error) => handleInputChange('name', value, error)}
                 />

                 < Input
                 type={'text'}
                 labelName={t("website.auth.signup.surname")}
                 elementName={'surname'}
                 validate={validateName}
                 onChange={(value, error) => handleInputChange('surname', value, error)}
                  />

                 < Input
                 type={'email'}
                 elementName={'email'}
                 labelName={t("website.auth.signup.email")}
                 validate={validateEmail}
                 onChange={(value, error) => handleInputChange('email', value, error)}
                  />

                 < Input
                 type={'date'}
                 elementName={'birthday'}
                 labelName={t("website.auth.signup.birthday")}
                 validate={validateName}
                 onChange={(value, error) => handleInputChange('birthday', value, error)}
                  />

                 < Input
                 type={'text'}
                 elementName={'phone_number'}
                 labelName={t("website.auth.signup.phone_number")}
                 validate={validatePhoneNumber}
                 onChange={(value, error) => handleInputChange('phone_number', value, error)}
                 maxV={13}
                 prefix={'+90'}
                  />

                 < Input
                 type={'text'}
                 elementName={'tc_number'}
                 labelName={t("website.auth.signup.tc_number")}
                 validate={validateTcNumber}
                 onChange={(value, error) => handleInputChange('tc_number', value, error)}
                 maxV={11}
                  />

                 < Input
                 type={'password'}
                 elementName={'password'}
                 labelName={t("website.auth.signup.password")}
                 validate={validatePassword}
                 onChange={(value, error) => handleInputChange('password', value, error)}
                  />


                 < Input
                 type={'password'}
                 elementName={'password_confirmation'}
                 labelName={t("website.auth.signup.password_confirmation")}
                 validate={(value) => validatePasswordConfirm(value, formData.password)}
                 onChange={(value, error) => handleInputChange('password_confirmation', value, error)}
                  />

                 <button type="submit" className="cursor-pointer h-10 w-26 bg-blue-500 text-white hover:bg-blue-600 rounded-lg">{t("website.auth.signup.button.save")}</button>

             </form>
        </div>
    );
}
