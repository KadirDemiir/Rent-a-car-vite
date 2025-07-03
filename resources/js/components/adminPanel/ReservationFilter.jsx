import { useState } from "react";
import SelectOptions from "../websites/filterSelectors/SelectOptions.jsx";

export default function ReservationFilter() {
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState("");
    const [filter, setFilter] = useState("");

    return (
        <div className="w-full p-4 rounded-xl shadow flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-44">
                <SelectOptions
                    value={sort}
                    onChange={setSort}
                    options={[
                        { label: "Önerilen", value: "primary" },
                        { label: "Fiyata Göre (artan)", value: "priceInc" },
                        { label: "Fiyata Göre (azalan)", value: "priceDesc" },
                        { label: "Tarihe Göre (önce en yeni)", value: "recently" },
                        { label: "Tarihe Göre (önce en eski)", value: "oldest" },
                    ]}
                    options_name="Sırala"
                />
            </div>


            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-36">
                <SelectOptions
                    value={status}
                    onChange={setStatus}
                    options={[
                        { label: "Aktif", value: "active" },
                        { label: "Beklemede", value: "pending" },
                        { label: "İptal", value: "cancelled" },
                        { label: "Tamamlandı", value: "completed" },
                    ]}
                    options_name="Durum"
                />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:ml-auto">
                <label className="text-sm font-medium text-gray-700">Filtrele:</label>
                <input
                    type="text"
                    placeholder="Kullanıcı, araç vb."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded px-3 py-1 text-sm w-full sm:w-auto"
                />
            </div>
        </div>
    );
}
