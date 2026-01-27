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

    if (loading) return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        </div>
    );

    if (!services || services.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Check size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                    {t('website.reservation.included_services', 'Fiyata Dahil Hizmetler')}
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service, index) => {
                    let name = {};
                    try {
                        name = typeof service.name === 'string' ? JSON.parse(service.name) : service.name;
                    } catch (e) {
                        name = { [i18n.language]: service.name };
                    }

                    return (
                        <div key={service.id || index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <Check size={16} className="text-green-600" strokeWidth={3} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {name[i18n.language] || name['tr'] || '...'}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
