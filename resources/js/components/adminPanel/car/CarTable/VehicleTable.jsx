import { useTranslation } from "react-i18next";
import { router } from "@inertiajs/react";

import { VehicleTableHeader, VehicleRow } from "./shared";

// ============================================================================
// VEHICLE TABLE COMPONENT (Individual cars)
// ============================================================================

export default function VehicleTable({ vehicles = [] }) {
    const { i18n, t } = useTranslation();

    // Navigation handler
    const handleRowClick = (id) => {
        router.visit(`/${i18n.language}/${t("address.adminpanel")}/${t("address.cars")}/${id}`);
    };

    return (
        <div className="space-y-8 mt-2">
            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <VehicleTableHeader t={t} />
                        <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                            {vehicles.map((vehicle, index) => (
                                <VehicleRow
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    index={index}
                                    t={t}
                                    onRowClick={handleRowClick}
                                />
                            ))}

                            {/* Empty State */}
                            {(!vehicles || vehicles.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        {t("adminpanel.car.list.empty_state") || "No vehicles found."}
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
