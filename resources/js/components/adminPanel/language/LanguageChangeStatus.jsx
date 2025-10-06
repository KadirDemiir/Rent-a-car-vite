import axios from "axios";
import Confirm from "../../Confirm.jsx";
import {useTranslation} from "react-i18next";

export default function LanguageChangeStatus({lang, setLang, setError, setSuccess}){
    const {t} = useTranslation();
    const handleSubmit = (st) => {
        axios.patch(`/adminpanel/languages/${lang.id}/active`, {status: st})
            .then(response => {
                console.log(response.data.language)
                setLang(response.data.language);
                setSuccess(response.data.success);
            })
            .catch(error => {
                setError(error.response.data.error);
            })
    }
    return(
        <div className={`flex gap-4`}>
            <button onClick={() => handleSubmit('active')} className={`whitespace-nowrap py-1 px-4 rounded-lg text-white bg-green-500 ${lang.status === 'active' ? 'ring-4 ring-green-500 ring-offset-4 ring-offset-white' : ''} `}>{t("adminpanel.languages.edit_language.button.active")}</button>
            <button onClick={() => handleSubmit('pasive')} className={`whitespace-nowrap py-1 px-4 rounded-lg text-white bg-red-500 ${lang.status === 'pasive' ? 'ring-4 ring-red-500 ring-offset-4 ring-offset-white' : ''}`}>{t("adminpanel.languages.edit_language.button.deactive")}</button>
        </div>
    );
}
