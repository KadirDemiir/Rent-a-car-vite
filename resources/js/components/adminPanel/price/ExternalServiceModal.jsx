import ExternalServiceForm from "./DropPrice/ExternalServiceForm.jsx";
import {router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";
import axios from "axios";
import { useState, useEffect } from "react";
export default function ExternalServiceModal({ service, close}) {
    const {t} = useTranslation();
    const [error, setError] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/get-supported-languages")
            .then(res => {
                const langs = res.data.languages.map(l => ({ label: l.name, value: l.code }));
                setLanguages(langs);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const handleSubmit = (data) => {
        setError(null);
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        axios.post('/adminpanel/external-services', data, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            }
        })
            .then( () => {
                close();
                router.visit(window.location.pathname, {preserveScroll: true});
            })
            .catch(err => {
                let errorMessage = "";
                if (err.response?.data?.errors) {
                    const errors = err.response.data.errors;
                    errorMessage = Object.values(errors).flat().join(", ");
                } else if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response?.data?.error) {
                    errorMessage = err.response.data.error;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                if (errorMessage) {
                    setError(errorMessage);
                }
            });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-8 relative">
                <button onClick={close} className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-700 transition cursor-pointer" aria-label="Kapat">
                    &times;
                </button>

                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {service ? t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.update_service_label") : t("adminpanel.pricing.adding_services.external_services.add_new_service_modal.add_new_service_label")}
                </h3>
                <hr className="mb-6" />
                {error && <div className={`border-l-12 border-red-600 bg-red-400 text-white p-2 mb-4`}>{error}</div>}
                {!loading && <ExternalServiceForm service={service} close={close} onSubmit={handleSubmit} languages={languages}/>}
            </div>
        </div>
    );
}
