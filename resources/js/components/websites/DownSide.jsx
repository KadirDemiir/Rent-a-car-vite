import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function DownSide({ isMobileMenuOpen }) {
    const {i18n,  t } = useTranslation();
    const lang = i18n.language.split('-')[0];
    const upperFirstLetter = (str) => {
        return str
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }
    return (
        <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex bg-gradient-to-r from-blue-600 to-blue-700 items-center justify-center`}>
            <ul className={`flex flex-col md:flex-row items-center justify-center gap-1 container mx-auto py-3 md:py-0`}>
                <li className="w-full md:w-auto">
                    <Link href={`/${lang}/${t('address.cars')}`} className="block px-4 py-3 md:py-3.5 text-white hover:bg-blue-500 transition-colors rounded text-sm font-medium text-center">{upperFirstLetter(t('website.navigator.cars'))}</Link>
                </li>
                <li className="w-full md:w-auto">
                    <Link href={`/${lang}/${t('address.locations')}`} className="block px-4 py-3 md:py-3.5 text-white hover:bg-blue-500 transition-colors rounded text-sm font-medium text-center">{upperFirstLetter(t('website.navigator.locations'))}</Link>
                </li>
                <li className="w-full md:w-auto">
                    <Link href={`/${lang}/${t('address.campaigns')}`} className="block px-4 py-3 md:py-3.5 text-white hover:bg-blue-500 transition-colors rounded text-sm font-medium text-center">{upperFirstLetter(t ('website.navigator.campaigns'))}</Link>
                </li>
                <li className="w-full md:w-auto">
                    <Link href={`/${lang}/${t('address.carporateRental')}`} className="block px-4 py-3 md:py-3.5 text-white hover:bg-blue-500 transition-colors rounded text-sm font-medium text-center">{upperFirstLetter(t('website.navigator.car_porte_car_rental'))}</Link>
                </li>
                <li className="w-full md:w-auto">
                    <Link href={`/${lang}/${t('address.about')}`} className="block px-4 py-3 md:py-3.5 text-white hover:bg-blue-500 transition-colors rounded text-sm font-medium text-center">{upperFirstLetter(t ('website.navigator.about_us'))}</Link>
                </li>
            </ul>
        </nav>
    );
}
