import LanguageDropdown from "../../websites/LanguageDropdown.jsx";
import CurrencyDropDown from "../../CurrencyDropDown.jsx";
import {CarFront, User, Menu, LogOut, MoreVertical, X} from 'lucide-react';
import {router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {useState, useRef, useEffect} from "react";

export default function UpSide({ onToggleSidebar }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const {t, i18n} = useTranslation();
    const goToHomePage = () => {
        router.visit(`/${i18n.language}/${t('address.adminpanel')}`)
    }
    const goToChangePassword = () => {
        setMobileMenuOpen(false);
        router.visit(`/${i18n.language}/${t('address.adminpanel')}/admin`)
    }
    const handleLogout = async () => {
        setMobileMenuOpen(false);
        try {
            await axios.post(`/${i18n.language}/logout`, {}, { withCredentials: true });
            router.visit(`/${i18n.language}/${t('address.adminpanel')}/${t('address.auth')}`);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return(
        <div className="fixed w-full px-3 sm:px-6 md:px-16 flex items-center justify-between h-16 sm:h-20 border-b z-40 bg-white shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4">
                <button onClick={onToggleSidebar} className="md:hidden p-2 -ml-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <Menu size={24} />
                </button>
                <button onClick={goToHomePage} className="p-2 cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <CarFront size={24} className="sm:w-7 sm:h-7"/>
                </button>
            </div>

            {/* Desktop: show all items inline */}
            <div className="hidden sm:flex items-center gap-3 md:gap-6">
                <LanguageDropdown/>
                <CurrencyDropDown/>
                <button onClick={goToChangePassword} className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <User size={22} className="md:w-6 md:h-6"/>
                </button>
                <button onClick={handleLogout} className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <LogOut size={22} className="md:w-6 md:h-6"/>
                </button>
            </div>

            {/* Mobile: dropdown menu */}
            <div className="sm:hidden relative" ref={dropdownRef}>
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                    className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                    {mobileMenuOpen ? <X size={24} /> : <MoreVertical size={24} />}
                </button>

                {mobileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        
                        <div className="p-2 space-y-1">
                            <div className="flex items-center justify-center px-3 py-2">
                                <LanguageDropdown/>
                            </div>
                            <div className="flex items-center justify-center px-3 py-2">
                                <CurrencyDropDown/>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-2 px-2 space-y-1">
                            <button 
                                onClick={goToChangePassword} 
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <User size={20}/>
                                <span className="text-sm font-medium">{t('profile', 'Profile')}</span>
                            </button>
                            <button 
                                onClick={handleLogout} 
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut size={20}/>
                                <span className="text-sm font-medium">{t('logout', 'Logout')}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
