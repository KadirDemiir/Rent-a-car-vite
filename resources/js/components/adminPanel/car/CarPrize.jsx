import CarForm from "./form/CarForm.jsx";
import React from "react";
import {Link, router} from "@inertiajs/react";
import {useTranslation} from "react-i18next";

export default function CarPrize({closeModal, car}){
    const {t} = useTranslation();
    const submitHandler = (data) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        router.post(`/adminpanel/cars/${car.id}`, data, {
            headers:{
                'X-CSRF-TOKEN': csrfToken,
            },
            onSuccess: () => {
                closeModal();
            },
            onError: () => {
                closeModal();
            }
        })
    };
    return(
        <>
            <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold cursor-pointer"
            >
                &times;
            </button>

            <h2 className="text-2xl font-semibold mb-6">{t("adminpanel.car.car_modify.edit_car_information.edit_car_information")}</h2>

            < CarForm mode="pricing" car={car} onSubmit={submitHandler}/>
            <div className={`inline-block mt-2 bg-green-500 hover:bg-green-600 py-2 rounded-lg`}>
                <Link href="#" className={`text-sm text-white p-2`}>Araç Üzerine Uygulanan İndirimler</Link>
            </div>

        </>
    );
}
