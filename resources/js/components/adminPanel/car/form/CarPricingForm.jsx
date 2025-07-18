import React, { useState, forwardRef, useImperativeHandle } from "react";
import FormInput from "./FormInput.jsx";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import DailyDiscountAmount from "../../price/DailyDiscountAmount.jsx";
import DateTimePickerComp from "../../price/DateTimePickerComp.jsx";

const currencyTypeOptions = [
    { label: "TL", value: "try" },
    { label: "Euro", value: "eur" },
];

const CarPricingForm = forwardRef(({ car = {}, onSubmit, ddopen=false}, ref) => {
    const [formData, setFormData] = useState({
        deposit: "",
        deposit_currency: "try",
        price: "",
        price_currency: "try",
        ...car,
    });

    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [error, setError] = useState({});
    const [dayDiscount, setDayDiscount] = useState([
        { min_day: "", max_day: "", discount_type: "fixed", currency: "try", discount_amount: "", day_error: "", amount_error: "" }
    ]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(() => {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay;
    });

    // useImperativeHandle ile submit fonksiyonunu dışa açıyoruz
    useImperativeHandle(ref, () => ({
        submit: () => {
            const errors = {};
            if (!formData.deposit) errors.deposit = "Depozito gerekli";
            if (!formData.price) errors.price = "Fiyat gerekli";

            const updatedDiscounts = dayDiscount.map(dd => {
                const { min_day, max_day, discount_amount } = dd;
                const allEmpty = !min_day && !max_day && !discount_amount;
                return allEmpty ? dd : {
                    ...dd,
                    day_error: (!min_day ? "Minimum gün boş olamaz." : "") + (!max_day ? (min_day ? "" : "\n") + "Maksimum gün boş olamaz." : ""),
                    amount_error: !discount_amount ? "İndirim tutarı boş olamaz." : ""
                };
            });

            const validDiscounts = updatedDiscounts.filter(dd => dd.min_day || dd.max_day || dd.discount_amount);
            const hasDiscountError = validDiscounts.some(dd => dd.day_error || dd.amount_error);

            if ((hasDiscountError || validDiscounts.length === 0) && isDiscountOpen) {
                setDayDiscount(updatedDiscounts);
                errors.discount_error = "Lütfen indirim alanlarını düzeltin";
            }

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
            data.append("hasDiscount", isDiscountOpen ? 1 : 0);
            data.append("dayDiscount", JSON.stringify(validDiscounts));
            data.append("start_date", startDate.toISOString().split("T")[0]);
            data.append("end_date", endDate.toISOString().split("T")[0]);
            return data;
        }
    }));

    const handleChange = (e) => {
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
            <SelectOptions options={currencyTypeOptions} options_name="Depozito Para Birimi" onChange={(e) => setFormData(prev => ({...prev, deposit_currency: e}))} value={formData.deposit_currency} />
            <FormInput name="deposit" label="Depozito" type="number" value={formData.deposit} onChange={handleChange} error={error.deposit} />
            <SelectOptions options={currencyTypeOptions} options_name="Fiyat Para Birimi" onChange={(e) => setFormData(prev => ({...prev, price_currency: e}))} value={formData.price_currency} />
            <FormInput name="price" label="Günlük Ücret" type="number" value={formData.price} onChange={handleChange} error={error.price} />

            {ddopen && <div className="md:col-span-2">
                <button type="button" onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                        className={`mt-2 mb-4 h-10 px-4 ${!isDiscountOpen ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} rounded-xl text-white`}>
                    {isDiscountOpen ? "İndirimi Kapat" : "İndirim Ekle"}
                </button>
            </div>}

            {isDiscountOpen && (
                <div className="md:col-span-2">
                    <DailyDiscountAmount dayDiscount={dayDiscount} setDayDiscount={(e) => setDayDiscount(e)} />
                    <div className="flex gap-4 justify-center py-4">
                        <DateTimePickerComp startDate={startDate} onchange={(e) => setStartDate(e)} />
                        <DateTimePickerComp startDate={endDate} onchange={(e) => setEndDate(e)} start={false} />
                    </div>
                </div>
            )}
        </form>
    );
});

export default CarPricingForm;
