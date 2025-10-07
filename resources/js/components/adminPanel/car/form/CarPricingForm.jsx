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
            <SelectOptions options={currencyTypeOptions} options_name={t("adminpanel.car.car_modify.edit_price_information.deopsit_currency")} onChange={(e) => setFormData(prev => ({...prev, deposit_currency: e}))} value={formData.deposit_currency}/>
            <SelectOptions options={currencyTypeOptions} options_name={t("adminpanel.car.car_modify.edit_price_information.daily_price_currency")} onChange={(e) => setFormData(prev => ({...prev, price_currency: e}))} value={formData.price_currency}/>
            {error?.price && Object.values(error.price).map((err, i) => (Object.values(err).some(er => er.trim()) && (<p key={i} className="p-2 col-span-2 border-l-12 border-red-500 bg-red-200 text-red-600 font-semibold">*değerler sadece sayı içermelidir örn: 1, 1.50</p>)))}
            <div className={`col-span-2`}><CarPriceDetailForm data={formData} setData={setFormData} errors={error} setErrors={setError}/></div>
        </form>
    );
});

export default CarPricingForm;
