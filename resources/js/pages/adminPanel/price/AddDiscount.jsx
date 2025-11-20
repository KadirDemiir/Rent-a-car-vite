import {useState} from "react";
import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import "react-datepicker/dist/react-datepicker.css";
import DiscountForm from "../../../components/adminPanel/price/DiscountForm.jsx";
import axios from "axios";
import {useTranslation} from "react-i18next";
import {createEmptyDiscount} from "../../../components/adminPanel/price/discountHelpers.js";

export default function AddDiscounts({success, errors, segments, currencies}) {
    const {t} = useTranslation();
    const [selectedDiscount, setSelectedDiscount] = useState("segment");
    const defaultCurrencyId = currencies?.find(curr => curr.is_default)?.id ?? currencies?.[0]?.id ?? "";
    const [dayDiscount, setDayDiscount] = useState(() => [createEmptyDiscount(defaultCurrencyId)]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
    const [segmentId, setSegmentId] = useState(segments[0].id || "");
    const [error, setError] = useState("");
    const [serverSuccess, setServerSuccess] = useState(success || "");
    const [serverError, setServerError] = useState(errors ? Object.values(errors).join("\n") : "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setError("");
        setServerError("");
        setServerSuccess("");

        if (!selectedDiscount) {
            setError(t("adminpanel.pricing.add_discount.validation.select_discount_option"));
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (selectedDiscount === "segment" && !segmentId) {
            setError(t("adminpanel.pricing.add_discount.validation.select_segment"));
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const updatedDiscounts = dayDiscount.map(dd => {
            const { min_day, max_day, discount_amount } = dd;
            const newDD = { ...dd, day_error: "", amount_error: "" };
            const allEmpty = !min_day && !max_day && !discount_amount;
            if (allEmpty) return newDD;
            const isNumeric = (value) => /^\d+$/.test(value);
            if (!min_day) {
                newDD.day_error = t("adminpanel.pricing.add_discount.validation.min_day_required");
            } else if (!isNumeric(min_day)) {
                newDD.day_error = t("adminpanel.pricing.add_discount.validation.days_numeric");
            }
            if (!max_day) {
                const message = t("adminpanel.pricing.add_discount.validation.max_day_required");
                newDD.day_error = newDD.day_error ? `${newDD.day_error}\n${message}` : message;
            } else if (!isNumeric(max_day)) {
                const message = t("adminpanel.pricing.add_discount.validation.days_numeric");
                newDD.day_error = newDD.day_error ? `${newDD.day_error}\n${message}` : message;
            }
            if (!discount_amount) newDD.amount_error = t("adminpanel.pricing.add_discount.validation.amount_required");
            return newDD;
        });

        const validDiscounts = updatedDiscounts.filter(dd => dd.min_day || dd.max_day || dd.discount_amount);
        const hasError = validDiscounts.some(dd => dd.day_error || dd.amount_error);
        setDayDiscount(updatedDiscounts);

        if (hasError || validDiscounts.length === 0) {
            setError(t("adminpanel.pricing.add_discount.validation.fix_discount_rows"));
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const data = new FormData();
        data.append("selectedDiscount", selectedDiscount);
        if (selectedDiscount === "segment") {
            data.append("discountTarget", segmentId);
        }
        data.append("dayDiscount", JSON.stringify(validDiscounts));
        data.append("startDate", startDate.toISOString().split("T")[0]);
        data.append("endDate", endDate.toISOString().split("T")[0]);

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        setIsSubmitting(true);

        try {
            const response = await axios.post("/adminpanel/discount/add", data, {
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "X-Requested-With": "XMLHttpRequest",
                    Accept: "application/json"
                }
            });
            setServerSuccess(response.data?.success || t("adminpanel.pricing.add_discount.messages.success"));
            setDayDiscount([createEmptyDiscount(defaultCurrencyId)]);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                t("adminpanel.pricing.add_discount.messages.generic_error");

            if (err.response?.status === 422 && err.response.data?.errors) {
                setServerError(Object.values(err.response.data.errors).flat().join("\n"));
            } else {
                setServerError(message);
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const FeedbackMessage = ({ type, children }) => (
        <div
            className={`mb-4 border-l-4 p-4 ${
                type === "success"
                    ? "border-green-500 bg-green-100 text-green-700"
                    : "border-red-500 bg-red-100 text-red-700"
            }`}
        >
            {children}
        </div>
    );

    return (
        <div className="w-full min-h-[600px]">
            <Navbar>
                <div className="rounded-md border border-gray-200 p-4 shadow-md">
                    <h3 className="text-2xl font-extrabold">
                        {t("adminpanel.pricing.add_discount.add_discount")}
                    </h3>
                    <hr className="my-6" />

                    {serverSuccess && <FeedbackMessage type="success">{serverSuccess}</FeedbackMessage>}
                    {serverError && <FeedbackMessage type="error">{serverError}</FeedbackMessage>}
                    {error && <FeedbackMessage type="error">{error}</FeedbackMessage>}

                    <DiscountForm currencies={currencies} selectedDiscount={selectedDiscount} setSelectedDiscount={setSelectedDiscount} dayDiscount={dayDiscount} setDayDiscount={setDayDiscount} segmentId={segmentId} setSegmentId={setSegmentId} segments={segments} defaultCurrencyId={defaultCurrencyId} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}/>

                    <div className="mt-4 flex items-center justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-48 rounded-md bg-blue-500 py-2 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {isSubmitting
                                ? t("adminpanel.pricing.add_discount.saving")
                                : t("adminpanel.pricing.add_discount.save")}
                        </button>
                    </div>
                </div>
            </Navbar>
        </div>
    );
}
