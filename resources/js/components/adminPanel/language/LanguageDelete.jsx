import Confirm from "../../Confirm.jsx";
import {useState} from "react";
import axios from "axios";
import {router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";
import { Trash2 } from "lucide-react";

export default function LanguageDelete({setError, lang}){
    const {t, i18n} = useTranslation();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const deleteHandler = () => {
        axios.delete(`/adminpanel/languages/${lang.code}`, )
            .then(response => {
                router.visit(`/${i18n.language}/${t('address.adminpanel')}/${t('address.languages')}`);
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
        <div className="w-full">
            <button
                onClick={() => setConfirmOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
                <Trash2 size={18} />
                <span className="hidden sm:inline">{t("adminpanel.languages.edit_language.button.delete")}</span>
            </button>
            {confirmOpen && <Confirm message={t("adminpanel.languages.edit_language.button.delete")} confirm={handleConfirm}/>}
        </div>
    );
}
