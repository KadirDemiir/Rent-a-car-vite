import CarIndexProp from "./CarIndexProp.jsx";
import CarIndexRequirement from "./CarIndexRequirement.jsx";
import CarIndexPhotos from "./CarIndexPhoto.jsx";
import {useTranslation} from "react-i18next";

export default function CarIndexCard({car, internalServices = []}){
    const { t, i18n } = useTranslation();

    const getServiceName = (service) => {
        if (!service?.name) return "";
        try {
            // Check if it's already an object
            const nameData = typeof service.name === 'string' ? JSON.parse(service.name) : service.name;
            return nameData[i18n.language] || nameData['en'] || Object.values(nameData)[0] || "";
        } catch (e) {
            return service.name; // Fallback to raw string
        }
    };

    return (
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <CarIndexPhotos photos={car.photos}/>

            <div className="w-full bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-lg font-semibold mb-3">{t("website.car.services_included_for_this_vehicle")}</h2>
              <div className="flex flex-wrap gap-2">
                {internalServices.length > 0 ? (
                    internalServices.map((service, index) => (
                        <span key={service.id || index} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">{getServiceName(service)}</span>
                    ))
                ) : (
                    <span className="text-sm text-gray-500">{t("website.car.no_services_included")}</span>
                )}
              </div>
            </div>
          </div>

        <aside className="lg:col-span-1 w-full sticky top-24">
          <CarIndexProp car={car}/>
          <div className="h-4" />
          <CarIndexRequirement car={car} />
        </aside>
      </div>

    );
}
