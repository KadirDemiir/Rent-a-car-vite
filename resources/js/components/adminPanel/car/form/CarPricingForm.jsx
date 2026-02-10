import React, {useState, forwardRef, useImperativeHandle, useEffect} from "react";
import { useTranslation } from "react-i18next";
import CarPriceDetailForm from "./CarPriceDetailForm.jsx";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import { useCurrency } from "../../../../providers/CurrencyContext.jsx";
import FormInput from "./FormInput.jsx";

const CarPricingForm = forwardRef(({ car = {}, onSubmit, ddopen = false }, ref) => {
    const { t } = useTranslation();
    const { currencies, calculateTotal } = useCurrency();
    const days = ["1-3", "4-6", "7-13", "14-20", "21-27", "28+"];
    const [currencyTypeOptions, setCurrencyTypeOptions] = useState(currencies);

    const [formData, setFormData] = useState(() => {
        const prices = {};
        for (let m = 1; m <= 12; m++) prices[m] = {};

        if (car?.price && Array.isArray(car.price)) {
            car.price.forEach(prc => {
                const months = prc.month ? [prc.month] : Array.from({ length: 12 }, (_, i) => i + 1);
                months.forEach(m => {
                    const key = `${prc.min_days}-${prc.max_days}`;
                    prices[m][key] = prc.price;
                });
            });
        } else {
            for (let m = 1; m <= 12; m++) days.forEach(d => (prices[m][d] = ""));
        }

        return {
            deposit: car?.deposit ?? "",
            price: prices,
            currency: car?.currency_id ?? "",
        };
    });

    const [error, setError] = useState(() => {
        const prices = {};
        for (let m = 1; m <= 12; m++) {
            prices[m] = {};
            days.forEach(d => (prices[m][d] = ""));
        }
        return { deposit: "", price: prices, currency: "" };
    });

    useEffect(() => {
        setCurrencyTypeOptions(currencies);
    }, [currencies]);

    useImperativeHandle(ref, () => ({
        submit: () => {
            const errs = {};
            if (!formData.deposit) errs.deposit = t("adminpanel.error.deposit_required");

            const hasEmptyPrice = Object.values(formData.price).some(p =>
                Object.values(p).some(v => !v?.toString().trim())
            );

            if (hasEmptyPrice) {
                const newPriceErrs = {};
                Object.entries(formData.price).forEach(([monthKey, monthPrices]) => {
                    newPriceErrs[monthKey] = {};
                    Object.entries(monthPrices).forEach(([dayKey, priceValue]) => {
                        if (!priceValue?.toString().trim())
                            newPriceErrs[monthKey][dayKey] = "Boş olamaz";
                    });
                });
                errs.price = newPriceErrs;
            }

            setError(prev => ({ ...prev, ...errs, price: errs.price || prev.price }));

            if (Object.keys(errs).length > 0) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return null;
            }

            const fd = new FormData();
            fd.append("deposit", formData.deposit);
            fd.append("price", JSON.stringify(formData.price));
            fd.append("currency", 1);
            return fd;
        },
    }));



    return (
        <form className="max-w-full grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={e => e.preventDefault()}>
            <div className="col-span-1 md:col-span-2">
                <SelectOptions
                    options={currencyTypeOptions?.map(c => ({label: c.code, value: c.id}))}
                    options_name={t("adminpanel.car.car_modify.edit_price_information.daily_price_currency")}
                    onChange={e => setFormData(p => ({ ...p, currency: e }))}
                    value={formData.currency ? [formData.currency] : currencyTypeOptions?.[0]?.id ? [currencyTypeOptions?.[0]?.id] : "" }
                />
            </div>
            <div className={`col-span-1 md:col-span-2`}>
                <FormInput name="deposit" label={t("adminpanel.add_car.deposit")} type="number" value={formData.deposit}
                           onChange={e => {
                               setError(p => ({
                                   ...p,
                                   deposit: !/^\d+(\.\d{2})?$/.test(e.target.value) ? "Sadece istenen format: örn 1.50, 2" : "",
                               }));
                               setFormData(p => ({...p, deposit: e.target.value}));
                           }}
                           error={error.deposit}
                />
            </div>

            {error?.price && Object.values(error.price).some(m => Object.values(m).some(v => v)) && (
                <p className="p-2 col-span-2 border-l-8 border-red-500 bg-red-100 text-red-600 font-semibold">
                    * {t("adminpanel.error.invalid_price_format")}
                </p>
            )}

            <div className="col-span-1 md:col-span-2">
                <CarPriceDetailForm data={formData} setData={setFormData} errors={error} setErrors={setError}/>
            </div>
        </form>
    );
});

export default CarPricingForm;
