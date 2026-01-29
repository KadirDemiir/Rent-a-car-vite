import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import FormInput from "./FormInput.jsx";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx"; // Yolun doğruluğundan emin olun
import { useTranslation } from "react-i18next";
import axios from "axios";
import LanguageProgress from "../../LanguageProgress.jsx";

const CarDetailsForm = forwardRef(({ car = {}, onSubmit }, ref) => {
    const { i18n, t } = useTranslation();

    const [segments, setSegments] = useState([]);
    const [bodyTypes, setBodyTypes] = useState([]);
    const [fuels, setFuels] = useState([]);
    const [transmissions, setTransmissions] = useState([]);

    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentLang, setCurrentLang] = useState(i18n.language);
    const [supportedLangs, setSupportedLangs] = useState([]);

    const defaultData = {
        license_plate: car?.license_plate || "",
        brand: {},
        model: {},
        year: car?.year || "",
        seat_count: car?.seat_count || "",
        trunk_capacity: car?.trunk_capacity || "",
        segment: car?.segment_id || "",          // Laravel: segment_id -> React: segment
        bodyType: car?.body_type_id || "",       // Laravel: body_type_id -> React: bodyType
        fuelType: car?.fuel_id || "",            // Laravel: fuel_id -> React: fuelType
        transmissionType: car?.transmission_id || "", // Laravel: transmission_id -> React: transmissionType
        status: car?.status || "available"
    };

    const [formData, setFormData] = useState(defaultData);
    const formDataRef = useRef(defaultData);

    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            try {
                const res = await axios.get("/adminpanel/get-all-cars-info");
                if (!mounted) return;

                const langs = res.data.languages.map(l => ({ label: l.name, value: l.code }));
                setSupportedLangs(langs);
                setSegments(res.data.segments);
                setBodyTypes(res.data.bodyTypes);
                setFuels(res.data.fuels);
                setTransmissions(res.data.transmissions);
                const brand = langs.reduce((acc, l) => ({
                    ...acc,
                    [l.value]: car?.brand_key?.translations?.find(tr => tr.language_code === l.value)?.value
                        || (car?.brand_key ? t(car.brand_key.key, {lng: l.value}) : "")
                }), {});

                const model = langs.reduce((acc, l) => ({
                    ...acc,
                    [l.value]: car?.model_key?.translations?.find(tr => tr.language_code === l.value)?.value
                        || (car?.model_key ? t(car.model_key.key, {lng: l.value}) : "")
                }), {});

                // Form verisini güncelle (Backend'den gelen ID'leri önceliklendir)
                const updated = {
                    ...formDataRef.current,
                    segment: car?.segment_id ?? res.data.segments[0]?.id ?? "",
                    bodyType: car?.body_type_id ?? res.data.bodyTypes[0]?.id ?? "",
                    fuelType: car?.fuel_id ?? res.data.fuels[0]?.id ?? "",
                    transmissionType: car?.transmission_id ?? res.data.transmissions[0]?.id ?? "",
                    status: car?.status || "available",
                    brand,
                    model
                };

                setFormData(updated);
                formDataRef.current = updated;
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.error || { general: "Veriler yüklenirken hata oluştu" });
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchData();

        return () => { mounted = false; };
    }, []); // car objesi değişirse tekrar çalışmasın diye boş bıraktık, mount anında çalışır.

    const handleChange = e => {
        const { name, value } = e.target;

        // Sadece sayı kontrolü
        if (["year", "seat_count", "trunk_capacity"].includes(name) && value !== "" && !/^\d+$/.test(value)) {
            return setError(p => ({ ...p, [name]: "Sadece sayı girilebilir" }));
        }

        setError(p => { const c = { ...p }; delete c[name]; return c; });

        // Dil bazlı inputlar (brand.tr gibi)
        if (name.includes(".")) {
            const [main, lang] = name.split(".");
            setFormData(p => {
                const u = { ...p, [main]: { ...p[main], [lang]: value } };
                formDataRef.current = u;
                return u;
            });
        } else {
            setFormData(p => {
                const u = { ...p, [name]: value };
                formDataRef.current = u;
                return u;
            });
        }
    };

    // Select değişimi için tek değer alıyoruz (array wrapper kaldırıldı)
    const handleSelectChange = (key, val) => {
        setError(p => { const c = { ...p }; delete c[key]; return c; });
        const u = { ...formData, [key]: val };
        setFormData(u);
        formDataRef.current = u;
    };

    const handleSubmit = () => {
        const d = formDataRef.current;
        const errs = {};

        if (!d.license_plate) errs.license_plate = "Araç plakası gerekli";
        if (!d.year) errs.year = "Model yılı gerekli";
        if (supportedLangs.some(l => !d.brand[l.value]?.trim())) errs.brand = "Marka (tüm diller) gerekli";
        if (supportedLangs.some(l => !d.model[l.value]?.trim())) errs.model = "Model (tüm diller) gerekli";
        if (!d.seat_count) errs.seat_count = "Koltuk sayısı gerekli";
        if (!d.trunk_capacity) errs.trunk_capacity = "Bagaj kapasitesi gerekli";

        setError(errs);
        if (Object.keys(errs).length) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return null;
        }

        const fd = new FormData();
        // Backend updateDetail fonksiyonuna uygun anahtarlar (snake_case)
        fd.append("license_plate", d.license_plate);
        fd.append("brand", JSON.stringify(d.brand));
        fd.append("model", JSON.stringify(d.model));
        fd.append("year", d.year);
        fd.append("seat_count", d.seat_count);
        fd.append("trunk_capacity", d.trunk_capacity);
        fd.append("segment", d.segment);
        fd.append("body_type", d.bodyType);             // Backend: body_type
        fd.append("fuel_type", d.fuelType);             // Backend: fuel_type
        fd.append("status", d.status);
        fd.append("transmission_type", d.transmissionType); // Backend: transmission_type

        return fd;
    };

    useImperativeHandle(ref, () => ({ submit: handleSubmit }));

    const progress = () => {
        const b = Object.values(formData.brand || {});
        const m = Object.values(formData.model || {});
        const total = (supportedLangs.length * 2); // Toplam beklenen alan sayısı
        if (!total) return 0;

        const filled = b.filter(v => v && v.trim()).length + m.filter(v => v && v.trim()).length;
        return Math.round((filled / total) * 100);
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!!Object.keys(error).length && (
                <div className="col-span-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p className="font-bold">Lütfen hataları düzeltin:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">{Object.entries(error).map(([f, m]) => <li key={f}>{typeof m === 'string' ? m : JSON.stringify(m)}</li>)}</ul>
                </div>
            )}
            <div className="col-span-1 md:col-span-2">
                <LanguageProgress langOpt={supportedLangs} calculateProgress={progress} isLanguageFilled={(langValue) => formData.brand[langValue]?.trim() && formData.model[langValue]?.trim()} lang={currentLang} setLang={setCurrentLang} />
            </div>

            <div className="col-span-1 md:col-span-2">
                <FormInput name={`brand.${currentLang}`} label={t("adminpanel.car.car_modify.edit_car_information.brand")} value={formData.brand[currentLang] || ""} onChange={handleChange} error={error.brand} />
            </div>
            <div>
                <FormInput name={`model.${currentLang}`} label={t("adminpanel.car.car_modify.edit_car_information.model")} value={formData.model[currentLang] || ""} onChange={handleChange} error={error.model} />
            </div>

            <div>
                <FormInput name="license_plate" label={t("adminpanel.car.car_modify.edit_car_information.license_plate")} value={formData.license_plate} onChange={handleChange} error={error.license_plate} />
            </div>
            <div>
                <FormInput name="year" label={t("adminpanel.car.car_modify.edit_car_information.year")} type="number" value={formData.year} onChange={handleChange} error={error.year} />
            </div>
            <div>
                <FormInput name="seat_count" label={t("adminpanel.car.car_modify.edit_car_information.seat_count")} type="number" value={formData.seat_count} onChange={handleChange} error={error.seat_count} />
            </div>
            <div>
                <FormInput name="trunk_capacity" label={t("adminpanel.car.car_modify.edit_car_information.trunk_capacity")} type="number" value={formData.trunk_capacity} onChange={handleChange} error={error.trunk_capacity} />
            </div>

            {/* SelectOptions Düzeltildi: Value artık array [] içinde değil ve options label/value maplendi */}
            <div>
                <SelectOptions
                    options={segments.map(s => ({ label: t(s.translation_key.key), value: s.id }))}
                    options_name={t("adminpanel.car.car_modify.edit_car_information.segment")}
                    onChange={e => handleSelectChange("segment", e)}
                    value={[formData.segment]}
                />
            </div>
            <div>
                <SelectOptions
                    options={bodyTypes.map(b => ({ label: t(b.translation_key.key), value: b.id }))}
                    options_name={t("adminpanel.car.car_modify.edit_car_information.body_type")}
                    onChange={e => handleSelectChange("bodyType", e)}
                    value={[formData.bodyType]}
                />
            </div>
            <div>
                <SelectOptions
                    options={fuels.map(f => ({ label: t(f.translation_key.key), value: f.id }))}
                    options_name={t("adminpanel.car.car_modify.edit_car_information.fuel_type")}
                    onChange={e => handleSelectChange("fuelType", e)}
                    value={[formData.fuelType]}
                />
            </div>
            <div>
                <SelectOptions
                    options={transmissions.map(tn => ({ label: t(tn.translation_key.key), value: tn.id }))}
                    options_name={t("adminpanel.car.car_modify.edit_car_information.transmission_type")}
                    onChange={e => handleSelectChange("transmissionType", e)}
                    value={[formData.transmissionType]}
                />
            </div>

            <div>
                <SelectOptions
                    options={[
                        { label: "Available", value: "available" },
                        { label: "Rented", value: "rented" },
                        { label: "Unavailable", value: "unavailable" }
                    ]}
                    options_name={"Status"}
                    onChange={e => handleSelectChange("status", e)}
                    value={[formData.status]}
                />
            </div>
        </form>
    );
});

export default CarDetailsForm;
