import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { router } from "@inertiajs/react";
import axios from "axios";
import { GripVertical } from "lucide-react";
import FilterCar from "./FilterCar.jsx";

export default function CarTable({ cars }) {
    const [filteredCars, setFilteredCars] = useState(cars);
    const [carsToSave, setCarsToSave] = useState(cars.map(car => ({ id: car.id, sort_order: car.sort_order || 0 })));
    const [isSaving, setIsSaving] = useState(false);
    
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);
    
    const { i18n, t } = useTranslation();

    useEffect(() => {
        setFilteredCars(cars);
        setCarsToSave(cars.map(car => ({ id: car.id, sort_order: car.sort_order || 0 })));
    }, [cars]);

    const handleClick = (id) => {
        router.visit(`/${i18n.language}/${t("address.adminpanel")}/${t("address.cars")}/${id}`);
    };

    const handleDragStart = (e, index) => {
        dragItem.current = index;
        e.dataTransfer.effectAllowed = "move";
        const row = e.target.closest('tr');
        e.dataTransfer.setDragImage(row, 0, 0);
    };

    const handleDragEnter = (e, index) => {
        dragOverItem.current = index;
        const dragIndex = dragItem.current;
        const overIndex = dragOverItem.current;

        if (dragIndex === null || dragIndex === overIndex) return;  

        const newCars = [...carsToSave];
        const draggedCar = newCars[dragIndex];

        newCars.splice(dragIndex, 1);
        newCars.splice(overIndex, 0, draggedCar);

        dragItem.current = overIndex;

        newCars.forEach((car, idx) => {
            car.sort_order = idx;
        });

        setCarsToSave(newCars);
    };

    const handleDragEnd = () => {
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const saveSortOrder = async () => {
        setIsSaving(true);
        const formData = new FormData();
        carsToSave.forEach((car, index) => {
            formData.append(`cars[${index}][id]`, car.id);
            formData.append(`cars[${index}][sort_order]`, car.sort_order);
        });

        try {
            await axios.post("/adminpanel/cars/update-sort", formData)
                .then(prev => {
                    if (prev.data.success) {
                        router.reload({ only: ['cars'] });
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 422) {
                        console.log(error.response.data.errors);
                    }
                    alert('Sıralama kaydedilemedi.');
                });
        } catch (error) {
            console.error(error);
            alert('Bir hata oluştu.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="px-4 py-8 md:px-8 lg:px-12 space-y-8">
            <FilterCar cars={cars} setFilteredCars={setFilteredCars} />

            <div className="flex gap-4 items-center">
                <button
                    onClick={saveSortOrder}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
                >
                    {isSaving ? 'Saving...' : 'Save Sort Order'}
                </button>
            </div>

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            <tr>
                                <th className="px-6 py-3 w-12"></th>
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
                            {carsToSave && carsToSave.map((carSort, index) => {
                                const car = cars.find(c => c.id === carSort.id);
                                if (!car) return null;
                                return (
                                    <tr
                                        key={car.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnter={(e) => handleDragEnter(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="transition hover:bg-gray-50 border-b last:border-b-0 cursor-default group"
                                    >
                                        <td className="px-6 py-3 cursor-grab active:cursor-grabbing w-12 text-gray-400 group-hover:text-gray-600">
                                            <GripVertical size={20} />
                                        </td>
                                        <td className="px-6 py-3 font-semibold text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => handleClick(car.id)}>{car.license_plate}</td>
                                        <td className="px-6 py-3 cursor-pointer hover:text-blue-600" onClick={() => handleClick(car.id)}>{t(car.brand_key.key)}</td>
                                        <td className="px-6 py-3 cursor-pointer hover:text-blue-600" onClick={() => handleClick(car.id)}>{t(car.model_key.key)}</td>
                                        <td className="px-6 py-3 cursor-pointer hover:text-blue-600" onClick={() => handleClick(car.id)}>{car.year}</td>
                                        <td className="px-6 py-3 cursor-pointer hover:text-blue-600" onClick={() => handleClick(car.id)}>{t(`transmission.${car.transmission_id}`)}</td>
                                        <td className="px-6 py-3 cursor-pointer hover:text-blue-600" onClick={() => handleClick(car.id)}>{t(`segment.${car.segment_id}`)}</td>
                                        <td className="px-6 py-3 cursor-pointer hover:text-blue-600" onClick={() => handleClick(car.id)}>{t(`body_type.${car.body_type_id}`)}</td>
                                        <td className="px-6 py-3 cursor-pointer hover:text-blue-600" onClick={() => handleClick(car.id)}>{t(`fuel.${car.fuel_id}`)}</td>
                                        <td className="px-6 py-3 cursor-pointer hover:text-blue-600" onClick={() => handleClick(car.id)}>{car.trunk_capacity}</td>
                                    </tr>
                                );
                            })}
                            {(!carsToSave || carsToSave.length === 0) && (
                                <tr>
                                    <td colSpan={10} className="px-6 py-10 text-center text-gray-500">
                                        {t("adminpanel.car.list.empty_state") ?? "No cars match your filters."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}