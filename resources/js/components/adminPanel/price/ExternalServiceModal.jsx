import Input from "./Input.jsx";
import SelectOptions from "../../websites/filterSelectors/SelectOptions.jsx";
import { useState } from "react";

export default function ExternalServiceModal({ service, close }) {
    const [name, setName] = useState(service?.name || "");
    const [oneThreeDayPrice, setOneThreeDayPrice] = useState(service?.one_three_day_price || "");
    const [fourSevenDayPrice, setFourSevenDayPrice] = useState(service?.four_seven_day_price || "");
    const [eightFifteenDayPrice, setEightFifteenDayPrice] = useState(service?.eight_fifteen_day_price || "");
    const [moreThanFifteenDayPrice, setMoreThanFifteenDayPrice] = useState(service?.more_than_fifteen_day_price || "");
    const [stock, setStock] = useState(service?.stock || "");
    const [maxLimit, setMaxLimit] = useState(service?.max_limit || "");
    const [currentCount, setCurrentCount] = useState(service?.current_count || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name,
            one_three_day_price: oneThreeDayPrice,
            four_seven_day_price: fourSevenDayPrice,
            eight_fifteen_day_price: eightFifteenDayPrice,
            more_than_fifteen_day_price: moreThanFifteenDayPrice,
            stock,
            max_limit: maxLimit,
            current_count: currentCount,
        };
        console.log("GÖNDERİLECEK VERİ:", payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-8 relative">
                <button
                    onClick={close}
                    className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-700 transition"
                    aria-label="Kapat"
                >
                    &times;
                </button>

                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {service ? "Servis Güncelle" : "Yeni Servis Ekle"}
                </h3>
                <hr className="mb-6" />

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Servis Adı" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input label="1-3 Gün Fiyat" type="number" value={oneThreeDayPrice} onChange={(e) => setOneThreeDayPrice(e.target.value)} />
                    <Input label="4-7 Gün Fiyat" type="number" value={fourSevenDayPrice} onChange={(e) => setFourSevenDayPrice(e.target.value)} />
                    <Input label="8-15 Gün Fiyat" type="number" value={eightFifteenDayPrice} onChange={(e) => setEightFifteenDayPrice(e.target.value)} />
                    <Input label="15+ Gün Fiyat" type="number" value={moreThanFifteenDayPrice} onChange={(e) => setMoreThanFifteenDayPrice(e.target.value)} />
                    <Input label="Stok" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                    <Input label="Maximum Sınır" type="number" value={maxLimit} onChange={(e) => setMaxLimit(e.target.value)} />
                    <Input label="Mevcut Sayı" type="number" value={currentCount} onChange={(e) => setCurrentCount(e.target.value)} />
                </form>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={close}
                        className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="ml-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                    >
                        Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
}
