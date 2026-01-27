import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { router } from "@inertiajs/react";
import axios from "axios";
import { GripVertical } from "lucide-react";
import FilterCar from "./FilterCar.jsx";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableRow = ({ car, index, t, handleClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: car.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        position: "relative",
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`
                transition-colors border-b last:border-b-0 group
                ${isDragging ? "bg-blue-100 shadow-xl ring-2 ring-blue-500 border-none" : "hover:bg-gray-50 bg-white"}
            `}
        >
            <td 
                {...attributes} 
                {...listeners} 
                className="px-4 py-3 w-10 text-gray-400 group-hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
            >
                <GripVertical size={20} className={isDragging ? "text-blue-700" : ""} />
            </td>
            
            <td className="px-4 py-3 font-bold text-gray-500 w-12 text-center select-none">
                {index + 1}
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
};

export default function CarTable({ cars }) {
    const [filteredCars, setFilteredCars] = useState(cars);
    const [carsToSave, setCarsToSave] = useState(cars);
    const [isSaving, setIsSaving] = useState(false);
    
    const { i18n, t } = useTranslation();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setFilteredCars(cars);
        setCarsToSave(cars);
    }, [cars]);

    const handleClick = (id) => {
        router.visit(`/${i18n.language}/${t("address.adminpanel")}/${t("address.cars")}/${id}`);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setCarsToSave((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                
                const newOrder = arrayMove(items, oldIndex, newIndex);
                
                return newOrder.map((item, index) => ({...item, sort_order: index}));
            });
        }
    };

    const saveSortOrder = async () => {
        setIsSaving(true);
        const formData = new FormData();
        carsToSave.forEach((car, index) => {
            formData.append(`cars[${index}][id]`, car.id);
            formData.append(`cars[${index}][sort_order]`, index);
        });

        try {
            await axios.post("/adminpanel/cars/update-sort", formData)
                .then(prev => {
                    if (prev.data.success) {
                        router.reload({ only: ['cars'] });
                    }
                });
        } catch (error) {
            console.error(error);
            alert('Error saving sort order');
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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold transition-colors shadow-sm"
                >
                    {isSaving ? 'Saving...' : 'Save Sort Order'}
                </button>
            </div>

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                    <DndContext 
                        sensors={sensors} 
                        collisionDetection={closestCenter} 
                        onDragEnd={handleDragEnd}
                    >
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-3 w-10"></th>
                                    <th className="px-4 py-3 w-12 text-center">#</th>
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
                                <SortableContext 
                                    items={carsToSave.map(c => c.id)} 
                                    strategy={verticalListSortingStrategy}
                                >
                                    {carsToSave.map((car, index) => (
                                        <SortableRow 
                                            key={car.id} 
                                            car={car} 
                                            index={index} 
                                            t={t} 
                                            handleClick={handleClick} 
                                        />
                                    ))}
                                </SortableContext>
                                
                                {(!carsToSave || carsToSave.length === 0) && (
                                    <tr>
                                        <td colSpan={11} className="px-6 py-10 text-center text-gray-500">
                                            {t("adminpanel.car.list.empty_state") ?? "No cars match your filters."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </DndContext>
                </div>
            </section>
        </div>
    );
}