import CarForm from "./form/CarForm.jsx";
import React from "react";

export default function CarPrize({closeModal, car}){
    return(
        <>
            <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
            >
                &times;
            </button>

            <h2 className="text-2xl font-semibold mb-6">Araç Fiyat Bilgilerin Düzenle</h2>

            < CarForm mode="pricing" car={car}/>

        </>
    );
}
