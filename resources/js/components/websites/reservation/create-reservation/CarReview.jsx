import ReservationCarPhoto from "../ReservationCarPhoto.jsx";
import ReservationCarInfo from "../ReservationCarInfo.jsx";
import {useTranslation} from "react-i18next";

export default function CarReview({car}){
    const {t} = useTranslation();
    const coverPhoto = car.photos?.find(p => p.is_cover)?.photo_path;
    const photoSrc = coverPhoto ? `/storage/${coverPhoto}` : undefined;
    const title = `${t(car.brand_key.key)} ${t(car.model_key.key)} • ${t(`fuel.${car.fuel_id}`)} • ${t(`transmission.${car.transmission_id}`)}`;
    const features = [
        {
            icon: "/storage/svg/carFeatures/gas_station.svg",
            label: t(`fuel.${car.fuel_id}`),
        },
        {
            icon: "/storage/svg/carFeatures/transmission.svg",
            label: t(`transmission.${car.transmission_id}`),
        },
        {
            icon: "/storage/svg/carFeatures/groups.svg",
            label: t("website.car_card.properties.seat_count_{count}", {count: car.seat_count}),
        },
    ];
    const requirements = [
        {
            icon: "/storage/svg/requirements/assurance.svg",
            label: t("website.car_card.requirement.{amount}_{currency}_deposit", {amount: car.deposit, currency: "try"}),
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
    return(
        <div className={`flex justify-stretch p-4 bg-white rounded-xl shadow-lg`}>
            <ReservationCarPhoto photoSrc={photoSrc}/>
            <ReservationCarInfo segmentLabel={t(`segment.${car.segment_id}`)} title={title} features={features} requirements={requirements} />
        </div>
    );
}
