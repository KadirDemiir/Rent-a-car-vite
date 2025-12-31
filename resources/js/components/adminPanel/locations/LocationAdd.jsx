import LocationForm from "./LocationForm.jsx";
import LocationMap from "./LoactionMap.jsx";
import axios from "axios";
import {useEffect, useState} from "react";

export default function LocationAdd({deflocation = null, formData, setFormData, errors, setErrors, locations, latitude, setLatitude, longitude, setLongitude, submit}){
/*    const [latitude, setLatitude] = useState(deflocation?.latitude ?? 0);
    const [longitude, setLongitude] = useState(deflocation?.longitude ?? 0);*/
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    /*const [formData, setFormData] = useState({ name: deflocation?.name ?? '', city: deflocation?.city ?? '', phone: deflocation?.phone ?? '', email: deflocation?.email ?? '', address: deflocation?.address ?? '' });*/
    const locationsOptions = [
        { label: "Yok (Ana Ofis)", value: '' },
        ...(locations?.map(l => ({ label: l.name, value: l.id })) || [])
    ];
    const [selectedParentLocation, setSelectedParentLocation] = useState(locationsOptions[0].value);

    useEffect(() => {
        if(latitude > 0 || longitude > 0) return;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLatitude(pos.coords.latitude);
                setLongitude(pos.coords.longitude);
            });
        }
    }, []);
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

    const handleSave = async () => {
        if (!validate()) return
        setLoading(true);
        const finalData = { ...formData, latitude, longitude, parentId: selectedParentLocation };
        submit(finalData);
    };

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

    return(
        <>
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
        </>
    );
}
