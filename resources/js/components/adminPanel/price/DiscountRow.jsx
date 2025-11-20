import {useMemo} from "react";
import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";
import {useTranslation} from "react-i18next";

export default function DiscountRow({
    currencies = [],
    discount,
    index,
    onUpdate,
    onRemove,
    defaultCurrencyId = ""
}) {
    const {t} = useTranslation();

    const handleDayChange = (value, type) => {
        const minVal = type === "min_day" ? value : discount.min_day;
        const maxVal = type === "max_day" ? value : discount.max_day;
        onUpdate(index, { ...discount, [type]: value }, "day", minVal, maxVal);
    };

    const handleDiscountTypeChange = (value) => {
        onUpdate(index, { ...discount, discount_type: value }, "discount_type");
    };

    const handleCurrencyChange = (value) => {
        onUpdate(index, { ...discount, currency: value }, "currency");
    };

    const handleAmountChange = (value) => {
        onUpdate(index, { ...discount, discount_amount: value }, "amount");
    };

    const discountTypeOptions = useMemo(() => ([
        {
            label: t("adminpanel.pricing.add_discount.fixed_amount", { defaultValue: "Sabit Tutar" }),
            value: "fixed"
        },
        {
            label: t("adminpanel.pricing.add_discount.percentage", { defaultValue: "Yüzde İndirim" }),
            value: "percentage"
        }
    ]), [t]);

    const currencyOptions = useMemo(() => (
        currencies?.map(curr => ({
            label: `${curr.code}${curr.symbol ? ` (${curr.symbol})` : ""}`,
            value: curr.id
        })) ?? []
    ), [currencies]);

    const currencyValue = discount.currency
        ? [discount.currency]
        : (defaultCurrencyId ? [defaultCurrencyId] : []);

    return (
        <div className="w-full rounded-lg border border-gray-200 bg-white py-4 shadow-md">
            <div className="flex w-full flex-wrap justify-center gap-4">
                <div className="flex min-w-[250px] flex-col items-center justify-center">
                    <div className="text-center">{t("adminpanel.pricing.add_discount.min_days")}</div>
                    <input
                        onChange={(e) => handleDayChange(e.target.value, "min_day")}
                        min="0"
                        className={`w-full rounded-md border py-2 px-4 shadow-sm outline-none ${
                            discount.day_error ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={t("adminpanel.pricing.add_discount.min_days")}
                        value={discount.min_day || ""}
                    />
                </div>

                <div className="flex min-w-[250px] flex-col items-center justify-center">
                    <div className="text-center">{t("adminpanel.pricing.add_discount.max_days")}</div>
                    <input
                        onChange={(e) => handleDayChange(e.target.value, "max_day")}
                        min="0"
                        className={`w-full rounded-md border py-2 px-4 shadow-sm outline-none ${
                            discount.day_error ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={t("adminpanel.pricing.add_discount.max_days")}
                        value={discount.max_day || ""}
                    />
                </div>

                <div className="min-w-[250px] px-4">
                    <SelectOptions
                        options={discountTypeOptions}
                        value={discount.discount_type ? [discount.discount_type] : []}
                        onChange={handleDiscountTypeChange}
                        options_name={t("adminpanel.pricing.add_discount.discount_type")}
                    />
                </div>

                {discount.discount_type === "fixed" && (
                    <div className="min-w-[250px] px-4">
                        <SelectOptions
                            options={currencyOptions}
                            value={currencyValue}
                            onChange={handleCurrencyChange}
                            options_name={t("adminpanel.pricing.add_discount.currency")}
                        />
                    </div>
                )}

                <div className="flex min-w-[250px] flex-col items-center justify-center">
                    <div className="text-center">{t("adminpanel.pricing.add_discount.discount_amount")}</div>
                    <input
                        onChange={(e) => handleAmountChange(e.target.value)}
                        min="0"
                        className={`w-full rounded-md border py-2 px-4 shadow-sm outline-none ${
                            discount.amount_error ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={t("adminpanel.pricing.add_discount.discount_amount")}
                        value={discount.discount_amount || ""}
                    />
                </div>

                <div className="flex min-w-[250px] items-end justify-center">
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="w-32 cursor-pointer rounded-md bg-red-500 py-2 text-white transition hover:bg-red-600"
                    >
                        {t("adminpanel.pricing.add_discount.delete")}
                    </button>
                </div>
            </div>

            {discount.day_error && (
                <div className="flex w-full justify-center whitespace-pre-line px-4 pt-4 text-sm text-red-500">
                    *{discount.day_error}
                </div>
            )}
            {discount.amount_error && (
                <div className="flex w-full justify-center px-4 pt-2 text-sm text-red-500">
                    *{discount.amount_error}
                </div>
            )}
        </div>
    );
}

