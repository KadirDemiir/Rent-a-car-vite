import React, { useState } from "react";
import CarForm from "./form/CarForm.jsx";

export default function CarModify({ closeModal = null, car = null }) {

    const handleSubmit = (e) => {
        console.log("Güncellenmiş araç:", e);
    };

    return (
        <>
            <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
            >
                &times;
            </button>

            <h2 className="text-2xl font-semibold mb-6">Araç Bilgilerini Düzenle</h2>

            < CarForm mode="edit" onSubmit={handleSubmit} car={car}/>


        </>
    );
}
