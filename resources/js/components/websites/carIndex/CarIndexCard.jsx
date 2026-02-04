import CarIndexProp from "./CarIndexProp.jsx";
import CarIndexRequirement from "./CarIndexRequirement.jsx";
import CarIndexPhotos from "./CarIndexPhoto.jsx";
import {useTranslation} from "react-i18next";

export default function CarIndexCard({car, internalServices = []}){
    const { t, i18n } = useTranslation();
console.log(internalServices);
    const getServiceName = (service) => {
        if (!service?.name) return "";
        try {
            const nameData = typeof service.name === 'string' ? JSON.parse(service.name) : service.name;
            return nameData[i18n.language] || nameData['en'] || Object.values(nameData)[0] || "";
        } catch (e) {
            return service.name;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <CarIndexPhotos photos={car.photos} alt={car.brand + ' ' + car.model} />

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {t("website.car.services_included_for_this_vehicle")}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {internalServices.length > 0 ? (
                            internalServices.map((service, index) => (
                                <span 
                                    key={service.id || index} 
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-sm font-medium"
                                >
                                    {getServiceName(service)}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500">{t("website.car.no_services_included")}</span>
                        )}
                    </div>
                </div>
            </div>

            <aside className="lg:col-span-1 space-y-4 lg:sticky lg:top-24 self-start">
                <CarIndexProp car={car} />
                <CarIndexRequirement car={car} />
            </aside>
        </div>
    );
}
