import LanguageDropdown from "../../websites/LanguageDropdown.jsx";
import CurrencyDropDown from "../../CurrencyDropDown.jsx";
import {CarFront, User, Menu} from 'lucide-react';
import {router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function UpSide({ onToggleSidebar }) {

    const {t, i18n} = useTranslation();
    const goToHomePage = () => {
        router.visit(`/${i18n.language}/${t('address.adminpanel')}`)
    }
    return(
        <div className="fixed w-full px-4 md:px-16 flex items-center justify-between h-20 border-b z-40 bg-white shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={onToggleSidebar} className="md:hidden text-gray-700 hover:text-blue-600 transition-colors">
                    <Menu size={28} />
                </button>
                <div onClick={goToHomePage} className="cursor-pointer hover:text-blue-600 transition-colors"><CarFront size={28}/></div>
            </div>
            <div className="flex items-center gap-3 md:gap-6">
                <LanguageDropdown/>
                <CurrencyDropDown/>
                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                    <span className="hidden md:block font-medium text-sm">PROFILE</span>
                    <User className="md:hidden" size={24}/>
                </div>
            </div>
        </div>
    );
}
