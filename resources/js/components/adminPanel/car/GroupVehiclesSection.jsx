import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Plus } from "lucide-react";
import FormInput from "./form/FormInput.jsx";
import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";

export default function GroupVehiclesSection({ car, locations = [], onVehicleAdded }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        plate_number: "",
        exact_year: new Date().getFullYear(),
        current_location_id: locations?.[0]?.id ?? "",
        chassis_number: "",
        current_km: "",
        status: "available",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSelect = (key, val) => {
        setForm((prev) => ({ ...prev, [key]: Array.isArray(val) ? val[0] : val }));
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!form.plate_number?.trim()) {
            setError(t("adminpanel.car_group.vehicle_plate_required") || "Plate number required");
            return;
        }
        if (!form.exact_year || form.exact_year < 1990 || form.exact_year > new Date().getFullYear() + 1) {
            setError(t("adminpanel.car_group.vehicle_year_required") || "Valid year required");
            return;
        }
        if (!form.current_location_id) {
            setError(t("adminpanel.car_group.vehicle_location_required") || "Location required");
            return;
        }
        setLoading(true);
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        axios
            .post(`/adminpanel/car-groups/${car.id}/vehicles`, {
                plate_number: form.plate_number.trim(),
                exact_year: parseInt(form.exact_year, 10),
                current_location_id: parseInt(form.current_location_id, 10),
                chassis_number: form.chassis_number?.trim() || null,
                current_km: form.current_km !== "" ? parseInt(form.current_km, 10) : null,
                status: form.status,
            }, {
                headers: { "X-CSRF-TOKEN": csrfToken, "Accept": "application/json", "Content-Type": "application/json" },
            })
            .then(() => {
                setOpen(false);
                setForm({
                    plate_number: "",
                    exact_year: new Date().getFullYear(),
                    current_location_id: locations?.[0]?.id ?? "",
                    chassis_number: "",
                    current_km: "",
                    status: "available",
                });
                onVehicleAdded?.();
            })
            .catch((err) => {
                setError(err.response?.data?.message || err.response?.data?.error || err.message || "Failed to add vehicle");
            })
            .finally(() => setLoading(false));
    };

    const vehicles = car?.vehicles ?? [];
    const locationOptions = locations.map((loc) => ({ label: loc.name, value: loc.id }));

    return (
        <div className="w-full bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {t("adminpanel.car_group.vehicles_in_group") || "Cars in this group"}
                </h3>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
                >
                    <Plus size={18} />
                    {t("adminpanel.car_group.add_vehicle") || "Add vehicle"}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">{t("adminpanel.car.car_modify.edit_car_information.license_plate") || "Plate"}</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">{t("adminpanel.car.car_modify.edit_car_information.year") || "Year"}</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">{t("adminpanel.car_group.current_location") || "Location"}</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">{t("adminpanel.car_group.status") || "Status"}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {vehicles.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                    {t("adminpanel.car_group.no_vehicles") || "No vehicles in this group."}
                                </td>
                            </tr>
                        ) : (
                            vehicles.map((v) => (
                                <tr key={v.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium text-gray-900">{v.plate_number}</td>
                                    <td className="px-4 py-2 text-gray-600">{v.exact_year}</td>
                                    <td className="px-4 py-2 text-gray-600">{locations.find((l) => l.id === v.current_location_id)?.name ?? "—"}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                            v.status === "available" ? "bg-green-100 text-green-800" :
                                            v.status === "rented" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
                                        }`}>
                                            {v.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            {t("adminpanel.car_group.add_vehicle") || "Add vehicle"}
                        </h4>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <FormInput
                                name="plate_number"
                                label={t("adminpanel.car.car_modify.edit_car_information.license_plate") || "Plate number"}
                                value={form.plate_number}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                name="exact_year"
                                label={t("adminpanel.car.car_modify.edit_car_information.year") || "Year"}
                                type="number"
                                value={form.exact_year}
                                onChange={handleChange}
                                required
                            />
                            <SelectOptions
                                options={locationOptions}
                                options_name={t("adminpanel.car_group.current_location") || "Location"}
                                onChange={(val) => handleSelect("current_location_id", val)}
                                value={form.current_location_id ? [form.current_location_id] : []}
                            />
                            <FormInput
                                name="chassis_number"
                                label={t("adminpanel.car_group.chassis_number") || "Chassis (optional)"}
                                value={form.chassis_number}
                                onChange={handleChange}
                            />
                            <FormInput
                                name="current_km"
                                label={t("adminpanel.car_group.current_km") || "Current KM (optional)"}
                                type="number"
                                value={form.current_km}
                                onChange={handleChange}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t("adminpanel.car_group.status") || "Status"}</label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="available">Available</option>
                                    <option value="rented">Rented</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    {t("adminpanel.car_group.cancel") || "Cancel"}
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {loading ? (t("adminpanel.car_group.saving") || "Saving...") : (t("adminpanel.car_group.add_vehicle") || "Add vehicle")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
