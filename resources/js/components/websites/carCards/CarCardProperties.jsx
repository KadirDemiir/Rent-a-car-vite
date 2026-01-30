import CarCardsProp from './carCardsProp/CarCardsProp.jsx';
import { useTranslation } from "react-i18next";
import { Fuel, Settings2, Users, Car, Briefcase } from 'lucide-react';

export default function CarCardProperties({ fuel_id, transmission_id, seat_count, body_type, trunk_capacity, compName }) {
    const { t } = useTranslation();

    return (
        <div className="flex-1 flex flex-wrap gap-4">
            <div className="w-full flex justify-center font-bold">
                {compName}
            </div>
            <CarCardsProp
                photo={<Fuel />}
                context={t(`fuel.${fuel_id}`)}
            />

            <CarCardsProp
                photo={<Settings2 />}
                context={t(`transmission.${transmission_id}`)}
            />

            <CarCardsProp
                photo={<Users />}
                context={seat_count}
            />

            <CarCardsProp
                photo={<Car />}
                context={body_type}
            />

            <CarCardsProp
                photo={<Briefcase />}
                context={`${trunk_capacity} L`}
            />
        </div>
    );
}
