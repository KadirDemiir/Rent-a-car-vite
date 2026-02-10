import ReservationCarPhoto from "../ReservationCarPhoto.jsx";
import ReservationCarInfo from "../ReservationCarInfo.jsx";
import {useTranslation} from "react-i18next";
import {User, Users, Fuel, Shield, Settings2} from 'lucide-react';
import {useCurrency} from "../../../../providers/CurrencyContext.jsx";

export default function CarReview({car}){
    const {t, i18n} = useTranslation();
    const {current, calculateTotal} = useCurrency();
    const coverPhoto = car.photos?.find(p => p.is_cover)?.photo_path;
    const photoSrc = coverPhoto ? `/storage/${coverPhoto}` : undefined;
    const title = JSON.parse(car.name)?.[i18n.language];
    const features = [
        {
            icon: <Fuel/>,
            label: t(`fuel.${car.fuel_id}`),
        },
        {
            icon: <Settings2/>,
            label: t(`transmission.${car.transmission_id}`),
        },
        {
            icon: <Users />,
            label: t("website.car_card.properties.seat_count_{count}", {count: car.seat_count}),
        },
    ];
    const requirements = [
        {
            icon: <Shield />,
            label: t("website.car_card.requirement.{amount}_{currency}_deposit", {amount: Number(calculateTotal(car.deposit)).toFixed(2), currency: current?.symbol}),
        },
        {
            icon: <User/>,
            label: t("website.car_card.requirements.required_min_{age}", {age: 22}),
        },
        {
            icon: <User/>,
            label: t("website.car_card.requirements.{year}_year_experience", {year: 2}),
        },
    ];
    return(
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-10 lg:grid-cols-8 gap-4 m-4">
                <ReservationCarPhoto photoSrc={photoSrc}/>
                <ReservationCarInfo segmentLabel={t(`segment.${car.segment_id}`)} title={title} features={features} requirements={requirements} className={`gap-6`}/>
            </div>
        </div>
    );
}
