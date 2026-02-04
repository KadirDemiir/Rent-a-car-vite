import { useState } from "react";
import CarModify from "./CarModify.jsx";
import CarPrize from "./CarPrize.jsx";
import CarPhotoUpload from "./CarPhotoUpload.jsx";
import CarModifyPhoto from "./CarModifyPhoto.jsx";
import { useTranslation } from "react-i18next";

export default function ModifyCar({ car, setCar, setSuccess }) {
    const { t } = useTranslation();
    const [openCarModify, setOpenCarModify] = useState(false);
    const [openCarPrice, setOpenCarPrice] = useState(false);
    const [openUploadPhoto, setOpenUploadPhoto] = useState(false);

    const closeModalCM = () => setOpenCarModify(false);
    const closeModalCp = () => setOpenCarPrice(false);
    const closeModalUP = () => setOpenUploadPhoto(false);

    return (
        <div className="w-full bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-stretch mt-4">
                <div
                    className="w-full lg:flex-1 h-60 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 cursor-pointer hover:opacity-90 transition relative group"
                    onClick={() => setOpenUploadPhoto(true)}
                >
                    <CarModifyPhoto photos={car.photos} />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <span className="text-white font-medium">{t("adminpanel.car.car_modify.edit_photos.edito_photos")}</span>
                    </div>
                </div>

                <div className="w-full lg:w-1/3 flex flex-col justify-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                    <h3 className="text-gray-800 font-semibold text-lg mb-2">{t("adminpanel.car.car_modify.operations")}</h3>
                    <button
                        onClick={() => setOpenCarPrice(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer"
                    >
                        {t("adminpanel.car.car_modify.edit_price_information.edit_price_information")}
                    </button>
                    <button
                        onClick={() => setOpenCarModify(true)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition cursor-pointer"
                    >
                        {t("adminpanel.car.car_modify.edit_car_information.edit_car_information")}
                    </button>
                    <button
                        onClick={() => setOpenUploadPhoto(true)}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition cursor-pointer"
                    >
                        {t("adminpanel.car.car_modify.edit_photos.edito_photos")}
                    </button>
                </div>
            </div>

            {openCarModify && (
                <ModalWrapper>
                    <CarModify closeModal={closeModalCM} car={car} setCar={setCar} />
                </ModalWrapper>
            )}
            {openCarPrice && (
                <ModalWrapper>
                    <CarPrize closeModal={closeModalCp} car={car} setCar={setCar} />
                </ModalWrapper>
            )}
            {openUploadPhoto && (
                <ModalWrapper>
                    <CarPhotoUpload car={car} closeModal={closeModalUP} setCar={setCar} setSuccess={setSuccess} />
                </ModalWrapper>
            )}
            <div className="w-full flex items-center justify-end p-4">
                <button className="px-6 bg-red-500 rounded-lg hover:bg-red-600 text-white text-lg cursor-pointer">
                    {t("adminpanel.car.car_modify.delete")}
                </button>
            </div>
        </div>
    );
}

function ModalWrapper({ children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white w-full md:w-[75%] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 md:p-12 relative overflow-x-hidden">
                {children}
            </div>
        </div>
    );
}
