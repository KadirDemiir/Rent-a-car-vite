import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import { useEffect, useState } from "react";
import LocationForm from "../../../components/adminPanel/locations/LocationForm.jsx";
import LocationMap from "../../../components/adminPanel/locations/LoactionMap.jsx";
import axios from "axios";

export default function Locations({ locations }) {
    const [formData, setFormData] = useState({ name: '', city: '', phone: '', email: '', address: '' });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState();
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const locationsOptions = [
        { label: "Yok (Ana Ofis)", value: '' },
        ...(locations?.map(l => ({ label: l.name, value: l.id })) || [])
    ];
    const [selectedParentLocation, setSelectedParentLocation] = useState(locationsOptions[0].value);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLatitude(pos.coords.latitude);
                setLongitude(pos.coords.longitude);
            });
        }
    }, []);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        //if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };
    const validate = () => {
        setErrors({});
        let tempErrors = {};
        if (!formData.name.trim()) tempErrors.name = "Ofis adı gerekli.";
        if (!formData.city.trim()) tempErrors.city = "Şehir gerekli.";
        if (!formData.phone.trim()) tempErrors.phone = "Telefon gerekli.";
        if (!formData.address.trim()) tempErrors.address = "Adres gerekli.";

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!formData.email.trim()) {
            tempErrors.email = "E-posta gerekli.";
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = "Hatalı Mail Formatı.";
        }

        if (latitude === 0 || longitude === 0) {
            tempErrors.map = "Haritadan bir konum seçmelisiniz.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return

        setLoading(true);
        const finalData = { ...formData, latitude, longitude, parentId: selectedParentLocation };

        try {
            const response = await axios.post('/adminpanel/locations/add', finalData);

            if (response.status === 200 || response.status === 201) {
                setSuccess("Lokasyon başarıyla kaydedildi!");
                setFormData({ name: '', city: '', phone: '', email: '', address: '' });
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error(error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                setErrors("Lütfen formdaki hataları kontrol edin.");
            } else {
                setErrors("Bir hata oluştu, lütfen tekrar deneyin.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchQuery) return;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            if (data.length > 0) {
                setLatitude(parseFloat(data[0].lat));
                setLongitude(parseFloat(data[0].lon));
                setErrors(prev => ({...prev, map: null}));
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative">

            <Navbar>
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Lokasyon Yönetimi</h1>
                            <p className="text-slate-500 text-sm">Ofis ekleme ve harita yönetimi.</p>
                        </div>
                        <button onClick={() => setIsModalOpen(!isModalOpen)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">
                            {isModalOpen ? 'İptal' : 'Yeni Lokasyon Ekle'}
                        </button>
                    </div>

                    {Object.keys(errors).length > 0 && typeof errors === 'object' && Object.keys(errors).map((e) => (
                        <div className={`bg-red-300 border-l-18 border-red-700 text-white px-2`}>{errors[e] ? `*${errors[e]}` : ''} </div>
                    ))}
                    {success && (
                        <div className={`bg-green-300 border-l-18 border-green-700 text-white px-2`}>*{success}</div>
                    )}
                    <br/>
                    {isModalOpen && (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
                            {errors.map && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-center space-x-2">
                                    <span>📍</span> <strong>Hata:</strong> <span>{errors.map}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-5">
                                    <LocationForm
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        errors={errors}
                                        locationsOptions={locationsOptions}
                                        selectedParentLocation={selectedParentLocation}
                                        setSelectedParentLocation={setSelectedParentLocation}
                                    />
                                </div>
                                <div className="lg:col-span-7">
                                    <LocationMap
                                        latitude={latitude} setLatitude={setLatitude}
                                        longitude={longitude} setLongitude={setLongitude}
                                        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                                        handleSearch={handleSearch}
                                    />
                                </div>
                            </div>

                            <div className="mt-10 flex justify-end border-t border-slate-50 pt-6">
                                <button
                                    type={`button`}
                                    onClick={handleSave}
                                    disabled={loading}
                                    className={`w-full md:w-auto px-12 py-3 bg-green-600 text-white rounded-2xl font-bold shadow-xl transition-all active:scale-95
                                        ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700 shadow-green-100"}`}
                                >
                                    {loading ? "İşleniyor..." : "Lokasyonu Kaydet"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Navbar>
        </div>
    );
}
