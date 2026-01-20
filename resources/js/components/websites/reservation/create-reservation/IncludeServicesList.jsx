import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";

export default function IncludedServices({ }) {
    const { t, i18n } = useTranslation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            axios.get('/get-included-services')
                .then(res => {
                    setServices(res.data.services);
                })
                .catch(error => {
                    const mesaj = error.response?.data?.message || 'Bir hata oluştu.';
                    console.error(mesaj);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        fetchData();
    }, []);

    if (loading) return <div className="p-6 text-center text-gray-500">Yükleniyor...</div>;

    if (!services || services.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
                {t('website.reservation.included_services', 'Fiyata Dahil Hizmetler')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                {services.map((service, index) => {
                    let name = {};
                    try {
                        name = typeof service.name === 'string' ? JSON.parse(service.name) : service.name;
                    } catch (e) {
                        name = { [i18n.language]: service.name };
                    }

                    return (
                        <div key={service.id || index} className="flex items-center gap-3">
                            <div className="shrink-0 p-1 bg-green-50 rounded-full">
                                <Check size={18} className="text-green-600" strokeWidth={2.5} />
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                                {name[i18n.language] || name['tr'] || 'Hizmet'}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
