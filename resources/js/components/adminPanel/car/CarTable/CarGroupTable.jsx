import { useEffect, useState, Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { router } from "@inertiajs/react";
import axios from "axios";
import { GripVertical, ChevronDown, ChevronRight, Car } from "lucide-react";
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
import { CarGroupTableHeader, VehicleSubRow } from "./shared";

const safeJsonParse = (str) => {
    try {
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (e) {
        return {};
    }
};

const SortableCarGroupRow = ({ carGroup, index, t, onRowClick, isExpanded, onToggleExpand }) => {
    const { i18n } = useTranslation();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: carGroup.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        position: "relative",
        opacity: isDragging ? 0.8 : 1,
    };

    const vehicleCount = carGroup.cars?.length || 0;

    const name = useMemo(() => safeJsonParse(carGroup.name), [carGroup.name]);

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`
                transition-colors border-b last:border-b-0 group
                ${isDragging ? "bg-gray-100 shadow-xl ring-2 ring-gray-700 border-none" : "hover:bg-gray-50 bg-white"}
            `}
        >
            <td
                {...attributes}
                {...listeners}
                className="px-4 py-3 w-10 text-gray-400 group-hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
            >
                <GripVertical size={20} className={isDragging ? "text-gray-700" : ""} />
            </td>

            <td className="px-4 py-3 font-bold text-gray-500 w-12 text-center select-none">
                {index + 1}
            </td>

            <td className="px-2 py-3 w-10">
                {vehicleCount > 0 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(carGroup.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                )}
            </td>

            <td
                className="px-6 py-3 font-semibold text-gray-900 cursor-pointer hover:text-gray-700"
                onClick={() => onRowClick(carGroup.id)}
            >
                {name?.[i18n.language] || `Group #${carGroup.id}`}
            </td>

            <td className="px-6 py-3 text-gray-600">
                <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                    <Car size={14} />
                    {vehicleCount}
                </span>
            </td>

            <td
                className="px-6 py-3 cursor-pointer hover:text-gray-700"
                onClick={() => onRowClick(carGroup.id)}
            >
                {t(`transmission.${carGroup.transmission_id}`)}
            </td>

            <td
                className="px-6 py-3 cursor-pointer hover:text-gray-700"
                onClick={() => onRowClick(carGroup.id)}
            >
                {t(`segment.${carGroup.segment_id}`)}
            </td>

            <td
                className="px-6 py-3 cursor-pointer hover:text-gray-700"
                onClick={() => onRowClick(carGroup.id)}
            >
                {t(`body_type.${carGroup.body_type_id}`)}
            </td>

            <td
                className="px-6 py-3 cursor-pointer hover:text-gray-700"
                onClick={() => onRowClick(carGroup.id)}
            >
                {t(`fuel.${carGroup.fuel_id}`)}
            </td>

            <td
                className="px-6 py-3 cursor-pointer hover:text-gray-700"
                onClick={() => onRowClick(carGroup.id)}
            >
                {carGroup.trunk_capacity}
            </td>
        </tr>
    );
};

export default function CarGroupTable({ carGroups = [] }) {
    const [dataToSave, setDataToSave] = useState(carGroups);
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [isSaving, setIsSaving] = useState(false);
    const { t, i18n } = useTranslation();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setDataToSave(carGroups);
    }, [carGroups]);

    const handleRowClick = (id) => {
        router.visit(`/${i18n.language}/${t("address.adminpanel")}/${t("address.car_groups")}/${id}`);
    };

    const toggleExpandGroup = (groupId) => {
        setExpandedGroups((prev) => {
            const next = new Set(prev);
            if (next.has(groupId)) {
                next.delete(groupId);
            } else {
                next.add(groupId);
            }
            return next;
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setDataToSave((items) => {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    };

    const saveSortOrder = async () => {
        setIsSaving(true);
        const formData = new FormData();
        dataToSave.forEach((group, index) => {
            formData.append(`cars[${index}][id]`, group.id);
            formData.append(`cars[${index}][sort_order]`, index);
        });

        try {
            const response = await axios.post("/adminpanel/cars/update-sort", formData);
            if (response.data.success) {
                router.reload({ only: ['carGroups', 'cars'] });
            }
        } catch (error) {
            console.error(error);
            alert(t("adminpanel.car_group.sort_error") || 'Error saving sort order');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="px-4 py-8 md:px-8 lg:px-12 space-y-8">
            <div className="flex gap-4 items-center">
                <button
                    onClick={saveSortOrder}
                    disabled={isSaving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold transition-colors shadow-sm"
                >
                    {t("adminpanel.car_group.save_sort")}
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
                            <CarGroupTableHeader t={t} />
                            <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                            <SortableContext
                                items={dataToSave.map(g => g.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {dataToSave.map((carGroup, index) => (
                                    <Fragment key={carGroup.id}>
                                        <SortableCarGroupRow
                                            carGroup={carGroup}
                                            index={index}
                                            t={t}
                                            onRowClick={handleRowClick}
                                            isExpanded={expandedGroups.has(carGroup.id)}
                                            onToggleExpand={toggleExpandGroup}
                                        />
                                        {expandedGroups.has(carGroup.id) && carGroup.cars?.map((vehicle) => (
                                            <VehicleSubRow
                                                key={`vehicle-${vehicle.id}`}
                                                vehicle={vehicle}
                                                t={t}
                                            />
                                        ))}
                                    </Fragment>
                                ))}
                            </SortableContext>

                            {(!dataToSave || dataToSave.length === 0) && (
                                <tr>
                                    <td colSpan={10} className="px-6 py-10 text-center text-gray-500">
                                        {t("adminpanel.car_group.list.empty_state") || "No car groups found."}
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
