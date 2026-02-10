import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {CarModifyPhoto} from "./CarModifyPhoto.jsx";

const CarModify = lazy(() => import("./CarModify.jsx"));
const CarPrice = lazy(() => import("./CarPrice.jsx"));
const CarPhotoUpload = lazy(() => import("./CarPhotoUpload.jsx"));

export default function ModifyCar({ car, setCar, setSuccess }) {
    const { t } = useTranslation();
    const [modalState, setModalState] = useState({ type: null, isOpen: false });

    const openModal = (type) => setModalState({ type, isOpen: true });

    const closeModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
        setTimeout(() => setModalState({ type: null, isOpen: false }), 300);
    }, []);

    const ModalContent = useMemo(() => {
        if (!modalState.isOpen) return null;

        switch (modalState.type) {
            case 'modify':
                return <CarModify closeModal={closeModal} car={car} setCar={setCar} setSuccess={setSuccess}/>;
            case 'price':
                return <CarPrice closeModal={closeModal} car={car} setCar={setCar} setSuccess={setSuccess}/>;
            case 'photo':
                return <CarPhotoUpload car={car} closeModal={closeModal} setCar={setCar} setSuccess={setSuccess} />;
            default:
                return null;
        }
    }, [modalState.type, modalState.isOpen, car, setCar, setSuccess, closeModal]);

    return (
        <div className="w-full bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-stretch mt-4">
                <div
                    className="w-full lg:flex-1 h-60 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 cursor-pointer hover:opacity-90 transition relative group"
                    onClick={() => openModal('photo')}
                >
                    <CarModifyPhoto photos={car.photos} />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <span className="text-white font-medium">{t("adminpanel.car.car_modify.edit_photos.edito_photos")}</span>
                    </div>
                </div>

                <div className="w-full lg:w-1/3 flex flex-col justify-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                    <h3 className="text-gray-800 font-semibold text-lg mb-2">{t("adminpanel.car.car_modify.operations")}</h3>
                    <button
                        onClick={() => openModal('price')}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer"
                    >
                        {t("adminpanel.car.car_modify.edit_price_information.edit_price_information")}
                    </button>
                    <button
                        onClick={() => openModal('modify')}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition cursor-pointer"
                    >
                        {t("adminpanel.car.car_modify.edit_car_information.edit_car_information")}
                    </button>
                    <button
                        onClick={() => openModal('photo')}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition cursor-pointer"
                    >
                        {t("adminpanel.car.car_modify.edit_photos.edito_photos")}
                    </button>
                </div>
            </div>

            <div className="w-full flex items-center justify-end p-4">
                <button className="px-6 bg-red-500 rounded-lg hover:bg-red-600 text-white text-lg cursor-pointer">
                    {t("adminpanel.car.car_modify.delete")}
                </button>
            </div>

            {modalState.isOpen && (
                <ModalWrapper>
                    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
                        {ModalContent}
                    </Suspense>
                </ModalWrapper>
            )}
        </div>
    );
}

function ModalWrapper({ children }) {
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white w-full md:w-[75%] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 md:p-12 relative overflow-x-hidden">
                {children}
            </div>
        </div>,
        document.body
    );
}
