import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/websites/Navbar.jsx';
import CarIndexCard from '../components/websites/carIndex/CarIndexCard.jsx';

export default function CarIndex({car, internalServices}){
    const { t, i18n } = useTranslation();

    return(
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href={`/${i18n.language}`} className="hover:text-blue-600 transition-colors">
                        {t('website.navigator.home')}
                    </Link>
                    <span>/</span>
                    <Link href={`/${i18n.language}/${t("address.cars")}`} className="hover:text-blue-600 transition-colors">
                        {t('website.navigator.cars')}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{car.brand} {car.model}</span>
                </nav>
                
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        {car.brand} {car.model}
                    </h1>
                    <div className="mt-2 flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {car.fuel_type}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            {car.transmission_type}
                        </span>
                    </div>
                </div>
                
                <CarIndexCard car={car} internalServices={internalServices} />
            </div>
        </div>
    );
}
