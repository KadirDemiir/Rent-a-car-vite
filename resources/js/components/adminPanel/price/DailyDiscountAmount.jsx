import {useCallback, useMemo} from "react";
import {useTranslation} from "react-i18next";
import DiscountRow from "./DiscountRow.jsx";
import {
    validateDayRange,
    validateDiscountAmount,
    validateDiscountTypeChange,
} from "./discountValidators.js";
import {createEmptyDiscount} from "./discountHelpers.js";

export default function DailyDiscountAmount({currencies = [], dayDiscount = [], setDayDiscount, defaultCurrencyId = ""}) {
    const {t} = useTranslation();

    const resolvedDefaultCurrencyId = useMemo(() => {
        if (defaultCurrencyId) return defaultCurrencyId;
        return currencies.find(curr => curr.is_default)?.id ?? currencies[0]?.id ?? "";
    }, [currencies, defaultCurrencyId]);

    const handleDiscountUpdate = useCallback((index, updatedDiscount, updateType, minVal, maxVal) => {
        setDayDiscount((prev) => {
            const updated = [...prev];
            const discount = { ...updatedDiscount };

            switch (updateType) {
                case "day":
                    discount.day_error = validateDayRange(minVal, maxVal, index, prev);
                    break;
                case "discount_type":
                    discount.amount_error = validateDiscountTypeChange(
                        discount.discount_type,
                        discount.discount_amount
                    );
                    if (discount.discount_type !== "fixed") {
                        discount.currency = "";
                    } else if (!discount.currency) {
                        discount.currency = resolvedDefaultCurrencyId;
                    }
                    break;
                case "amount":
                    discount.amount_error = validateDiscountAmount(
                        discount.discount_amount,
                        discount.discount_type
                    );
                    break;
                default:
                    break;
            }

            updated[index] = discount;
            return updated;
        });
    }, [resolvedDefaultCurrencyId, setDayDiscount]);

    const handleRemoveDiscount = useCallback((index) => {
        setDayDiscount((prev) => prev.filter((_, idx) => idx !== index));
    }, [setDayDiscount]);

    const handleAddNewDiscount = useCallback(() => {
        setDayDiscount((prev) => [...prev, createEmptyDiscount(resolvedDefaultCurrencyId)]);
    }, [resolvedDefaultCurrencyId, setDayDiscount]);

    return (
        <div className="w-full rounded-md py-4">
            <h6 className="flex items-center justify-center font-bold">
                {t("adminpanel.pricing.add_discount.day_based_discount")}
            </h6>

            <div className="flex flex-col gap-4 py-4">
                {dayDiscount?.map((discount, index) => (
                    <DiscountRow
                        key={`discount-row-${index}`}
                        currencies={currencies}
                        discount={discount}
                        index={index}
                        onUpdate={handleDiscountUpdate}
                        onRemove={handleRemoveDiscount}
                        defaultCurrencyId={resolvedDefaultCurrencyId}
                    />
                ))}
            </div>

            <div className="mt-4 flex w-full items-center justify-center">
                <button
                    type="button"
                    onClick={handleAddNewDiscount}
                    className="w-32 cursor-pointer rounded-md bg-green-500 py-2 text-white transition hover:bg-green-600"
                >
                    {t("adminpanel.pricing.add_discount.add_new")}
                </button>
            </div>
        </div>
    );
}
