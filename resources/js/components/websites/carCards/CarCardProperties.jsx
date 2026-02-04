import { useTranslation } from "react-i18next";
import { Fuel, Settings2, Users, Car, Briefcase } from 'lucide-react';

export default function CarCardProperties({ fuel_id, transmission_id, seat_count, body_type, trunk_capacity }) {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                <Fuel className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600 text-center">{t(`fuel.${fuel_id}`)}</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                <Settings2 className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600 text-center">{t(`transmission.${transmission_id}`)}</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600 text-center">{seat_count}</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                <Car className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600 text-center">{body_type}</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg col-span-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600 text-center">{trunk_capacity}</span>
            </div>
        </div>
    );
}
