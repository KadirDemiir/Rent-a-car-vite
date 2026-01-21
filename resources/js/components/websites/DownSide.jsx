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
        <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex bg-blue-800 md:min-h-[5rem] flex-col md:flex-row items-center justify-center relative`}>
            {/* The toggle button is now controlled by parent Navbar, so we don't need internal toggle logic or the hidden button div */}
            <ul className={`flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-[80%] md:h-20 pb-4 md:pb-0 pt-4 md:pt-0`}>
            <li className="w-full md:w-auto md:flex-1 h-12 md:h-full hover:bg-blue-700 flex items-center justify-center rounded-md">
                <Link href={`/${lang}/${t('address.cars')}`} className="h-full w-full text-white flex items-center justify-center">{upperFirstLetter(t('website.navigator.cars'))}</Link>
            </li>
            <li className="w-full md:w-auto md:flex-1 h-12 md:h-full hover:bg-blue-700 flex items-center justify-center rounded-md">
                <Link href={`/${lang}/${t('address.locations')}`} className="h-full w-full text-white flex items-center justify-center">{upperFirstLetter(t('website.navigator.locations'))}</Link>
            </li>
            <li className="w-full md:w-auto md:flex-1 h-12 md:h-full hover:bg-blue-700 flex items-center justify-center rounded-md">
                <Link href={`/${lang}/${t('address.campaigns')}`} className="h-full w-full text-white flex items-center justify-center">{upperFirstLetter(t ('website.navigator.campaigns'))}</Link>
            </li>
            <li className="w-full md:w-auto md:flex-1 h-12 md:h-full hover:bg-blue-700 flex items-center justify-center rounded-md">
                <Link href={`/${lang}/${t('address.carporateRental')}`} className="h-full w-full text-white flex items-center justify-center text-center">{upperFirstLetter(t('website.navigator.car_porte_car_rental'))}</Link>
            </li>
            <li className="w-full md:w-auto md:flex-1 h-12 md:h-full hover:bg-blue-700 flex items-center justify-center rounded-md">
                <Link href={`/${lang}/${t('address.about')}`} className="h-full w-full text-white flex items-center justify-center">{upperFirstLetter(t ('website.navigator.about_us'))}</Link>
            </li>
            {/*
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href="/blog" className="h-full w-full text-white flex items-center justify-center">Blog</Link>
            </li>*/}
        </ul>
    </nav>
    );
}
