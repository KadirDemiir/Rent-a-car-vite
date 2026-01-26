import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useCurrency } from "../../providers/CurrencyContext.jsx";
import ReservationCarPhoto from "./reservation/ReservationCarPhoto.jsx";
import ReservationCarInfo from "./reservation/ReservationCarInfo.jsx";
import ReservationCarPayment from "./reservation/ReservationCarPayment.jsx";
import { Fuel, Settings2, Shield, User, Users } from "lucide-react";

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
    const { current, calculateTotal } = useCurrency();
    const [processingId, setProcessingId] = useState(null);

    const filteredCars = useMemo(() => {
        const filtered = applyFilters(availableCars, segment, fuelType, transmissionType);
        return applySorting(filtered, sortBy);
    }, [availableCars, sortBy, segment, fuelType, transmissionType]);

    const currencySymbol = current?.symbol ?? "";

    const handleRentNow = async(car) => {
        if (processingId) return;

        setProcessingId(car.id);

        const combinedStart = `${reservation.startDate} ${reservation.startTime}`;
        const combinedFinish = `${reservation.finishDate} ${reservation.finishTime || reservation.endTime}`;

        try {
            const url = `/${i18n.language}/${t('address.reservation-create')}`;

            const response = await axios.post(url, {
                car_id: car.id,
                startDateTime: combinedStart,
                finishDateTime: combinedFinish,
                PULocation: reservation.selectedPULocation.id,
                RLocation: reservation.selectedRLocation.id
            }, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            let targetUrl = response.data.redirect_url;

/*             if (targetUrl && targetUrl.startsWith('http://')) {
                targetUrl = targetUrl.replace('http://', 'https://');
            } */

            if (targetUrl) 
                window.location.href = targetUrl; 
            setProcessingId(null);

        } catch (error) {
            console.error(error);
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-4">
            {filteredCars.map((filteredCar) => {
                const coverPhoto = filteredCar.photos?.find(p => p.is_cover)?.photo_path;
                const photoSrc = coverPhoto ? `/storage/${coverPhoto}` : undefined;
                const title = `${t(filteredCar.brand_key.key)} ${t(filteredCar.model_key.key)} • ${t(`fuel.${filteredCar.fuel_id}`)} • ${t(`transmission.${filteredCar.transmission_id}`)}`;

                const features = [
                    { icon: <Fuel/>, label: t(`fuel.${filteredCar.fuel_id}`) },
                    { icon: <Settings2/>, label: t(`transmission.${filteredCar.transmission_id}`) },
                    { icon: <Users />, label: t("website.car_card.properties.seat_count_{count}", {count: filteredCar.seat_count}) },
                ];

                const requirements = [
                    {
                        icon: <Shield />,
                        label: t("website.car_card.requirement.{amount}_{currency}_deposit", {amount: calculateTotal(filteredCar.deposit).toFixed(2), currency: current.symbol}),
                    },
                    {
                        icon: <User/>,
                        label: t("website.car_card.requirements.required_min_{age}", {age: filteredCar.min_age ?? 22}), 
                    },
                    {
                        icon: <User/>,
                        label: t("website.car_card.requirements.{year}_year_experience", {year: filteredCar.min_license_year ?? 2}),
                    },
                ];

                const priceData = filteredCar.calculated_price || {};
                const hasDiscount = filteredCar.discount_data?.has_discount ?? false;
                const totalDays = filteredCar.total_days ?? 0;

                const rawBaseDaily = priceData.base_daily_price ?? filteredCar.daily_price ?? 0;
                const rawFinalDaily = priceData.final_daily_price ?? filteredCar.daily_price ?? 0;
                const rawDrop = priceData.drop_price ?? filteredCar.drop_price ?? 0;
                const rawTotal = priceData.grand_total ??
                    ((Number(rawDrop) + (Number(rawFinalDaily) * Number(totalDays))));

                const isProcessing = processingId === filteredCar.id;

                return (
                    <div
                        key={filteredCar.id}
                        className={`bg-white w-full rounded-2xl grid grid-cols-1 md:grid-cols-10 gap-4 p-6 shadow-md transition-opacity ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}
                    >
                        <ReservationCarPhoto
                            photoSrc={photoSrc}
                            alt={`${t(filteredCar.brand_key.key)} ${t(filteredCar.model_key.key)}`}
                        />

                        <ReservationCarInfo
                            segmentLabel={t(`segment.${filteredCar.segment_id}`)}
                            title={title}
                            features={features}
                            requirements={requirements}
                        />

                        <ReservationCarPayment
                            baseDailyPrice={calculateTotal(rawBaseDaily).toFixed(2)}
                            dailyPrice={calculateTotal(rawFinalDaily).toFixed(2)}
                            hasDiscount={hasDiscount}
                            dropPrice={calculateTotal(rawDrop).toFixed(2)}
                            totalDays={totalDays}
                            totalPrice={calculateTotal(rawTotal).toFixed(2)}
                            currencySymbol={currencySymbol}
                            rentLabel={isProcessing ? t("website.general.processing") : t("website.searchReservation.rent_now")}
                            disabled={isProcessing}
                            onRentNow={() => handleRentNow(filteredCar)}
                        />
                    </div>
                );
            })}
        </div>
    );
}