import LanguageDropdown from "../../websites/LanguageDropdown.jsx";
import CurrencyDropDown from "../../CurrencyDropDown.jsx";
import {CarFront} from 'lucide-react';
import {router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function UpSide() {

    const {t, i18n} = useTranslation();
    const goToHomePage = () => {
        router.visit(`/${i18n.language}/${t('address.adminpanel')}`)
    }
    return(
        <div className="fixed w-full px-16 flex items-center justify-between h-20 border-b z-40 bg-white">
            <div onClick={goToHomePage} ><CarFront/></div>
            <div>
                <LanguageDropdown/>
            </div>
            <div><CurrencyDropDown/></div>
            <div>PROFILE</div>
        </div>
    );
}
