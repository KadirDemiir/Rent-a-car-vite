import { useMemo, useState } from "react";
import Td from "../table/Td.jsx";
import ShowResCard from "../reservations/ShowResCard.jsx";
import ChevronNavigation from "../reservations/ChevronNavigation.jsx";
import { useTranslation } from "react-i18next";
export default function CarReservations({ allReservations, updateData, current = true, past = true, prev=false}) {
    const reservations = useMemo(() => {
        if (!allReservations) return [];
        if (current && past) return allReservations;
        return allReservations.filter(res =>
            current
                ? ['pending', 'confirmed'].includes(res.status)
                : ['cancelled', 'completed'].includes(res.status)
        );
    }, [current, past, allReservations]);

    const { t } = useTranslation();
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [startIndex, setStartIndex] = useState(0);
    const perPage = prev ? 5 : 50;

    const TDclass = "border border-gray-500 px-4 py-2";
    const headers = [
        t("adminpanel.reservation.name_and_surname"),
        t("adminpanel.reservation.pick_up_date"),
        t("adminpanel.reservation.return_date"),
        t("adminpanel.reservation.payment_status"),
        t("adminpanel.reservation.status")
    ];

    const closeModal = () => {
        setSelectedReservation(null);
    };

    const handlePrev = () => {
        setStartIndex((prev) => Math.max(prev - perPage, 0));
    };

    const handleNext = () => {
        if (startIndex + perPage < reservations.length) {
            setStartIndex(startIndex + perPage);
        }
    };

    const currentReservations = reservations.slice(startIndex, startIndex + perPage);
    const totalPages = Math.ceil(reservations.length / perPage);
    const currentPage = Math.floor(startIndex / perPage) + 1;

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'text-yellow-600';
            case 'confirmed': return 'text-green-600';
            case 'cancelled': return 'text-red-600';
            default: return 'text-black';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'text-green-600';
            case 'failed': return 'text-red-600';
            default: return 'text-yellow-600';
        }
    };

    return (
        <div className="relative">
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="w-full border-collapse">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-gray-700 text-sm text-left w-1/4">{headers[0]}</th>
                            <th className="px-6 py-3 font-semibold text-gray-700 text-sm text-left w-1/5">{headers[1]}</th>
                            <th className="px-6 py-3 font-semibold text-gray-700 text-sm text-left w-1/5">{headers[2]}</th>
                            <th className="px-6 py-3 font-semibold text-gray-700 text-sm text-left w-1/6">{headers[3]}</th>
                            <th className="px-6 py-3 font-semibold text-gray-700 text-sm text-left w-1/6">{headers[4]}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentReservations.map((r, index) => (
                            <tr
                                key={r.id || startIndex + index}
                                onClick={() => setSelectedReservation(r)}
                                className="cursor-pointer bg-white hover:bg-blue-50 transition-colors duration-150 border-0"
                            >
                                <td className="px-6 py-4 text-sm text-gray-900 w-1/4">{`${r.name} ${r.surname}`}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 w-1/5">{new Date(r.pickup_datetime).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "short", timeStyle: "short" })}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 w-1/5">{new Date(r.return_datetime).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "short", timeStyle: "short" })}</td>
                                <td className="px-6 py-4 text-sm w-1/6">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(r.payment_status)} ${getPaymentStatusColor(r.payment_status).includes('green') ? 'bg-green-50 border border-green-300' : getPaymentStatusColor(r.payment_status).includes('red') ? 'bg-red-50 border border-red-300' : 'bg-yellow-50 border border-yellow-300'}`}>
                                        {r.payment_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm w-1/6">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(r.status)} ${getStatusColor(r.status).includes('green') ? 'bg-green-50 border border-green-300' : getStatusColor(r.status).includes('red') ? 'bg-red-50 border border-red-300' : 'bg-yellow-50 border border-yellow-300'}`}>
                                        {r.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ChevronNavigation
                handlePrev={handlePrev}
                handleNext={handleNext}
                startIndex={startIndex}
                perPage={perPage}
                currentPage={currentPage}
                totalPages={totalPages}
                length={reservations.length}
            />

            {selectedReservation && (
                <ShowResCard
                    res={selectedReservation}
                    updateData={updateData}
                    closeModal={closeModal}
                    curr={current}
                    past={past}
                />
            )}
        </div>
    );
}