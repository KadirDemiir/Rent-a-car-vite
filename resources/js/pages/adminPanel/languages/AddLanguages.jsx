import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import AddLanguageForm from "../../../components/adminPanel/language/AddLanguageForm.jsx";
import {useTranslation} from "react-i18next";

export default function AddLanguages({keys}){
    const {t} =  useTranslation()
    return(
        <div className={`w-full`}>
            <Navbar >
                <h4>{t("adminpanel.add_languages.add_language")}</h4><hr/><br/>
                <AddLanguageForm keys={keys}/>
            </Navbar>
        </div>
    );
}
