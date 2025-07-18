import Navbar from "../../../components/adminPanel/navbar/Navbar.jsx";
import Td from "../../../components/adminPanel/table/Td.jsx";
import { useState } from "react";
import ExternalServiceModal from "../../../components/adminPanel/price/ExternalServiceModal.jsx";

export default function ExtraServices({ extraServices }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [instantService, setInstantService] = useState(null);

    const header = ["Ekstra Hizmet", "1-3 Günlük Fiyat", "4-7 Günlük Fiyat", "8-15 Günlük Fiyat", "15+ Fiyat", "Stok", "Max Sınır", "Mevcut Sayı", "Açıklama"];
    const TDclass = "border border-gray-500 px-4 py-2";

    const handleService = (id) => {
        const selected = extraServices.find((es) => es.id === id);
        setInstantService(selected);
        setIsModalOpen(true);
    };

    const createService = () => {
        setInstantService(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setInstantService(null);
    };

    return (
        <div className="w-full min-h-screen">
            <Navbar />
            <div className="pl-64 pt-24 pr-4">
                <h3 className="text-2xl font-extrabold">Ekstra Hizmetler</h3>
                <hr className="my-4" />

                <div className="w-full">
                    <h2 className="text-xl font-bold p-2">Ekstra Hizmetler</h2>
                    <table className="w-full">
                        <thead>
                        <tr>
                            <Td contents={header} as="th" cls={TDclass} />
                        </tr>
                        </thead>
                        <tbody>
                        {extraServices.map((es, index) => {
                            return (
                                <tr key={index} onClick={() => handleService(es.id)} className="cursor-pointer">
                                    <Td
                                        contents={[
                                            es.name,
                                            es.one_three_day_price,
                                            es.four_seven_day_price,
                                            es.eight_fifteen_day_price,
                                            es.more_than_fifteen_day_price,
                                            es.stock,
                                            es.max_limit,
                                            es.current_count ?? "-",
                                            es.description
                                        ]}
                                        cls={TDclass}
                                    />
                                </tr>

                            );
                        })}
                        </tbody>
                    </table>
                </div>

                <div className="w-full flex items-center justify-end pr-4 mt-6">
                    <button
                        onClick={createService}
                        className="w-36 py-2 bg-green-600 hover:bg-green-700 text-white cursor-pointer rounded-xl"
                    >
                        Yeni Servis Ekle
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <ExternalServiceModal service={instantService} close={closeModal} />
            )}
        </div>
    );
}
