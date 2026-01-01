import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import LocationAdd from "../../../components/adminPanel/locations/LocationAdd.jsx";
import CarTable from "../../../components/adminPanel/car/CarTable.jsx";

export default function IndexLocation({ id }) {
    const [location, setLocation] = useState(null);
    const [locations, setLocations] = useState(null);
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [formData, setFormData] = useState({ name: '', city: '', phone: '', email: '', address: '', image: null });

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        if (location) {
            setFormData({
                name: location.name || '',
                city: location.city || '',
                phone: location.phone || '',
                email: location.email || '',
                address: location.address || '',
                image: location.photo_path ? `/storage/${location.photo_path}` : ''
            });
            setLatitude(Number(location.latitude) || 0);
            setLongitude(Number(location.longitude) || 0);
        }
    }, [location]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/adminpanel/get-info/locations/${id}`);
            setLocation(response.data.location);
            setLocations(response.data.locations);
            setLoading(false);
        } catch (err) {
            console.error("Veri çekme hatası:", err);
            setErrors({ fetch: "Lokasyon bilgileri yüklenirken bir hata oluştu." });
            setLoading(false);
        }
    };

    const handleSubmit = async (finalData) => {
        console.log(finalData);
        setErrors({});
        try {
            const response = await axios.post(`/adminpanel/locations/update/${id}`, finalData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccess("Lokasyon başarıyla kaydedildi!");
                fetchData();
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: "Bir hata oluştu, lütfen tekrar deneyin." });
            }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <Navbar>
            <div className="p-4 md:p-8 space-y-6">
                <section>
                    <LocationAdd
                        deflocation={location}
                        longitude={longitude}
                        submit={handleSubmit}
                        setLongitude={setLongitude}
                        latitude={latitude}
                        setLatitude={setLatitude}
                        formData={formData}
                        setFormData={setFormData}
                        errors={errors}
                        setErrors={setErrors}
                        refresh={fetchData}
                        setSuccess={setSuccess}
                        locations={locations}
                    />
                </section>

                <section className="space-y-4">
                    <div className="w-full flex items-center justify-center font-extrabold text-xl text-slate-800">
                        Bu Ofise Ait Araçlar
                    </div>
                    <div className="shadow-xl bg-white rounded-3xl overflow-hidden border border-slate-100">
                        <CarTable cars={location?.cars || []} />
                    </div>
                </section>
            </div>
        </Navbar>
    );
}
