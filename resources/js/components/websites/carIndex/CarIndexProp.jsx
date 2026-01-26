import CarIndexPropComp from "./carIndexComp/CarIndexPropComp.jsx";
import {useTranslation} from "react-i18next";
import {Settings2, Fuel, Users, Briefcase, Car} from "lucide-react";

export default function CarIndexProp({car}){
    console.log('CarIndexProp => ', car);
    const {t} = useTranslation();
    return (
        <div className="grid grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow-md w-full border-1 border-blue-600">

            <div className="col-span-2 flex justify-center font-bold text-xl">Car Properties</div>

            < CarIndexPropComp photo={<Settings2 />} title={t(`transmission.${car.transmission_id}`)} content={t(`transmission.${car.transmission_id}`)}/>

            < CarIndexPropComp photo={<Fuel/>} title={t(`fuel.${car.fuel_id}`)} content={t(`fuel.${car.fuel_id}`)}/>

            < CarIndexPropComp photo={<Users/>} title={t("website.car.seat_count")} content={car.seat_count}/>

            < CarIndexPropComp photo={<Briefcase/>} title={t("website.car.trunk_capacity")} content={car.trunk_capacity}/>

            < CarIndexPropComp photo={<Car/>} title={t(`body_type.${car.body_type_id}`)} content={t(`body_type.${car.body_type_id}`)}/>

        </div>
    );
}
