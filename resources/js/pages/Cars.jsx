import Navbar from '../components/websites/Navbar.jsx';
import CarCard from '../components/websites/carCards/CarCard.jsx';
import { Link } from '@inertiajs/react';
import {useTranslation} from "react-i18next";

export default function Car({cars}) {
    const {i18n, t} = useTranslation();
    return (
        <div>
            < Navbar />
            <div className="mt-8 w-full grid grid-cols-3 justify-items-center gap-6 bg-gray-50">
                {cars.map((car) => (
                    <Link key={car.id} href={`/${i18n.language}/${t("address.cars")}/${car.id}`}>
                        < CarCard key={car.id} car={car} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
