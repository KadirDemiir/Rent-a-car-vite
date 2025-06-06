export default function FormInput({ name, label, value, onChange, type = "text", required = true, error}) {
        const handleChangeNumber = (e) => {
            if(/[^0-9]/.test(e.target.value)){
                error = "sorun var";
                console.log(1);
            }
            //console.log(2);
            onChange(e);
        }

        return (
        <div>
            <label className="block text-gray-700 mb-1">{label}</label>
            <input
                type="text"
                name={name}
                value={value || ""}
                onChange={(type === "number") ? handleChangeNumber : onChange}
                required={required}
                className={`w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-500
                    ${error ? "border-red-500" : "border-gray-300"}`}
            />
            {error && <p className="ml-4 text-red-600 text-sm mt-1">*{error}</p>}
        </div>
    );
}
