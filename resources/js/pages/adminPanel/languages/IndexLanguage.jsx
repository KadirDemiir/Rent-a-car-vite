import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {Link} from '@inertiajs/react';
import LanguageForm from "../../../components/adminPanel/language/LanguageForm.jsx";
import {useTranslation} from "react-i18next";

export default function IndexLanguage({language, keys, campaigns}){
    const {t} = useTranslation();
    return(
        <div className={`w-full`}>
            <Navbar >
                <h4>{t("adminpanel.languages.edit_language.language_information")}</h4><hr/><br/>
                <div className={`w-full flex items-center justify-between`}>
                    <div><Link href={`/aa/adminpanel/languages`}><span className={`font-medium text-gray-600 hover:text-gray-700`}>Show All</span></Link> / <span className={`text-gray-700`}>{language.name}</span></div>
                    {new Date(language.created_at) > new Date(Date.now() - 86400000) && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white text-sm font-semibold select-none">
                            ✨ New Added
                        </div>
                    )}

                </div><br/>
                <LanguageForm language={language} keys={keys} campaigns={campaigns}/>
            </Navbar>
        </div>
    );
}
