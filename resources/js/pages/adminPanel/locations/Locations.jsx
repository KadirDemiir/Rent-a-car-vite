import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import { useEffect, useState } from "react";
import LocationAdd from "../../../components/adminPanel/locations/LocationAdd.jsx";
import LocationsList from "../../../components/adminPanel/locations/LocationsList.jsx";
import axios from "axios";

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', city: '', phone: '', email: '', address: '', image: null });
    const [latitude, setLatitude] = useState( 0);
    const [longitude, setLongitude] = useState( 0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/adminpanel/get-locations');
            if (response.data.success) {
                setLocations(response.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleSubmit = async (finalData) => {
        const formData = new FormData();
        Object.entries(finalData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });
        try {
            const response = await axios.post('/adminpanel/locations/add', formData, {
                header: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccess("Lokasyon başarıyla kaydedildi!");
                setFormData({ name: '', city: '', phone: '', email: '', address: '', image: null });
                fetchData();
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
            return false;
        }
    }
    return (
        <div className="min-h-screen bg-slate-50 relative">
            <Navbar>
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Lokasyon Yönetimi</h1>
                            <p className="text-slate-500 text-sm">Ofis ekleme ve harita yönetimi.</p>
                        </div>
                        <button type={`button`} onClick={() => setIsModalOpen(!isModalOpen)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">
                            {isModalOpen ? 'İptal' : 'Yeni Lokasyon Ekle'}
                        </button>
                    </div>

                    <div className="mb-6 space-y-2">
                        {Object.keys(errors).length > 0 && typeof errors === 'object' && (
                            <div className="space-y-1.5 animate-in fade-in duration-300">
                                {Object.keys(errors).map((key) => (
                                    errors[key] && key !== 'map' && (
                                        <div key={key} className="flex items-center text-xs font-medium text-rose-500 bg-rose-50/30 px-3 py-2 rounded-lg border border-rose-100/50">
                                            <span className="mr-2">●</span>
                                            {Array.isArray(errors[key]) ? errors[key][0] : errors[key]}
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50/30 px-3 py-2 rounded-lg border border-emerald-100/50 animate-in fade-in duration-300">
                                <span className="mr-2">✓</span>
                                {success}
                            </div>
                        )}
                    </div>
                    <br/>
                    {isModalOpen && (
                        <div className={``}>
                            <LocationAdd formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} locations={locations} setLatitude={setLatitude} setLongitude={setLongitude} latitude={latitude} longitude={longitude} submit={handleSubmit}/>
                        </div>
                    )}
                </div>

                <div>
                    <LocationsList locations={locations} />
                </div>
            </Navbar>
        </div>
    );
}
