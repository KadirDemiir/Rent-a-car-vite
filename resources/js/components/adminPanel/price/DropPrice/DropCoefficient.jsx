import DropForm from "./DropForm.jsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import axios from "axios";

export default function DropCoefficient({segments, onSuccess, onError}) {
    console.log(segments);
    const {t} = useTranslation();
    const name = segments.map(s => s.id);
    console.log(name);
    const [coeffiData, setCoeffiData] = useState({});
    const [coeffiError, setCoeffiError] = useState({});
    const [formError, setFormError] = useState();

    useEffect(() => {
        segments.forEach((s) => {
            setCoeffiData(prev => ({
                ...prev,
                [s.id]: {value: s.coefficient},
            }));
        });
    }, [segments]);

    const handleSubmitSegmentCoefficient = (e) => {
        e.preventDefault();
        setFormError("");
        if (Object.keys(coeffiError).length > 0) {
            setFormError("Lütfen Hataları Çözünüz");
            return;
        }
        const emptyFields = Object.entries(coeffiData).filter(([_, val]) => !val);
        if (emptyFields.length > 0) {
            setFormError("Lütfen tüm alanları doldurunuz.");
            return;
        }
        const data = new FormData();
        data.append("coefficients", JSON.stringify(coeffiData));
        data.append("type", "segment_coefficient");

        axios.post("/adminpanel/drop-price", data)
            .then((res) => {
                setCoeffiError({});
                if (res.data?.success) {
                    onSuccess?.("Updated Successfully.");
                }
            })
            .catch((errors) => {
                console.error("Sunucu hatası:", errors);
                const message = errors.response?.data?.error || errors.message;
                if (message) {
                    onError?.(message);
                }
            });
    };

    return (
        <section className="space-y-4">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
                <div className="space-y-2 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t("adminpanel.pricing.drop_price.vehicle_segment_coefficient.vehicle_segment_coefficient")}
                    </h3>
                </div>
                {formError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {formError}
                    </div>
                )}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <DropForm
                        handleSubmit={handleSubmitSegmentCoefficient}
                        opt={name}
                        data={coeffiData}
                        setData={setCoeffiData}
                        error={coeffiError}
                        setError={setCoeffiError}
                        minZero={false}
                    />
                </div>
            </div>
        </section>
    );
}
