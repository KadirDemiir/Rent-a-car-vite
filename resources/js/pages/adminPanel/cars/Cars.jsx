import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import {router} from "@inertiajs/react";
import FilterCar from "../../../components/adminPanel/car/FilterCar.jsx";
import {useTranslation} from "react-i18next";
import {useEffect, useMemo, useState} from "react";

export default function Cars({cars}) {
    const [filteredCars, setFilteredCars] = useState(cars);
    const {i18n, t} = useTranslation();

    useEffect(() => {
        setFilteredCars(cars);
    }, [cars]);

    const totalCars = useMemo(() => filteredCars?.length ?? 0, [filteredCars]);
    const pageTitle = t("adminpanel.car.list.title", {defaultValue: "Cars overview"});
    const pageDescription = t("adminpanel.car.list.description", {
        count: totalCars,
        defaultValue: "Manage and refine your fleet inventory.",
    });
    const totalLabel = t("adminpanel.car.list.total", {defaultValue: "Total vehicles"});

    const handleClick = (id) => {
        router.visit(`/${i18n.language}/${t("address.adminpanel")}/${t("address.cars")}/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar>
                <div className="px-4 py-8 md:px-8 lg:px-12 space-y-8">
                    <section className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                {t("adminpanel.cars.filter.filter_label")}
                            </p>
                            <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
                            <p className="text-sm text-gray-500">{pageDescription}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">{totalLabel}</p>
                            <p className="text-3xl font-semibold text-gray-900">{totalCars}</p>
                        </div>
                    </section>

                    <FilterCar cars={cars} setFilteredCars={setFilteredCars} />

                    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                <tr>
                                    <th className="px-6 py-3">{t("adminpanel.car.list.license_plate")}</th>
                                    <th className="px-6 py-3">{t("adminpanel.car.list.brand")}</th>
                                    <th className="px-6 py-3">{t("adminpanel.car.list.model")}</th>
                                    <th className="px-6 py-3">{t("adminpanel.car.list.year")}</th>
                                    <th className="px-6 py-3">{t("adminpanel.car.list.transmission_type")}</th>
                                    <th className="px-6 py-3">{t("adminpanel.car.list.segment")}</th>
                                    <th className="px-6 py-3">{t("adminpanel.car.list.body_type")}</th>
                                    <th className="px-6 py-3">{t("adminpanel.car.list.fuel_type")}</th>
                                    <th className="px-6 py-3">{t("adminpanel.car.list.trunk_capacity")}</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                                {filteredCars && filteredCars.map((car) => (
                                    <tr
                                        key={car.id}
                                        onClick={() => handleClick(car.id)}
                                        className="transition hover:bg-gray-50 cursor-pointer"
                                    >
                                        <td className="px-6 py-3 font-semibold text-gray-900">{car.license_plate}</td>
                                        <td className="px-6 py-3">{t(car.brand_key.key)}</td>
                                        <td className="px-6 py-3">{t(car.model_key.key)}</td>
                                        <td className="px-6 py-3">{car.year}</td>
                                        <td className="px-6 py-3">{t(`transmission.${car.transmission_id}`)}</td>
                                        <td className="px-6 py-3">{t(`segment.${car.segment_id}`)}</td>
                                        <td className="px-6 py-3">{t(`body_type.${car.body_type_id}`)}</td>
                                        <td className="px-6 py-3">{t(`fuel.${car.fuel_id}`)}</td>
                                        <td className="px-6 py-3">{car.trunk_capacity}</td>
                                    </tr>
                                ))}
                                {(!filteredCars || filteredCars.length === 0) && (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-10 text-center text-gray-500">
                                            {t("adminpanel.car.list.empty_state") ?? "No cars match your filters."}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </Navbar>
        </div>
    );
}
