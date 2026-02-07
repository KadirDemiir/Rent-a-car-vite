import axios from "axios";
import {useTranslation} from "react-i18next";
import { Power, PowerOff } from "lucide-react";

export default function LanguageChangeStatus({lang, setLang, setError, setSuccess}){
    const {t} = useTranslation();
    const handleSubmit = (st) => {
        axios.patch(`/adminpanel/languages/${lang.code}/active`, {status: st})
            .then(response => {
                setLang(response.data.language);
                setSuccess(response.data.success);
            })
            .catch(error => {
                setError(error.response.data.error);
            })
    }

    return(
        <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
                onClick={() => handleSubmit('active')} 
                className={`flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 sm:px-5 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 active:scale-[0.98] ${
                    lang.status === 'active'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg ring-2 ring-green-300 ring-offset-2'
                        : 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100 hover:border-green-300'
                }`}
            >
                <Power size={18} />
                <span className="hidden sm:inline">{t("adminpanel.languages.edit_language.button.active")}</span>
            </button>
            <button 
                onClick={() => handleSubmit('pasive')} 
                className={`flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 sm:px-5 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 active:scale-[0.98] ${
                    lang.status === 'pasive'
                        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg ring-2 ring-red-300 ring-offset-2'
                        : 'bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100 hover:border-red-300'
                }`}
            >
                <PowerOff size={18} />
                <span className="hidden sm:inline">{t("adminpanel.languages.edit_language.button.deactive")}</span>
            </button>
        </div>
    );
}
