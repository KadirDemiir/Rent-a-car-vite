
export default function FormInput({ label, type = "text", value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white shadow-sm flex justify-between items-center"
            />
        </div>
    );
}
