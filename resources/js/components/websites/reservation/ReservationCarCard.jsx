import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../../providers/CurrencyContext.jsx";
import ReservationCarPhoto from "../reservation/ReservationCarPhoto.jsx";
import ReservationCarInfo from "../reservation/ReservationCarInfo.jsx";
import ReservationCarPayment from "../reservation/ReservationCarPayment.jsx";
import { Fuel, Settings2, Shield, User, Users } from "lucide-react";

const ReservationCarCard = memo(({ car, isProcessing, onRent, priority }) => {
    const { t, i18n } = useTranslation();
    const { current, calculateTotal } = useCurrency();

    const name = JSON.parse(car.name);
    const photoSrc = `/storage/${car.photos?.[0]?.photo_path}`;
    const title = `${name?.[i18n.language]} • ${t(`fuel.${car.fuel_id}`)} • ${t(`transmission.${car.transmission_id}`)}`;
    const currencySymbol = current?.symbol ?? "";

    const features = [
        { icon: <Fuel size={20} className="w-5 h-5 shrink-0 text-gray-500" />, label: t(`fuel.${car.fuel_id}`) },
        { icon: <Settings2 size={20} className="w-5 h-5 shrink-0 text-gray-500" />, label: t(`transmission.${car.transmission_id}`) },
        { icon: <Users size={20} className="w-5 h-5 shrink-0 text-gray-500" />, label: t("website.car_card.properties.seat_count_{count}", { count: car.seat_count }) },
    ];

    const requirements = [
        { icon: <Shield size={20} className="w-5 h-5 shrink-0 text-gray-500" />, label: t("website.car_card.requirement.{amount}_{currency}_deposit", { amount: calculateTotal(car.deposit).toFixed(2), currency: current.symbol }) },
        { icon: <User size={20} className="w-5 h-5 shrink-0 text-gray-500" />, label: t("website.car_card.requirements.required_min_{age}", { age: car.min_age ?? 22 }) },
        { icon: <User size={20} className="w-5 h-5 shrink-0 text-gray-500" />, label: t("website.car_card.requirements.{year}_year_experience", { year: car.min_license_year ?? 2 }) },
    ];

    const priceData = car.calculated_price || {};
    const rawBaseDaily = priceData.base_daily_price ?? car.daily_price ?? 0;
    const rawFinalDaily = priceData.final_daily_price ?? car.daily_price ?? 0;
    const rawDrop = priceData.drop_price ?? car.drop_price ?? 0;
    const rawTotal = priceData.grand_total ?? ((Number(rawDrop) + (Number(rawFinalDaily) * Number(car.total_days ?? 0))));

    return (
        <div className={`bg-white w-full rounded-2xl grid grid-cols-1 sm:grid-cols-12 gap- 3 sm:gap-4 lg:gap-6 p-4 sm:p-5 lg:p-6 shadow-md transition-opacity ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}>
            <ReservationCarPhoto
                photoSrc={photoSrc}
                alt={name?.[i18n.language]}
                priority={priority}
            />
            <ReservationCarInfo
                segmentLabel={t(`segment.${car.segment_id}`)}
                title={title}
                features={features}
                requirements={requirements}
            />
            <ReservationCarPayment
                baseDailyPrice={calculateTotal(rawBaseDaily).toFixed(2)}
                dailyPrice={calculateTotal(rawFinalDaily).toFixed(2)}
                hasDiscount={car.discount_data?.has_discount ?? false}
                dropPrice={calculateTotal(rawDrop).toFixed(2)}
                totalDays={car.total_days ?? 0}
                totalPrice={calculateTotal(rawTotal).toFixed(2)}
                onlineTotal={calculateTotal(car.calculated_price?.onlineTotal).toFixed(2)}
                currencySymbol={currencySymbol}
                rentLabel={t("website.searchReservation.rent_now")}
                disabled={isProcessing}
                onRentNow={onRent}
            />
        </div>
    );
});

export default ReservationCarCard;
