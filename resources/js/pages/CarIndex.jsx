import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/websites/Navbar.jsx';
import CarIndexCard from '../components/websites/carIndex/CarIndexCard.jsx';

export default function CarIndex({car, internalServices}){
    const { t, i18n } = useTranslation();
    console.log('carIndex.jsx => ', car);
    return(
        <div>
            < Navbar />
            <div className="w-[90%] mt-16 mx-auto">
                <div className="text-gray-600 text-[16px] font-medium">
                    <Link href={`/${i18n.language}`} className="hover:text-black ">{t('website.navigator.home')}</Link> 
                    / 
                    <Link href={`/${i18n.language}/${t("address.cars")}`} className="hover:text-black">{t('website.navigator.cars')}</Link> / <span className="text-black">{car.brand} {car.model}</span>
                </div>
                <div className="font-extrabold text-2xl sm:text-3xl mt-2">{car.brand} {car.model} <span className="text-gray-500 font-medium">{car.fuel_type} • {car.transmission_type}</span></div><br />
                < CarIndexCard car={car} internalServices={internalServices} />
            </div>
        </div>
    );
}
