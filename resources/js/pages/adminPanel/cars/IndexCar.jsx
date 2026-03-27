import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import CarReservations from "../../../components/adminPanel/car/CarReservations.jsx";
import CarVehicleForm from "../../../components/adminPanel/car/form/CarVehicleForm.jsx";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { router } from "@inertiajs/react";
import SuccessMessage from "../../../components/SuccessMessage.jsx";

const safeJsonParse = (str) => {
    try {
        if (!str) return {};
        return typeof str === 'string' ? JSON.parse(str) : str;
    } catch (e) {
        return {};
    }
};

export default function IndexCar({ id, locations = [], carGroups = [], languages = [] }) {
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [brandModel, setBrandModel] = useState({ brand: {}, model: {} });
    const { t, i18n } = useTranslation();

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/adminpanel/cars/${id}/info`);
            setCar(response.data.car);
            console.log(response.data.car);
            const brandData = response.data.brand || {};
            const modelData = response.data.model || {};
            setBrandModel({ brand: brandData, model: modelData });
            setFormData({
                plate_number: response.data.car.plate_number || '',
                exact_year: response.data.car.exact_year || '',
                current_km: response.data.car.current_km ?? '',
                status: response.data.car.status || 'available',
                current_location_id: response.data.car.current_location_id || '',
                car_group_id: response.data.car.car_group_id || '',
                brand: brandData,
                model: modelData,
            });
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle nested brand.en or model.tr style names
        if (name.includes('.')) {
            const [parent, key] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [key]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelect = (key, val) => {
        const value = Array.isArray(val) ? val[0] : val;
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                brand: JSON.stringify(formData.brand),
                model: JSON.stringify(formData.model),
            };
            const response = await axios.post(`/adminpanel/cars/${id}/update`, payload);
            setCar(response.data.car);
            setBrandModel({ brand: response.data.brand || {}, model: response.data.model || {} });
            setSuccess("Araç bilgileri başarıyla güncellendi!");
            setEditing(false);
            setTimeout(() => setSuccess(""), 10000);
        } catch (err) {
            setError(err.response?.data?.message || "Güncelleme sırasında hata oluştu.");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Bu aracı silmek istediğinizden emin misiniz?")) return;
        try {
            await axios.delete(`/adminpanel/cars/${id}`);
            router.visit(`/${i18n.language}/${t("address.adminpanel")}/${t("address.cars")}`);
        } catch (err) {
            setError(err.response?.data?.message || "Silme sırasında hata oluştu.");
        }
    };

    const groupOptions = carGroups.map((g) => {
        const parsedName = safeJsonParse(g.name);
        return {
            label: parsedName?.[i18n.language] || `Group #${g.id}`,
            value: g.id
        };
    });

    const getStatusBadge = (status) => {
        const styles = {
            available: 'bg-green-100 text-green-800 border-green-200',
            rented: 'bg-blue-100 text-blue-800 border-blue-200',
            unavailable: 'bg-red-100 text-red-800 border-red-200',
            maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };
        return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const carGroupName = car?.car_group?.name ? JSON.parse(car.car_group.name)?.[i18n.language] : '—';
    const brandName = brandModel.brand?.[i18n.language] || '—';
    const modelName = brandModel.model?.[i18n.language] || '—';

    const handleVisitGroup = (id) => {
        router.visit(`/${t('address.adminpanel')}/${t('address.car_groups')}/${id}`);
    }

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <Navbar>
                {loading ? (
                    <div className="flex items-center justify-center min-h-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg m-6">
                        Hata: {error}
                    </div>
                ) : !car ? (
                    <div className="p-6 text-center text-gray-500">Araç bulunamadı</div>
                ) : (
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {brandName} {modelName} - {car.exact_year}  - {car.plate_number}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {carGroupName}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(car.status)}`}>
                                    {t(`adminpanel.car.${car.status}`) || car.status}
                                </span>
                                {!editing && (
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Düzenle
                                    </button>
                                )}
                            </div>
                        </div>

                        <SuccessMessage message={success} />

                        {/* Car Details Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Araç Bilgileri</h2>

                            {editing ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <CarVehicleForm
                                        form={formData}
                                        onChange={handleInputChange}
                                        onSelect={handleSelect}
                                        locations={locations}
                                        carGroupOptions={groupOptions}
                                        languages={languages}
                                        showBrandModel={true}
                                    />

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditing(false);
                                                setFormData({
                                                    plate_number: car.plate_number || '',
                                                    exact_year: car.exact_year || '',
                                                    current_km: car.current_km || '',
                                                    status: car.status || 'available',
                                                    current_location_id: car.current_location_id || '',
                                                    car_group_id: car.car_group_id || '',
                                                    brand: brandModel.brand,
                                                    model: brandModel.model,
                                                });
                                            }}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Kaydet
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500">{t("adminpanel.car.list.brand")}</p>
                                        <p className="font-semibold text-gray-900">{brandName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{t("adminpanel.car.list.model")}</p>
                                        <p className="font-semibold text-gray-900">{modelName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{t('adminpanel.car.list.license_plate')}</p>
                                        <p className="font-semibold text-gray-900">{car.plate_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{t("adminpanel.car_group")}</p>
                                        <span onClick={() => handleVisitGroup(car.car_group.id)} className="font-semibold text-gray-900 cursor-pointer">{carGroupName}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{t("adminpanel.car.list.year")}</p>
                                        <p className="font-semibold text-gray-900">{car.exact_year || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{t("adminpanel.car.current_km")}</p>
                                        <p className="font-semibold text-gray-900">{car.current_km?.toLocaleString() || '—'} km</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{t("adminpanel.car.list.current_locations")}</p>
                                        <p className="font-semibold text-gray-900">{car.current_location?.name || '—'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reservations Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Araca Ait Rezervasyonlar
                            </h2>
                            <CarReservations
                                updateData={fetchData}
                                allReservations={car.reservations || []}
                                past={false}
                                prev={true}
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Geçmiş Rezervasyonlar
                            </h2>
                            <CarReservations
                                updateData={fetchData}
                                allReservations={car.reservations || []}
                                current={false}
                                prev={true}
                            />
                        </div>

                        {/* Delete Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Aracı Sil
                            </button>
                        </div>
                    </div>
                )}
            </Navbar>
        </div>
    );
}
