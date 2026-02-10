import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import FormInput from "./FormInput.jsx";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import { useTranslation } from "react-i18next";
import axios from "axios";
import LanguageProgress from "../../LanguageProgress.jsx";

const CarDetailForm = forwardRef(({ car = {}, onSubmit, groupOnly = false }, ref) => {
    const { i18n, t } = useTranslation();
    const [segments, setSegments] = useState([]);
    const [bodyTypes, setBodyTypes] = useState([]);
    const [fuels, setFuels] = useState([]);
    const [transmissions, setTransmissions] = useState([]);

    const [error, setError] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentLang, setCurrentLang] = useState(i18n.language);
    const [supportedLangs, setSupportedLangs] = useState([]);

    const parseName = (val) => {
        try {
            return typeof val === 'string' ? JSON.parse(val) : (val ?? {});
        } catch (e) {
            return {};
        }
    };
    const defaultData = {
        name: parseName(car?.name),
        slug: car?.slug ? (typeof car.slug === 'string' ? JSON.parse(car.slug) : car.slug) : {},
        seat_count: car?.seat_count ?? "",
        trunk_capacity: car?.trunk_capacity ?? "",
        segment: car?.segment_id || "",
        bodyType: car?.body_type_id || "",
        fuelType: car?.fuel_id || "",
        transmissionType: car?.transmission_id || "",
    };
    const [formData, setFormData] = useState(defaultData);

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

                const existingName = parseName(car?.name);
                const normalizedName = {};
                langs.forEach(l => {
                    normalizedName[l.value] = existingName[l.value] ?? "";
                });

                const updated = {
                    ...defaultData,
                    segment: car?.segment_id ?? res.data.segments[0] ?? "",
                    bodyType: car?.body_type_id ?? res.data.bodyTypes[0] ?? "",
                    fuelType: car?.fuel_id ?? res.data.fuels[0] ?? "",
                    transmissionType: car?.transmission_id ?? res.data.transmissions[0] ?? "",
                    status: car?.status || "available",
                    name: normalizedName,
                };

                setFormData(updated);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.error || { general: "Veriler yüklenirken hata oluştu" });
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchData();

        return () => { mounted = false; };
    }, []);

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const handleChange = e => {
        const { name, value } = e.target;

        if (["seat_count", "trunk_capacity"].includes(name) && value !== "" && !/^\d+$/.test(value)) {
            return setError(p => ({ ...p, [name]: "Sadece sayı girilebilir" }));
        }

        setError(p => { const c = { ...p }; delete c[name]; delete c["name"]; delete c["slug"]; return c; });

        if (name.startsWith("slug.")) {
            const lang = name.split(".")[1];
            // Validate slug
            if (value && !slugRegex.test(value)) {
                setError(p => ({ ...p, [name]: "Geçerli bir bağlantı (slug) girin: küçük harf, rakam, tire (-)" }));
            }
            setFormData(p => ({ ...p, slug: { ...p.slug, [lang]: value } }));
            return;
        }

        if (name.includes(".")) {
            const [main, lang] = name.split(".");
            setFormData(p => ({ ...p, [main]: { ...p[main], [lang]: value } }));
        } else {
            setFormData(p => ({ ...p, [name]: value }));
        }
    };

    const handleSelectChange = (key, val) => {
        setError(p => { const c = { ...p }; delete c[key]; return c; });
        setFormData(p => ({ ...p, [key]: val }));
    };

    const handleSubmit = () => {
        const d = formData;
        const errs = {};

        if (supportedLangs.some(l => !d.name[l.value]?.trim()))
            errs.name = "İsim alanı tüm diller için gereklidir";

        // Slug validation: required and valid for each language
        supportedLangs.forEach(l => {
            const val = d.slug?.[l.value] || "";
            if (!val.trim()) {
                errs[`slug.${l.value}`] = `Slug (${l.label}) zorunludur`;
            } else if (!slugRegex.test(val)) {
                errs[`slug.${l.value}`] = `Geçerli bir bağlantı (slug) girin: küçük harf, rakam, tire (-)`;
            }
        });

        if (d.seat_count === "" || d.seat_count === null || d.seat_count === undefined)
            errs.seat_count = "Koltuk sayısı gerekli";
        if (d.trunk_capacity === "" || d.trunk_capacity === null || d.trunk_capacity === undefined)
            errs.trunk_capacity = "Bagaj kapasitesi gerekli";
        setError(errs);
        if (Object.keys(errs).length) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return null;
        }

        const fd = new FormData();
        fd.append("name", JSON.stringify(d.name));
        fd.append("slug", JSON.stringify(d.slug));
        fd.append("seat_count", d.seat_count);
        fd.append("trunk_capacity", d.trunk_capacity);
        fd.append("segment", d.segment);
        fd.append("body_type", d.bodyType);
        fd.append("fuel_type", d.fuelType);
        fd.append("transmission_type", d.transmissionType);
        return fd;
    };

    useImperativeHandle(ref, () => ({ submit: handleSubmit }), [formData, supportedLangs]);

    const progress = () => {
        const b = Object.values(formData.name || {});
        const c = Object.values(formData.slug || {});
        const total = supportedLangs.length *2;
        if (!total) return 0;

        const filledb = b.filter(v => v && v.trim()).length;
        const filledc = c.filter(c => c && c.trim()).length;
        return Math.round(((filledb + filledc) / total) * 100);
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!!Object.keys(error).length && (
                <div className="col-span-1 md:col-span-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p className="font-bold">Lütfen hataları düzeltin:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        {Object.entries(error).map(([f, m]) => (
                            <li key={f}>{typeof m === 'string' ? m : JSON.stringify(m)}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="col-span-1 md:col-span-2">
                <LanguageProgress
                    langOpt={supportedLangs}
                    calculateProgress={progress}
                    isLanguageFilled={(langValue) => formData.name[langValue]?.trim()}
                    lang={currentLang}
                    setLang={setCurrentLang}
                />
            </div>

            <div className="col-span-1">
                <FormInput
                    name={`name.${currentLang}`}
                    label={`${t("adminpanel.car_group.name")}`}
                    value={formData.name[currentLang] || ""}
                    onChange={handleChange}
                    error={error[`name.${currentLang}`] || error.name}
                />
            </div>

            <div className="col-span-1">
                <FormInput
                    name={`slug.${currentLang}`}
                    label={t("adminpanel.car_group.slug") + " (" + currentLang + ")"}
                    value={formData.slug?.[currentLang] || ""}
                    onChange={handleChange}
                    error={error[`slug.${currentLang}`]}
                />
            </div>

            <div className="col-span-1">
                <FormInput
                    name="seat_count"
                    label={t("adminpanel.car.car_modify.edit_car_information.seat_count")}
                    type="number"
                    value={formData.seat_count}
                    onChange={handleChange}
                    error={error.seat_count}
                />
            </div>
            <div className="col-span-1">
                <FormInput
                    name="trunk_capacity"
                    label={t("adminpanel.car.car_modify.edit_car_information.trunk_capacity")}
                    type="number"
                    value={formData.trunk_capacity }
                    onChange={handleChange}
                    error={error.trunk_capacity}
                />
            </div>

            <div className="col-span-1">
                <SelectOptions
                    options={segments.map(id => ({ label: t(`segment.${id}`), value: id }))}
                    options_name={t("adminpanel.car.car_modify.edit_car_information.segment")}
                    onChange={e => handleSelectChange("segment", e)}
                    value={[formData.segment]}
                />
            </div>
            <div className="col-span-1">
                <SelectOptions
                    options={bodyTypes.map(id => ({ label: t(`body_type.${id}`), value: id }))}
                    options_name={t("adminpanel.car.car_modify.edit_car_information.body_type")}
                    onChange={e => handleSelectChange("bodyType", e)}
                    value={[formData.bodyType]}
                />
            </div>
            <div className="col-span-1">
                <SelectOptions
                    options={fuels.map(id => ({ label: t(`fuel.${id}`), value: id }))}
                    options_name={t("adminpanel.car.car_modify.edit_car_information.fuel_type")}
                    onChange={e => handleSelectChange("fuelType", e)}
                    value={[formData.fuelType]}
                />
            </div>
            <div className="col-span-1">
                <SelectOptions
                    options={transmissions.map(id => ({ label: t(`transmission.${id}`), value: id }))}
                    options_name={t("adminpanel.car.car_modify.edit_car_information.transmission_type")}
                    onChange={e => handleSelectChange("transmissionType", e)}
                    value={[formData.transmissionType]}
                />
            </div>
        </form>
    );
});

export default CarDetailForm;
