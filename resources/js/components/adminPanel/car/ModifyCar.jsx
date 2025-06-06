import {useState} from "react";
import CarModify from "./CarModify.jsx";
import CarPrize from "./CarPrize.jsx";

export default function ModifyCar({car}){
    const [openCarModify, setOpenCarModify] = useState(false);
    const [openCarPrice, setOpenCarPrice] = useState(false);

   const closeModalCM = () => {
       setOpenCarModify(false);
   }

    const closeModalCp = () => {
       setOpenCarPrice(false);
    }
    return(
        <div className="w-full flex justify-between p-8 bg-white rounded-xl shadow-md">
            <div className="h-60 w-80 border border-gray-300 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 cursor-pointer">
                Fotoğraflar
            </div>

            <div className="flex flex-col gap-4 items-end">
                <button onClick={() => setOpenCarModify(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer">
                    Araç Düzenle
                </button>
                <button onClick={()=> setOpenCarPrice(true)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition cursor-pointer">
                    Fiyat Düzenle
                </button>
            </div>

            {openCarModify && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white-30">
                    <div className="bg-white w-[90%] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 relative">
                        < CarModify closeModal={closeModalCM} car={car}/>
                    </div>
                </div>
            )}

            {openCarPrice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white-30">
                    <div className="bg-white w-[90%] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 relative">
                        < CarPrize closeModal={closeModalCp} car={car}/>
                    </div>
                </div>
            )}
        </div>
    );
}
