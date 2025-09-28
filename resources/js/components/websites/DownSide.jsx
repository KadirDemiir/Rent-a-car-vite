import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function DownSide() {
    const {i18n,  t } = useTranslation();
    const lang = i18n.language.split('-')[0];
    const upperFirstLetter = (str) => {
        return str
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }
    return (
        <nav className="bg-blue-800 h-20 flex items-center justify-center">
        <ul className="flex items-center justify-center gap-4 h-full w-[80%]">
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href={`/${lang}/${t('address.cars')}`} className="h-full w-full text-white flex items-center justify-center">{upperFirstLetter(t('website.navigator.cars'))}</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex-1 flex items-center justify-center rounded-md">
                <Link href={`/${lang}/${t('address.locations')}`} className="h-full w-full text-white flex items-center justify-center">{upperFirstLetter(t('website.navigator.locations'))}</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href={`/${lang}/${t('address.campaigns')}`} className="h-full w-full text-white flex items-center justify-center">{upperFirstLetter(t ('website.navigator.campaigns'))}</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href={`/${lang}/${t('address.carporateRental')}`} className="h-full w-full text-white flex items-center justify-center text-center">{upperFirstLetter(t('website.navigator.car_porte_car_rental'))}</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
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
