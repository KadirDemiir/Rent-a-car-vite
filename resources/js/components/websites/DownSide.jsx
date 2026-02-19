import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function DownSide({ isMobileMenuOpen }) {
    const { i18n, t } = useTranslation();
    const { activePages } = usePage().props;
    const lang = i18n.language.split('-')[0];
    console.log(activePages);
    console.log(1);
    const upperFirstLetter = (str) => {
        return str
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }

    return (
        <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex bg-linear-to-r from-gray-600 to-gray-700 items-center justify-center w-full`}>
            <ul className="flex flex-col md:flex-row items-center justify-center gap-1 container mx-auto py-3 md:py-0 w-full">

                {activePages?.includes('cars') && (
                    <li className="w-full md:w-auto">
                        <Link href={`/${lang}/${t('address.cars')}`} className="block px-4 py-3 md:py-3.5 text-white hover:bg-blue-500 transition-colors rounded text-sm font-medium text-center w-full">
                            {upperFirstLetter(t('website.navigator.cars'))}
                        </Link>
                    </li>
                )}

                {activePages?.includes('locations') && (
                    <li className="w-full md:w-auto">
                        <Link href={`/${lang}/${t('address.locations')}`} className="block px-4 py-3 md:py-3.5 text-white hover:bg-blue-500 transition-colors rounded text-sm font-medium text-center w-full">
                            {upperFirstLetter(t('website.navigator.locations'))}
                        </Link>
                    </li>
                )}

                {activePages?.includes('campaigns') && (
                    <li className="w-full md:w-auto">
                        <Link href={`/${lang}/${t('address.campaigns')}`} className="block px-4 py-3 md:py-3.5 text-white hover:bg-blue-500 transition-colors rounded text-sm font-medium text-center w-full">
                            {upperFirstLetter(t('website.navigator.campaigns'))}
                        </Link>
                    </li>
                )}

                {activePages?.includes('corporate') && (
                    <li className="w-full md:w-auto">
                        <Link href={`/${lang}/${t('address.carporateRental')}`} className="block px-4 py-3 md:py-3.5 text-white hover:bg-blue-500 transition-colors rounded text-sm font-medium text-center w-full">
                            {upperFirstLetter(t('website.navigator.car_porte_car_rental'))}
                        </Link>
                    </li>
                )}

                {activePages?.includes('about') && (
                    <li className="w-full md:w-auto">
                        <Link href={`/${lang}/${t('address.about')}`} className="block px-4 py-3 md:py-3.5 text-white hover:bg-blue-500 transition-colors rounded text-sm font-medium text-center w-full">
                            {upperFirstLetter(t('website.navigator.about_us'))}
                        </Link>
                    </li>
                )}

            </ul>
        </nav>
    );
}
