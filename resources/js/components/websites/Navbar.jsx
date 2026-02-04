import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Menu, X, User, CarFront, ClipboardCheck, LogOut } from 'lucide-react';
import LanguageDropdown from './LanguageDropdown.jsx';
import CurrencyDropDown from '../CurrencyDropDown.jsx';
import axios from 'axios';

const Navbar = () => {
    const { auth } = usePage().props;
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
        <nav className="bg-gray-700 text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors">
                        <CarFront size={28} strokeWidth={2} />
                    </Link>

                    {/* Main Navigation Links */}
                    <div className="flex items-center gap-1">
                        <Link href={`/${lang}/${t('address.cars')}`} className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                            {upperFirstLetter(t('website.navigator.cars'))}
                        </Link>
                        <Link href={`/${lang}/${t('address.locations')}`} className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                            {upperFirstLetter(t('website.navigator.locations'))}
                        </Link>
                        <Link href={`/${lang}/${t('address.campaigns')}`} className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                            {upperFirstLetter(t('website.navigator.campaigns'))}
                        </Link>
                        <Link href={`/${lang}/${t('address.carporateRental')}`} className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                            {upperFirstLetter(t('website.navigator.car_porte_car_rental'))}
                        </Link>
                        <Link href={`/${lang}/${t('address.about')}`} className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                            {upperFirstLetter(t('website.navigator.about_us'))}
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <Link href={`/${i18n.language}/${t('address.checkReservation')}`} className="p-2 text-white hover:bg-blue-500 rounded-lg transition-colors" title={upperFirstLetter(t("website.navigator.check_reservation"))}>
                            <ClipboardCheck size={20} />
                        </Link>
                        
                        {user ? (
                            <button onClick={handleLogout} className="p-2 text-red-100 hover:text-white hover:bg-blue-500 rounded-lg transition-colors" title={upperFirstLetter(t('logout'))}>
                                <LogOut size={20} />
                            </button>
                        ) : (
                            <Link href={`/${i18n.language}/${t('address.auth')}`} className="p-2 text-white/90 hover:text-white hover:bg-blue-500 rounded-lg transition-colors" title={upperFirstLetter(t("website.auth.login.login_label"))}>
                                <User size={20} />
                            </Link>
                        )}
                        
                        <div className="h-6 w-px bg-blue-400/60 mx-1"></div>
                        
                        <LanguageDropdown />
                        <CurrencyDropDown />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden">
                    <div className="flex items-center justify-between h-14">
                        <Link href="/" className="text-white">
                            <CarFront size={26} strokeWidth={2} />
                        </Link>
                        
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-white/90 hover:text-white transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="py-4 border-t border-blue-500/40">
                            <div className="space-y-1">
                                <Link href={`/${lang}/${t('address.cars')}`} className="block px-4 py-2.5 text-white/90 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                                    {upperFirstLetter(t('website.navigator.cars'))}
                                </Link>
                                <Link href={`/${lang}/${t('address.locations')}`} className="block px-4 py-2.5 text-white/90 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                                    {upperFirstLetter(t('website.navigator.locations'))}
                                </Link>
                                <Link href={`/${lang}/${t('address.campaigns')}`} className="block px-4 py-2.5 text-white/90 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                                    {upperFirstLetter(t('website.navigator.campaigns'))}
                                </Link>
                                <Link href={`/${lang}/${t('address.carporateRental')}`} className="block px-4 py-2.5 text-white/90 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                                    {upperFirstLetter(t('website.navigator.car_porte_car_rental'))}
                                </Link>
                                <Link href={`/${lang}/${t('address.about')}`} className="block px-4 py-2.5 text-white/90 hover:bg-blue-500 hover:text-white rounded-lg transition-colors">
                                    {upperFirstLetter(t('website.navigator.about_us'))}
                                </Link>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-blue-500/40 space-y-2">
                                <Link href={`/${i18n.language}/${t('address.checkReservation')}`} className="flex items-center gap-2 px-4 py-2.5 text-white hover:bg-blue-500 rounded-lg transition-colors">
                                    <ClipboardCheck size={18} />
                                    {upperFirstLetter(t("website.navigator.check_reservation"))}
                                </Link>
                                
                                {user ? (
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-red-100 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                                        <LogOut size={18} />
                                        {upperFirstLetter(t('logout'))}
                                    </button>
                                ) : (
                                    <Link href={`/${i18n.language}/${t('address.auth')}`} className="flex items-center gap-2 px-4 py-2.5 text-white/90 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
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
        </nav>
    );
};

export default Navbar;
