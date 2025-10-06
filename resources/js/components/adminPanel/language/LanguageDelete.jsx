import Confirm from "../../Confirm.jsx";
import {useState} from "react";
import axios from "axios";
import {router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function LanguageDelete({setError, lang}){
    const {t} = useTranslation();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const deleteHandler = () => {
        axios.delete(`/adminpanel/languages/${lang.id}`, )
            .then(response => {
                router.visit('/adminpanel/languages');
            })
            .catch(error => {
                setError(error.response.data.error);
            });
    };
    const handleConfirm = (response) => {
        if (response)
            deleteHandler()
        setConfirmOpen(false);
    }
    return(
        <div className={`w-full`}>
            <button onClick={() => setConfirmOpen(true)} className={`py-1 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg cursor-pointer`}>
                {t("adminpanel.languages.edit_language.button.delete")}
            </button>
            {confirmOpen && <Confirm message={"Are you sure you want to delete this language?"} confirm={handleConfirm}/>}
        </div>
    );
}
