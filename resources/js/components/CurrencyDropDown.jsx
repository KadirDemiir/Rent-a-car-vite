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
        <div ref={dropdownRef} className="w-24 relative flex flex-col items-center gap-2">
            <button type={`button`} onClick={() => setOpen(!open)} className="w-full px-2 py-1 border rounded-xl flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold">{current?.symbol} {current?.code}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" /></svg>
            </button>

            {open && (
                <ul className="absolute top-full mt-1 bg-white border rounded shadow-md w-full z-40 text-center max-h-60 overflow-auto">
                    {currencies.map(curr => (
                        <li
                            key={curr.id} className={`flex items-center justify-center gap-2 px-4 py-2 cursor-pointer ${current.code === curr.code ? 'bg-blue-800 text-white' : ''}`} onClick={() => { changeCurrency(curr); setOpen(false); }}>
                            <span className="font-semibold">{curr.symbol}</span>
                            <span className="font-semibold">{curr.name}</span>
                            <span>{curr.code.toUpperCase()}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
