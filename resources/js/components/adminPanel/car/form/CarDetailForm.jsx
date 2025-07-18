import React, { useState, forwardRef, useImperativeHandle } from "react";
import FormInput from "./FormInput.jsx";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";

const segmentOptions = [{ label: "Economy", value: "economy" }, { label: "Compact", value: "compact" }, { label: "Midrange", value: "midrange" }, { label: "Premium", value: "premium" }];
const bodyTypeOptions = [{ label: "Hatchback", value: "hatchback" }, { label: "Sedan", value: "sedan" }, { label: "Suv", value: "suv" }, { label: "Station", value: "station" }, { label: "Coupe", value: "coupe" }, { label: "Convertible", value: "convertible" }, { label: "Minivan", value: "minivan" }, { label: "Pickup", value: "pickup" }];
const fuelOptions = [{ label: "Benzin", value: "benzin" }, { label: "Dizel", value: "dizel" }, { label: "Elektrik", value: "elektrik" }, { label: "Hibrit", value: "hibrit" }];
const transmissionOptions = [{ label: "Manuel", value: "manuel" }, { label: "Otomatik", value: "otomatik" }];

const CarDetailsForm = forwardRef(({ car = {}, onSubmit }, ref) => {
    const [formData, setFormData] = useState({
        license_plate: "",
        brand: "",
        model: "",
        year: "",
        seat_count: "",
        trunk_capacity: "",
        segment: segmentOptions[0].value,
        bodyType: bodyTypeOptions[0].value,
        fuelType: fuelOptions[0].value,
        transmissionType: transmissionOptions[0].value,
        ...car,
    });
    const [error, setError] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["year", "seat_count", "trunk_capacity"].includes(name) && /[^0-9]/.test(value)) {
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

    const handleSubmit = () => {
        const newErrors = {};
        if (!formData.license_plate) newErrors.license_plate = "Araç plakası gerekli";
        if (!formData.year) newErrors.year = "Model yılı gerekli";
        if (!formData.brand) newErrors.brand = "Marka gerekli";
        if (!formData.model) newErrors.model = "Model gerekli";
        if (!formData.seat_count) newErrors.seat_count = "Koltuk sayısı gerekli";
        if (!formData.trunk_capacity) newErrors.trunk_capacity = "Bagaj kapasitesi gerekli";

        setError(newErrors);
        if (Object.keys(newErrors).length > 0) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return null;
        }

        const data = new FormData();
        data.append("license_plate", formData.license_plate);
        data.append("brand", formData.brand);
        data.append("model", formData.model);
        data.append("year", formData.year);
        data.append("seat_count", formData.seat_count);
        data.append("trunk_capacity", formData.trunk_capacity);
        data.append("segment", formData.segment);
        data.append("body_type", formData.bodyType);
        data.append("fuel_type", formData.fuelType);
        data.append("transmission_type", formData.transmissionType);

        return data;
    };
    useImperativeHandle(ref, () => ({
        submit: handleSubmit
    }));

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
            <FormInput name="license_plate" label="Araç Plakası" value={formData.license_plate} onChange={handleChange} error={error.license_plate} />
            <FormInput name="brand" label="Marka" value={formData.brand} onChange={handleChange} error={error.brand} />
            <FormInput name="model" label="Model" value={formData.model} onChange={handleChange} error={error.model} />
            <FormInput name="year" label="Model Yılı" type="number" value={formData.year} onChange={handleChange} error={error.year} />
            <FormInput name="seat_count" label="Koltuk Sayısı" type="number" value={formData.seat_count} onChange={handleChange} error={error.seat_count} />
            <FormInput name="trunk_capacity" label="Bagaj Kapasitesi" type="number" value={formData.trunk_capacity} onChange={handleChange} error={error.trunk_capacity} />
            <SelectOptions options={segmentOptions} options_name="Segment" onChange={(e) => setFormData(prev => ({ ...prev, segment: e }))} value={formData.segment} />
            <SelectOptions options={bodyTypeOptions} options_name="Araç Tipi" onChange={(e) => setFormData(prev => ({ ...prev, bodyType: e }))} value={formData.bodyType} />
            <SelectOptions options={fuelOptions} options_name="Yakıt Tipi" onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e }))} value={formData.fuelType} />
            <SelectOptions options={transmissionOptions} options_name="Vites Tipi" onChange={(e) => setFormData(prev => ({ ...prev, transmissionType: e }))} value={formData.transmissionType} />
        </form>
    );
});

export default CarDetailsForm;
