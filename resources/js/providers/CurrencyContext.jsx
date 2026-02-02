import { createContext, useContext, useState, useMemo } from "react";
import { usePage } from "@inertiajs/react";

const CurrencyContext = createContext();
export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const { currencies } = usePage().props;

    const [current, setCurrent] = useState(() => {
        const availableCurrencies = Array.isArray(currencies) ? currencies : [];
        
        if (availableCurrencies.length === 0) return null;

        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("curr-currency");
            
            if (stored) {
                const found = availableCurrencies.find(c => c.code === stored);
                if (found) return found;
            }

            const lang = navigator.language.toLowerCase();
            
            if (lang.includes("tr")) {
                const tryC = availableCurrencies.find(c => c.code.toLowerCase() === "try");
                if (tryC) {
                    localStorage.setItem("curr-currency", tryC.code);
                    return tryC;
                }
            }
            
            const eurC = availableCurrencies.find(c => c.code.toLowerCase() === "eur");
            if (eurC) {
                localStorage.setItem("curr-currency", eurC.code);
                return eurC;
            }
        }

        return availableCurrencies[0];
    });

    const changeCurrency = (curr) => {
        setCurrent(curr);
        if (typeof window !== "undefined") {
            localStorage.setItem("curr-currency", curr.code);
        }
    };

    const calculateTotal = useMemo(() => {
        return (amount = 0, convertToBase = true) => {
            if (!current || !current.exchange_rate) return amount;
            
            return convertToBase 
                ? amount * current.exchange_rate 
                : amount / current.exchange_rate;
        };
    }, [current]);

    const value = useMemo(
        () => ({ currencies: currencies || [], current, changeCurrency, calculateTotal }),
        [currencies, current, calculateTotal]
    );

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};