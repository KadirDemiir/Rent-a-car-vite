
import {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useCurrency} from "../../providers/CurrencyContext.jsx";
import ReservationCarPhoto from "./reservation/ReservationCarPhoto.jsx";
import ReservationCarInfo from "./reservation/ReservationCarInfo.jsx";
import ReservationCarPayment from "./reservation/ReservationCarPayment.jsx";
import {router} from "@inertiajs/react";

const applyFilters = (cars, segment, fuelType, transmissionType) => {
    return cars.filter(car => {
        const segmentMatch = segment === "" || segment[0] === "" || segment.includes(`${car.segment_id}`);
        const fuelMatch = fuelType === "" || fuelType[0] === "" || fuelType.includes(`${car.fuel_id}`);
        const transmissionMatch = transmissionType === "" || transmissionType[0] === "" || transmissionType.includes(`${car.transmission_id}`);
        return segmentMatch && fuelMatch && transmissionMatch;
    });
};

const resolveComparablePrice = (car) => Number(car?.daily_price ?? car?.price ?? 0);

const applySorting = (cars, sortBy) => {
    const sorted = [...cars];
    switch (sortBy) {
        case "increase":
            sorted.sort((a, b) => resolveComparablePrice(a) - resolveComparablePrice(b));
            break;
        case "decrease":
            sorted.sort((a, b) => resolveComparablePrice(b) - resolveComparablePrice(a));
            break;
        default:
            break;
    }
    return sorted;
};

export default function SortSearchReservations({availableCars = [], sortBy, segment, fuelType, transmissionType, reservation}) {
    console.log(reservation);
    const {t, i18n} = useTranslation();
    const [filteredCars, setFilteredCars] = useState([]);
    const {current, calculateTotal} = useCurrency();

    useEffect(() => {
        const filtered = applyFilters(availableCars, segment, fuelType, transmissionType);
        const sorted = applySorting(filtered, sortBy);
        setFilteredCars(sorted);
    }, [availableCars, sortBy, segment, fuelType, transmissionType]);

    const currencySymbol = current?.symbol ?? "";

    return (
        <div className="space-y-4">
            {filteredCars.map((filteredCar) => {
                const coverPhoto = filteredCar.photos?.find(p => p.is_cover)?.photo_path;
                const photoSrc = coverPhoto ? `/storage/${coverPhoto}` : undefined;
                const title = `${t(filteredCar.brand_key.key)} ${t(filteredCar.model_key.key)} • ${t(`fuel.${filteredCar.fuel_id}`)} • ${t(`transmission.${filteredCar.transmission_id}`)}`;
                const features = [
                    {
                        icon: "/storage/svg/carFeatures/gas_station.svg",
                        label: t(`fuel.${filteredCar.fuel_id}`),
                    },
                    {
                        icon: "/storage/svg/carFeatures/transmission.svg",
                        label: t(`transmission.${filteredCar.transmission_id}`),
                    },
                    {
                        icon: "/storage/svg/carFeatures/groups.svg",
                        label: t("website.car_card.properties.seat_count_{count}", {count: filteredCar.seat_count}),
                    },
                ];
                const requirements = [
                    {
                        icon: "/storage/svg/requirements/assurance.svg",
                        label: t("website.car_card.requirement.{amount}_{currency}_deposit", {amount: filteredCar.deposit, currency: "try"}),
                    },
                    {
                        icon: "/storage/svg/requirements/calendar.svg",
                        label: t("website.car_card.requirements.required_min_{age}", {age: 22}),
                    },
                    {
                        icon: "/storage/svg/requirements/steering-wheel.svg",
                        label: t("website.car_card.requirements.{year}_year_experience", {year: 2}),
                    },
                ];
                const dailyPriceValue = calculateTotal(filteredCar.daily_price ?? 0);
                const dropPriceValue = calculateTotal(filteredCar.drop_price ?? 0);
                const totalDays = filteredCar.total_days ?? 0;
                const numericDrop = Number(filteredCar.drop_price ?? 0);
                const numericDaily = Number(filteredCar.daily_price ?? 0);
                const totalPriceValue = calculateTotal(numericDrop + numericDaily * Number(totalDays));

                return (
                    <div
                        key={filteredCar.id}
                        className="bg-white w-full rounded-2xl grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-10 gap-4 p-6 shadow-md"
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
                            dailyPrice={dailyPriceValue}
                            dropPrice={dropPriceValue}
                            totalDays={totalDays}
                            totalPrice={totalPriceValue}
                            currencySymbol={currencySymbol}
                            rentLabel={t("website.searchReservation.rent_now")}
                            onRentNow={() => {
                                const combinedStart = `${reservation.startDate} ${reservation.startTime}`;
                                const combinedFinish = `${reservation.finishDate} ${reservation.finishTime || reservation.endTime}`;
                                router.visit(`/${i18n.language}/${t('address.reservation-create')}`, {
                                    method: "get",
                                    data: {
                                        car_id: filteredCar.id,
                                        startDateTime: combinedStart,
                                        finishDateTime: combinedFinish,
                                        PULocation: reservation.selectedPULocation.id,
                                        RLocation: reservation.selectedRLocation.id
                                    },
                                });
                            }}

                        />
                    </div>
                );
            })}
        </div>
    );
}
