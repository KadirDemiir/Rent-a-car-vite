import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Navbar from "../../../components/adminPanel/navbar/Navbar";
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

const safeJsonParse = (str) => {
    try {
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (e) {
        return {};
    }
};

const SortablePageRow = ({ page, index }) => {
    const { i18n } = useTranslation();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: page.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        position: "relative",
        opacity: isDragging ? 0.8 : 1,
    };

    const titleObj = useMemo(() => safeJsonParse(page.title), [page.title]);
    const displayTitle = titleObj?.[i18n.language] || titleObj?.en || String(page.title);

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
                className="px-4 py-3 w-10 text-gray-400 group-hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none"
            >
                <GripVertical size={20} className={isDragging ? "text-gray-700" : ""} />
            </td>
            <td className="px-4 py-3 font-bold text-gray-500 w-12 text-center select-none whitespace-nowrap">
                {index + 1}
            </td>
            <td className="px-6 py-3 font-semibold text-gray-900 whitespace-nowrap">
                {displayTitle}
            </td>
        </tr>
    );
};

export default function NavigationOperator() {
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess("");
            }, 20000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchPages = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/get-pages");
            setPages(response.data.pages || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setPages((items) => {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    };

    const saveSortOrder = async () => {
        setIsSaving(true);
        const payload = pages.map((page, index) => ({
            id: page.id,
            sort_order: index
        }));

        try {
            await axios.post("/update-pages-sort", { pages: payload })
                .then(res => {
                    if(res.data.success)
                        setSuccess("Update Successfully.");

                })
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Navbar>
            <div className="px-4 py-6 md:px-8 lg:px-10 w-full max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Menü Sıralaması</h1>
                    <button
                        onClick={saveSortOrder}
                        disabled={isSaving || pages.length === 0}
                        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors shadow-sm"
                    >
                        {isSaving ? "Kaydediliyor..." : "Sıralamayı Kaydet"}
                    </button>
                </div>

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4">

                        <span className="block sm:inline">{success}</span>
                        <button
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setSuccess("")}
                        >
                            <span className="text-xl">&times;</span>
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-8 text-gray-500">Yükleniyor...</div>
                ) : (
                    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden w-full">
                        <div className="overflow-x-auto w-full">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 w-10"></th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Sıra</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sayfa Başlığı</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                                        <SortableContext
                                            items={pages.map(p => p.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {pages.map((page, index) => (
                                                <SortablePageRow
                                                    key={page.id}
                                                    page={page}
                                                    index={index}
                                                />
                                            ))}
                                        </SortableContext>

                                        {(!pages || pages.length === 0) && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                                                    Gösterilecek sayfa bulunamadı.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </DndContext>
                        </div>
                    </section>
                )}
            </div>
        </Navbar>
    );
}
