import CarCardsProp from './carCardsProp/CarCardsProp.jsx';
import { useTranslation } from "react-i18next";
import { Fuel, Settings2, Users, Car, Briefcase } from 'lucide-react';

export default function CarCardProperties({ fuel_id, transmission_id, seat_count, body_type, trunk_capacity, compName }) {
    const { t } = useTranslation();
    const iconStyle = "text-slate-700 dark:text-slate-200 transition-colors";
    const iconSize = 20;

    return (
        <div className="flex-1 w-full bg-white dark:bg-slate-900 p-4 rounded-lg transition-colors">
            <div className="w-full flex justify-center font-bold mb-4 text-slate-900 dark:text-white">
                {compName}
            </div>

            <CarCardsProp
                photo={<Fuel size={iconSize} className={iconStyle} />}
                context={t(`fuel.${fuel_id}`)}
            />

            <CarCardsProp
                photo={<Settings2 size={iconSize} className={iconStyle} />}
                context={t(`transmission.${transmission_id}`)}
            />

            <CarCardsProp
                photo={<Users size={iconSize} className={iconStyle} />}
                context={seat_count}
            />

            <CarCardsProp
                photo={<Car size={iconSize} className={iconStyle} />}
                context={body_type}
            />

            <CarCardsProp
                photo={<Briefcase size={iconSize} className={iconStyle} />}
                context={`${trunk_capacity} L`}
            />
        </div>
    );
}
