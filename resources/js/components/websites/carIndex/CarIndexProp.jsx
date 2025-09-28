import CarIndexPropComp from "./carIndexComp/CarIndexPropComp.jsx";
import {useTranslation} from "react-i18next";

export default function CarIndexProp({car}){
    const {t} = useTranslation();
    return (
        <div className="grid grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow-md w-full border-1 border-blue-600">

            <div className="col-span-2 flex justify-center font-bold text-xl">Car Properties</div>

            < CarIndexPropComp photo_path={"/storage/svg/carFeatures/transmission.svg"} title={t('website.car.transmission_type')} content={car.transmission_type}/>

            < CarIndexPropComp photo_path={"/storage/svg/carFeatures/gas_station.svg"} title={t("website.car.fuel_type")} content={car.fuel_type}/>

            < CarIndexPropComp photo_path={"/storage/svg/carFeatures/groups.svg"} title={t("website.car.seat_count")} content={car.seat_count}/>

            < CarIndexPropComp photo_path={"/storage/svg/carFeatures/bag.svg"} title={t("website.car.trunk_capacity")} content={car.trunk_capacity}/>

            < CarIndexPropComp photo_path={"/storage/svg/carFeatures/car.svg"} title={t("website.car.body_type")} content={car.body_type}/>

        </div>
    );
}
