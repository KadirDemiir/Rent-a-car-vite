import Navbar from '../components/websites/Navbar.jsx';
import SearchReservationForm from '../components/websites/SearchReservationForm.jsx';
import CarCard from '../components/websites/carCards/CarCard.jsx';
import {Head, Link} from '@inertiajs/react';
import {useTranslation} from "react-i18next";
import MetaData from "../components/websites/MetaData.jsx";

export default function Car({cars, locations}) {
    return (
        <>
        <MetaData />
        <div className="min-h-screen bg-linear-to-b from-gray-100 to-gray-200">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <SearchReservationForm locations={locations} home={false} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <div
                            key={car.id}
                            /*href={`/${i18n.language}/${t("address.cars")}/${car.id}`}*/
                            className="group"
                        >
                            <CarCard car={car} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}
