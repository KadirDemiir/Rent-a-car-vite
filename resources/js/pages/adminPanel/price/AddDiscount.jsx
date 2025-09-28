import { useState } from "react";
import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import "react-datepicker/dist/react-datepicker.css";
import DiscountForm from "../../../components/adminPanel/price/DiscountForm.jsx";
import {router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function AddDiscounts({success, errors}) {
    const {t} = useTranslation();
    const [selectedDiscount, setSelectedDiscount] = useState("segment");
    const [dayDiscount, setDayDiscount] = useState([
        { min_day: "", max_day: "", discount_type: "fixed", currency: "try", discount_amount: "", day_error: "", amount_error: "" }
    ]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [discountTarget, setDiscountTarget] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        setError("");

        if (!selectedDiscount) {
            setError("Lütfen İndirim Seçeneklerinden Birini Seçiniz.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (selectedDiscount === "segment" && !discountTarget) {
            setError("Lütfen Segment Seçiniz");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const updatedDiscounts = dayDiscount.map(dd => {
            const { min_day, max_day, discount_amount } = dd;
            const newDD = { ...dd };
            const allEmpty = !min_day && !max_day && !discount_amount;
            if (allEmpty) return newDD;
            if (!min_day) newDD.day_error = "Minimum gün boş olamaz.";
            if (!max_day) newDD.day_error = newDD.day_error ? newDD.day_error + "\nMaksimum gün boş olamaz." : "Maksimum gün boş olamaz.";
            if (!discount_amount) newDD.amount_error = "İndirim tutarı boş olamaz.";
            return newDD;
        });
        const validDiscounts = updatedDiscounts.filter(dd => dd.min_day || dd.max_day || dd.discount_amount);
        const hasError = validDiscounts.some(dd => dd.day_error || dd.amount_error);
        if (hasError || validDiscounts.length === 0) {
            setError("Lütfen eksik veya hatalı indirim alanlarını düzeltin.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const data = new FormData();
        data.append("selectedDiscount", selectedDiscount);
        data.append("discountTarget", discountTarget || "");
        data.append("dayDiscount", JSON.stringify(validDiscounts));
        data.append("startDate", startDate.toISOString().split("T")[0]);
        data.append("endDate", endDate.toISOString().split("T")[0]);
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        router.post("/adminpanel/discount/add", data, {
            headers: {
                csrfToken,
            },
        });
    };

    return (
        <div className="w-full h-600">
            <Navbar >
                <div className="border border-gray-300 rounded-md shadow-md p-4">
                    <h3 className="text-2xl font-extrabold">{t("adminpanel.pricing.add_discount.add_discount")}</h3>
                    <hr className="my-6" />
                    {success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                            {success}
                        </div>
                    )}
                    {errors && Object.keys(errors).length > 0 && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                            {Object.values(errors).map((err, i) => (
                                <div key={i}>{err}</div>
                            ))}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                            {error}
                        </div>
                    )}
                    <DiscountForm
                        selectedDiscount={selectedDiscount}
                        setSelectedDiscount={setSelectedDiscount}
                        dayDiscount={dayDiscount}
                        setDayDiscount={setDayDiscount}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        discountTarget={discountTarget}
                        setDiscountTarget={setDiscountTarget}
                    />
                    <div className="flex items-center justify-end mt-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 w-48 py-2 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                        >
                            {t("adminpanel.pricing.add_discount.save")}
                        </button>
                    </div>
                </div>
            </Navbar>
        </div>
    );
}
