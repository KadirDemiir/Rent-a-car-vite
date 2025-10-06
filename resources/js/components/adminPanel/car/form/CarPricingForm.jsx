import React, { useState, forwardRef, useImperativeHandle } from "react";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import {useTranslation} from "react-i18next";
import CarPriceDetailForm from "./CarPriceDetailForm.jsx";

const currencyTypeOptions = [{ label: "TL", value: "try" }, { label: "Euro", value: "eur" },];

const CarPricingForm = forwardRef(({ car = {}, onSubmit, ddopen=false}, ref) => {
    const {t} = useTranslation();
    const days = ['1-3', '4-6', '7-13', '14-20', '21-27', '28+'];

    const [formData, setFormData] = useState(() => {
        const prices = {};
        for (let month = 1; month <= 12; month++) {
            prices[month] = {};
            days.forEach(day => {
                prices[month][day] = "";
            });
        }
        return {deposit: "", deposit_currency: "try", price: prices, price_currency: "try", ...car,};});

    const [error, setError] = useState(() => {
        const prices = {};
        for (let month = 1; month <= 12; month++) {
            prices[month] = {};
            days.forEach(day => {
                prices[month][day] = "";
            });
        }
        return {deposit: "", deposit_currency: "", price: prices,   month: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i, ""])), price_currency: "", ...car,};});

    useImperativeHandle(ref, () => ({
        submit: () => {
            const errors = {};
            if (!formData.deposit) errors.deposit = "Depozito gerekli";
            if (!formData.price) errors.price = "Fiyat gerekli";

            setError(errors);
            if (Object.keys(errors).length > 0) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return null;
            }

            const data = new FormData();
            data.append("deposit", formData.deposit);
            data.append("deposit_currency", formData.deposit_currency);
            data.append("price", formData.price);
            data.append("price_currency", formData.price_currency);
            return data;
        }
    }));

    return (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
                const hasError = (obj) =>
                    Object.values(obj).some(val =>
                        (typeof val === "string" && val) ||
                        (typeof val === "object" && val !== null && hasError(val))
                    );
                return hasError(error) && (
                    <div className="col-span-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            {(() => {
                                const render = (obj, parentKey = "") =>
                                    Object.entries(obj).map(([key, val]) => {
                                        const fullKey = parentKey ? `${parentKey}.${key}` : key;
                                        if (typeof val === "string" && val) return <li key={fullKey}>{fullKey}: {val}</li>;
                                        if (typeof val === "object" && val !== null) return render(val, fullKey);
                                        return null;
                                    });
                                return render(error);
                            })()}
                        </ul>
                    </div>
                );
            })()}
            <SelectOptions
                options={currencyTypeOptions}
                options_name={t("adminpanel.car.car_modify.edit_price_information.deopsit_currency")}
                onChange={(e) => setFormData(prev => ({...prev, deposit_currency: e}))}
                value={formData.deposit_currency}
            />
            <SelectOptions
                options={currencyTypeOptions}
                options_name={t("adminpanel.car.car_modify.edit_price_information.daily_price_currency")}
                onChange={(e) => setFormData(prev => ({...prev, price_currency: e}))}
                value={formData.price_currency}
            />
            <div className={`col-span-2`}>
                <CarPriceDetailForm data={formData} setData={setFormData} errors={error} setErrors={setError}/>
            </div>
        </form>
    );
});

export default CarPricingForm;
