import React, { useState } from 'react';

export default function Confirm({ message, confirm }) {
    const handleConfirm = () => {
        confirm(true);
    };

    const handleCancel = () => {
        confirm(false);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
                <h3 className="text-lg font-semibold">{message}</h3>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleConfirm}
                        className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600 cursor-pointer"
                    >
                        Evet
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                    >
                        Hayır
                    </button>
                </div>
            </div>
        </div>
    );
}

