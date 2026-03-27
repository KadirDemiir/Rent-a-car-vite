import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CarPriceDetailForm from "./CarPriceDetailForm.jsx";
import FormInput from "./FormInput.jsx";

const DEFAULT_DAYS = ["1-3", "4-7", "8-14", "15-21", "22-28", "29+"];

const prepareFormData = (car) => {
    let daysToUse = [];

    if (car?.price && Array.isArray(car.price) && car.price.length > 0) {
        const extractedKeys = new Set();
        car.price.forEach(prc => {
            const key = prc.max_days
                ? `${prc.min_days}-${prc.max_days}`
                : `${prc.min_days}+`;
            extractedKeys.add(key);
        });

        daysToUse = Array.from(extractedKeys).sort((a, b) => {
            const minA = parseInt(a.split('-')[0].replace('+', ''));
            const minB = parseInt(b.split('-')[0].replace('+', ''));
            return minA - minB;
        });
    }

    if (daysToUse.length === 0) {
        daysToUse = [...DEFAULT_DAYS];
    }

    const prices = {};

    for (let m = 1; m <= 12; m++) {
        prices[m] = {};
        daysToUse.forEach(d => (prices[m][d] = ""));
    }

    if (car?.price && Array.isArray(car.price)) {
        car.price.forEach(prc => {
            const key = prc.max_days
                ? `${prc.min_days}-${prc.max_days}`
                : `${prc.min_days}+`;

            const months = prc.month ? [prc.month] : Array.from({ length: 12 }, (_, i) => i + 1);

            months.forEach(m => {
                if (prices[m] && prices[m].hasOwnProperty(key)) {
                    prices[m][key] = prc.price;
                }
            });
        });
    }

    return {
        deposit: car?.deposit ?? "",
        online_discount: (car?.online_discount ?? 0) * 100,
        price: prices,
    };
};

const CarPricingForm = forwardRef(({ car = {}, onSubmit, ddopen = false }, ref) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState(() => prepareFormData(car));

    const [error, setError] = useState({});

    useEffect(() => {
        if (car && Object.keys(car).length > 0) {
            setFormData(prepareFormData(car));
        }
    }, [car]);

    useImperativeHandle(ref, () => ({
        submit: () => {
            const errs = {};
            if (!formData.deposit) errs.deposit = t("adminpanel.error.deposit_required");

            let hasPriceError = false;

            if (error?.price && Object.values(error.price).some(m => Object.values(m).some(v => v))) {
                hasPriceError = true;
            }

            if (hasPriceError) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return null;
            }

            if (errs.deposit) {
                setError(prev => ({...prev, ...errs}));
                return null;
            }

            const fd = new FormData();
            fd.append("deposit", formData.deposit);
            fd.append("online_discount", formData.online_discount);
            fd.append("price", JSON.stringify(formData.price));
            return fd;
        },
    }), [formData, error, t]);

    return (
        <form className="max-w-full grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={e => e.preventDefault()}>
            <div className={`col-span-1`}>
                <FormInput
                    name="deposit"
                    label={t("adminpanel.add_car.deposit")}
                    type="number"
                    value={formData.deposit}
                    onChange={e => {
                        const val = e.target.value;
                        setFormData(p => ({ ...p, deposit: val }));
                    }}
                    error={error.deposit}
                />
            </div>

            <div className={`col-span-1`}>
                <FormInput
                    name="online_discount"
                    label={t("adminpanel.add_car.online_discount") || "Online İndirim (%)"}
                    type="number"
                    min="0"
                    max="100"
                    value={formData.online_discount.toFixed(2)}
                    onChange={e => {
                        let val = parseFloat(e.target.value) || 0;
                        if (val < 0) val = 0;
                        if (val > 100) val = 100;
                        setFormData(p => ({ ...p, online_discount: val.toFixed(2) }));
                    }}
                    error={error.online_discount}
                />
            </div>

            <div className="col-span-1 md:col-span-2">
                <CarPriceDetailForm
                    data={formData}
                    setData={setFormData}
                    errors={error}
                    setErrors={setError}
                />
            </div>
        </form>
    );
});

export default CarPricingForm;
