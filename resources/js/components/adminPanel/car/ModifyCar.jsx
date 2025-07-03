import { useState } from "react";
import CarModify from "./CarModify.jsx";
import CarPrize from "./CarPrize.jsx";
import CarPhotoUpload from "./CarPhotoUpload.jsx";
import CarModifyPhoto from "./CarModifyPhoto.jsx";

export default function ModifyCar({ car }) {
  const [openCarModify, setOpenCarModify] = useState(false);
  const [openCarPrice, setOpenCarPrice] = useState(false);
  const [openUploadPhoto, setOpenUploadPhoto] = useState(false);

  const closeModalCM = () => setOpenCarModify(false);
  const closeModalCp = () => setOpenCarPrice(false);
  const closeModalUP = () => setOpenUploadPhoto(false);

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div
          className="flex-1 min-w-[300px] h-60 border border-gray-300 rounded-lg overflow-hidden bg-gray-50 cursor-pointer hover:opacity-90 transition"
          onClick={() => setOpenUploadPhoto(true)}
        >
          <CarModifyPhoto />
        </div>

        <div className="w-full lg:w-1/3 flex flex-col justify-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-gray-800 font-semibold text-lg mb-2">İşlemler</h3>
          <button
            onClick={() => setOpenCarPrice(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer"
          >
            Fiyat Bilgisi Düzenle
          </button>
          <button
            onClick={() => setOpenCarModify(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            Araç Bilgisi Düzenle
          </button>
          <button
            onClick={() => setOpenUploadPhoto(true)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition cursor-pointer"
          >
            Fotoğrafları Düzenle
          </button>
        </div>
      </div>

      {openCarModify && (
        <ModalWrapper>
          <CarModify closeModal={closeModalCM} car={car} />
        </ModalWrapper>
      )}
      {openCarPrice && (
        <ModalWrapper>
          <CarPrize closeModal={closeModalCp} car={car} />
        </ModalWrapper>
      )}
      {openUploadPhoto && (
        <ModalWrapper>
          <CarPhotoUpload closeModal={closeModalUP} />
        </ModalWrapper>
      )}
    </div>
  );
}

function ModalWrapper({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white w-[50%] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-12 relative">
            {children}
        </div>
    </div>
  );
}
