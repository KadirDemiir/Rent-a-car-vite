import React, {useEffect, useState} from "react";

export default function PriceInput ({ initialValue, onSave, validate, error, className = "" }) {
    const [localValue, setLocalValue] = useState(initialValue || '');
    useEffect(() => {
        setLocalValue(initialValue || '');
    }, [initialValue]);

    const handleBlur = () => {
        if (localValue === initialValue) return;
        validate(localValue);
        onSave(localValue);
    };

    return (
        <div className={``}>
            <input
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                className={`w-full border-gray-300 px-2 rounded-lg outline-none border-2 transition-all ${
                    error ? 'border-red-500' : ''
                } ${className}`}
            />
        </div>
    );
};
