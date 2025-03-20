import { router } from '@inertiajs/react'
import {useState} from 'react'
import Input from '../../components/formElement/Input';

export default function LogInForm() 
    {
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
          alert('Lütfen hataları düzeltin.');
          return; 
      }
      
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      router.post('/auth', formData, {
          headers: {
              'X-CSRF-TOKEN': csrfToken,
          },
      });
              
  };

        const validateEmail = (value) => 
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Geçersiz e-posta' : '';
        
          const validatePassword = (value) => 
            value.length < 6 ? 'Şifre en az 6 karakter olmalı' : '';
        
          return (
            <div className="mt-4 border w-full">
              <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center gap-4 p-4">
                
                <Input
                  type="email"
                  elementName="email"
                  labelName="E-posta"
                  validate={validateEmail}
                  onChange={(val, err) => handleInputChange('email', val, err)}
                />
                
                <Input
                  type="password"
                  elementName="password"
                  labelName="Şifre"
                  validate={validatePassword}
                  onChange={(val, err) => handleInputChange('password', val, err)}
                />
                
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Giriş Yap
                </button>
              </form>
            </div>
          );
    }