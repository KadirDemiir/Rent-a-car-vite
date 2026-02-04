import Navbar from '../../components/websites/Navbar.jsx'
import SignUpForm from './SignUpForm.jsx'
import LogInForm from './LogInForm'
import { useState, useEffect } from 'react';
import {useTranslation} from "react-i18next";



export default function Auth() {
    const {t} = useTranslation();
    const [formType, setFormType] = useState('Login');
    const [localMessage, setLocalMessage] = useState(null);

    const handleMessage = (msg) => {
        setLocalMessage(msg);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Tab Navigation */}
                    <div className="bg-white rounded-t-2xl shadow-lg border border-gray-100 border-b-0">
                        <div className="flex gap-0">
                            <button 
                                type="button" 
                                onClick={() => setFormType('Login')} 
                                className={`flex-1 py-4 font-semibold transition-all duration-300 relative ${
                                    formType === 'Login' 
                                        ? 'text-gray-700' 
                                        : 'text-gray-500 hover:text-gray-700'
                                } ${formType === 'Login' ? 'rounded-tl-2xl' : ''}`}
                            >
                                {t("website.auth.login.login_label")}
                                {formType === 'Login' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700"></div>
                                )}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setFormType('Signup')} 
                                className={`flex-1 py-4 font-semibold transition-all duration-300 relative ${
                                    formType === 'Signup' 
                                        ? 'text-gray-700' 
                                        : 'text-gray-500 hover:text-gray-700'
                                } ${formType === 'Signup' ? 'rounded-tr-2xl' : ''}`}
                            >
                                {t("website.auth.signup.signup_label")}
                                {formType === 'Signup' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700"></div>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {/* Messages */}
                    {localMessage && (
                        <div className="bg-white border-x border-gray-100 px-8 pt-6">
                            {localMessage.type === 'error' && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 mb-4">
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-sm">{localMessage.text}</span>
                                </div>
                            )}
                            {localMessage.type === 'success' && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2 mb-4">
                                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-sm">{localMessage.text}</span>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Form Content */}
                    {formType === 'Login' ? <LogInForm onMessage={handleMessage} setFormType={setFormType} /> : <SignUpForm onMessage={handleMessage} setFormType={setFormType} />}
                </div>
            </div>
        </div>
    );
}
