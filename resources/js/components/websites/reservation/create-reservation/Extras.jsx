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
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        )
    return(
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">...</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {extras?.map(e => {
                    let name = JSON.parse(e.name);
                    let description = JSON.parse(e.description);
                    const isSelected = selectedExtras[e.id];
                    const {price, currency_id} = e.extra_service_prices.find(p => p.min_days <= car.total_days && p.max_days >= car.total_days);
                    return(
                        <div 
                            key={e.id} 
                            className={`relative group rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                                isSelected 
                                    ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-700 shadow-md' 
                                    : 'bg-white border-2 border-gray-200 hover:border-gray-400 hover:shadow-md'
                            }`} 
                            onClick={() => handleToggle(e.id, price, currency_id)}
                        >
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-800 mb-2 truncate">{name[i18n.language]}</div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                            {e.type}
                                        </span>
                                        <span className="font-semibold text-gray-700">
                                            {calculateTotal(price).toFixed(2)} {current.symbol}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <div className={`h-7 w-7 ring-2 rounded-full flex items-center justify-center transition-all ${
                                        isSelected ? 'ring-gray-700 bg-gray-700' : 'ring-gray-300 bg-white'
                                    }`}>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    
                                    {isSelected && e.type === 'daily' && (
                                        <div className="flex items-center gap-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg px-2 py-1 shadow-md" onClick={(e) => e.stopPropagation()}>
                                            <button 
                                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-gray-700 hover:bg-gray-100 transition-colors font-bold text-sm"
                                                onClick={() => updateQuantity(e.id, e.currentStock, e.max_limit, false)}
                                            >
                                                −
                                            </button>
                                            <div className="w-8 text-center text-white font-semibold">{selectedExtras[e.id].count}</div>
                                            <button 
                                                className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-gray-700 hover:bg-gray-100 transition-colors font-bold text-sm"
                                                onClick={() => updateQuantity(e.id, e.currentStock, e.max_limit, true)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
                                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl max-w-xs whitespace-normal">
                                    {description[i18n.language]}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                        <div className="border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
