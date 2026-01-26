import { Link, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LanguageDropdown from './LanguageDropdown.jsx';
import CurrencyDropDown from "../CurrencyDropDown.jsx";
import { User, CarFront, ClipboardCheck, LogOut } from 'lucide-react';

export default function UpSide({ isMobileMenuOpen }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { post } = useForm();
    const { i18n, t } = useTranslation();

    const upperFirstLetter = (str) => {
        return str
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }

    const handleLogout = (e) => {
        e.preventDefault();
        post('/logout');
    };

    return (
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex md:min-h-[15vh] w-full items-center justify-center bg-gray-100 p-2`}>
            <div className="w-[95%] md:w-[80%] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                <div className="hidden md:flex w-full md:w-auto items-center justify-center md:justify-start">
                    <Link href="/"><CarFront/></Link>
                </div>
                <div className={`flex h-full w-full md:w-auto md:min-w-[50%] transition-all duration-300`}>
                    <nav className="flex items-center justify-center h-full w-full">
                        <ul className="flex flex-col md:flex-row items-center justify-center gap-4 h-full w-full md:w-[80%] py-4 md:py-0">
                            <li>
                                <Link href={`/${i18n.language}/${t('address.checkReservation')}`} className="h-10 px-4 rounded-full bg-gray-100 border border-blue-800 flex items-center gap-2 hover:bg-blue-600 hover:shadow-lg transition-all duration-300 hover:text-white text-blue-800">
                                    <ClipboardCheck size={20}/>
                                    <div className="font-medium">{upperFirstLetter(t("website.navigator.check_reservation", "rez-kontrol"))}</div>
                                </Link>
                            </li>
                            <li>
                                {(user) ? (
                                    <button type="button" onClick={handleLogout} className="h-10 px-4 rounded-full bg-red-50 border border-red-800 flex items-center gap-2 hover:bg-red-600 hover:shadow-lg transition-all duration-300 hover:text-white text-red-800">
                                        <LogOut size={20}/>
                                        <div className="font-medium">{upperFirstLetter(t('logout'))}</div>
                                    </button>
                                ) : (
                                    <Link href={`/${i18n.language}/${t('address.auth')}`} className="h-10 px-4 rounded-full bg-gray-200 border border-blue-800 flex items-center gap-2 hover:bg-blue-600 hover:shadow-lg transition-all duration-300 hover:text-white">
                                        <User size={20}/>
                                        <div className="font-medium">{upperFirstLetter(t("website.auth.login.login_label"))}</div>
                                    </Link>
                                )}
                            </li>
                            <li className="h-10 pl-2 flex items-center justify-center">
                                <LanguageDropdown />
                            </li>
                            <li>
                                <CurrencyDropDown />
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}