import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import FormInput from "./FormInput.jsx";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import { useTranslation } from "react-i18next";
import axios from "axios";

const CarDetailsForm = forwardRef(({ car = {}, onSubmit }, ref) => {
    const { i18n, t } = useTranslation();
    const [segments, setSegments] = useState([]), [bodyTypes, setBodyTypes] = useState([]), [fuels, setFuels] = useState([]), [transmissions, setTransmissions] = useState([]);
    const [error, setError] = useState({}), [loading, setLoading] = useState(true), [currentLang, setCurrentLang] = useState(i18n.language), [supportedLangs, setSupportedLangs] = useState([]);
    const defaultData = { license_plate: "", brand: {}, model: {}, year: "", seat_count: "", trunk_capacity: "", segment: "", bodyType: "", fuelType: "", transmissionType: "", ...car };
    const [formData, setFormData] = useState(defaultData); const formDataRef = useRef(defaultData);

    useEffect(() => {
        axios.get("/adminpanel/get-all-cars-info").then(res => {
            const langs = res.data.languages.map(l => ({ label: l.name, value: l.code }));
            const getIds = (arr, key) => car?.[key] ?? arr[0]?.id ?? "";
            const base = { segment: getIds(res.data.segments, "segment"), bodyType: getIds(res.data.bodyTypes, "bodyType"), fuelType: getIds(res.data.fuels, "fuelType"), transmissionType: getIds(res.data.transmissions, "transmissionType") };
            const brand = langs.reduce((a, l) => ({ ...a, [l.value]: car?.brand_key ? t(car.brand_key.key, {lng: l.value}) : "" }), {}), model = langs.reduce((a, l) => ({ ...a, [l.value]: car?.model_key ? t(car.model_key.key, {lng: l.value}) : "" }), {});
            const updated = { ...formDataRef.current, ...base, brand, model };
            setSupportedLangs(langs); setSegments(res.data.segments); setBodyTypes(res.data.bodyTypes); setFuels(res.data.fuels); setTransmissions(res.data.transmissions);
            setFormData(updated); formDataRef.current = updated; setLoading(false);
        }).catch(err => { setError(err.response?.data?.error || { general: "Veriler yüklenirken hata oluştu" }); setLoading(false); });
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        if (["year", "seat_count", "trunk_capacity"].includes(name) && /[^0-9]/.test(value)) return setError(p => ({ ...p, [name]: "Sadece sayı girilebilir" }));
        setError(p => { const c = { ...p }; delete c[name]; return c; });
        if (name.includes(".")) {
            const [main, lang] = name.split(".");
            setFormData(p => { const u = { ...p, [main]: { ...p[main], [lang]: value } }; formDataRef.current = u; return u; });
        } else setFormData(p => { const u = { ...p, [name]: value }; formDataRef.current = u; return u; });
    };

    const handleSelectChange = (key, val) => { setError(p => { const c = { ...p }; delete c[key]; return c; }); const u = { ...formData, [key]: val }; setFormData(u); formDataRef.current = u; };

    const handleSubmit = () => {
        const d = formDataRef.current, errs = {};
        if (!d.license_plate) errs.license_plate = "Araç plakası gerekli";
        if (!d.year) errs.year = "Model yılı gerekli";
        if (supportedLangs.some(l => !d.brand[l.value]?.trim())) errs.brand = "Marka gerekli";
        if (supportedLangs.some(l => !d.model[l.value]?.trim())) errs.model = "Model gerekli";
        if (!d.seat_count) errs.seat_count = "Koltuk sayısı gerekli";
        if (!d.trunk_capacity) errs.trunk_capacity = "Bagaj kapasitesi gerekli";
        setError(errs); if (Object.keys(errs).length) return window.scrollTo({ top: 0, behavior: "smooth" });

        const fd = new FormData();
        Object.entries({ license_plate: d.license_plate, brand: JSON.stringify(d.brand), model: JSON.stringify(d.model), year: d.year, seat_count: d.seat_count, trunk_capacity: d.trunk_capacity, segment: d.segment, body_type: d.bodyType, fuel_type: d.fuelType, transmission_type: d.transmissionType }).forEach(([k, v]) => fd.append(k, v));
        return fd;
    };

    useImperativeHandle(ref, () => ({ submit: handleSubmit }));

    const progress = () => {
        const b = Object.values(formData.brand || {}), m = Object.values(formData.model || {}), total = b.length + m.length; if (!total) return 0;
        return Math.round(((b.filter(v => v.trim()).length + m.filter(v => v.trim()).length) / total) * 100);
    };

    if (loading) return <div>Yükleniyor...</div>;
    return (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!!Object.keys(error).length && (
                <div className="col-span-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <ul className="list-disc pl-5 space-y-1 text-sm">{Object.entries(error).map(([f, m]) => <li key={f}>{m}</li>)}</ul>
                </div>
            )}
            <div className="col-span-2 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 mb-4 md:w-[30%]">
                    <SelectOptions options={supportedLangs} onChange={setCurrentLang} value={currentLang} options_name={t("adminpanel.pricing.add_campaign.select_language")} />
                    <div className="w-full h-2 flex"><div className="bg-green-500 transition-all duration-300" style={{ width: `${progress()}%` }}/><div className="bg-red-300 transition-all duration-300" style={{ width: `${100 - progress()}%` }}/></div>
                </div>
            </div>
            <FormInput name={`brand.${currentLang}`} label={t("adminpanel.car.car_modify.edit_car_information.brand")} value={formData.brand[currentLang]} onChange={handleChange} error={error.brand} />
            <FormInput name={`model.${currentLang}`} label={t("adminpanel.car.car_modify.edit_car_information.model")} value={formData.model[currentLang]} onChange={handleChange} error={error.model} />
            <FormInput name="license_plate" label={t("adminpanel.car.car_modify.edit_car_information.license_plate")} value={formData.license_plate} onChange={handleChange} error={error.license_plate} />
            <FormInput name="year" label={t("adminpanel.car.car_modify.edit_car_information.year")} type="number" value={formData.year} onChange={handleChange} error={error.year} />
            <FormInput name="seat_count" label={t("adminpanel.car.car_modify.edit_car_information.seat_count")} type="number" value={formData.seat_count} onChange={handleChange} error={error.seat_count} />
            <FormInput name="trunk_capacity" label={t("adminpanel.car.car_modify.edit_car_information.trunk_capacity")} type="number" value={formData.trunk_capacity} onChange={handleChange} error={error.trunk_capacity} />
            <SelectOptions options={segments.map(s => ({ label: t(s.translation_key.key), value: s.id }))} options_name={t("adminpanel.car.car_modify.edit_car_information.segment")} onChange={e => handleSelectChange("segment", e)} value={[formData.segment]} />
            <SelectOptions options={bodyTypes.map(b => ({ label: t(b.translation_key.key), value: b.id }))} options_name={t("adminpanel.car.car_modify.edit_car_information.body_type")} onChange={e => handleSelectChange("bodyType", e)} value={[formData.bodyType]} />
            <SelectOptions options={fuels.map(f => ({ label: t(f.translation_key.key), value: f.id }))} options_name={t("adminpanel.car.car_modify.edit_car_information.fuel_type")} onChange={e => handleSelectChange("fuelType", e)} value={[formData.fuelType]} />
            <SelectOptions options={transmissions.map(tn => ({ label: t(tn.translation_key.key), value: tn.id }))} options_name={t("adminpanel.car.car_modify.edit_car_information.transmission_type")} onChange={e => handleSelectChange("transmissionType", e)} value={[formData.transmissionType]} />
        </form>
    );
});

export default CarDetailsForm;
