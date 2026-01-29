import { Link } from '@inertiajs/react';
import { usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LanguageDropdown from './LanguageDropdown.jsx';
import CurrencyDropDown from "../CurrencyDropDown.jsx";
import { User, CarFront, ClipboardCheck, LogOut } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';

export default function UpSide({ isMobileMenuOpen }) {
    const { auth } = usePage().props;
    const [user, setUser] = useState(auth?.user);
    const { i18n, t } = useTranslation();

    const upperFirstLetter = (str) => {
        return str
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }

    const handleLogout = (e) => {
        e.preventDefault();
        axios.post('/logout')
        .then((prev) => {
            if(prev.data.success){
                console.log(prev.data);
                setUser(prev.data.auth);
            }
        })
        .catch((err) => {
            console.error(err);
        });
    };

    const handleClick = () => {
        router.visit(`/${i18n.language}`);
    }

    return (
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex w-full items-center justify-center bg-white border-b border-gray-200 py-2`}>
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
                <button onClick={handleClick} className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                    <CarFront size={28}/>
                </button>
                
                <nav className="flex items-center">
                    <ul className="flex flex-col md:flex-row items-center gap-2 md:gap-3 py-3 md:py-0">
                        <li>
                            <Link href={`/${i18n.language}/${t('address.checkReservation')}`} className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 text-sm font-medium">
                                <ClipboardCheck size={16}/>
                                {upperFirstLetter(t("website.navigator.check_reservation", "rez-kontrol"))}
                            </Link>
                        </li>
                        <li>
                            {(user) ? (
                                <button type="button" onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 text-sm font-medium">
                                    <LogOut size={16}/>
                                    {upperFirstLetter(t('logout'))}
                                </button>
                            ) : (
                                <Link href={`/${i18n.language}/${t('address.auth')}`} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 text-sm font-medium">
                                    <User size={16}/>
                                    {upperFirstLetter(t("website.auth.login.login_label"))}
                                </Link>
                            )}
                        </li>
                        <li className="flex items-center">
                            <LanguageDropdown />
                        </li>
                        <li>
                            <CurrencyDropDown />
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}