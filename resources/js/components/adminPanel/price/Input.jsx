export default function FormInput({ label, type = "text", value, onChange,name, error, setError }) {
    const onCh = (e) => {
        const value = e.target.value;
        if (type === "number") {
            if (!/^\d*\.?\d*$/.test(value))
                setError(prev => ({
                    ...prev,
                    [name]: "Lütfen Sadece Sayı Giriniz."}
                ));
            else setError(prev => ({
                ...prev,
                [name]: null
            }));
        }
        onChange(e);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                name={name}
                value={value}
                onChange={onCh}
                className={`w-full pl-2 pr-4 py-2 border rounded-md bg-white shadow-sm flex justify-between items-center outline-none ${error?.[name] ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error?.[name] && <div className={`pl-2 text-sm text-red-500`}>{error[name]}</div>}
        </div>
    );
}
