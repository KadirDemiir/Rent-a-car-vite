import LanguageDropdown from "../../websites/LanguageDropdown.jsx";
import CurrencyDropDown from "../../CurrencyDropDown.jsx";

export default function UpSide() {
    return(
        <div className="fixed w-full px-16 flex items-center justify-between h-20 border-b z-40 bg-white">
            <div><img src="/storage/svg/logo.svg" className="h-8" alt=""/></div>
            <div>
                <LanguageDropdown/>
            </div>
            <div><CurrencyDropDown/></div>
            <div>PROFILE</div>
        </div>
    );
}
