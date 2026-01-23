import CarIndexPropComp from "./carIndexComp/CarIndexPropComp.jsx";
import {useTranslation} from "react-i18next";
import {Calendar, User, Shield} from "lucide-react";
import { useCurrency } from "../../../providers/CurrencyContext.jsx";

export default function CarIndexRequirement({car}){ 
    console.log(car);
    const {t} = useTranslation();
    const {current, calculateTotal} = useCurrency();
    return (
        <div className="grid grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow-md w-full border-1 border-blue-600">
            <div className="col-span-2 flex justify-center font-bold text-xl">Requirements</div>

            < CarIndexPropComp photo={<Calendar/>} title={t("website.car.requirements.required_min_age")} content={"23"}/>
            < CarIndexPropComp photo={<User/>} title={t("website.car.requirement.experience")} content={"3"}/>
            < CarIndexPropComp photo={<Shield/>} title={t("website.car.requirement.deposit")} content={` ${calculateTotal(car.deposit).toFixed(2)} ${current.symbol}`}/>
        </div>
    );
}
