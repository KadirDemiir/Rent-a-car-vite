import CarIndexPropComp from "./carIndexComp/CarIndexPropComp.jsx";
import {useTranslation} from "react-i18next";
import {Settings2, Fuel, Users, Briefcase, Car} from "lucide-react";

export default function CarIndexProp({car}){
    console.log('CarIndexProp => ', car);
    const {t} = useTranslation();
    return (
        <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100 w-full">
            <div className="mb-4 text-center text-sm font-semibold text-gray-700">{t('website.car_card.properties.properties_label')}</div>
            <div className="grid grid-cols-2 gap-4">
                < CarIndexPropComp photo={<Settings2 />} title={t(`transmission.${car.transmission_id}`)} content={t(`transmission.${car.transmission_id}`)}/>

                < CarIndexPropComp photo={<Fuel/>} title={t(`fuel.${car.fuel_id}`)} content={t(`fuel.${car.fuel_id}`)}/>

                < CarIndexPropComp photo={<Users/>} title={t("website.car.seat_count")} content={car.seat_count}/>

                < CarIndexPropComp photo={<Briefcase/>} title={t("website.car.trunk_capacity")} content={car.trunk_capacity}/>

                <div className="col-span-2">
                    < CarIndexPropComp photo={<Car/>} title={t(`body_type.${car.body_type_id}`)} content={t(`body_type.${car.body_type_id}`)}/>
                </div>
            </div>
        </div>
    );
}
