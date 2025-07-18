import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";
import { useState } from "react";

export default function DailyDiscountAmount({ dayDiscount, setDayDiscount }) {
    console.log(dayDiscount);

    const ddtOnChange = (value, i, type) => {
        const updated = [...dayDiscount];
        const item = updated[i];
        updated[i] = { ...item, [type]: value };
        if (type === "discount_type") {
            const amount = item.discount_amount;
            let error = "";
            if (value === "percentage" && Number(amount) > 100) error = "En Fazla %100 İndirim Seçebilirisniz!";
            else if (amount && !/^\d+$/.test(amount)) error = "İndirim Değerleri Yalnızca Rakamlardan Oluşabilir";
            updated[i].amount_error = error;
        }
        setDayDiscount(updated);
    };

    const dayInputOnchange = (minVal, maxVal, i, type) => {
        let error = "";
        const min = Number(minVal);
        const max = Number(maxVal);
        const updated = [...dayDiscount];
        if (minVal && maxVal && (max - min < 1)) error += "İndirim Süresi En Az Bir GÜn Olmalıdır!\n";
        const intersection = dayDiscount.every((dd, index) => {
            if (index === i) return true;
            const a_start = Number(dd.min_day);
            const a_end = Number(dd.max_day);
            return ((a_start < min && min > a_end) || (a_start > max && a_start > max));
        });
        if (!intersection) error += "Girdiğiniz Gün Aralığı Farklı Gün Aralıklarıyla Kesişiyor!\n";
        if ((minVal && !/^\d+$/.test(min)) || (maxVal && !/^\d+$/.test(max))) error = "Gün Değerleri Yalnzıca Rakamlardan Oluşabilir\n";
        updated[i] = { ...updated[i], [type]: type === "min_day" ? minVal : maxVal, day_error: error };
        setDayDiscount(updated);
    };

    const discountAmountOnChange = (amount, i, ddtype, type) => {
        let error = "";
        if (ddtype === "percentage") error = amount > 100 ? "En Fazla %100 İndirim Seçebilirisniz!" : "";
        if ((amount && !/^\d+$/.test(amount))) error = "İndirim Değerleri Yalnzıca Rakamlardan Oluşabilir\n";
        const updated = [...dayDiscount];
        updated[i] = { ...updated[i], [type]: amount, amount_error: error };
        setDayDiscount(updated);
    };

    const currencyOnChange = (e, i) => {
        const updated = [...dayDiscount];
        updated[i] = { ...updated[i], currency: e };
        setDayDiscount(updated);
    };

    const createNewddt = () => {
        setDayDiscount([...dayDiscount, {min_day: "", max_day: "", discount_type: "fixed", discount_currency: "", discount_amount: "", day_error: "", amount_error: ""}]);
    };

    const removeDiscount = (i) => {
        const update = [...dayDiscount];
        update.splice(i, 1);
        setDayDiscount(update);
    };

    return (
        <div className="w-full py-4 rounded-md gap-8 ">
            <h6 className="font-bold col-span-full flex items-center justify-center">Güne Göre indirim</h6>
            <div className={`flex flex-col py-4 gap-4`}>
                {dayDiscount?.map((dd, i) => (
                    <div
                        key={i}
                        className="w-full bg-white border border-gray-200 shadow-md rounded-lg py-4"
                    >
                        {/* 👇 BURASI GÜNCELLENDİ */}
                        <div className="w-full flex flex-wrap justify-center gap-4">
                            <div className="min-w-[250px] flex flex-col items-center justify-center">
                                <div className="text-center">Minimum Gün</div>
                                <input
                                    onChange={(e) => dayInputOnchange(e.target.value, dd.max_day, i, "min_day")}
                                    type="text"
                                    className={`outline-none border ${
                                        dd.day_error ? "border-red-500" : "border-gray-300"
                                    } py-2 px-4 rounded-md bg-white shadow-sm`}
                                    placeholder="Minimum Gün"
                                    value={dd.min_day}
                                />
                            </div>
                            <div className="min-w-[250px] flex flex-col items-center justify-center">
                                <div className="text-center">Maximum Gün</div>
                                <input
                                    onChange={(e) => dayInputOnchange(dd.min_day, e.target.value, i, "max_day")}
                                    type="text"
                                    className={`outline-none border ${
                                        dd.day_error ? "border-red-500" : "border-gray-300"
                                    } py-2 px-4 rounded-md bg-white shadow-sm`}
                                    placeholder="Maximum Gün"
                                    value={dd.max_day}
                                />
                            </div>
                            <div className="min-w-[250px] flex flex-col items-center justify-center px-4">
                                <SelectOptions options={[
                                    { label: "Sabit Tutar", value: "fixed" },
                                    { label: "Yüzde İndirim", value: "percentage" }
                                ]} value={dd.discount_type} onChange={(e) => ddtOnChange(e, i, "discount_type")} options_name="İndirim Tİpi"/>
                            </div>
                            {dd.discount_type === "fixed" && (
                                <div className="min-w-[250px] flex flex-col items-center justify-center px-4">
                                    <SelectOptions options={[
                                        { label: "TL", value: "try" },
                                        { label: "Euro", value: "eur" }
                                    ]} value={dd.currency} onChange={(e) => currencyOnChange(e, i)} options_name="Para Birimi"/>
                                </div>
                            )}
                            <div className="min-w-[250px] flex flex-col items-center justify-center">
                                <div className="text-center">İndirim Tutarı</div>
                                <input
                                    onChange={(e) =>
                                        discountAmountOnChange(e.target.value, i, dd.discount_type, "discount_amount")
                                    }
                                    type="text"
                                    className={`outline-none border ${
                                        dd.amount_error ? "border-red-500" : "border-gray-300"
                                    } py-2 px-4 rounded-md bg-white shadow-sm`}
                                    placeholder="İndirim Tutarı"
                                    value={dd.discount_amount}
                                />
                            </div>
                            <div className="min-w-[250px] flex items-end justify-center">
                                <button type="button" onClick={() => removeDiscount(i)} className="text-white w-32 bg-red-500 py-2 rounded-md hover:bg-red-600 cursor-pointer">
                                    Sil
                                </button>
                            </div>
                        </div>
                        <br />
                        {dd.day_error && (
                            <div className="w-full flex justify-center text-red-500 text-sm" style={{ whiteSpace: "pre-line" }}>
                                *{dd.day_error}
                            </div>
                        )}
                        {dd.amount_error && (
                            <div className="w-full flex justify-center text-red-500 text-sm">
                                *{dd.amount_error}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="w-full flex items-center justify-center mt-4">
                <button
                    type="button"
                    onClick={createNewddt}
                    className="w-32 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer"
                >
                    Yeni Ekle
                </button>
            </div>
        </div>
    );
}
