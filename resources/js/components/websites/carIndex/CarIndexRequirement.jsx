import CarIndexPropComp from "./carIndexComp/CarIndexPropComp.jsx";
import {useTranslation} from "react-i18next";
import {Calendar, User, Shield} from "lucide-react";
import { useCurrency } from "../../../providers/CurrencyContext.jsx";

export default function CarIndexRequirement({car}){
    const {t} = useTranslation();
    const {current, calculateTotal} = useCurrency();
    return (
        <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100 w-full">
            <div className="mb-4 text-center text-sm font-semibold text-gray-700">{t('website.car.requirements.requirements_label')}</div>
            <div className="grid grid-cols-2 gap-4">
                < CarIndexPropComp photo={<Calendar/>} title={t("website.car.requirements.required_min_age")} content={23}/>
                < CarIndexPropComp photo={<User/>} title={t("website.car.requirement.experience")} content={3}/>
                < CarIndexPropComp photo={<Shield/>} title={t("website.car.requirement.deposit")} content={`${calculateTotal(car.deposit).toFixed(2)} ${current.symbol}`}/>
            </div>
        </div>
    );
}
