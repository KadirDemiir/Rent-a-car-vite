import CarForm from "./form/CarForm.jsx";
import { usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import SuccessMessage from "../../SuccessMessage.jsx";

export default function CarModify({ closeModal = null, car = null, setCar, setSuccess }) {
    const { t, i18n } = useTranslation();
    const { success, error } = usePage().props;

    const handleSubmit = async (data) => {
        console.log("Submitting data:", Object.fromEntries(data.entries()));
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        try {
            const res = await axios.post(`/adminpanel/car_groups/${car.id}`, data, {
                headers: { 'X-CSRF-TOKEN': csrfToken },
            });
            closeModal();
            setSuccess("Başarıyla güncellendi");
            setCar(res.data.car);
            setTimeout(() => setSuccess(""), 10000);
        } catch (error) {
            console.error(error);
            closeModal();
        }
    };

    return (
        <div className="w-full">
            <button
                onClick={closeModal}
                className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-500 hover:text-black text-2xl font-bold p-2"
            >
                &times;
            </button>

            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 pr-8">{t("adminpanel.car.car_modify.edit_car_information.edit_car_information")}</h2>
            <SuccessMessage message={success} />
            {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
                    {error}
                </div>
            )}
            <CarForm mode="edit" onSubmit={handleSubmit} car={car} />
        </div>
    );
}
