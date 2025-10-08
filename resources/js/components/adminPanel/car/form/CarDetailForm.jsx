import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import FormInput from "./FormInput.jsx";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import { useTranslation } from "react-i18next";
import axios from "axios";


const CarDetailsForm = forwardRef(({ car = {}, onSubmit }, ref) => {
    const { i18n, t } = useTranslation();
    const [segments, setSegments] = useState([]);
    const [bodyTypes, setBodyTypes] = useState([]);
    const [fuels, setFuels] = useState([]);
    const [transmissions, setTransmissions] = useState([]);
    const [formData, setFormData] = useState({license_plate: "", brand: {}, model: {}, year: "", seat_count: "", trunk_capacity: "", segment: "", bodyType: "", fuelType: "", transmissionType: "", ...car,});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentLang, setCurrentLang] = useState(i18n.language);
    const [supportedLanguage, setSuppportedLanguage] = useState("");

    const formDataRef = useRef({license_plate: "", brand: {}, model: {}, year: "", seat_count: "", trunk_capacity: "", segment: "", bodyType: "", fuelType: "", transmissionType: "", ...car,});

    useEffect(() => {
        axios.get("/adminpanel/get-all-cars-info")
            .then(res => {
                setSuppportedLanguage(res.data.languages.map(lng => ({
                    label: lng.name,
                    value: lng.code
                })));
                setSegments(res.data.segments);
                setBodyTypes(res.data.bodyTypes);
                setFuels(res.data.fuels);
                setTransmissions(res.data.transmissions);
                const updatedData = {
                    ...formDataRef.current,
                    segment: car?.segment ?? res.data.segments[0]?.id ?? "",
                    bodyType: car?.bodyType ?? res.data.bodyTypes[0]?.id ?? "",
                    fuelType: car?.fuelType ?? res.data.fuels[0]?.id ?? "",
                    transmissionType: car?.transmissionType ?? res.data.transmissions[0]?.id ?? "",
                    brand: res.data.languages ? res.data.languages.reduce((acc, lng) => {
                        acc[lng.code] = "";
                        return acc;
                    }, {}) : "",
                    model: res.data.languages ? res.data.languages.reduce((acc, lng) => {
                        acc[lng.code] = "";
                        return acc;
                    }, {}) : ""
                };
                setFormData(updatedData);
                formDataRef.current = updatedData;
                setLoading(false);
            })
            .catch(err => {
                setError(err.response?.data?.error || { general: "Veriler yüklenirken hata oluştu" });
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["year", "seat_count", "trunk_capacity"].includes(name) && /[^0-9]/.test(value)) {
            setError(prev => ({ ...prev, [name]: "Sadece sayı girilebilir" }));
            return;
        }
        setError(prev => {
            const copy = { ...prev };
            delete copy[name];
            return copy;
        });

        if (name.includes(".")) {
            const [mainName, lang] = name.split(".");

            setFormData(prev => {
                const updated = {
                    ...prev,
                    [mainName]: {
                        ...prev[mainName],
                        [lang]: value
                    }
                };
                formDataRef.current = updated;
                return updated;
            });
        } else {
            setFormData(prev => {
                const updated = {
                    ...prev,
                    [name]: value
                };
                formDataRef.current = updated;
                return updated;
            });
        }
    };


    const handleSelectChange = (field, value) => {
        setError(prev => {
            const copy = { ...prev };
            delete copy[field];
            return copy;
        });

        const updatedData = { ...formData, [field]: value };
        setFormData(updatedData);
        formDataRef.current = updatedData;
    };

    const handleSubmit = () => {
        const currentData = formDataRef.current;
        const newErrors = {};

        if (!currentData.license_plate) newErrors.license_plate = "Araç plakası gerekli";
        if (!currentData.year) newErrors.year = "Model yılı gerekli";
        if (!currentData.brand) newErrors.brand = "Marka gerekli";
        if (!currentData.model) newErrors.model = "Model gerekli";
        if (!currentData.seat_count) newErrors.seat_count = "Koltuk sayısı gerekli";
        if (!currentData.trunk_capacity) newErrors.trunk_capacity = "Bagaj kapasitesi gerekli";

        setError(newErrors);
        if (Object.keys(newErrors).length > 0) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return null;
        }

        const data = new FormData();
        data.append("license_plate", currentData.license_plate);
        data.append("brand", currentData.brand);
        data.append("model", currentData.model);
        data.append("year", currentData.year);
        data.append("seat_count", currentData.seat_count);
        data.append("trunk_capacity", currentData.trunk_capacity);
        data.append("segment", currentData.segment);
        data.append("body_type", currentData.bodyType);
        data.append("fuel_type", currentData.fuelType);
        data.append("transmission_type", currentData.transmissionType);

        return data;
    };

    useImperativeHandle(ref, () => ({
        submit: handleSubmit
    }));
    const progress = () => {
        const isBrandObject = formData.brand && typeof formData.brand === 'object';
        const isModelObject = formData.model && typeof formData.model === 'object';

        if (!isBrandObject && !isModelObject) return 0;

        const brandValues = isBrandObject ? Object.values(formData.brand) : [];
        const modelValues = isModelObject ? Object.values(formData.model) : [];

        const totalFields = brandValues.length + modelValues.length;
        if (totalFields === 0) return 0;

        const filledBrands = brandValues.filter(val => val?.trim() !== "").length;
        const filledModels = modelValues.filter(val => val?.trim() !== "").length;

        return Math.round(((filledBrands + filledModels) / totalFields) * 100);
    }

    if (loading) return <div>Yükleniyor...</div>;
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
            <div className={`col-span-2 flex items-center justify-center`}>
                <div className="flex flex-col itmes-center justify-between gap-2 mb-4 md:w-[30%]">
                    <SelectOptions options={supportedLanguage} onChange={(e) => setCurrentLang(e)} value={currentLang} options_name={t("adminpanel.pricing.add_campaign.select_language")} />
                    <div className={`w-full h-2 flex`}>
                        <div className="bg-green-500 transition-all duration-300" style={{ width: `${progress()}%` }}/>
                        <div className="bg-red-300 transition-all duration-300" style={{ width: `${(100 - progress())}%` }}/>
                    </div>
                </div>
            </div>
            <FormInput name={`brand.${currentLang}`} label={t("adminpanel.car.car_modify.edit_car_information.brand")} value={formData.brand[currentLang]} onChange={handleChange} error={error.brand} />
            <FormInput name={`model.${currentLang}`} label={t("adminpanel.car.car_modify.edit_car_information.model")} value={formData.model[currentLang]} onChange={handleChange} error={error.model} />
            <FormInput name="license_plate" label={t("adminpanel.car.car_modify.edit_car_information.license_plate")} value={formData.license_plate} onChange={handleChange} error={error.license_plate} />
            <FormInput name="year" label={t("adminpanel.car.car_modify.edit_car_information.year")} type="number" value={formData.year} onChange={handleChange} error={error.year} />
            <FormInput name="seat_count" label={t("adminpanel.car.car_modify.edit_car_information.seat_count")} type="number" value={formData.seat_count} onChange={handleChange} error={error.seat_count} />
            <FormInput name="trunk_capacity" label={t("adminpanel.car.car_modify.edit_car_information.trunk_capacity")} type="number" value={formData.trunk_capacity} onChange={handleChange} error={error.trunk_capacity} />

            <SelectOptions options={segments.map(s => ({ label: t(s.translation_key.key), value: s.id }))} options_name={t("adminpanel.car.car_modify.edit_car_information.segment")} onChange={(e) => handleSelectChange("segment", e)} value={[formData.segment]}/>
            <SelectOptions options={bodyTypes.map(bt => ({ label: t(bt.translation_key.key), value: bt.id }))} options_name={t("adminpanel.car.car_modify.edit_car_information.body_type")} onChange={(e) => handleSelectChange("bodyType", e)} value={[formData.bodyType]}/>
            <SelectOptions options={fuels.map(f => ({ label: t(f.translation_key.key), value: f.id }))} options_name={t("adminpanel.car.car_modify.edit_car_information.fuel_type")} onChange={(e) => handleSelectChange("fuelType", e)} value={[formData.fuelType]}/>
            <SelectOptions options={transmissions.map(tm => ({ label: t(tm.translation_key.key), value: tm.id }))} options_name={t("adminpanel.car.car_modify.edit_car_information.transmission_type")} onChange={(e) => handleSelectChange("transmissionType", e)} value={[formData.transmissionType]}/>
        </form>
    );
});

export default CarDetailsForm;
