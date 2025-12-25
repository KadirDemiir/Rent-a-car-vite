import { Link, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import LanguageDropdown from './LanguageDropdown.jsx';
import CurrencyDropDown from "../CurrencyDropDown.jsx";
import {User, CarFront} from 'lucide-react';

export default function UpSide() {
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
        <div className="h-[15vh] w-full flex items-center justify-center bg-gray-100 p-2">
            <div className="w-[80%] flex items-center justify-between">
                <div><Link href="/"><CarFront/></Link></div>
                <div className="flex h-full min-w-[50%]">
                    <nav className="flex items-center justify-center h-full w-full">
                        <ul className="flex items-center justify-center gap-4 h-full w-[80%]">
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
