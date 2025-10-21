import React, { useState, forwardRef, useImperativeHandle } from "react";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import {useTranslation} from "react-i18next";
import CarPriceDetailForm from "./CarPriceDetailForm.jsx";
import FormInput from "./FormInput.jsx";

const currencyTypeOptions = [{ label: "TL", value: "try" }, { label: "Euro", value: "eur" },];

const CarPricingForm = forwardRef(({ car = {}, onSubmit, ddopen=false}, ref) => {
    const {t} = useTranslation();
    const days = ['1-3', '4-6', '7-13', '14-20', '21-27', '28+'];

    const [formData, setFormData] = useState(() => {
        const prices = {};
        for (let month = 1; month <= 12; month++)
            prices[month] = {};
        if(car?.price){
            car.price.forEach(prc => {
                const monthsToApply = prc.month ? [prc.month] : Array.from({length: 12}, (_, i) => i+1);
                monthsToApply.forEach(month => {
                    const key = `${prc.min_days}-${prc.max_days}`;
                    prices[month][key] = prc.price;
                });
            });
        } else {
            for(let month = 1; month <= 12; month++){
                days.forEach(day => {
                    prices[month][day] = "";
                });
            }
        }
        return {deposit: car?.deposit ?? "", deposit_currency: car?.deposit_currency ?? "try", price: prices, price_currency: car?.price?.[0]?.price_currency ?? "try"};
    });


    const [error, setError] = useState(() => {
        const prices = {};
        for (let month = 1; month <= 12; month++) {
            prices[month] = {};
            days.forEach(day => {
                prices[month][day] = "";
            });
        }
        return {deposit: "", deposit_currency: "", price: prices,   month: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i, ""])), price_currency: ""};});

    useImperativeHandle(ref, () => ({
        submit: () => {
            const errors = {};

            if (!formData.deposit)
                errors.deposit = "Depozito gerekli";
            else if(error.deposit)
                errors.deposit = error.deposit;

            if (Object.values(formData.price).some(price => Object.values(price).some(prc => !prc.toString().trim()))) {
                const newPriceErrors = {};

                Object.entries(formData.price).forEach(([monthKey, monthPrices]) => {
                    newPriceErrors[monthKey] = {};
                    Object.entries(monthPrices).forEach(([dayKey, priceValue]) => {
                        if (!priceValue.toString().trim())
                            newPriceErrors[monthKey][dayKey] = "Boş olamaz";
                        else
                            newPriceErrors[monthKey][dayKey] = error.price[monthKey][dayKey] ?? "";
                    });
                    if (Object.keys(newPriceErrors[monthKey]).length === 0)
                        delete newPriceErrors[monthKey];
                });

                errors.price = newPriceErrors;
            }

            setError(prev => ({...prev, ...errors, price: errors.price || prev.price}));

            if (Object.keys(errors).length > 0) {
                console.log(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return null;
            }

            const data = new FormData();
            data.append('deposit', formData.deposit);
            data.append("deposit_currency", formData.deposit_currency);
            data.append("price", JSON.stringify(formData.price));
            data.append("price_currency", formData.price_currency);
            return data;
        }
    }));

    return (
        <form className="max-w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectOptions options={currencyTypeOptions} options_name={t("adminpanel.car.car_modify.edit_price_information.deopsit_currency")} onChange={(e) => setFormData(prev => ({...prev, deposit_currency: e}))} value={formData.deposit_currency}/>
            <FormInput name="deposit" label={t("adminpanel.add_car.deposit")} type="number" value={formData.deposit} onChange={(e) => {
                setError(prev => ({...prev, deposit: !/^\d+(\.\d{2})?$/.test(e.target.value) ? "Sadece istenen format: örn 1.50, 2" : ""}))
                setFormData(prev => ({...prev, deposit: e.target.value}))
            }} error={error.deposit} />
            <div className={`col-span-2`}><SelectOptions options={currencyTypeOptions} options_name={t("adminpanel.car.car_modify.edit_price_information.daily_price_currency")} onChange={(e) => setFormData(prev => ({...prev, price_currency: e}))} value={formData.price_currency}/></div>
            {error?.price && Object.values(error.price).some(err => Object.values(err).some(er => er.trim())) && (<p className="p-2 col-span-2 border-l-12 border-red-500 bg-red-200 text-red-600 font-semibold">*Değerler sadece sayı içermelidir örn: 1, 1.50</p>)}
            <div className={`col-span-2`}><CarPriceDetailForm data={formData} setData={setFormData} errors={error} setErrors={setError}/></div>
        </form>
    );
});

export default CarPricingForm;
