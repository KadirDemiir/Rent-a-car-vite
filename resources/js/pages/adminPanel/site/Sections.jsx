import React, { useState, useEffect } from "react";
import axios from "axios";
import { GripVertical } from "lucide-react";
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
import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import SectionModal from "../../../components/adminPanel/site/SectionModal.jsx";

const langOpt = [
    { value: "tr", label: "Türkçe" },
    { value: "en", label: "English" }
];

const parseJsonData = (data) => {
    if (!data) return {};
    if (typeof data === "object") return data;
    try {
        return JSON.parse(data);
    } catch {
        return { tr: data };
    }
};

const getText = (data, currLan) => {
    const parsed = parseJsonData(data);
    return parsed[currLan] || Object.values(parsed)[0] || "";
};

const SortableSectionRow = ({ section, index, onEdit, onDelete, currLan }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        position: "relative",
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`transition-colors border-b last:border-b-0 group ${
                isDragging ? "bg-gray-100 shadow-xl ring-2 ring-gray-700 border-none" : "hover:bg-gray-50 bg-white"
            }`}
        >
            <td
                {...attributes}
                {...listeners}
                className="px-6 py-4 w-20 text-gray-400 group-hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
            >
                <div className="flex items-center gap-2">
                    <GripVertical size={20} className={isDragging ? "text-gray-700" : ""} />
                    <span className="font-bold text-gray-500 select-none">{index + 1}</span>
                </div>
            </td>
            <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                {section.description}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {section.is_default ? (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded w-max">
                        Sistem
                    </span>
                ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded w-max">
                        Özel
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {section.is_active ? (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded w-max">
                        Aktif
                    </span>
                ) : (
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded w-max">
                        Pasif
                    </span>
                )}
            </td>
            <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                <button
                    onClick={() => onEdit(section)}
                    className="font-medium text-blue-600 hover:text-blue-800"
                >
                    Düzenle
                </button>
                {!section.is_default && (
                    <button
                        onClick={() => onDelete(section.id)}
                        className="font-medium text-red-600 hover:text-red-800"
                    >
                        Sil
                    </button>
                )}
            </td>
        </tr>
    );
};

export default function Sections({ sections = [], currLan = "tr" }) {
    const [dataToSave, setDataToSave] = useState(sections);
    const [isSaving, setIsSaving] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        description: null,
        title: {},
        content: {},
        is_active: true,
        is_default: false
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setDataToSave(sections);
    }, [sections]);

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
        const payload = dataToSave.map((section, index) => ({
            id: section.id,
            sort_order: index
        }));

        try {
            await axios.post("/adminpanel/sections/reorder", { items: payload });
            window.location.reload();
        } catch (error) {
            alert("Sıralama kaydedilirken hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenModal = (section = null) => {
        if (section) {
            setFormData({
                id: section.id,
                description: section.description,
                title: parseJsonData(section.title),
                content: parseJsonData(section.content),
                is_active: section.is_active,
                is_default: section.is_default
            });
        } else {
            setFormData({
                id: null,
                description: null,
                title: {},
                content: {},
                is_active: true,
                is_default: false
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ id: null, description: null, title: {}, content: {}, is_active: true, is_default: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title,
            description: formData.description,
            content: formData.content,
            is_active: formData.is_active,
            page_id: 1
        };

        try {
            if (formData.id) {
                await axios.put(`/adminpanel/sections/${formData.id}`, payload);
            } else {
                await axios.post("/adminpanel/sections", payload);
            }
            window.location.reload();
        } catch (error) {
            alert("Kayıt işlemi başarısız oldu.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bu bölümü silmek istediğinize emin misiniz?")) return;

        try {
            await axios.delete(`/adminpanel/sections/${id}`);
            window.location.reload();
        } catch (error) {
            alert("Silme işlemi başarısız oldu.");
        }
    };

    return (
        <div>
            <Navbar>
                <div className="p-4 md:p-6 lg:p-8 w-full flex flex-col gap-6 relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Yazı Bölümleri</h1>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                                onClick={saveSortOrder}
                                disabled={isSaving}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm w-full sm:w-auto font-semibold shadow-sm"
                            >
                                Sıralamayı Kaydet
                            </button>
                            <button
                                onClick={() => handleOpenModal()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto shadow-sm"
                            >
                                + Yeni Ekle
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200 w-full">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <table className="min-w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th scope="col" className="px-6 py-3 w-24">Sıra</th>
                                    <th scope="col" className="px-6 py-3">Açıklama</th>
                                    <th scope="col" className="px-6 py-3 w-32">Tür</th>
                                    <th scope="col" className="px-6 py-3 w-32">Durum</th>
                                    <th scope="col" className="px-6 py-3 text-right w-40">İşlemler</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                <SortableContext
                                    items={dataToSave?.map(s => s.id) || []}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {dataToSave && dataToSave.length > 0 ? (
                                        dataToSave.map((section, index) => (
                                            <SortableSectionRow
                                                key={section.id}
                                                section={section}
                                                index={index}
                                                onEdit={handleOpenModal}
                                                onDelete={handleDelete}
                                                currLan={currLan}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                Gösterilecek veri bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                </SortableContext>
                                </tbody>
                            </table>
                        </DndContext>
                    </div>

                    <SectionModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        langOpt={langOpt}
                    />
                </div>
            </Navbar>
        </div>
    );
}
