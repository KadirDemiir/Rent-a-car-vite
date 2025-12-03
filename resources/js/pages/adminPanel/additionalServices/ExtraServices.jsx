import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import Td from "../../../components/adminPanel/table/Td.jsx";
import { useState } from "react";
import ExternalServiceModal from "../../../components/adminPanel/price/ExternalServiceModal.jsx";
import {useTranslation} from "react-i18next";

export default function ExtraServices({ extraServices, success, error }) {
    console.log(extraServices);
    const {t, i18n} = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [instantService, setInstantService] = useState(null);

    const header = [t("adminpanel.pricing.adding_services.external_services.service"), t("adminpanel.pricing.adding_services.external_services.1-3_days_price"), t("adminpanel.pricing.adding_services.external_services.4-7_days_price"), t("adminpanel.pricing.adding_services.external_services.8-15_days_price"), t("adminpanel.pricing.adding_services.external_services.more_than_15_days_price"), t("adminpanel.pricing.adding_services.external_services.stock"), t("adminpanel.pricing.adding_services.external_services.max_limit"), t("adminpanel.pricing.adding_services.external_services.current_stock"), t("adminpanel.pricing.adding_services.external_services.description")];
    const TDclass = "border border-gray-500 px-4 py-2";

    const handleService = (id) => {
        const selected = extraServices.find((es) => es.id === id);
        setInstantService(selected);
        setIsModalOpen(true);
    };

    const createService = () => {
        setInstantService(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setInstantService(null);
    };

    return (
        <div className="w-full min-h-screen">
            <Navbar >
                <h3 className="text-2xl font-extrabold">{t("adminpanel.pricing.adding_services.external_services.external_services")}</h3>
                <hr className="my-4" />
                {error && <div className={`border-l-12 border-red-600 bg-red-400 text-white p-2`}>{error}</div>}
                {success && <div className={`border-l-12 border-green-600 bg-green-400 text-white p-2`}>{success}</div>}
                <div className="w-full">
                    <h2 className="text-xl font-bold p-2">{t("adminpanel.pricing.adding_services.external_services.external_services")}</h2>
                    <table className="w-full">
                        <thead>
                        <tr>
                            <Td contents={header} as="th" cls={TDclass} />
                        </tr>
                        </thead>
                        <tbody>
                        {extraServices.map((es, index) => {
                            const name = JSON.parse(es.name);
                            const description = JSON.parse(es.description);
                            return (
                                <tr key={index} onClick={() => handleService(es.id)} className="cursor-pointer">
                                    <Td
                                        contents={[
                                            name[i18n.language],
                                            es.extra_service_prices.find(e => e.min_days === 1 && e.max_days === 3).price,
                                            es.extra_service_prices.find(e => e.min_days === 4 && e.max_days === 7).price,
                                            es.extra_service_prices.find(e => e.min_days === 8 && e.max_days === 15).price,
                                            es.extra_service_prices.find(e => e.min_days === 16 && e.max_days === 999).price,
                                            es.stock,
                                            es.max_limit,
                                            es.current_count ?? "-",
                                            description[i18n.language]
                                        ]}
                                        cls={TDclass}
                                    />
                                </tr>

                            );
                        })}
                        </tbody>
                    </table>
                </div>

                <div className="w-full flex items-center justify-end pr-4 mt-6">
                    <button
                        onClick={createService}
                        className="w-36 py-2 bg-green-600 hover:bg-green-700 text-white cursor-pointer rounded-xl"
                    >
                        {t("adminpanel.pricing.adding_services.external_services.button.add_new_service")}
                    </button>
                </div>
            </Navbar>

            {isModalOpen && (
                <ExternalServiceModal service={instantService} close={closeModal} />
            )}
        </div>
    );
}
