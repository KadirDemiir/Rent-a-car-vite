import CarForm from "./form/CarForm.jsx";
import { usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function CarModify({ closeModal = null, car = null, setCar }) {
    const { t, i18n } = useTranslation();
    const { success, error } = usePage().props;

    const handleSubmit = async (data) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        try {
            const res = await axios.post(`/adminpanel/cars/${car.id}`, data, {
                headers: { 'X-CSRF-TOKEN': csrfToken },
            });
            setCar(res.data.car);
            closeModal();
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
            {success && (
                <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
                    {success}
                </div>
            )}
            {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
                    {error}
                </div>
            )}
            <CarForm mode="edit" onSubmit={handleSubmit} car={car} />
        </div>
    );
}
