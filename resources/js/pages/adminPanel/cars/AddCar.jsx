import Navbar from "../../../components/adminPanel/navbar/Navbar";
import { useTranslation } from "react-i18next";
import axios from "axios";
import React, { useState, useRef } from "react";
import CarVehicleForm from "../../../components/adminPanel/car/form/CarVehicleForm.jsx";

const safeJsonParse = (str) => {
    try {
        if (!str) return {};
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (e) {
        return {};
    }
};

export default function AddCar({ carGroups = [], locations = [], languages = [] }) {
    const { t, i18n } = useTranslation();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const supportedLangs = languages.length > 0
        ? languages.map(l => ({ label: l.name, value: l.code }))
        : [{ label: "English", value: "en" }, { label: "Turkish", value: "tr" }];

    const [form, setForm] = useState({
        brand: Object.fromEntries(supportedLangs.map(l => [l.value, ""])),
        model: Object.fromEntries(supportedLangs.map(l => [l.value, ""])),
        car_group_id: carGroups?.[0]?.id ?? "",
        plate_number: "",
        exact_year: new Date().getFullYear(),
        current_location_id: locations?.[0]?.id ?? "",
        current_km: "",
        status: "available",
    });

    const topRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, key] = name.split('.');
            setForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [key]: value
                }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
        setError("");
    };

    const handleSelect = (key, val) => {
        // Handle array or single value from SelectOptions
        const value = Array.isArray(val) ? val[0] : val;
        setForm((prev) => ({ ...prev, [key]: value }));
        setError("");
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!form.car_group_id) {
            setError(t("adminpanel.add_car.select_car_group") || "Please select a car group.");
            return;
        }
        if (!form.plate_number?.trim()) {
            setError(t("adminpanel.car_group.vehicle_plate_required") || "Plate number required");
            return;
        }
        if (!form.current_location_id) {
            setError(t("adminpanel.car_group.vehicle_location_required") || "Location required");
            return;
        }

        setLoading(true);
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        const payload = {
            ...form,
            brand: JSON.stringify(form.brand),
            model: JSON.stringify(form.model),
            exact_year: parseInt(form.exact_year, 10),
            current_location_id: parseInt(form.current_location_id, 10),
            current_km: form.current_km ? parseInt(form.current_km, 10) : null,
        };

        axios
            .post(`/adminpanel/car/add`, payload, {
                headers: { "X-CSRF-TOKEN": csrfToken, "Accept": "application/json", "Content-Type": "application/json" },
            })
            .then((res) => {
                setSuccess(res.data?.message || "Vehicle added to inventory successfully.");
/*                 setForm(prev => ({
                    brand: Object.fromEntries(supportedLangs.map(l => [l.value, ""])),
                    model: Object.fromEntries(supportedLangs.map(l => [l.value, ""])),
                    car_group_id: prev.car_group_id,
                    plate_number: "",
                    exact_year: new Date().getFullYear(),
                    current_location_id: prev.current_location_id,
                    current_km: "",
                    status: "available",
                })); */
                setTimeout(() => setSuccess(""), 10000);
                if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
            })
            .catch((err) => {
                const msg = err.response?.data?.errors
                    ? Object.values(err.response.data.errors).flat().join(" ")
                    : err.response?.data?.message || err.message;
                setError(msg);
                if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
            })
            .finally(() => setLoading(false));
    };

    const groupOptions = carGroups.map((g) => {
        const parsedName = safeJsonParse(g.name);
        return {
            label: parsedName?.[i18n.language] || `Group #${g.id}`,
            value: g.id
        };
    });

    return (
        <div className="w-full">
            <Navbar>
                <div className="p-4">
                    <h3 ref={topRef} className="text-xl font-bold">{t("adminpanel.add_car.add_car")}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {t("adminpanel.add_car.add_car")}
                    </p>
                    <hr className="my-4" />

                    {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">{success}</div>}
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">{error}</div>}

                    <div className="w-full shadow-lg p-6 rounded-xl bg-white border border-gray-200">
                        <form onSubmit={onSubmit} className="space-y-4">
                            <CarVehicleForm
                                form={form}
                                onChange={handleChange}
                                onSelect={handleSelect}
                                locations={locations}
                                carGroupOptions={groupOptions}
                                languages={languages}
                                showBrandModel={true}
                            />

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {loading && (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    { t("adminpanel.add_car.save")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Navbar>
            <div className="w-full h-12" />
        </div>
    );
}
