import { router } from '@inertiajs/react'
import Input from '../../components/formElement/Input';
import {useState} from 'react'

export default function SignUpForm() {

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
            alert('Lütfen hataları düzeltin.');
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

    const validateName = (value) => value.trim() === '' ? '*Bu alan boş bırakılamaz.' : '';
    const validateEmail = (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '*Geçersiz e-posta adresi.' : '';
    const validatePassword = (value) => value.length < 6 ? '*Şifre en az 6 karakter olmalıdır.' : '';
    const validatePasswordConfirm = (value, value2) => {
        if(value.length < 6)
            return '*Şifre en az 6 karakter olmalıdır.';
        if(value2  && value !== value2)
            return "*Şifreler aynı olmalı";
        return "";
    }

    const validateTcNumber = (value) => {
        if(!( /^\d+$/.test(value)))
            return '*Sadece sayı girebilirsiniz.';
        if(value.length != 11)
            return 'bu alanı eksiksiz doldurunuz';
        return
    };

    const validatePhoneNumber = (value) => {
        if(!( /^\d+$/.test(value)))
            return '*Sadece sayı girebilirsiniz.';
        if(value.length != 10)
            return 'bu alanı eksiksiz doldurunuz';
        return '';
    };


    return(
        <div className="mt-4 border w-full">
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center gap-4 p-4">
                

                 < Input 
                 type={'text'}
                 elementName={'name'}
                 labelName={'Name'}
                 validate={validateName}
                 onChange={(value, error) => handleInputChange('name', value, error)}
                 />
 
                 < Input 
                 type={'text'}
                 elementName={'surname'}
                 labelName={'Surname'}
                 validate={validateName}
                 onChange={(value, error) => handleInputChange('surname', value, error)}
                  />
 
                 < Input 
                 type={'email'}
                 elementName={'email'}
                 labelName={'Email'}
                 validate={validateEmail}
                 onChange={(value, error) => handleInputChange('email', value, error)}
                  />
 
                 < Input 
                 type={'date'}
                 elementName={'birthday'}
                 labelName={'Birthday'}
                 validate={validateName}
                 onChange={(value, error) => handleInputChange('birthday', value, error)}
                  />
 
                 < Input 
                 type={'text'}
                 elementName={'phone_number'}
                 labelName={'Phone Number'}
                 validate={validatePhoneNumber}
                 onChange={(value, error) => handleInputChange('phone_number', value, error)}
                 maxV={13}
                 prefix={'+90'} 
                  />
 
                 < Input 
                 type={'text'}
                 elementName={'tc_number'}
                 labelName={'TC Number'}
                 validate={validateTcNumber}
                 onChange={(value, error) => handleInputChange('tc_number', value, error)}
                 maxV={11}
                  />
 
                 < Input 
                 type={'password'}
                 elementName={'password'}
                 labelName={'Password'}
                 validate={validatePassword}
                 onChange={(value, error) => handleInputChange('password', value, error)}
                  />
 
 
                 < Input 
                 type={'password'}
                 elementName={'password_confirmation'}
                 labelName={'Password Confirmation'}
                 validate={(value) => validatePasswordConfirm(value, formData.password)}
                 onChange={(value, error) => handleInputChange('password_confirmation', value, error)}
                  />
 
                 <button type="submit" className="cursor-pointer h-10 w-26 bg-blue-500 text-white hover:bg-blue-600 rounded-lg">Sign In</button>
                 
             </form>
        </div>
    );
}