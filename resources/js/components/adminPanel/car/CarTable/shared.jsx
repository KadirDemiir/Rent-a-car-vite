import {useTranslation} from "react-i18next";
import {router} from "@inertiajs/react";
export const VehicleStatusBadge = ({ status, t }) => {
    const statusStyles = {
        available: 'bg-green-100 text-green-800',
        rented: 'bg-blue-100 text-blue-800',
        unavailable: 'bg-red-100 text-red-800',
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {t(`adminpanel.car.${status}`)}
        </span>
    );
};

export const VehicleSubRow = ({ vehicle, t }) => {
    return (
        <tr className="bg-gray-50 border-b last:border-b-0 text-sm text-gray-600">
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2"></td>
            <td className="px-2 py-2"></td>

            <td className="px-6 py-2 pl-10">
                <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="font-medium text-gray-700">{vehicle.plate_number}</span>
                </span>
            </td>

            <td className="px-6 py-2 text-gray-500">
                {vehicle.exact_year || '—'}
            </td>

            <td className="px-6 py-2">
                <VehicleStatusBadge status={vehicle.status} t={t} />
            </td>

            <td className="px-6 py-2"></td>
            <td className="px-6 py-2"></td>
            <td className="px-6 py-2"></td>
            <td className="px-6 py-2"></td>
        </tr>
    );
};

export const CarGroupTableHeader = ({ t }) => (
    <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
        <tr>
            <th className="px-4 py-3 w-10"></th>
            <th className="px-4 py-3 w-12 text-center">#</th>
            <th className="px-2 py-3 w-10"></th>
            <th className="px-6 py-3">{t("adminpanel.car_group")}</th>
            <th className="px-6 py-3">{t("adminpanel.car.list.count") || "Cars"}</th>
            <th className="px-6 py-3">{t("adminpanel.car.list.transmission_type")}</th>
            <th className="px-6 py-3">{t("adminpanel.car.list.segment")}</th>
            <th className="px-6 py-3">{t("adminpanel.car.list.body_type")}</th>
            <th className="px-6 py-3">{t("adminpanel.car.list.fuel_type")}</th>
            <th className="px-6 py-3">{t("adminpanel.car.list.trunk_capacity")}</th>
        </tr>
    </thead>
);

export const VehicleTableHeader = ({ t }) => (
    <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
        <tr>
            <th className="px-4 py-3 w-12 text-center">#</th>
            <th className="px-6 py-3">{t("adminpanel.car.list.license_plate")}</th>
            <th className="px-6 py-3">{t("adminpanel.car.list.year")}</th>
            <th className="px-6 py-3">{t("adminpanel.car_group")}</th>
            <th className="px-6 py-3">{t("adminpanel.car.status")}</th>
            <th className="px-6 py-3">{t("adminpanel.car.list.current_locations")}</th>
        </tr>
    </thead>
);


export const VehicleRow = ({ vehicle, index, t, onRowClick }) => {
    const {i18n} = useTranslation();
    const name = JSON.parse(vehicle.car_group?.name);
/*    const handleVisitGroup = (id) => {
        router.visit(`/${t('address.adminpanel')}/${t('address.car_groups')}/${id}`);
    }*/
    return (
        <tr className="transition-colors border-b last:border-b-0 hover:bg-gray-50 bg-white group cursor-pointer" onClick={() => onRowClick?.(vehicle.id)}>
            <td className="px-4 py-3 font-bold text-gray-500 w-12 text-center select-none">
                {index + 1}
            </td>

            <td
                className="px-6 py-3 font-semibold text-gray-900 hover:text-gray-700"
            >
                {vehicle.plate_number}
            </td>

            <td className="px-6 py-3 text-gray-700">
                {vehicle.exact_year || '—'}
            </td>

            <td className="px-6 py-3 text-gray-700">
                {name?.[i18n.language]}
            </td>

            <td className="px-6 py-3">
                <VehicleStatusBadge status={vehicle.status} t={t} />
            </td>

            <td className="px-6 py-3 text-gray-700">
                {vehicle.current_location?.name || '—'}
            </td>
        </tr>
    );
};
