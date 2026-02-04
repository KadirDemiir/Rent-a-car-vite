import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useCurrency } from "../../../../providers/CurrencyContext.jsx";
import PriceInput from "./PriceInput.jsx";

export default function CarPriceDetailForm({ data, setData, errors, setErrors }) {
    const { calculateTotal, currencies } = useCurrency();
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const dayKeys = useMemo(() => Object.keys(data.price?.[1] || {}), [data.price]);

    const parseRange = useCallback((val) => {
        if (!val || typeof val !== 'string') return null;
        const trimmed = val.trim();
        if (trimmed.endsWith("+")) {
            const num = Number(trimmed.replace("+", ""));
            return isNaN(num) || num <= 0 ? null : { min: num, max: Infinity };
        }
        if (trimmed.includes("-")) {
            const [a, b] = trimmed.split("-").map(s => Number(s.trim()));
            return isNaN(a) || isNaN(b) || a <= 0 || b <= 0 || a >= b ? null : { min: a, max: b };
        }
        return null;
    }, []);

    const validateDays = useCallback((value, dayIndex) => {
        if (!value || value.trim() === '') return { error: "Boş olamaz" };
        const current = parseRange(value);
        if (!current) return { error: "Geçersiz format (örn: 1-3, 4-7, 8+)" };

        for (let i = 0; i < dayKeys.length; i++) {
            if (i === dayIndex) continue;
            const other = parseRange(dayKeys[i]);
            if (!other) continue;
            if (current.max === Infinity && other.max === Infinity) return { error: "İki sonsuz değer olamaz" };
            if (current.min <= other.max && current.max >= other.min) return { error: `${dayKeys[i]} ile çakışıyor` };
        }
        return { error: "" };
    }, [dayKeys, parseRange]);

    const updateDayKey = useCallback((oldKey, newKey) => {
        setData(prev => {
            const newPrice = {};
            Object.entries(prev.price).forEach(([month, daysObj]) => {
                const updatedDays = {};
                Object.entries(daysObj).forEach(([key, value]) => {
                    updatedDays[key === oldKey ? newKey : key] = value;
                });
                newPrice[month] = updatedDays;
            });
            return { ...prev, price: newPrice };
        });
    }, [setData]);

    const handleDayKeyChange = useCallback((oldKey, newKey, index) => {
        const validation = validateDays(newKey, index);
        setErrors(prev => ({ ...prev, month: { ...prev.month, [index]: validation.error } }));
        if (!validation.error && oldKey !== newKey) {
            updateDayKey(oldKey, newKey);
        }
    }, [validateDays, updateDayKey, setErrors]);
    const addColumn = useCallback(() => {
        const uniqueSuffix = Math.floor(Math.random() * 1000);
        const newKey = `yeni-${uniqueSuffix}`;

        setData(prev => {
            const updatedPrice = { ...prev.price };
            months.forEach((_, idx) => {
                const monthNum = idx + 1;
                updatedPrice[monthNum] = { ...updatedPrice[monthNum], [newKey]: "" };
            });
            return { ...prev, price: updatedPrice };
        });
    }, [setData, months]);

    const removeColumn = useCallback((dayKey) => {
        if (dayKeys.length <= 1) {
            setErrors(p => ({ ...p, global: "En az bir sütun bulunmalıdır" }));
            return;
        }
        setData(prev => {
            const filteredPrice = {};
            Object.entries(prev.price).forEach(([month, daysObj]) => {
                const { [dayKey]: _, ...remainingDays } = daysObj;
                filteredPrice[month] = remainingDays;
            });
            return { ...prev, price: filteredPrice };
        });
    }, [dayKeys, setData, setErrors]);

    const copyColumn = useCallback((dayKey) => {
        setData(prev => {
            const copiedPrice = {};
            Object.entries(prev.price).forEach(([month, daysObj]) => {
                copiedPrice[month] = { ...daysObj, [dayKey]: daysObj[dayKey] || prev.price[1][dayKey] };
            });
            return { ...prev, price: copiedPrice };
        });
    }, [setData]);

    const runPriceValidation = (value, monthIndex, dayKey) => {
        const isValid = !value.trim() || /^\d+(\.\d{1,2})?$/.test(value);
        const err = isValid ? "" : "Geçersiz fiyat";
        setErrors(prev => ({
            ...prev,
            price: {
                ...prev.price,
                [monthIndex + 1]: { ...(prev.price?.[monthIndex + 1] || {}), [dayKey]: err }
            }
        }));
    };

    return (
        <div className="w-full shadow-lg overflow-x-auto bg-white rounded-lg">
            <div className="p-3 md:p-4 flex items-center gap-2 md:gap-4">
                <button
                    type="button"
                    className="px-3 md:px-4 py-2 text-xs md:text-sm bg-green-500 rounded-md text-white hover:bg-green-600 transition-colors whitespace-nowrap"
                    onClick={() => {
                        setData(prev => ({
                            ...prev,
                            price: Object.fromEntries(Object.entries(prev.price).map(([m, d]) => [m, Object.fromEntries(Object.keys(d).map(k => [k, 1]))]))
                        }));
                    }}
                >
                    Tüm Günlere 1 Ekle
                </button>
            </div>

            <div className="p-3 md:p-4 overflow-x-auto">
                <table className="border-separate border-spacing-4 md:border-spacing-4" style={{minWidth: 'max-content'}}>
                    <thead>
                    <tr>
                        <th className="min-w-16 md:min-w-32"></th>
                        {dayKeys.map((dayKey, index) => (
                            <th key={dayKey} className="relative min-w-20 md:min-w-36">
                                <div className="group relative">
                                    <div className="absolute -top-6 left-0 right-0 flex justify-between px-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
                                        <button type="button" onClick={() => copyColumn(dayKey)} className="bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] hover:bg-gray-800 shadow-sm" title="Sütunu Kopyala">C</button>
                                        <button type="button" onClick={() => removeColumn(dayKey)} className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow-sm" title="Sütunu Sil">&times;</button>
                                    </div>
                                    <input
                                        defaultValue={dayKey}
                                        onBlur={(e) => handleDayKeyChange(dayKey, e.target.value, index)}
                                        className={`outline-none bg-gray-100 rounded-md w-full text-center px-1 md:px-2 py-1 md:py-1.5 transition-all font-medium text-xs md:text-sm ${errors.month?.[index] ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-gray-400'}`}
                                    />
                                </div>
                                {errors.month?.[index] && (
                                    <p className="text-red-500 text-[9px] md:text-[10px] absolute -bottom-4 md:-bottom-5 left-0 right-0 font-bold whitespace-nowrap overflow-hidden text-ellipsis">{errors.month[index]}</p>
                                )}
                            </th>
                        ))}
                        <th className="min-w-8 md:min-w-10">
                            <button type="button" onClick={addColumn} className="w-8 h-8 bg-green-500 rounded-full text-white hover:bg-green-600 transition-transform active:scale-90 shadow-md">+</button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {months.map((month, i) => (
                        <tr key={month}>
                            <th className="bg-gray-200 rounded-md px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-bold text-gray-900 min-w-16 md:min-w-32">{month}</th>
                            {dayKeys.map((dayKey) => {
                                const rawVal = data.price[i + 1]?.[dayKey];
                                const selectedCurr = currencies.find(c => c.id === data.currency);
                                return (
                                    <td key={dayKey} className="min-w-20 md:min-w-36">
                                        <PriceInput
                                            initialValue={rawVal}
                                            error={errors?.price?.[i + 1]?.[dayKey]}
                                            validate={(val) => runPriceValidation(val, i, dayKey)}
                                            onSave={(val) => {
                                                const finalVal = calculateTotal(val, selectedCurr, false);
                                                setData(prev => ({
                                                    ...prev,
                                                    price: {
                                                        ...prev.price,
                                                        [i + 1]: { ...(prev.price[i + 1] || {}), [dayKey]: val }
                                                    }
                                                }));
                                            }}
                                        />
                                    </td>
                                );
                            })}
                            <td className="min-w-8 md:min-w-10"></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
