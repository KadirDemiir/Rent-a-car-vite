export default function FormInput({ name, label, value, onChange, type = "text", required = true, error}) {
        const handleChangeNumber = (e) => {
            if(/[^0-9]/.test(e.target.value)){
                console.log(1);
            }
            onChange(e);
        }

        return (
        <div>
            <label className=" text-gray-700 mb-1 flex items-center justify-center">{label}</label>
            <input
                type="text"
                required={required}
                name={name}
                value={value || ""}
                onChange={(type === "number") ? handleChangeNumber : onChange}
                className={`w-full bg-white border rounded-xl p-2  outline-none
                    ${error ? "border-red-500" : "border-gray-300"}`}
            />
            {error && <p className="ml-4 text-red-600 text-sm mt-1">*{error}</p>}
        </div>
    );
}
