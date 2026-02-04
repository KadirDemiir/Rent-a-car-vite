import { useState, useRef, useEffect } from "react";
import { useCurrency } from "../providers/CurrencyContext.jsx";

export default function CurrencyDropDown() {
    const { currencies, current, changeCurrency } = useCurrency();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = e => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="w-32 relative flex flex-col items-center">
            <button type={`button`} onClick={() => setOpen(!open)} className="w-full px-2 py-1.5 border border-gray-400/60 bg-gray-500 text-white rounded-xl flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm font-semibold">{current?.symbol} {current?.code}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" /></svg>
            </button>

            {open && (
                <ul className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-full z-40 text-center max-h-60 overflow-auto">
                    {currencies.map(curr => (
                        <li
                            key={curr.id} className={`flex items-center justify-center gap-2 px-3 py-2 text-sm cursor-pointer ${current.code === curr.code ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => { changeCurrency(curr); setOpen(false); }}>
                            <span className="font-semibold">{curr.symbol}</span>
                            <span className="font-semibold">{curr.name}</span>
                            <span className="font-medium">{curr.code.toUpperCase()}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
