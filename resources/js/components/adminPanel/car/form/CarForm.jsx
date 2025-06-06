import React, { useState, useEffect } from "react";
import FormInput from "./FormInput.jsx";
import FormSelect from "./FormSelect.jsx";
import FileInput from "./FileInput.jsx";

export default function CarForm({ onSubmit, car = null, mode = "create" }) {

    const [formData, setFormData] = useState({car});
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState({});

    const showPhoto = mode === "create";
    const showPricing = mode === "create" || mode === "pricing";
    const showDetails = mode === "create" || mode === "edit";

    useEffect(() => {
        if (car && mode !== "create") {
            setFormData({ ...car });
        }
    }, [car, mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const isNumericField = [
            "year", "seat_count", "trunk_capacity",
            "dailyPrice", "monthlyPrice", "weeklyPrice", "deposit"
        ].includes(name);

        if (isNumericField && /[^0-9]/.test(value)) {
            setError(prev => ({ ...prev, [name]: "Sadece sayı girilebilir" }));
        } else {
            setError(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Object.keys(error).length > 0) return;

        const data = {};

        if (showDetails) {
            [
                "license_plate", "year", "brand", "model",
                "seat_count", "trunk_capacity", "segment",
                "body_type", "fuel_type", "transmission_type"
            ].forEach(key => data[key] = formData[key]);
        }

        if (showPricing) {
            [
                "dailyPrice", "weeklyPrice", "monthlyPrice", "deposit"
            ].forEach(key => data[key] = formData[key]);
        }

        if (showPhoto && photo) {
            data.photo = photo;
        }

        onSubmit(data);
    };

    const segmentOptions = ["economy", "compact", "midrange", "suv", "premium", "minivan"];
    const bodyTypeOptions = ["hatchback", "sedan", "suv", "station", "coupe", "convertible", "minivan", "pickup"];
    const fuelOptions = ["benzin", "dizel", "elektrik", "hibrit"];
    const transmissionOptions = ["manuel", "otomatik"];

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
            {showDetails && (
                <>
                    <FormInput name="license_plate" label="Araç Plakası" value={formData.license_plate || ""} onChange={handleChange} error={error.license_plate} />
                    <FormInput name="year" label="Model Yılı" type="number" value={formData.year || ""} onChange={handleChange} error={error.year} />
                    <FormInput name="brand" label="Marka" value={formData.brand || ""} onChange={handleChange} error={error.brand} />
                    <FormInput name="model" label="Model" value={formData.model || ""} onChange={handleChange} error={error.model} />
                    <FormInput name="seat_count" label="Koltuk Sayısı" type="number" value={formData.seat_count || ""} onChange={handleChange} error={error.seat_count} />
                    <FormInput name="trunk_capacity" label="Bagaj Kapasitesi" type="number" value={formData.trunk_capacity || ""} onChange={handleChange} error={error.trunk_capacity} />
                    <FormSelect name="segment" label="Segment" value={formData.segment || ""} onChange={handleChange} options={segmentOptions} />
                    <FormSelect name="body_type" label="Kasa Tipi" value={formData.body_type || ""} onChange={handleChange} options={bodyTypeOptions} />
                    <FormSelect name="fuel_type" label="Yakıt Türü" value={formData.fuel_type || ""} onChange={handleChange} options={fuelOptions} />
                    <FormSelect name="transmission_type" label="Vites Türü" value={formData.transmission_type || ""} onChange={handleChange} options={transmissionOptions} />
                </>
            )}

            {showPhoto && (
                <div className="md:col-span-2">
                    <FileInput label="Araç Fotoğrafı" onChange={handlePhotoChange} />
                </div>
            )}

            {showPricing && (
                <>
                    <FormInput type="number" name="dailyPrice" label="Günlük Fiyat" onChange={handleChange} value={formData.dailyPrice || ""} error={error.dailyPrice} />
                    <FormInput name="weeklyPrice" label="Haftalık Fiyat" onChange={handleChange} value={formData.weeklyPrice || ""} error={error.weeklyPrice} />
                    <FormInput name="monthlyPrice" label="Aylık Fiyat" onChange={handleChange} value={formData.monthlyPrice || ""} error={error.monthlyPrice} />
                    <FormInput name="deposit" label="Depozito" onChange={handleChange} value={formData.deposit || ""} error={error.deposit} />
                </>
            )}

            <div className="md:col-span-2 pt-4">
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
                >
                    {mode === "edit" ? "Güncelle" : "Kaydet"}
                </button>
            </div>
        </form>
    );
}
