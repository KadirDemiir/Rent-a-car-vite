import React, { useState } from "react";
import CarForm from "./form/CarForm.jsx";
import {router, usePage} from "@inertiajs/react";

export default function CarModify({ closeModal = null, car = null, }) {
    const {success, error} = usePage().props;
    const handleSubmit = (data) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        router.post(`/adminpanel/cars/${car.id}`, data, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },
            onSuccess: () => {
                closeModal();
            },
            onError: () => {
                closeModal();
            },
        });
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
            < CarForm mode="edit" onSubmit={handleSubmit} car={car}/>


        </>
    );
}
