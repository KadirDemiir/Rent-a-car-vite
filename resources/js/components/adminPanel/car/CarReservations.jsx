import { useMemo, useState } from "react";
import Td from "../table/Td.jsx";
import ShowResCard from "../reservations/ShowResCard.jsx";
import ChevronNavigation from "../reservations/ChevronNavigation.jsx";
import { useTranslation } from "react-i18next";

export default function CarReservations({ allReservations, updateData, current = true, past = true }) {
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
    const perPage = 10;

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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("tr-TR", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).replace(/\./g, " / ");
    };

    return (
        <div className="relative">
            <table className="table-auto w-full border border-gray-500 border-collapse mt-2">
                <thead className="bg-gray-100">
                    <tr>
                        <Td cls={TDclass} contents={headers} as="th" />
                    </tr>
                </thead>
                <tbody>
                    {currentReservations.map((r, index) => (
                        <tr
                            key={r.id || startIndex + index}
                            onClick={() => setSelectedReservation(r)}
                            className="cursor-pointer hover:bg-gray-100"
                        >
                            <Td
                                cls={TDclass}
                                contents={[
                                    `${r.name} ${r.surname}`,
                                    formatDate(r.pickup_datetime),
                                    formatDate(r.return_datetime),
                                    <span className={`${getPaymentStatusColor(r.payment_status)} font-semibold`} key="payment">
                                        {r.payment_status}
                                    </span>,
                                    <span className={`${getStatusColor(r.status)} font-semibold`} key="status">
                                        {r.status}
                                    </span>,
                                ]}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>

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
