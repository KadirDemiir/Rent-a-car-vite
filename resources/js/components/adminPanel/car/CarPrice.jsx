import CarForm from "./form/CarForm.jsx";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function CarPrice({ closeModal, car, setCar, setSuccess }) {
    const { t } = useTranslation();
    const submitHandler = (data) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        axios.post(`/adminpanel/car_groups/${car.id}`, data, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },
        })
            .then((res) => {
                closeModal();
                setSuccess("Başarıyla güncellendi");
                setCar(res.data.car);
                setTimeout(() => setSuccess(""), 10000);
            })
            .catch((error) => {
                console.error(error);
                closeModal();
            });
    };

    return (
        <div className="w-full">
            <button onClick={closeModal} className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-500 hover:text-black text-2xl font-bold p-2 cursor-pointer">&times;</button>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 pr-8">{t("adminpanel.car.car_modify.edit_car_information.edit_car_information")}</h2>
            <div className="w-full"><CarForm mode="pricing" car={car} onSubmit={submitHandler} /></div>
            <div className="inline-block mt-4 bg-green-500 hover:bg-green-600 py-2 rounded-lg w-full md:w-auto text-center">
                <Link href="#" className="text-sm text-white p-2 block w-full">Araç Üzerine Uygulanan İndirimler</Link>
            </div>
        </div>
    );
}
