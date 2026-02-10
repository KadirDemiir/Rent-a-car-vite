import { useState, Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@inertiajs/react";
import {
    ChevronDown,
    ChevronRight,
    Car,
    Hash,
    Gauge,
    Activity,
    FileText
} from "lucide-react";

const safeJsonParse = (str) => {
    try {
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (e) {
        return {};
    }
};

const StatusBadge = ({ status, t }) => {
    const statusConfig = {
        available: { color: "bg-green-100 text-green-800", label: "status.available" },
        rented: { color: "bg-blue-100 text-blue-800", label: "status.rented" },
        maintenance: { color: "bg-red-100 text-red-800", label: "status.maintenance" },
        reserved: { color: "bg-yellow-100 text-yellow-800", label: "status.reserved" },
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
            {t(config.label)}
        </span>
    );
};

const CarGroupRow = ({ carGroup, t, isExpanded, onToggleExpand }) => {
    const { i18n } = useTranslation();
    const vehicleCount = carGroup.cars?.length || 0;
    const name = useMemo(() => safeJsonParse(carGroup.name), [carGroup.name]);

    return (
        <tr
            className="hover:bg-gray-50 transition-colors border-b border-gray-200 cursor-pointer"
            onClick={() => onToggleExpand(carGroup.id)}
        >
            {/* Genişletme İkonu */}
            <td className="px-4 py-4 w-10">
                <button
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                >
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
            </td>

            {/* Grup Adı */}
            <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Car size={20} />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">
                            {name?.[i18n.language] || `Group #${carGroup.id}`}
                        </div>
                        <div className="text-xs text-gray-500">
                            ID: {carGroup.id}
                        </div>
                    </div>
                </div>
            </td>

            {/* Toplam Araç Sayısı */}
            <td className="px-4 py-4 text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    <Hash size={14} />
                    {vehicleCount} {t('vehicles.count_suffix') || 'Araç'}
                </span>
            </td>
        </tr>
    );
};

const VehiclesListRow = ({ vehicles, t }) => {
    if (!vehicles || vehicles.length === 0) {
        return (
            <tr className="bg-gray-50/50">
                <td colSpan={3} className="px-12 py-4 text-sm text-gray-500 italic">
                    {t('vehicles.empty_group') || 'Bu grupta henüz araç bulunmuyor.'}
                </td>
            </tr>
        );
    }

    return (
        <tr className="bg-gray-50/50">
            <td colSpan={3} className="px-4 py-4 md:px-12">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <FileText size={14} />
                                    {t('vehicles.plate') || 'Plaka'}
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Gauge size={14} />
                                    {t('vehicles.current_km') || 'Güncel KM'}
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Activity size={14} />
                                    {t('vehicles.status') || 'Durum'}
                                </div>
                            </th>
                            <th className="relative px-4 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id} className="hover:bg-blue-50/30 transition-colors">
                                {/* PLAKA */}
                                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                    <div className="px-2 py-1 bg-white border border-gray-300 rounded inline-block shadow-sm">
                                        {vehicle.plate}
                                    </div>
                                </td>

                                {/* GÜNCEL KM */}
                                <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                                    {vehicle.current_km?.toLocaleString()} km
                                </td>

                                {/* DURUM */}
                                <td className="px-4 py-3">
                                    <StatusBadge status={vehicle.status} t={t} />
                                </td>

                                {/* İŞLEM BUTONU (Opsiyonel) */}
                                <td className="px-4 py-3 text-right text-sm font-medium">
                                    <Link
                                        href={`/adminpanel/vehicles/${vehicle.id}`}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        {t('common.details') || 'Detay'}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </td>
        </tr>
    );
};

export default function VehicleGroupTable({ cars = [] }) {
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const { t } = useTranslation();

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

    return (
        <div className="px-4 py-8 md:px-8 lg:px-12 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                    {t('adminpanel.vehicle_list_title') || 'Araç Listesi'}
                </h2>
                <div className="text-sm text-gray-500">
                    {t('common.total_groups')}: {cars.length}
                </div>
            </div>

            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="w-10 px-4 py-3"></th> {/* Ok ikonu için boşluk */}
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('adminpanel.car_group.name') || 'Araç Grubu'}
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('adminpanel.car_group.total_vehicles') || 'Araç Sayısı'}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {cars.map((carGroup) => (
                            <Fragment key={carGroup.id}>
                                {/* Ana Grup Satırı */}
                                <CarGroupRow
                                    carGroup={carGroup}
                                    t={t}
                                    isExpanded={expandedGroups.has(carGroup.id)}
                                    onToggleExpand={toggleExpandGroup}
                                />

                                {/* Açılan Detay Satırı (Araçlar Listesi) */}
                                {expandedGroups.has(carGroup.id) && (
                                    <VehiclesListRow
                                        vehicles={carGroup.cars}
                                        t={t}
                                    />
                                )}
                            </Fragment>
                        ))}

                        {(!cars || cars.length === 0) && (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <Car size={48} className="text-gray-300 mb-2" />
                                        <p>{t("adminpanel.car_group.list.empty_state") || "Kayıtlı araç grubu bulunamadı."}</p>
                                    </div>
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
