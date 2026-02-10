import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "./FormInput.jsx";
import SelectOptions from "../../../websites/filterSelectors/SelectOptions.jsx";
import { Plus, Trash2 } from "lucide-react";

const defaultVehicle = (locations) => ({
    plate_number: "",
    exact_year: new Date().getFullYear(),
    current_location_id: locations?.[0]?.id ?? "",
    chassis_number: "",
    current_km: "",
});

const VehicleListForm = forwardRef(({ locations = [] }, ref) => {
    const { t } = useTranslation();
    const [vehicles, setVehicles] = useState([defaultVehicle(locations)]);
    const [errors, setErrors] = useState({});

    const addRow = () => {
        setVehicles((prev) => [...prev, defaultVehicle(locations)]);
        setErrors((prev) => {
            const next = { ...prev };
            Object.keys(next).forEach((k) => k.startsWith("vehicles.") && delete next[k]);
            return next;
        });
    };

    const removeRow = (index) => {
        if (vehicles.length <= 1) return;
        setVehicles((prev) => prev.filter((_, i) => i !== index));
        setErrors((prev) => {
            const next = { ...prev };
            Object.keys(next).forEach((k) => {
                const match = k.match(/^vehicles\.(\d+)\./);
                if (match && parseInt(match[1], 10) === index) delete next[k];
            });
            return next;
        });
    };

    const updateVehicle = (index, field, value) => {
        setVehicles((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
        setErrors((prev) => {
            const next = { ...prev };
            delete next[`vehicles.${index}.${field}`];
            return next;
        });
    };

    useImperativeHandle(ref, () => ({
        submit: () => {
            const errs = {};
            vehicles.forEach((v, i) => {
                if (!String(v.plate_number ?? "").trim()) errs[`vehicles.${i}.plate_number`] = t("adminpanel.car_group.vehicle_plate_required") || "Plate number required";
                if (!v.exact_year || v.exact_year < 1990 || v.exact_year > new Date().getFullYear() + 1) errs[`vehicles.${i}.exact_year`] = t("adminpanel.car_group.vehicle_year_required") || "Valid year required";
                if (!v.current_location_id) errs[`vehicles.${i}.current_location_id`] = t("adminpanel.car_group.vehicle_location_required") || "Location required";
            });
            setErrors(errs);
            if (Object.keys(errs).length > 0) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return null;
            }
            return vehicles.map((v) => ({
                plate_number: String(v.plate_number).trim(),
                exact_year: parseInt(v.exact_year, 10),
                current_location_id: parseInt(v.current_location_id, 10),
                chassis_number: String(v.chassis_number || "").trim() || null,
                current_km: v.current_km !== "" && v.current_km !== null ? parseInt(v.current_km, 10) : null,
            }));
        },
    }));

    const locationOptions = locations.map((loc) => ({ label: loc.name, value: loc.id }));

    return (
        <div className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {t("adminpanel.car_group.vehicles") || "Cars"}
                </h3>
                <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
                >
                    <Plus size={18} />
                    {t("adminpanel.car_group.add_vehicle") || "Add vehicle"}
                </button>
            </div>
            <div className="space-y-4">
                {vehicles.map((v, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-3 bg-white rounded-lg border border-gray-200"
                    >
                        <div>
                            <FormInput
                                name={`vehicles.${index}.plate_number`}
                                label={t("adminpanel.car.car_modify.edit_car_information.license_plate") || "Plate"}
                                value={v.plate_number}
                                onChange={(e) => updateVehicle(index, "plate_number", e.target.value)}
                                error={errors[`vehicles.${index}.plate_number`]}
                            />
                        </div>
                        <div>
                            <FormInput
                                name={`vehicles.${index}.exact_year`}
                                label={t("adminpanel.car.car_modify.edit_car_information.year") || "Year"}
                                type="number"
                                value={v.exact_year}
                                onChange={(e) => updateVehicle(index, "exact_year", e.target.value)}
                                error={errors[`vehicles.${index}.exact_year`]}
                            />
                        </div>
                        <div>
                            <SelectOptions
                                options={locationOptions}
                                options_name={t("adminpanel.car_group.current_location") || "Location"}
                                onChange={(val) => updateVehicle(index, "current_location_id", Array.isArray(val) ? val[0] : val)}
                                value={v.current_location_id ? [v.current_location_id] : []}
                            />
                        </div>
                        <div>
                            <FormInput
                                name={`vehicles.${index}.chassis_number`}
                                label={t("adminpanel.car_group.chassis_number") || "Chassis (optional)"}
                                value={v.chassis_number}
                                onChange={(e) => updateVehicle(index, "chassis_number", e.target.value)}
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <FormInput
                                    name={`vehicles.${index}.current_km`}
                                    label={t("adminpanel.car_group.current_km") || "KM (optional)"}
                                    type="number"
                                    value={v.current_km}
                                    onChange={(e) => updateVehicle(index, "current_km", e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeRow(index)}
                                disabled={vehicles.length <= 1}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                title={t("adminpanel.car_group.remove_vehicle") || "Remove"}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default VehicleListForm;
