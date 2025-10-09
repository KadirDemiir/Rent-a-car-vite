import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {router} from "@inertiajs/react";
import FilterCar from "../../../components/adminPanel/car/FilterCar.jsx";
import {useTranslation} from "react-i18next";
import {useState} from "react";

export default function Cars({cars}){

    const [filteredCars, setFilteredCars] = useState(cars);
    const {i18n, t} = useTranslation();
    const handleClick = (id) => {
        router.visit(`/${i18n.language}/${t("address.adminpanel")}/${t("address.cars")}/${id}`)
    };

    return(
        <div className="w-full">
            < Navbar>
                    <div className="mr-4">
                        <FilterCar cars={cars} setFilteredCars={setFilteredCars}/>
                    </div>
                    <div className="mt-8 mr-4">
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">{t("adminpanel.car.list.license_plate")}</th>
                                <th className="border px-4 py-2">{t("adminpanel.car.list.brand")}</th>
                                <th className="border px-4 py-2">{t("adminpanel.car.list.model")}</th>
                                <th className="border px-4 py-2">{t("adminpanel.car.list.year")}</th>
                                <th className="border px-4 py-2">{t("adminpanel.car.list.transmission_type")}</th>
                                <th className="border px-4 py-2">{t("adminpanel.car.list.segment")}</th>
                                <th className="border px-4 py-2">{t("adminpanel.car.list.body_type")}</th>
                                <th className="border px-4 py-2">{t("adminpanel.car.list.fuel_type")}</th>
                                <th className="border px-4 py-2">{t("adminpanel.car.list.trunk_capacity")}</th>

                            </tr>
                            </thead>
                            <tbody>
                                {filteredCars && filteredCars.map((car) => (
                                <tr key={car.id} onClick={() => handleClick(car.id)} className="cursor-pointer">
                                    <td className="border px-4 py-2">{car.license_plate}</td>
                                    <td className="border px-4 py-2">{t(car.brand_key.key)}</td>
                                    <td className="border px-4 py-2">{t(car.model_key.key)}</td>
                                    <td className="border px-4 py-2">{car.year}</td>
                                    <td className="border px-4 py-2">{t(`fuel.${car.transmission_id}`)}</td>
                                    <td className="border px-4 py-2">{t(`segment.`+car.segment_id)}</td>
                                    <td className="border px-4 py-2">{t(`body_type.${car.body_type_id}`)}</td>
                                    <td className="border px-4 py-2">{t(`fuel.${car.fuel_id}`)}</td>
                                    <td className="border px-4 py-2">{car.trunk_capacity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                </div>
            </Navbar>
        </div>
    );
}
