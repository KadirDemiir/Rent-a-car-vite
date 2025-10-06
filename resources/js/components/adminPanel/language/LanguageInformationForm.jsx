import LanguageInformation from "./LanguageInformation.jsx";
import {useState} from "react";
import LanguageDelete from "./LanguageDelete.jsx";
import LanguageChangeStatus from "./LanguageChangeStatus.jsx";
import axios from "axios";
import {useTranslation} from "react-i18next";

export default function LanguageInformationForm({lang, setLang, totalCmpCount, cmpErrorCount, totalVariableCount, variableErrorCount}){
    const {t} = useTranslation();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [data, setData] = useState({
        name: { value:  lang.name || '', error: lang.name ?  '' : 'This Field Cant Be Empty.'},
        code: { value:  lang.code || '', error: lang.code ? '' : 'This Field Cant Be Empty.' },
        flag: { value: lang.flag_photo_path || null, error: lang.flag_photo_path ? '' : 'This Field Cant Be Empty.'  },
    });

    const handleSubmit = () => {
        if(Object.entries(data).some(([k, v]) => v.error)){
            window.scrollTo({top: 0, behavior: "smooth"});
            return;
        }
        const form_data = new FormData();
        form_data.append('name', data.name.value);
        form_data.append('code', data.code.value);
        if(data.flag.value instanceof File)
            form_data.append('flag', data.flag.value);
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
        form_data.append('_method', 'PUT');
        axios.post(`/adminpanel/languages/${lang.id}`, form_data, {
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            }
        })
            .then(response => setSuccess(response.data.success))
            .catch(error => setError(error.response.data.error));
    }
    return(
        <div className={`w-full`}>
            {error && <div className={`w-full border-l-12 border-red-600 bg-red-400 text-white p-2`}>{error}</div>}
            {success && <div className={`w-full border-l-12 border-green-600 bg-green-400 text-white p-2`}>{success}</div>}
            <br/>
            <div className={`w-full flex items-center justify-between`}>
                <LanguageDelete setError={setError} lang={lang}/>
                <LanguageChangeStatus lang={lang} setLang={setLang} setError={setError} setSuccess={setSuccess}/>
            </div><br/>
            <LanguageInformation data={data} setData={setData}/><br/>
            <button onClick={handleSubmit} className={`py-1 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer`}>{t("adminpanel.languages.edit_language.button.delete")}</button>
            <div>TOTAL CAMPAIGN COUNT: {totalCmpCount}, LANGUAGE ERROR CAMPAIGN COUNT:{cmpErrorCount}</div>
            <div>TOTAL SITE VARİABLE COUNT: {totalVariableCount}, VARIABLE ERROR COUNT: {variableErrorCount}</div>

        </div>
    );
}
