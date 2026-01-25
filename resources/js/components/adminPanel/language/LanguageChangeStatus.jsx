import axios from "axios";
import Confirm from "../../Confirm.jsx";
import {useTranslation} from "react-i18next";

export default function LanguageChangeStatus({lang, setLang, setError, setSuccess}){
    const {t} = useTranslation();
    const handleSubmit = (st) => {
        axios.patch(`/adminpanel/languages/${lang.id}/active`, {status: st})
            .then(response => {
                setLang(response.data.language);
                setSuccess(response.data.success);
            })
            .catch(error => {
                setError(error.response.data.error);
            })
    }

    return(
        <div className="w-full flex flex-col sm:flex-row gap-2 md:gap-3">
            <button 
                onClick={() => handleSubmit('active')} 
                className={`flex-1 whitespace-nowrap px-4 md:px-5 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all duration-200 active:scale-95 ${
                    lang.status === 'active'
                        ? 'bg-green-600 text-white shadow-md ring-2 ring-green-300 ring-offset-2'
                        : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                }`}
            >
                {t("adminpanel.languages.edit_language.button.active")}
            </button>
            <button 
                onClick={() => handleSubmit('pasive')} 
                className={`flex-1 whitespace-nowrap px-4 md:px-5 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all duration-200 active:scale-95 ${
                    lang.status === 'pasive'
                        ? 'bg-red-600 text-white shadow-md ring-2 ring-red-300 ring-offset-2'
                        : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                }`}
            >
                {t("adminpanel.languages.edit_language.button.deactive")}
            </button>
        </div>
    );
}
