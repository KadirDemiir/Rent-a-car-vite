import CarCardsProp from './carCardsProp/CarCardsProp.jsx';
import {useTranslation} from "react-i18next";


export default function CarCardProperties({fuel_id, transmission_id, seat_count, body_type, trunk_capacity, compName}){
    const {t} = useTranslation();
    return(
        <div className="flex-1 w-full">
            <div className="w-full flex justify-center font-bold">
                {compName}
            </div>

            < CarCardsProp
            photo_path = "/storage/svg/carFeatures/gas_station.svg"
            context = {t(`fuel.${fuel_id}`)}
            />
            < CarCardsProp
            photo_path = "/storage/svg/carFeatures/transmission.svg"
            context = {t(`transmission.${transmission_id}`)}
            />
            < CarCardsProp
            photo_path = "/storage/svg/carFeatures/groups.svg"
            context = {`${seat_count}`}
            />
            < CarCardsProp
            photo_path = "/storage/svg/carFeatures/car.svg"
            context={body_type}
            />
            < CarCardsProp
            photo_path = "/storage/svg/carFeatures/bag.svg"
            context = {`${trunk_capacity}`}
            />
        </div>
    );
}
