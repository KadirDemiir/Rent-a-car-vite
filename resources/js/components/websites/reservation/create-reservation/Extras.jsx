import {useEffect, useState} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import {useCurrency} from "../../../../providers/CurrencyContext.jsx";

export default function Extras({car, selectedExtras, setSelectedExtras}){
    const { current, calculateTotal} = useCurrency();
    const {i18n} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [extras, setExtras] = useState([]);
    useEffect(() => {
        const fetchData = () => {
            axios.get('/get-extras')
                .then(res => {
                    setExtras(res.data.extras);
                    console.log(res.data.extras[0]);
                })
                .catch(error => {
                    const mesaj = error.response?.data?.message || 'Bir hata oluştu.';
                    console.error(mesaj);
                });
        }
        fetchData();
        setLoading(false);
    }, []);
    const handleToggle = (extraId, extraprice, currency_id) => {
        setSelectedExtras(prev => {
            const newState = { ...prev };
            if (newState[extraId]) {
                delete newState[extraId];
            } else {
                newState[extraId] = {count: 1,price: extraprice, currency_id: currency_id};
            }
            return newState;
        });
    };

    const updateQuantity = (id, stock, limit, up) => {
        if(up && stock === 0)
            return;
        if(up && selectedExtras[id].count === limit)
            return;
        if(!up && selectedExtras[id].count === 1)
            return handleToggle(id);
        if(up)
            setSelectedExtras(p => ({ ...p, [id]: { ...p[id], count: p[id].count + 1 }}));
        else
            setSelectedExtras(p => ({ ...p, [id]: { ...p[id], count: p[id].count - 1 }}));

    }

    if(loading)
        return <>loading...</>
    return(
        <div className={`bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-6 rounded-2xl shadow-md`}>
            <div className={`col-span-full`}>
                <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
                    Ekstra Hizmetler
                </h2>
            </div>
            {extras?.map(e => {
                console.log(selectedExtras);
                let name = JSON.parse(e.name);
                let description = JSON.parse(e.description);
                const isSelected = selectedExtras[e.id];
                const {price, currency_id} = e.extra_service_prices.find(p => p.min_days <= car.total_days && p.max_days >= car.total_days);
                return(
                    <div key={e.id} className={`relative group rounded-lg shadow-lg  flex justify-between p-4 ${isSelected ? 'bg-blue-100 border-2 border-blue-600' : 'bg-white border-2 border-gray-200 hover:bg-gray-50'} cursor-pointer`} onClick={() => handleToggle(e.id, price, currency_id)}>
                        <div className={`flex flex-col gap-2`}>
                            <div className={`font-bold `}>{name[i18n.language]}</div>
                            <div className={`text-sm`}><span className={`text-sm font-thin text-gray-700`}>{e.type}</span>: <span>{calculateTotal(price).toFixed(2)} {current.symbol}</span></div>
                        </div>
                        <div className={`flex flex-col items-end justify-end gap-2`}>
                            <div>
                                <div className={`h-6 w-6 ring-2 ring-blue-600 rounded-full flex items-center justify-center`}>
                                    <div className={`h-4 w-4 rounded-full transition-all ${isSelected ? 'bg-blue-600' : 'bg-white'}`}></div>
                                </div>
                            </div>
                            {isSelected && e.type === 'daily' && (
                                <div className="flex items-center gap-2 bg-blue-500 rounded-full px-3 py-1" onClick={(e) => e.stopPropagation()}>
                                    <button className="w-5 h-5 flex items-center justify-center rounded-full bg-white shadow text-lg leading-none" onClick={() => updateQuantity(e.id, e.currentStock, e.max_limit, false)}>−</button>
                                    <div className="w-5 text-center text-white">{selectedExtras[e.id].count}</div>
                                    <button className="w-5 h-4 flex items-center justify-center rounded-full bg-white shadow text-lg leading-none" onClick={() => updateQuantity(e.id, e.currentStock, e.max_limit, true)}>+</button>
                                </div>
                            )}
                        </div>
                        <div className={` absolute bottom-full bg-blue-600 rounded-xl mb-2 p-2 text-white text-xs left-0 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 max-w-xs break-words whitespace-normal`}>{description[i18n.language]}</div>
                    </div>
                )
            })}
        </div>
    );
}
