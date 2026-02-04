import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import { useCurrency } from "../../../providers/CurrencyContext";

export default function DiscountList({data = []}) {
    const {t, i18n} = useTranslation();
    const {calculateTotal, current} = useCurrency();

    const headers = useMemo(() => ([
        t("adminpanel.pricing.discounts.discount_type"),
        t("adminpanel.pricing.discounts.effected_vehicles_or_vehicle"),
        t("adminpanel.pricing.discounts.discount_type_or_percentage"),
        t("adminpanel.pricing.discounts.start_date"),
        t("adminpanel.pricing.discounts.end_date"),
        t("adminpanel.pricing.discounts.status")
    ]), [t]);

    const formatTarget = (discount) => {
        if (!discount) return t("adminpanel.general.not_available");
        if (discount.target_type === "car") {
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{discount.car?.brand} {discount.car?.model}</span>
                </div>
            ) || t("adminpanel.pricing.discounts.target.car_fallback");
        }
        if (discount.target_type === "segment") {
            return <span className="font-medium text-gray-700">{t(`segment.${discount.segment_id}`)}</span> || t("adminpanel.pricing.discounts.target.segment_fallback");
        }
        return <span className="font-medium text-purple-600">{t("adminpanel.pricing.discounts.target.all_vehicles")}</span>;
    };

    const formatDiscountValue = (discount) => {
        if (!discount) return "-";
        if (discount.discount_type === "fixed") {
            //const symbol = discount.currency_symbol || "";
            return <span className="font-bold text-gray-900">{`${Number(calculateTotal(discount?.discount_value)).toFixed(2)} ${current?.symbol}`}</span>;
        }
        const percentage = Number(discount.discount_value ?? 0) * 100;
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{percentage}%</span>;
    };

    const formatDate = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return <span className="text-gray-500">{date.toLocaleDateString(i18n.language)}</span>;
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-gray-100 text-gray-800",
            expired: "bg-red-100 text-red-800",
        };
        const style = styles[status] || styles.inactive;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
                {t(`adminpanel.pricing.discounts.status_labels.${status}`, status)}
            </span>
        );
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((header, index) => (
                            <th 
                                key={index} 
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                {data.map((discount) => (
                    <tr key={discount.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                             <span className="capitalize">{discount.target_type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatTarget(discount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatDiscountValue(discount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(discount.start_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(discount.end_date)}
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {getStatusBadge(discount.status)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
