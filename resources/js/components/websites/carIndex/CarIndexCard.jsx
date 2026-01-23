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
      <div className="w-full grid lg:grid-cols-10 grid-cols-1 gap-4">
          <div className="lg:col-span-7 sm:col-span-1 flex flex-col gap-16">
            <CarIndexPhotos photos={car.photos}/>
            <div className="w-full border-1 border-blue-800 p-4 rounded-2xl">
              <h1 className="text-xl font-extrabold">{t("website.car.services_included_for_this_vehicle")}</h1>
              <hr className="border-blue-800" /><br /><br />
                <ul className="list-disc ml-4 font-semibold text-gray-700">
                    {internalServices.length > 0 ? (
                        internalServices.map((service, index) => (
                            <li key={service.id || index}>{getServiceName(service)}</li>
                        ))
                    ) : (
                        <li>{t("website.car.no_services_included", "Standart hizmetler dahildir")}</li>
                    )}
                </ul><br /><br /><br /><br />
            </div>
              <br /><br />
          </div>

        <div className="lg:col-span-3 sm-col-span-1 flex flex-col items-center gap-4">
          <CarIndexProp car={car}/>
          <CarIndexRequirement car={car} />
        </div>
      </div>

    );
}
