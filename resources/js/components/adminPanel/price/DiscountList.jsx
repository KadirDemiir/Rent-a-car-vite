import Td from "../table/Td.jsx";
import {useTranslation} from "react-i18next";

export default function DiscountList({data, isActive, }){
    const {t} = useTranslation();
    const TDclass = "border border-gray-500 px-4 py-2";
    const header = [t("adminpanel.pricing.discounts.discount_type"), t("adminpanel.pricing.discounts.effected_vehicles_or_vehicle"), t("adminpanel.pricing.discounts.discount_type_or_percentage"), t("adminpanel.pricing.discounts.start_date"), t("adminpanel.pricing.discounts.end_date"), t("adminpanel.pricing.discounts.status")];
    return(
        <table className={`w-full`}>
            <thead>
            <tr>
                < Td contents={header} cls={TDclass} as={"th"}/>
            </tr>
            </thead>
            <tbody>
            {data.map((dt) => {
                const hedef = dt.target_type === "car"
                    ? (dt.car?.brand || "Marka Yok")
                    : dt.target_type === "segment"
                        ? (dt.segment_name + " araçlar" || "Segment Yok")
                        : "Tümü";
                const indirim = dt.discount_type === "fixed"
                    ? dt.discount_value + "₺"
                    : (dt.discount_value * 100) + "%";

                if(isActive !== "all" && isActive !== dt.status)
                    return
                else{

                    return (
                        <tr key={dt.id}>
                            <Td contents={[
                                dt.target_type,
                                hedef,
                                indirim,
                                dt.start_date,
                                dt.end_date,
                                dt.status
                            ]}
                                cls={TDclass} />
                        </tr>
                    );
                }
            })}
            </tbody>
        </table>
    );
}
