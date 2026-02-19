import { Link, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Menu, X, User, CarFront, ClipboardCheck, LogOut } from 'lucide-react';
import { useState } from 'react';
import LanguageDropdown from './LanguageDropdown.jsx';
import CurrencyDropDown from '../CurrencyDropDown.jsx';
import axios from "axios";

const Navbar = () => {
    const { auth, activePages } = usePage().props;
    const [user, setUser] = useState(auth?.user);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { i18n, t } = useTranslation();
    const lang = i18n.language.split('-')[0];

    const upperFirstLetter = (str) => {
        return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    const handleLogout = (e) => {
        e.preventDefault();
        axios.post('/logout')
            .then((prev) => {
                if(prev.data.success){
                    setUser(prev.data.auth);
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="hidden lg:flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                        <CarFront size={28} strokeWidth={2} />
                    </Link>

                    <div className="flex items-center gap-1">
                        {activePages?.includes('cars') && (
                            <Link href={`/${lang}/${t('address.cars')}`} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                                {upperFirstLetter(t('website.navigator.cars'))}
                            </Link>
                        )}
                        {activePages?.includes('locations') && (
                            <Link href={`/${lang}/${t('address.locations')}`} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                                {upperFirstLetter(t('website.navigator.locations'))}
                            </Link>
                        )}
                        {activePages?.includes('campaigns') && (
                            <Link href={`/${lang}/${t('address.campaigns')}`} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                                {upperFirstLetter(t('website.navigator.campaigns'))}
                            </Link>
                        )}
                        {activePages?.includes('corporate') && (
                            <Link href={`/${lang}/${t('address.carporateRental')}`} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                                {upperFirstLetter(t('website.navigator.car_porte_car_rental'))}
                            </Link>
                        )}
                        {activePages?.includes('about') && (
                            <Link href={`/${lang}/${t('address.about')}`} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                                {upperFirstLetter(t('website.navigator.about_us'))}
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/${i18n.language}/${t('address.checkReservation')}`} className="p-2 text-blue-600 hover:text-white hover:bg-blue-500 rounded-lg transition-colors" title={upperFirstLetter(t("website.navigator.check_reservation"))}>
                            <ClipboardCheck size={20} />
                        </Link>

                        {user ? (
                            <button onClick={handleLogout} className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors cursor-pointer" title={upperFirstLetter(t('logout'))}>
                                <LogOut size={20} />
                            </button>
                        ) : (
                            <Link href={`/${i18n.language}/${t('address.auth')}`} className="p-2 text-gray-700 hover:text-white hover:bg-blue-500 rounded-lg transition-colors" title={upperFirstLetter(t("website.auth.login.login_label"))}>
                                <User size={20} />
                            </Link>
                        )}

                        <div className="h-6 w-px bg-blue-400/60 mx-1"></div>

                        <LanguageDropdown />
                        <CurrencyDropDown />
                    </div>
                </div>

                <div className="lg:hidden">
                    <div className="flex items-center justify-between h-14">
                        <Link href="/">
                            <CarFront size={26} strokeWidth={2} className="text-gray-800" />
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-700 transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="py-4 border-t border-blue-500/40">
                            <div className="space-y-1">
                                {activePages?.includes('cars') && (
                                    <Link href={`/${lang}/${t('address.cars')}`} className="block px-4 py-2.5 text-gray-800 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                                        {upperFirstLetter(t('website.navigator.cars'))}
                                    </Link>
                                )}
                                {activePages?.includes('locations') && (
                                    <Link href={`/${lang}/${t('address.locations')}`} className="block px-4 py-2.5 text-gray-800 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                                        {upperFirstLetter(t('website.navigator.locations'))}
                                    </Link>
                                )}
                                {activePages?.includes('campaigns') && (
                                    <Link href={`/${lang}/${t('address.campaigns')}`} className="block px-4 py-2.5 text-gray-800 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                                        {upperFirstLetter(t('website.navigator.campaigns'))}
                                    </Link>
                                )}
                                {activePages?.includes('corporate') && (
                                    <Link href={`/${lang}/${t('address.carporateRental')}`} className="block px-4 py-2.5 text-gray-800 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                                        {upperFirstLetter(t('website.navigator.car_porte_car_rental'))}
                                    </Link>
                                )}
                                {activePages?.includes('about') && (
                                    <Link href={`/${lang}/${t('address.about')}`} className="block px-4 py-2.5 text-gray-800 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                                        {upperFirstLetter(t('website.navigator.about_us'))}
                                    </Link>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-blue-500/40 space-y-2">
                                <Link href={`/${i18n.language}/${t('address.checkReservation')}`} className="flex items-center gap-2 px-4 py-2.5 text-gray-800 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                                    <ClipboardCheck size={18} />
                                    {upperFirstLetter(t("website.navigator.check_reservation"))}
                                </Link>

                                {user ? (
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:text-white hover:bg-red-500 rounded-lg transition-colors">
                                        <LogOut size={18} />
                                        {upperFirstLetter(t('logout'))}
                                    </button>
                                ) : (
                                    <Link href={`/${i18n.language}/${t('address.auth')}`} className="flex items-center gap-2 px-4 py-2.5 text-gray-800 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                                        <User size={18} />
                                        {upperFirstLetter(t("website.auth.login.login_label"))}
                                    </Link>
                                )}

                                <div className="flex items-center gap-2 px-4 py-2">
                                    <LanguageDropdown />
                                    <CurrencyDropDown />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <hr className="border-t border-gray-100" />
        </nav>
    );
};

export default Navbar;
