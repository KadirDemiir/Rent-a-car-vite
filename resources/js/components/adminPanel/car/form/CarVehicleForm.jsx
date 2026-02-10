import { useState } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "./FormInput.jsx";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import LanguageProgress from "../../LanguageProgress.jsx";

/**
 * CarVehicleForm - Reusable form component for individual car/vehicle fields
 * Used in both AddCar and IndexCar pages
 *
 * @param {Object} form - Form data object (includes brand, model as language-keyed objects)
 * @param {Function} onChange - Handler for input changes
 * @param {Function} onSelect - Handler for select changes
 * @param {Array} locations - Available locations
 * @param {Array} carGroupOptions - Car group options
 * @param {Array} languages - Supported languages [{label, value}]
 * @param {boolean} disabled - Whether form is disabled
 * @param {boolean} showBrandModel - Whether to show brand/model fields (default true)
 */
export default function CarVehicleForm({
    form = {},
    onChange,
    onSelect,
    locations = [],
    carGroupOptions = [],
    languages = [],
    disabled = false,
    showBrandModel = true,
}) {
    const { t, i18n } = useTranslation();
    const [currentLang, setCurrentLang] = useState(i18n.language);

    const supportedLangs = languages.length > 0
        ? languages.map(l => ({ label: l.name || l.label, value: l.code || l.value }))
        : [{ label: "English", value: "en" }, { label: "Turkish", value: "tr" }];

    const locationOptions = locations.map((loc) => ({
        label: loc.name,
        value: loc.id
    }));

    const statusOptions = [
        { label: t("adminpanel.car.available") || "Available", value: 'available' },
        { label: t("adminpanel.car.rented") || "Rented", value: 'rented' },
        { label: t("adminpanel.car.unavailable") || "Unavailable", value: 'unavailable' },
    ];

    const calculateProgress = () => {
        const b = Object.values(form.brand || {});
        const m = Object.values(form.model || {});
        const total = supportedLangs.length * 2;
        if (!total) return 0;
        const filled = b.filter(v => v && v.trim()).length + m.filter(v => v && v.trim()).length;
        return Math.round((filled / total) * 100);
    };

    const isLanguageFilled = (langValue) => {
        return form.brand?.[langValue]?.trim() && form.model?.[langValue]?.trim();
    };
    console.log(form);
    return (
        <div className="space-y-4">
            {/* Brand/Model with Language Support */}
            {showBrandModel && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                        <LanguageProgress
                            langOpt={supportedLangs}
                            calculateProgress={calculateProgress}
                            isLanguageFilled={isLanguageFilled}
                            lang={currentLang}
                            setLang={setCurrentLang}
                        />
                    </div>
                    <div className="col-span-1">
                        <FormInput
                            name={`brand.${currentLang}`}
                            label={t("adminpanel.car.car_modify.edit_car_information.brand") || "Brand"}
                            value={form.brand?.[currentLang] || ""}
                            onChange={onChange}
                            disabled={disabled}
                        />
                    </div>
                    <div className="col-span-1">
                        <FormInput
                            name={`model.${currentLang}`}
                            label={t("adminpanel.car.car_modify.edit_car_information.model") || "Model"}
                            value={form.model?.[currentLang] || ""}
                            onChange={onChange}
                            disabled={disabled}
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Car Group Selector */}
                {carGroupOptions.length > 0 && (
                    <div className="col-span-1">
                        <SelectOptions
                            options={carGroupOptions}
                            options_name={t("adminpanel.car.select_group") || "Choose a car group..."}
                            onChange={(val) => onSelect("car_group_id", val)}
                            value={form.car_group_id ? [form.car_group_id] : []}
                            disabled={disabled}
                        />
                    </div>
                )}

                {/* Plate Number */}
                <div className="col-span-1">
                    <FormInput
                        name="plate_number"
                        label={t("adminpanel.car.car_modify.edit_car_information.license_plate") || "Plate Number"}
                        value={form.plate_number || ""}
                        onChange={onChange}
                        required
                        placeholder="34 ABC 123"
                        disabled={disabled}
                    />
                </div>

                {/* Year */}
                <div className="col-span-1">
                    <FormInput
                        name="exact_year"
                        label={t("adminpanel.car.car_modify.edit_car_information.year") || "Year"}
                        type="number"
                        value={form.exact_year || ""}
                        onChange={onChange}
                        required
                        disabled={disabled}
                    />
                </div>

                {/* Current KM */}
                <div className="col-span-1">
                    <FormInput
                        name="current_km"
                        label={t("adminpanel.car.current_km") || "Current KM"}
                        type="number"
                        value={form.current_km }
                        onChange={onChange}
                        placeholder="e.g. 15000"
                        disabled={disabled}
                    />
                </div>

                {/* Status */}
                <div className="col-span-1">
                    <SelectOptions
                        options={statusOptions}
                        value={form.status ? [form.status] : ['available']}
                        onChange={(val) => onSelect("status", val)}
                        options_name={t("adminpanel.car.status") || "Status"}
                        disabled={disabled}
                    />
                </div>

                {/* Current Location */}
                <div className="col-span-1">
                    <SelectOptions
                        options={locationOptions}
                        options_name={t("adminpanel.add_car.select_location") || "Select Location"}
                        onChange={(val) => onSelect("current_location_id", val)}
                        value={form.current_location_id ? [form.current_location_id] : []}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
}
