import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ReservationCarCard from "../websites/reservation/ReservationCarCard.jsx";

const resolveComparablePrice = (car) => {
    if (car.calculated_price?.final_daily_price) {
        return Number(car.calculated_price.final_daily_price);
    }
    return Number(car?.daily_price ?? car?.price ?? 0);
};

const applyFilters = (cars, segment, fuelType, transmissionType) => {
    return cars.filter(car => {
        const segmentMatch = !segment || segment === "" || segment[0] === "" || segment.includes(`${car.segment_id}`);
        const fuelMatch = !fuelType || fuelType === "" || fuelType[0] === "" || fuelType.includes(`${car.fuel_id}`);
        const transmissionMatch = !transmissionType || transmissionType === "" || transmissionType[0] === "" || transmissionType.includes(`${car.transmission_id}`);
        return segmentMatch && fuelMatch && transmissionMatch;
    });
};

const applySorting = (cars, sortBy) => {
    switch (sortBy) {
        case "increase":
            return [...cars].sort((a, b) => resolveComparablePrice(a) - resolveComparablePrice(b));
        case "decrease":
            return [...cars].sort((a, b) => resolveComparablePrice(b) - resolveComparablePrice(a));
        default:
            return cars;
    }
};

export default function SortSearchReservations({ availableCars = [], sortBy, segment, fuelType, transmissionType, reservation }) {
    const { t, i18n } = useTranslation();
    const [processingId, setProcessingId] = useState(null);
 console.log(availableCars);
    const filteredCars = useMemo(() => {
        const filtered = applyFilters(availableCars, segment, fuelType, transmissionType);
        return applySorting(filtered, sortBy);
    }, [availableCars, sortBy, segment, fuelType, transmissionType]);

    const handleRentNow = useCallback(async (car) => {
        if (processingId) return;
        setProcessingId(car.id);

        const combinedStart = `${reservation.startDate} ${reservation.startTime}`;
        const combinedFinish = `${reservation.finishDate} ${reservation.finishTime || reservation.endTime}`;

        try {
            const url = `/${i18n.language}/${t('address.reservation-create')}`;
            const response = await axios.post(url, {
                car_group_id: car.id,
                startDateTime: combinedStart,
                finishDateTime: combinedFinish,
                PULocation: reservation.selectedPULocation.id,
                RLocation: reservation.selectedRLocation.id
            }, {
                headers: { 'Accept': 'application/json' }
            });

            if (response.data.redirect_url)
                window.location.href = response.data.redirect_url;
            setProcessingId(null);
        } catch (error) {
            console.error(error);
            setProcessingId(null);
        }
    }, [processingId, reservation, i18n.language, t]);

    return (
        <div className="space-y-3 sm:space-y-4">
            {filteredCars.map((filteredCar, index) => (
                <ReservationCarCard
                    key={filteredCar.id}
                    car={filteredCar}
                    isProcessing={processingId === filteredCar.id}
                    onRent={() => handleRentNow(filteredCar)}
                    priority={index === 0}
                />
            ))}
        </div>
    );
}
