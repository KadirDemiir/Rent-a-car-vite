import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function DownSide() {
    const { t } = useTranslation('downside');
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
                <Link href="/cars" className="h-full w-full text-white flex items-center justify-center">{upperFirstLetter(t('cars'))}</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex-1 flex items-center justify-center rounded-md">
                <Link href="/locations" className="h-full w-full text-white flex items-center justify-center">{upperFirstLetter(t('locations'))}</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href="/campaigns" className="h-full w-full text-white flex items-center justify-center">{upperFirstLetter(t ('campaigns'))}</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href="/carporateRental" className="h-full w-full text-white flex items-center justify-center text-center">{upperFirstLetter(t('corporate_car_rental'))}</Link>
            </li>
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href="/about" className="h-full w-full text-white flex items-center justify-center">{upperFirstLetter(t ('about_us'))}</Link>
            </li>
            {/*
            <li className="h-full hover:bg-blue-700 flex flex-1 items-center justify-center rounded-md">
                <Link href="/blog" className="h-full w-full text-white flex items-center justify-center">Blog</Link>
            </li>*/}
        </ul>
    </nav>
    );
}
