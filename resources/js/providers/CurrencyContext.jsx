import { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

const CurrencyContext = createContext();
export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const [currencies, setCurrencies] = useState([]);
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("curr-currency");
        if (stored) {
            const cachedList = localStorage.getItem("currencies-cache");
            if (cachedList) {
                try {
                    const parsed = JSON.parse(cachedList);
                    setCurrencies(parsed);
                    const found = parsed.find(c => c.code.toLowerCase() === stored.toLowerCase());
                    if (found) setCurrent(found);
                } catch {}
            }
        }
        const fetchCurrencies = async () => {
            try {
                const { data } = await axios.get("/get-currencies");
                if (!Array.isArray(data) || !data.length) return;
                localStorage.setItem("currencies-cache", JSON.stringify(data));
                let selected = stored;
                if (!selected) {
                    const lang = navigator.language.toLowerCase();
                    const tryC = data.find(c => c.code.toLowerCase() === "try");
                    const eurC = data.find(c => c.code.toLowerCase() === "eur");

                    if (lang.includes("tr") && tryC) selected = tryC.code;
                    else if (eurC) selected = eurC.code;
                    else selected = data[0].code;

                    localStorage.setItem("curr-currency", selected);
                }

                setCurrencies(data);
                setCurrent(data.find(c => c.code.toLowerCase() === selected?.toLowerCase()) || data[0]);
            } catch (err) {
                console.error("Currency fetch error:", err);
            }
        };

        fetchCurrencies();
    }, []);

    const changeCurrency = (curr) => {
        setCurrent(curr);
        localStorage.setItem("curr-currency", curr.code);
    };

    const calculateTotal = useMemo(() => {
        return (a = 0) => {
            if (!current) return a;
            const result = a * current.exchange_rate;
            return parseFloat(result.toFixed(2));
        };
    }, [current]);


    const value = useMemo(
        () => ({ currencies, current, changeCurrency, calculateTotal }),
        [currencies, current, calculateTotal]
    );

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};
