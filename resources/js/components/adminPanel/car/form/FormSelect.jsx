export default function FormSelect({ name, label, value, options, onChange, required = true }) {
    return (
        <div>
            <label className="block text-gray-700 mb-1">{label}</label>
            <select
                name={name}
                value={value || ""}
                onChange={onChange}
                required={required}
                className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Seçiniz</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
}
