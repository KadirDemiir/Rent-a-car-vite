import React, { useState, forwardRef, useImperativeHandle } from "react";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import {useTranslation} from "react-i18next";
import CarPriceDetailForm from "./CarPriceDetailForm.jsx";

const days = ['1-3', '4-6', '7-13', '14-20', '21-27', '28+'];
const currencyTypeOptions = [{ label: "TL", value: "try" }, { label: "Euro", value: "eur" },];

const CarPricingForm = forwardRef(({ car = {}, onSubmit, ddopen=false}, ref) => {
    const {t} = useTranslation();
    const [formData, setFormData] = useState(() => {
        const prices = {};
        for (let month = 1; month <= 12; month++) {
            days.forEach(day => {
                prices[`${month}-${day}`] = "";
            });
        }
        return {deposit: "", deposit_currency: "try", price: prices, price_currency: "try", ...car,};
    });


    const [error, setError] = useState({});

    // useImperativeHandle ile submit fonksiyonunu dışa açıyoruz
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

    const handleChange = (e) => {
        console.log(formData);
        const { name, value } = e.target;
        if (["deposit", "price"].includes(name) && /[^0-9]/.test(value)) {
            setError(prev => ({ ...prev, [name]: "Sadece sayı girilebilir" }));
        } else {
            setError(prev => {
                const copy = { ...prev };
                delete copy[name];
                return copy;
            });
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(error).length > 0 && (
                <div className="col-span-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        {Object.entries(error).map(([field, msg]) => (
                            <li key={field}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}
            <SelectOptions options={currencyTypeOptions} options_name={t("adminpanel.car.car_modify.edit_price_information.deopsit_currency")} onChange={(e) => setFormData(prev => ({...prev, deposit_currency: e}))} value={formData.deposit_currency} />
            {/*<FormInput name="deposit" label={t("adminpanel.car.car_modify.edit_price_information.deposit")} type="number" value={formData.deposit} onChange={handleChange} error={error.deposit} />*/}
            <SelectOptions options={currencyTypeOptions} options_name={t("adminpanel.car.car_modify.edit_price_information.daily_price_currency")} onChange={(e) => setFormData(prev => ({...prev, price_currency: e}))} value={formData.price_currency} />
            {/*<FormInput name="price" label={t("adminpanel.car.car_modify.edit_price_information.daily_price")} type="number" value={formData.price} onChange={handleChange} error={error.price} />*/}
            <div className={`col-span-2`}>
                <CarPriceDetailForm data={formData} setData={setFormData} error={error} setError={setError}/>
            </div>
        </form>
    );
});

export default CarPricingForm;
