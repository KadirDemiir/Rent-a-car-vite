import Navbar from '../../components/websites/Navbar.jsx'
import SignUpForm from './SignUpForm.jsx'
import LogInForm from './LogInForm'
import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import {useTranslation} from "react-i18next";



export default function Auth() {
    const {t} = useTranslation();
    const { errorMessage, message, page} = usePage().props;
    const [formType, setFormType] = useState('Login');

    useEffect(() => {
        if (page) {
          setFormType(page);
        }
      }, [page]);

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center mt-16">
                <div className="w-96">
                    <div className="w-full flex gap-1 ">
                        <button type="button" onClick={() => setFormType('Login')} className={`flex-1 flex items-center justify-center w-full h-12 hover:bg-blue-500 hover:text-white rounded-lg cursor-pointer ${formType === 'Login' ? 'bg-blue-500 text-white' : 'bg-blue-100'}`}>
                            {t("website.auth.login.login_label")}
                        </button>
                        <button type="button" onClick={() => setFormType('Signup')} className={`flex-1 flex items-center justify-center w-full h-12 hover:bg-blue-500 hover:text-white rounded-lg cursor-pointer ${formType === 'Signup' ? 'bg-blue-500 text-white' : 'bg-blue-100'}`}>
                            {t("website.auth.signup.signup_label")}
                        </button>
                    </div>
                    {errorMessage && (<div className="ml-2 text-red-600">{errorMessage}</div>)}
                    {message && (<div className="ml-2 text-green-600">{message}</div>)}
                    {formType === 'Login' ? <LogInForm /> : <SignUpForm />}
                </div>
            </div>
        </div>
    );
}
