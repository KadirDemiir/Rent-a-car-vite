import ExternalServiceForm from "./DropPrice/ExternalServiceForm.jsx";
import {router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";
const langOpt = [{ label: "Türkçe", value: "tr" }, { label: "İngilizce", value: "en" }];
export default function ExternalServiceModal({ service, close}) {
const {t} = useTranslation();

    const handleSubmit = (data) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        router.post('/adminpanel/external-services', data, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },
            onSuccess: () => {
                close();
            }
        })
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-8 relative">
                <button
                    onClick={close}
                    className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-700 transition cursor-pointer"
                    aria-label="Kapat"
                >
                    &times;
                </button>

                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {service ? t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.update_service_label") : t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.add_new_service_label")}
                </h3>
                <hr className="mb-6" />
                <ExternalServiceForm service={service} close={close} onSubmit={handleSubmit}/>
            </div>
        </div>
    );
}
