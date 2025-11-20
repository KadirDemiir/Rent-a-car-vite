import Td from "../table/Td.jsx";
import {useMemo} from "react";
import {useTranslation} from "react-i18next";

export default function DiscountList({data = []}) {
    const {t, i18n} = useTranslation();
    const tableCellClass = "border border-gray-500 px-4 py-3 text-sm";

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
            return discount.car?.brand || t("adminpanel.pricing.discounts.target.car_fallback");
        }
        if (discount.target_type === "segment") {
            return discount.segment_name || t("adminpanel.pricing.discounts.target.segment_fallback");
        }
        return t("adminpanel.pricing.discounts.target.all_vehicles");
    };

    const formatDiscountValue = (discount) => {
        if (!discount) return "-";
        if (discount.discount_type === "fixed") {
            const symbol = discount.currency_symbol || "₺";
            return `${discount.discount_value ?? 0}${symbol}`;
        }
        const percentage = Number(discount.discount_value ?? 0) * 100;
        return `${percentage}%`;
    };

    const formatDate = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString(i18n.language);
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <Td contents={headers} cls="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600" as="th"/>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {data.map((discount) => (
                    <tr key={discount.id} className="hover:bg-gray-50">
                        <Td
                            contents={[
                                discount.target_type,
                                formatTarget(discount),
                                formatDiscountValue(discount),
                                formatDate(discount.start_date),
                                formatDate(discount.end_date),
                                t(`adminpanel.pricing.discounts.status_labels.${discount.status}`, discount.status)
                            ]}
                            cls={tableCellClass}
                        />
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
