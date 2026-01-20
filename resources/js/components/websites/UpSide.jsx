import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LanguageDropdown from './LanguageDropdown.jsx';
import CurrencyDropDown from "../CurrencyDropDown.jsx";
import {User, CarFront, ClipboardCheck, Menu, X} from 'lucide-react';

export default function UpSide() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth.user;
    const { post } = useForm();
    const {i18n, t } = useTranslation();
    const upperFirstLetter = (str) => {
        return str
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }


    const handleLogout = () => {
    post('/logout', {
        onFinish: () => window.location.reload(),
    });
};
    return (
        <div className="min-h-[15vh] w-full flex items-center justify-center bg-gray-100 p-2">
            <div className="w-[95%] md:w-[80%] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                <div className="w-full md:w-auto flex items-center justify-between">
                    <Link href="/"><CarFront/></Link>
                    <button
                        className="md:hidden p-2 text-gray-700"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex h-full w-full md:w-auto md:min-w-[50%]`}>
                    <nav className="flex items-center justify-center h-full w-full">
                        <ul className="flex flex-col md:flex-row items-center justify-center gap-4 h-full w-full md:w-[80%] py-4 md:py-0">
                            <li>
                                <Link href={`/${i18n.language}/${t('address.checkReservation')}`} className="h-10 px-4 rounded-full bg-gray-100 border border-blue-800 flex items-center gap-2 hover:bg-blue-600 hover:shadow-lg transition-all duration-300 hover:text-white text-blue-800">
                                    <ClipboardCheck size={20}/>
                                    <div className="font-medium">{upperFirstLetter(t("website.navigator.check_reservation", "rez-kontrol"))}</div>
                                </Link>
                            </li>
                            <li>
                                {user ? (
                                <button type="button" onClick={handleLogout} className="btn btn-danger">
                                    {upperFirstLetter(t('logout'))}
                                </button>
                                ) : (
                                    <Link href={`/${i18n.language}/${t('address.auth')}`} className="h-10 px-4 rounded-full bg-gay-200 border border-blue-800 flex items-center gap-2 hover:bg-blue-600 hover:shadow-lg transition-all duration-300 hover:text-white">
                                        {/*<img src="/storage/svg/profile.svg" className="bg-gray-200 rounded-2xl h-6 w-6" alt="" />*/}
                                        <User size={20}/>
                                        <div className="font-medium">{upperFirstLetter(t("website.auth.login.login_label"))}</div>
                                    </Link>
                                )}
                            </li>
                            <li className="h-10 pl-2 flex items-center justify-center">
                                < LanguageDropdown />
                            </li>
                            <li>
                                < CurrencyDropDown />
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}
